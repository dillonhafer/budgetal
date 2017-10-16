import React, {Component} from 'react';
import {SignOutRequest} from 'api';
import {RemoveAuthentication, IsAuthenticated} from 'authentication';
import {Row, Col, Menu, Icon} from 'antd';
import Layout from 'antd/lib/layout';
import SignIn from './SignIn';
import {Link} from 'react-router-dom';

export default class Header extends Component {
  signOut = async e => {
    try {
      e.preventDefault();
      const resp = await SignOutRequest();
      if (resp && resp.ok) {
        RemoveAuthentication();
        window.notice('You have been signed out');
        this.resetSignIn();
      }
    } catch (err) {
      console.log(err);
    }
  };

  adminLink(admin) {
    let items = [];
    if (admin) {
      items.push(
        <Menu.Item key="admin-link">
          <Link to="/admin">
            <Icon type="lock" />Admin Panel
          </Link>
        </Menu.Item>,
      );
      items.push(<Menu.Divider key="divider3" />);
    }
    return items;
  }

  renderMenuItems() {
    const signedIn = IsAuthenticated();
    if (signedIn) {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const user = JSON.parse(localStorage['user']);
      return [
        <Menu.Item key="budgets">
          <Link to={`/budgets/${year}/${month}`}> Budgets</Link>
        </Menu.Item>,
        <Menu.Item key="detailed-budgets">
          <Link to={`/detailed-budgets/${year}/${month}`}>
            {' '}
            Detailed Budgets
          </Link>
        </Menu.Item>,
        <Menu.Item key="annual-budgets">
          <Link to={`/annual-budgets/${year}`}> Annual Budgets</Link>
        </Menu.Item>,
        <Menu.SubMenu key="submenu-calc" title="Calculators">
          <Menu.Item key="mortgage-calculator">
            <Link to={`/calculators/mortgage`}>
              <Icon type="home" />Mortgage
            </Link>
          </Menu.Item>
        </Menu.SubMenu>,
        <Menu.SubMenu
          key="submenu"
          title={
            <span>
              <img
                className="nav-user-logo"
                alt={user.firstName}
                src={user.avatar}
              />Hello, {user.firstName}!
            </span>
          }
        >
          <Menu.Item key="stats">
            <Link to={`/monthly-statistics/${year}/${month}`}>
              <Icon type="pie-chart" />Statistics (for geeks)
            </Link>
          </Menu.Item>
          <Menu.Divider key="divider1" />
          <Menu.Item key="account-settings">
            <Link to="/account-settings">
              <Icon type="setting" />Account Settings
            </Link>
          </Menu.Item>
          <Menu.Divider key="divider2" />
          {this.adminLink(user.admin)}
          <Menu.Item key="sign-out">
            <a onClick={this.signOut} title="Sign out" rel="nofollow">
              <Icon type="logout" />Sign out
            </a>
          </Menu.Item>
        </Menu.SubMenu>,
      ];
    } else {
      return [
        <Menu.SubMenu key="submenu-calc" title="Calculators">
          <Menu.Item key="mortgage-calculator">
            <Link to="/calculators/mortgage">
              <Icon type="home" />Mortgage
            </Link>
          </Menu.Item>
        </Menu.SubMenu>,
        <Menu.Item key="sign-in">
          <SignIn />
        </Menu.Item>,
      ];
    }
  }

  selectedKeys(location) {
    switch (true) {
      case /\/budgets/.test(location):
        return ['budgets'];
      case /\/detailed-budgets/.test(location):
        return ['detailed-budgets'];
      case /\/annual-budgets/.test(location):
        return ['annual-budgets'];
      case /\/calculators\/mortgage/.test(location):
        return ['mortgage-calculator'];
      default:
        return [];
    }
  }

  render() {
    const selectedKeys = this.selectedKeys(this.props.location);

    return (
      <Layout.Header style={{position: 'fixed', width: '100%'}}>
        <Link to="/">
          <div className="logo" />
        </Link>

        <Row type="flex" justify="end">
          <Col>
            <Menu
              onSelect={this.handleMenuSelect}
              theme="dark"
              selectedKeys={selectedKeys}
              mode="horizontal"
              style={{lineHeight: '64px'}}
            >
              {this.renderMenuItems()}
            </Menu>
          </Col>
        </Row>
      </Layout.Header>
    );
  }
}
