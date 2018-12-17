/*
 * @Author: hzwuyuedong
 * @Date: 2018-12-17 15:38:24
 * @Last Modified by: hzwuyuedong
 * @Last Modified time: 2018-12-17 17:13:30
 */

'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Icon, Modal, Tabs } from 'antd';
import { getProjectList, addProject, removeProject, setProjectActive, request } from '../util';
import ProjectPanel from './project-panel';
import AddProjectDialog from './add-project';

import 'antd/dist/antd.css';
import './index.scss';

const { TabPane } = Tabs;
const { confirm } = Modal;

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAddProjectDialog: false,
      projects: [],
    };
  }

  componentWillMount() {
    this.getProjectList();
  }

  getProjectList() {
    const list = getProjectList();
    this.setState({
      projects: list || [],
    });
  }

  // https://nei.netease.com/api/projects/16189
  // 添加项目
  onAddProject = () => {
    this.setState({ showAddProjectDialog: true });
  }

  onRemoveProject = (id) => {
    confirm({
      title: '您是否要删除该项目?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.onRemoveProjectOk(id);
      },
    });
  }

  onRemoveProjectOk = (id) => {
    removeProject(id);
    this.getProjectList();
  }

  onAddProjectOk = (params) => {
    request(`https://nei.netease.com/api/projects/${params.projectId}`).then((res) => {
      addProject({
        id: res.id,
        name: res.name,
        key: res.toolKey,
        paths: [],
      });
      this.setState({ showAddProjectDialog: false });
      this.getProjectList();
    });
  }

  onAddProjectCc = () => {
    this.setState({ showAddProjectDialog: false });
  }

  onTabChange = (id) => {
    setProjectActive(parseInt(id, 10));
    this.getProjectList();
  }

  render() {
    const { projects, showAddProjectDialog } = this.state;
    let dom = null;
    if (!projects || projects.length === 0) {
      dom = <Button className="add-btn-2" onClick={this.onAddProject}><Icon type="plus" /> 添加NEI项目</Button>;
    } else {
      const activeProject = projects.filter((project) => {
        return project.active === true;
      })[0];
      const activeKey = '' + (activeProject ? activeProject.id : projects[0].id);
      dom = <div>
        <Button className="add-btn-1" size="small" onClick={this.onAddProject}><Icon type="plus" /> 添加NEI项目</Button>
        <Tabs type="card" activeKey={activeKey} onChange={this.onTabChange}>
          {
            projects.map((panel) => {
              return <TabPane
                key={panel.id}
                tab={<span>{panel.name} <Icon
                  style={{ marginRight: 0, fontSize: 12, color: '#999' }}
                  type="close"
                  onClick={this.onRemoveProject.bind(this, panel.id)}
                /></span>}>
                <ProjectPanel id={panel.id} onRemove={this.onRemoveProjectOk.bind(this, panel.id)} />
              </TabPane>;
            })
          }
        </Tabs>
      </div>;
    }
    return <div className="container">
      <AddProjectDialog
        visible={showAddProjectDialog}
        onOk={this.onAddProjectOk}
        onCc={this.onAddProjectCc}
      />
      {dom}
    </div>
  }
}


chrome.devtools.inspectedWindow.eval(
  'window.location',
  function (result) {
    window.$$domain = result.host;
    ReactDOM.render(<Index />, document.getElementById('app'));
  }
);


// {
//   'NEI-STORAGE-CACHE-localhost:3000': {
//     '5199': {
//        id: '',
//       key: '',
//       name: '',
//       paths: [''],    //需要启用的规则
//       favoritePaths: [''],  // 常用的规则
//       active: true,
//     }
//   }
// }

// 插件初始化
// 1. 进入devtools的时候，判断当前域名下面有没有项目
// 2. 没有的话，新建项目
// 3. 有的话遍历当前域名下面的项目
// 4. 获取业务分组和接口 https://nei.netease.com/api/groups/?pid=36622 https://nei.netease.com/api/interfaces/?pid=36622
// 5. 判断当前项目下paths的有效状态（是否被删除）和选中状态
// 6. 开启和关闭接口

// 页面运行时
// 1. 拦截请求，判断origin !== 'nei.netease.com'并且path命中，两个条件都符合的话做307跳转
