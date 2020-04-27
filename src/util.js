/*
 * @Author: hzwuyuedong
 * @Date: 2018-12-17 15:39:41
 * @Last Modified by: hzwuyuedong
 * @Last Modified time: 2018-12-17 16:20:23
 */

import 'whatwg-fetch';
import { message } from 'antd';

const STORAGE_KEY = 'NEI-STORAGE-CACHE';

// 拦截请求调用checkPathEnable时，domain应该已经被设置好
// devtool-panel 在 window.$$domain赋值之后再初始化
chrome.devtools.inspectedWindow.eval(
  'window.location',
  function (result) {
    window.$$domain = result.host;
  }
);

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
};

export function uniq(array, value) {
  if (!Array.isArray(array)) {
    return null;
  }
  const ret = []; //一个新的临时数组
  for (var i = 0; i < array.length; i++) {
    if (ret.indexOf(array[i]) == -1) {
      ret.push(array[i]);
    }
  }
  return ret;
};

export function request(url, options = {}) {
  // https://nei.hz.netease.com/api/interfaces/?pid=36622
  return fetch(url, options)
    .then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.code === 200) {
        return json.result;
      } else {
        return Promise.reject(json);
      }
    }).catch(function (ex) {
      const code = ex && ex.code;
      const msg = code === 403 ? '无权限进行该操作~' : ex && ex.msg;
      message.error(msg);
      if (code === 401) {
        window.open('https://nei.hz.netease.com/login');
      }
      return Promise.reject(ex);
    });
};

export function getStorageData() {
  const mergeKey = `${STORAGE_KEY}-${window.$$domain}`;
  let ret = {};
  if (!!window.localStorage && window.localStorage.getItem(mergeKey)) {
    ret = JSON.parse(window.localStorage.getItem(mergeKey));
  }
  ret = clone(ret);
  return ret;
};

export function setStorageData(value) {
  const mergeKey = `${STORAGE_KEY}-${window.$$domain}`;
  if (!!window.localStorage) {
    window.localStorage.setItem(mergeKey, JSON.stringify(value));
  }
  return value;
};

export function getProjectList() {
  const value = getStorageData();
  const keys = Object.keys(value);
  const ret = [];
  keys.forEach((key) => {
    ret.push(value[key]);
  });
  return ret;
};

export function addProject(project) {
  const value = getStorageData();
  // 已存在，不操作
  if (!!value[project.id]) {
    return value[project.id];
  }
  setStorageData({
    ...value,
    ...{
      [project.id]: {
        ...project
      },
    }
  });
  setProjectActive(project.id);
};

export function removeProject(id) {
  const value = getStorageData();
  delete value[id];
  setStorageData({
    ...value,
  });
};

export function setProjectActive(id) {
  const projects = getProjectList();
  const ret = {};
  projects.forEach((project) => {
    ret[project.id] = {
      ...project,
      active: id === project.id,
    };
  });
  setStorageData(ret);
};

export function getPathByProjectId(projectId) {
  const value = getStorageData();
  const project = value[projectId] || {};
  return project.paths || [];
};

export function getFavoritePathsByProjectId(projectId) {
  const value = getStorageData();
  const project = value[projectId] || {};
  return project.favoritePaths || [];
};

export function updatePath(projectId, paths) {
  const value = getStorageData();
  setStorageData({
    ...value,
    ...{
      [projectId]: {
        ...value[projectId],
        paths: paths,
      }
    }
  });
};

export function addPath(projectId, path) {
  const value = getStorageData();
  const project = value[projectId] || {};
  const originPaths = project.paths || [];
  originPaths.push(path);
  const newPaths = uniq(originPaths, path);
  setStorageData({
    ...value,
    ...{
      [projectId]: {
        ...value[projectId],
        paths: newPaths,
      }
    }
  });
};

export function removePath(projectId, path) {
  const value = getStorageData();
  const project = value[projectId] || {};
  const originPaths = project.paths || [];
  const index = originPaths.indexOf(path);
  if (index !== -1) {
    originPaths.splice(index, 1);
    setStorageData({
      ...value,
      ...{
        [projectId]: {
          ...value[projectId],
          paths: originPaths,
        }
      }
    });
  }
}

export function updateFavoritePath(projectId, paths) {
  const value = getStorageData();
  setStorageData({
    ...value,
    ...{
      [projectId]: {
        ...value[projectId],
        favoritePaths: paths,
      }
    }
  });
};

export function addFavoritePath(projectId, path) {
  const value = getStorageData();
  const project = value[projectId] || {};
  const originPaths = project.favoritePaths || [];
  originPaths.push(path);
  const newPaths = uniq(originPaths, path);
  setStorageData({
    ...value,
    ...{
      [projectId]: {
        ...value[projectId],
        favoritePaths: newPaths,
      }
    }
  });
};

export function removeFavoritePath(projectId, path) {
  const value = getStorageData();
  const project = value[projectId] || {};
  const originPaths = project.favoritePaths || [];
  const index = originPaths.indexOf(path);
  if (index !== -1) {
    originPaths.splice(index, 1);
    setStorageData({
      ...value,
      ...{
        [projectId]: {
          ...value[projectId],
          favoritePaths: originPaths,
        }
      }
    });
  }
}


export function checkPathEnable(path) {
  const projects = getProjectList() || [];
  let flag = false;
  let key = '';
  projects.some((project) => {
    if (project.paths.indexOf(path) !== -1) {
      flag = true;
      key = project.key;
      return true;
    }
  });
  return {
    flag,
    key,
  }
}
