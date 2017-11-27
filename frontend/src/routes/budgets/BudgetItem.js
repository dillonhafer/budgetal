import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import {
  updateBudgetItem,
  updateNullBudgetItem,
  removeBudgetItem,
} from 'actions/budgets';

// API
import {
  CreateItemRequest,
  UpdateItemRequest,
  DestroyItemRequest,
} from 'api/budget-items';

// Helpers
import classNames from 'classnames';
import { currencyf } from 'helpers';
import { notice } from 'window';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Row,
} from 'antd';
const FormItem = Form.Item;

class BudgetItem extends Component {
  state = {
    loading: false,
  };

  componentWillReceiveProps = nextProps => {
    if (this.props.budgetItem.id !== nextProps.budgetItem.id) {
      this.props.form.resetFields();
    }
  };

  updateAmount = amount => {
    const updatedItem = Object.assign({}, this.props.budgetItem, {
      amount: String(amount).replace(/\$\s?|(,*)/g, ''),
    });
    this.props.updateBudgetItem(updatedItem);
  };

  persistBudgetItem = async budgetItem => {
    try {
      this.setState({ loading: true });
      const isPersisted = budgetItem.id !== null;
      const strategy = isPersisted ? UpdateItemRequest : CreateItemRequest;
      const resp = await strategy(budgetItem);

      if (resp && resp.ok) {
        if (budgetItem.id === null) {
          this.props.updateNullBudgetItem(resp.budgetItem);
        }
        notice(`Saved ${resp.budgetItem.name}`);
      }
    } catch (err) {
      // apiError(err.message);
    } finally {
      this.setState({ loading: false });
    }
  };

  save = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.persistBudgetItem(this.props.budgetItem);
      }
    });
  };

  deleteBudgetItem = async () => {
    try {
      if (this.props.budgetItem.id !== null) {
        const resp = await DestroyItemRequest(this.props.budgetItem.id);
        if (resp !== null) {
          notice('Deleted ' + this.props.budgetItem.name);
        }
      }

      this.props.removeBudgetItem(this.props.budgetItem);
    } catch (err) {
      // apiError(err.message);
    }
  };

  remainingClass(amountRemaining) {
    return classNames({
      'success-color': amountRemaining > 0,
      'alert-color': amountRemaining < 0,
      blue: Math.abs(currencyf(amountRemaining, '')) === 0,
    });
  }

  onDeleteClick = e => {
    e.preventDefault();
    this.props.deleteBudgetItem(this.props.budgetItem);
  };

  handleDeleteClick = e => {
    e.preventDefault();
    Modal.confirm({
      wrapClassName: 'delete-button',
      okText: `Delete ${this.props.budgetItem.name}`,
      okType: 'danger',
      cancelText: 'Cancel',
      title: `Delete ${this.props.budgetItem.name}`,
      content: `Are you sure you want to delete ${this.props.budgetItem
        .name}? This cannot be undone.`,
      onOk: () => {
        this.deleteBudgetItem(this.props.budgetItem);
      },
      onCancel() {},
    });
  };

  percentSpent = () => {
    const p = this.props.amountSpent / this.props.budgetItem.amount * 100;

    if (p > 99.99) {
      return 100;
    }

    if (isNaN(p)) {
      return 0;
    }

    return parseInt(p, 10);
  };

  render() {
    const item = this.props.budgetItem;
    const deleteFunction =
      item.id !== null
        ? this.handleDeleteClick
        : () => {
            this.props.removeBudgetItem(item);
          };
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        offset: 8,
        span: 16,
      },
    };

    let status;
    if (this.props.amountRemaining < 0) {
      status = 'exception';
    } else if (this.props.amountRemaining === 0.0) {
      status = 'success';
    }

    return (
      <div>
        <Row>
          <Col span={8}>
            <Form layout="horizontal" onSubmit={this.save}>
              <FormItem {...formItemLayout} label="Name">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: 'Name is required',
                    },
                  ],
                })(<Input name="name" placeholder="Name" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="Amount">
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
                    name="amount"
                    min={1}
                    placeholder="(1.00)"
                    formatter={value =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />,
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout} className="text-right">
                <Button
                  type="primary"
                  loading={this.state.loading}
                  disabled={this.state.loading}
                  htmlType="submit"
                >
                  Save
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={16}>
            <Row type="flex" justify="center">
              <Col span={8}>
                <div className="text-right">
                  <Progress
                    type="circle"
                    status={status}
                    percent={this.percentSpent()}
                  />
                </div>
              </Col>
              <Col span={12}>
                <p className="text-center">
                  You have spent <b>{currencyf(this.props.amountSpent)}</b> of{' '}
                  <b>{currencyf(item.amount)}</b>.
                </p>
                <p className="text-center">
                  You have <b>{currencyf(this.props.amountRemaining)}</b>{' '}
                  remaining to spend.
                </p>
              </Col>
              <Col span={4} style={{ alignSelf: 'flex-start' }}>
                <Button
                  onClick={deleteFunction}
                  type="danger"
                  className="delete-button right"
                  shape="circle"
                  icon="delete"
                />
              </Col>
            </Row>
          </Col>
        </Row>
        {/*<BudgetItemExpenseList budgetItem={item} />*/}
      </div>
    );
  }
}

const formProps = {
  mapPropsToFields: props => {
    return {
      name: { value: props.budgetItem.name },
      amount: { value: props.budgetItem.amount },
    };
  },
  onFieldsChange: (props, fields) => {
    if (fields.hasOwnProperty('amount')) {
      props.updateBudgetItem({
        ...props.budgetItem,
        amount: fields['amount'].value,
      });
    }

    if (fields.hasOwnProperty('name')) {
      props.updateBudgetItem({
        ...props.budgetItem,
        name: fields['name'].value,
      });
    }
  },
};

export default connect(
  state => ({}),
  dispatch => ({
    updateBudgetItem: income => {
      dispatch(updateBudgetItem(income));
    },
    updateNullBudgetItem: item => {
      dispatch(updateNullBudgetItem(item));
    },
    removeBudgetItem: item => {
      dispatch(removeBudgetItem(item));
    },
  }),
)(Form.create(formProps)(BudgetItem));
