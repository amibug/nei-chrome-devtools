/*
 * @Author: hzwuyuedong
 * @Date: 2018-12-17 15:38:59
 * @Last Modified by: hzwuyuedong
 * @Last Modified time: 2018-12-17 16:09:01
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal } from 'antd';
import './index.scss';

const FormItem = Form.Item;

class AddProject extends React.Component {

  static propTypes = {
    visible: PropTypes.boolean,
    onCc: PropTypes.func,
    onOk: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    onCc: function () { },
    onOk: function () { },
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.visible && !nextProps.visible) {
      this.props.form.resetFields();
    }
  }

  onOk = (e) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onOk(values);
      }
    });
  }

  onCc = (e) => {
    this.props.onCc();
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <div>
        <Modal
          title="添加项目"
          visible={this.props.visible}
          onOk={this.onOk}
          onCancel={this.onCc}
          okText="确定"
          cancelText="取消"
          className="add-project-modal"
        >
          <FormItem
            {...formItemLayout}
            label="项目ID"
          >
            {getFieldDecorator('projectId', {
              rules: [{
                required: true, message: '请输入项目ID~',
              }],
            })(
              <Input />
            )}
          </FormItem>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(AddProject);
