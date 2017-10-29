import React, { Component } from 'react';
import { SignInRequest } from 'api/sessions';
import { notice } from 'window';
import { SetAuthenticationToken, SetCurrentUser } from 'authentication';

import { Form, Input, Button, Icon } from 'antd';

const FormItem = Form.Item;

class SignInForm extends Component {
  submitForm = async values => {
    try {
      const resp = await SignInRequest(values);

      if (resp && resp.ok) {
        notice('You are now signed in');
        SetAuthenticationToken(resp.token);
        SetCurrentUser(resp.user);
        this.props.resetSignIn();
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.submitForm(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem hasFeedback={true}>
          {getFieldDecorator('email', {
            rules: [
              { required: true, message: 'E-mail Address is required' },
              { pattern: /.+@.+/, message: 'E-mail Address is invalid' },
            ],
          })(
            <Input
              prefix={<Icon type="mail" style={{ fontSize: 13 }} />}
              type="email"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              placeholder="E-mail Address"
            />,
          )}
        </FormItem>
        <FormItem hasFeedback={true}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Password is required' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="sign-in-form-button"
          >
            Sign In
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(SignInForm);
