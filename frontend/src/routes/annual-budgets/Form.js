import React, { Component } from 'react';
import { notice } from 'window';
import {
  CreateAnnualBudgetItemRequest,
  UpdateAnnualBudgetItemRequest,
} from 'api/annual-budget-items';

// Redux
import { connect } from 'react-redux';
import { ANNUAL_ITEMS_ADDED, ANNUAL_ITEMS_UPDATED } from 'action-types';

// Antd
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Row from 'antd/lib/row';
import InputNumber from 'antd/lib/input-number';
import DatePicker from 'antd/lib/date-picker';
import Switch from 'antd/lib/switch';
import Modal from 'antd/lib/modal';
const Option = Select.Option;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class AnnualBudgetItemForm extends Component {
  createItem = async item => {
    try {
      const resp = await CreateAnnualBudgetItemRequest({
        ...item,
        year: this.props.budgetItem.year,
      });
      if (resp && resp.ok) {
        this.props.itemAdded(resp.annualBudgetItem);
        notice(`Created ${item.name}`);
      }
    } catch (err) {
      //ignore for now
    }
  };

  updateItem = async item => {
    try {
      const resp = await UpdateAnnualBudgetItemRequest(item);
      if (resp && resp.ok) {
        this.props.itemUpdated(resp.annualBudgetItem);
        notice(`Updated ${item.name}`);
      }
    } catch (err) {
      //ignore for now
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const item = {
          ...values,
          id: this.props.budgetItem.id,
          interval: parseInt(values.interval, 10),
        };

        if (item.id) {
          this.updateItem(item);
        } else {
          this.createItem(item);
        }
      } else {
        console.log(err);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, onCancel, budgetItem } = this.props;
    const okText = budgetItem.id ? 'Update Item' : 'Create Item';
    return (
      <Modal
        title="Annual Budget Item"
        width={300}
        visible={visible}
        okText={okText}
        onOk={this.handleSubmit}
        onCancel={onCancel}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item {...layout} hasFeedback label="Name">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Name is required' }],
            })(<Input placeholder="Life Insurance" />)}
          </Form.Item>
          <Form.Item {...layout} hasFeedback label="Amount">
            {getFieldDecorator('amount', {
              rules: [
                {
                  type: 'number',
                  min: 1,
                  required: true,
                  message: 'Amount is required',
                },
              ],
            })(
              <InputNumber
                formatter={value =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                name="amount"
                style={{ width: '100%' }}
                min={1}
                placeholder="(10.00)"
              />,
            )}
          </Form.Item>
          <Form.Item {...layout} hasFeedback label="Due Date">
            {getFieldDecorator('dueDate', {
              rules: [{ required: true, message: 'Date is required' }],
            })(
              <DatePicker
                size="large"
                allowClear={false}
                style={{ width: '100%' }}
              />,
            )}
          </Form.Item>
          <Form.Item {...layout} hasFeedback label="Months">
            {getFieldDecorator('interval', {})(
              <Select>
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5">5</Option>
                <Option value="6">6</Option>
                <Option value="7">7</Option>
                <Option value="8">8</Option>
                <Option value="9">9</Option>
                <Option value="10">10</Option>
                <Option value="11">11</Option>
                <Option value="12">12</Option>
              </Select>,
            )}
          </Form.Item>
          <Row type="flex" justify="end">
            <Form.Item {...layout}>
              {getFieldDecorator('paid', {
                valuePropName: 'checked',
              })(<Switch checkedChildren="paid" unCheckedChildren="paid" />)}
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    );
  }
}

const mapPropsToFields = props => {
  const item = props.budgetItem;
  return Object.keys(item).reduce((acc, k) => {
    const value = item[k];
    return { ...acc, [k]: { value } };
  }, {});
};

const itemUpdated = item => {
  return {
    type: ANNUAL_ITEMS_UPDATED,
    item,
  };
};

const itemAdded = item => {
  return {
    type: ANNUAL_ITEMS_ADDED,
    item,
  };
};

export default connect(
  state => ({
    ...state.annualBudgetItems,
  }),
  dispatch => ({
    itemUpdated: item => {
      dispatch(itemUpdated(item));
    },
    itemAdded: item => {
      dispatch(itemAdded(item));
    },
  }),
)(Form.create({ mapPropsToFields })(AnnualBudgetItemForm));
