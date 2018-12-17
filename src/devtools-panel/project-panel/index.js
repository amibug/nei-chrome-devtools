/*
 * @Author: hzwuyuedong
 * @Date: 2018-12-17 15:39:18
 * @Last Modified by: hzwuyuedong
 * @Last Modified time: 2018-12-17 17:12:00
 */

'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Table, Tabs, Tooltip, Switch, Spin } from 'antd';
import { clone, request, getPathByProjectId, getFavoritePathsByProjectId, addPath, removePath, updatePath, updateFavoritePath, addFavoritePath, removeFavoritePath } from '../../util';

import './index.scss';

const { Column } = Table;
const { TabPane } = Tabs;

class ProjectPanel extends Component {

  static propTypes = {
    id: PropTypes.number,
    onRemove: PropTypes.func,
  }

  static defaultProps = {
    id: -1,
    onRemove: function () { },
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      groups: [],
    };
  }

  componentWillMount() {
    this.getGroupsList();
  }

  getGroupsList() {
    const { id } = this.props;
    this.setState({
      loading: true,
    });
    request(`https://nei.netease.com/api/groups/?pid=${id}`).then((groupRet = []) => {
      request(`https://nei.netease.com/api/interfaces/?pid=${id}`).then((interfacesRet = []) => {
        this.setState({
          oriGropus: groupRet,
          oriInterfaces: interfacesRet,
          loading: false,
        }, () => {
          this.formatGroupList(true);
        });
      }).catch(() => {
        this.setState({
          loading: false,
        });
      });
    }).catch((res) => {
      if (res && res.code === 403) {
        this.props.onRemove();
      }
      this.setState({
        loading: false,
      });
    });
  }

  formatGroupList(init) {
    const { id } = this.props;
    let { oriGropus, oriInterfaces } = this.state;
    oriGropus = clone(oriGropus);
    oriInterfaces = clone(oriInterfaces);
    const paths = getPathByProjectId(id);
    const favoritePaths = getFavoritePathsByProjectId(id);
    const groupsMap = {};
    // nei上删除的接口从cache中移除
    const newPaths = [];
    const newFavoritePaths = [];
    oriInterfaces.forEach((ife) => {
      groupsMap[ife.groupId] = groupsMap[ife.groupId] || [];
      // check 是否开启队列
      if (paths.indexOf(ife.path) !== -1) {
        newPaths.push(ife.path);
        ife.enabled = true;
      } else {
        ife.enabled = false;
      }
      // check 最近常用接口
      if (favoritePaths.indexOf(ife.path) !== -1) {
        ife.favorited = true;
        newFavoritePaths.push(ife);
      }
      groupsMap[ife.groupId].push(ife);
    });
    oriGropus.forEach((group) => {
      group.interfaces = groupsMap[group.id] || [];
    });
    oriGropus.unshift({
      name: '常用接口分组',
      id: -1000,
      interfaces: newFavoritePaths,
    });
    this.setState({
      groups: oriGropus,
    });
    if (init) {
      // 更新path
      updatePath(id, newPaths);
      // 更新favoritepath
      updateFavoritePath(id, newFavoritePaths.map((itm) => { return itm.path || '' }));
    }
  }

  // 开启关闭接口mock
  onEnableStatusChange(record, enabled) {
    const { id } = this.props;
    if (!enabled) {
      removePath(id, record.path);
    } else {
      addPath(id, record.path);
      addFavoritePath(id, record.path);
    }
    this.formatGroupList();
  }

  // onAddFavoritePath(record) {
  //   const { id } = this.props;
  //   addFavoritePath(id, record.path);
  //   this.formatGroupList();
  // }

  // 从常用列表中移除，同时关闭mock功能
  onRemoveFavoritePath(record) {
    const { id } = this.props;
    removePath(id, record.path);
    removeFavoritePath(id, record.path);
    this.formatGroupList();
  }

  render() {
    const { groups = [], loading } = this.state;

    if (!loading && (!groups || groups.length === 0)) {
      return <div className="project-panel"><div className="empty">暂无业务分组，或者没权限~</div></div>;
    }
    return <div className="project-panel">
      <Spin spinning={loading} style={{ width: '100%' }}>
        <Tabs tabPosition="left" size="small">
          {
            groups.map((group) => {
              return (
                <TabPane tab={group.name} key={group.id} bordered={false}>
                  <Table size="small" pagination={false} dataSource={group.interfaces}>
                    <Column title="名称" dataIndex="name" key="name" />
                    <Column title="方法" dataIndex="method" key="method" />
                    <Column title="路径" dataIndex="path" key="path" />
                    <Column
                      title={<Tooltip placement="rightBottom"
                        style={{fontSize: 12}}
                        title="开启规则后，接口会被添加到常用接口分组">
                        开启状态 <Icon type="question-circle" />
                      </Tooltip>}
                      dataIndex="enabled"
                      key="enabled"
                      render={(value, record) => {
                        return <Switch checked={value} onChange={this.onEnableStatusChange.bind(this, record)} />;
                      }}
                    />
                    {group.id === -1000 ? <Column
                      title="业务分组"
                      dataIndex="group"
                      key="group"
                      render={(value, record) => {
                        return value && value.name;
                      }}
                    /> : null}
                    {group.id === -1000 ? <Column
                      title={<Tooltip placement="rightBottom"
                        style={{fontSize: 12}}
                        title="删除规则后，默认关闭接口mock">
                        操作 <Icon type="question-circle" />
                      </Tooltip>}
                      dataIndex="id"
                      key="id"
                      render={(value, record) => {
                        return <Button onClick={this.onRemoveFavoritePath.bind(this, record)} size="small">删除</Button>;
                      }}
                    /> : null}
                  </Table>
                </TabPane>
              );
            })
          }
        </Tabs>
      </Spin>
    </div>
  }
}

export default ProjectPanel;
