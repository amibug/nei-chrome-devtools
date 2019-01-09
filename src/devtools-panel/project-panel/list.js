/*
 * @Author: hzwuyuedong
 * @Date: 2018-12-17 15:39:18
 * @Last Modified by: hzwuyuedong
 * @Last Modified time: 2018-12-17 17:12:00
 */

'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Table, Tabs, Tooltip, Switch, Spin, Input } from 'antd';
import { clone, request, getPathByProjectId, getFavoritePathsByProjectId, addPath, removePath, updatePath, updateFavoritePath, addFavoritePath, removeFavoritePath } from '../../util';
import Highlighter from 'react-highlight-words';
import './list.scss';

const { Column } = Table;

class List extends Component {

  static propTypes = {
    groupId: PropTypes.number,
    data: PropTypes.array,
    onEnableStatusChange: PropTypes.func,
    onRemoveFavoritePath: PropTypes.func,
  }

  static defaultProps = {
    id: -1,
    data: [],
    onEnableStatusChange: function () { },
    onRemoveFavoritePath: function () { },
  }

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
        <div className="custom-filter-dropdown">
          <Input
            ref={node => { this.searchInput = node; }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
        </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
        </Button>
        </div>
      ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  })

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  }

  onTabChange = (id) => {
    handleReset();
  }

  render() {
    const { groupId, data, onEnableStatusChange, onRemoveFavoritePath } = this.props;

    return <Table size="small" pagination={false} dataSource={data}>
      <Column title="名称" dataIndex="name" key="name" />
      <Column title="方法" dataIndex="method" key="method" />
      <Column title="路径" dataIndex="path" key="path" {...this.getColumnSearchProps('path')} />
      <Column
        title={<Tooltip placement="rightBottom"
          style={{ fontSize: 12 }}
          title="开启规则后，接口会被添加到常用接口分组">
          开启状态 <Icon type="question-circle" />
        </Tooltip>}
        dataIndex="enabled"
        key="enabled"
        render={(value, record) => {
          return <Switch checked={value} onChange={(v)=>{
            onEnableStatusChange(record, v);
          }} />;
        }}
      />
      {groupId === -1000 ? <Column
        title="业务分组"
        dataIndex="group"
        key="group"
        render={(value, record) => {
          return value && value.name;
        }}
      /> : null}
      {groupId === -1000 ? <Column
        title={<Tooltip placement="rightBottom"
          style={{ fontSize: 12 }}
          title="删除规则后，默认关闭接口mock">
          操作 <Icon type="question-circle" />
        </Tooltip>}
        dataIndex="id"
        key="id"
        render={(value, record) => {
          return <Button onClick={()=>{
            onRemoveFavoritePath(record)
          }} size="small">删除</Button>;
        }}
      /> : null}
    </Table>
  }
}

export default List;
