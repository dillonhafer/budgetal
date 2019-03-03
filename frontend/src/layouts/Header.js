import React, { Component } from 'react';
import { SignOutRequest } from '@shared/api/sessions';
import {
  RemoveAuthentication,
  IsAuthenticated,
  GetCurrentUser,
} from 'authentication';
import {
  Pane,
  IconButton,
  Avatar,
  Spinner,
  toaster,
  Text,
  Position,
  Popover,
  Icon,
  Menu,
} from 'evergreen-ui';
import SignIn from './SignIn';
import { Link } from 'react-router-dom';
import { notice } from 'window';
import { colors } from '@shared/theme';
import './header.css';

const ProfileImage = React.memo(({ user }) => {
  let src = '/missing-profile.png';
  if (user.avatarUrl) {
    src = user.avatarUrl;
  }

  if (process.env.NODE_ENV === 'development' && user.avatarUrl) {
    src = new URL(user.avatarUrl).pathname;
  }

  return (
    <Avatar
      {...(/.*missing-profile.*/.test(src) ? {} : { src })}
      name={`${user.firstName || '?'} ${user.lastName || '?'}`}
      size={42}
      marginRight={10}
    />
  );
});

const blurMenu = () => {
  document.getElementById('root').click();
};

const NavMenuItem = React.memo(({ icon, active, to, title, ...rest }) => (
  <Menu.Item
    onSelect={blurMenu}
    {...rest}
    className={active ? 'headermenu active' : 'headermenu'}
    is={to ? Link : Pane}
    icon={
      <Icon
        icon={icon}
        marginLeft={16}
        marginRight={-4}
        color={active ? 'white' : colors.primary}
      />
    }
    to={to}
  >
    <Text color={colors.primary}>{title}</Text>
  </Menu.Item>
));

class Header extends Component {
  signOut = () => {
    toaster.notify(
      <Pane
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Spinner size={16} />
        <Text marginLeft={8}>Sign out in progress...</Text>
      </Pane>,
      { id: 'logout' },
    );

    SignOutRequest().then(r => {
      if (r.ok) {
        RemoveAuthentication();
        this.props.resetSignIn();
        notice('You have been signed out', { id: 'logout' });
        setTimeout(() => {
          window.location = '/';
        }, 1000);
      }
    });
  };

  renderMenuItems = () => {
    const signedIn = IsAuthenticated();
    if (signedIn) {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const user = GetCurrentUser();
      return [
        <Link
          key="budgets"
          to={`/budgets/${year}/${month}`}
          className={this.activeRoute() === 'budgets' ? 'active' : ''}
        >
          <Pane
            paddingX={20}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            height={64}
          >
            <Text color="unset">Budgets</Text>
          </Pane>
        </Link>,
        <Link
          key="annual"
          to={`/annual-budgets/${year}`}
          className={this.activeRoute() === 'annual-budgets' ? 'active' : ''}
        >
          <Pane
            paddingX={20}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            height={64}
          >
            <Text color="unset">Annual Budgets</Text>
          </Pane>
        </Link>,
        <Link
          key="networth"
          to={`/net-worth/${year}`}
          className={this.activeRoute() === 'net-worth' ? 'active' : ''}
        >
          <Pane
            paddingX={20}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            height={64}
          >
            <Text color="unset">Net Worth</Text>
          </Pane>
        </Link>,
        <Popover
          key="calc"
          position={Position.TOP_LEFT}
          content={
            <Menu>
              <Menu.Group>
                <NavMenuItem
                  active={this.activeRoute() === 'calculators'}
                  to="/calculators/mortgage"
                  title="Mortgage"
                  icon="home"
                />
              </Menu.Group>
            </Menu>
          }
        >
          <Pane
            paddingX={20}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            height={64}
            className={
              this.activeRoute() === 'calculators' ? 'anchor active' : 'anchor'
            }
          >
            <Text color="unset">Calculators</Text>
          </Pane>
        </Popover>,
        <Popover
          key="user-menu"
          position={Position.TOP_RIGHT}
          content={
            <Menu>
              <Menu.Group>
                <NavMenuItem
                  active={this.activeRoute() === 'statistics'}
                  to={`/monthly-statistics/${year}/${month}`}
                  title="Statistics"
                  icon="doughnut-chart"
                />
                <Menu.Divider />
                <NavMenuItem
                  active={this.activeRoute() === 'account-settings'}
                  to="/account-settings"
                  title="Account Settings"
                  icon="cog"
                />
                <Menu.Divider />
                {user.admin && (
                  <NavMenuItem
                    active={this.activeRoute() === 'admin'}
                    to="/admin"
                    title="Admin Panel"
                    icon="lock"
                  />
                )}
                {user.admin && <Menu.Divider />}
                <NavMenuItem
                  onSelect={this.signOut}
                  title="Sign Out"
                  icon="log-out"
                />
              </Menu.Group>
            </Menu>
          }
        >
          <Pane
            paddingX={20}
            cursor="pointer"
            height={64}
            display="flex"
            flexDirection="row"
            alignItems="center"
            className={
              ['statistics', 'account-settings', 'admin'].includes(
                this.activeRoute(),
              )
                ? 'anchor active'
                : 'anchor'
            }
          >
            <ProfileImage user={user} />
            <Text color="unset">
              Hello
              {user.firstName ? `, ${user.firstName}` : ''}!
            </Text>
          </Pane>
        </Popover>,
      ];
    } else {
      return [
        <Popover
          key="calc"
          position={Position.TOP_LEFT}
          content={
            <Menu>
              <Menu.Group>
                <NavMenuItem
                  active={this.activeRoute() === 'calculators'}
                  to="/calculators/mortgage"
                  title="Mortgage"
                  icon="home"
                />
              </Menu.Group>
            </Menu>
          }
        >
          <Pane
            paddingX={20}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            height={64}
            className={
              this.activeRoute() === 'calculators' ? 'anchor active' : 'anchor'
            }
          >
            <Text>Calculators</Text>
          </Pane>
        </Popover>,
        <Pane
          key="signin"
          paddingX={20}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          height={64}
        >
          <SignIn resetSignIn={this.props.resetSignIn} />
        </Pane>,
      ];
    }
  };

  renderMobileMenuItems = () => {
    const signedIn = IsAuthenticated();
    if (signedIn) {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const user = GetCurrentUser();
      return [
        <NavMenuItem
          active={this.activeRoute() === 'budgets'}
          to={`/budgets/${year}/${month}`}
          title="Budgets"
          icon="bank-account"
        />,
        <Menu.Divider />,
        <NavMenuItem
          active={this.activeRoute() === 'annual-budgets'}
          to={`/annual-budgets/${year}`}
          title="Annual Budgets"
          icon="calendar"
        />,
        <Menu.Divider />,
        <NavMenuItem
          active={this.activeRoute() === 'net-worth'}
          to={`/net-worth/${year}`}
          title="Net Worth"
          icon="series-add"
        />,
        <Menu.Divider />,
        <NavMenuItem
          active={this.activeRoute() === 'calculators'}
          to="/calculators/mortgage"
          title="Mortgage"
          icon="home"
        />,
        <Menu.Divider />,
        <NavMenuItem
          active={this.activeRoute() === 'statistics'}
          to={`/monthly-statistics/${year}/${month}`}
          title="Statistics"
          icon="doughnut-chart"
        />,
        <Menu.Divider />,
        <NavMenuItem
          active={this.activeRoute() === 'account-settings'}
          to="/account-settings"
          title="Account Settings"
          icon="cog"
        />,
        <Menu.Divider />,
        user.admin ? (
          <NavMenuItem
            active={this.activeRoute() === 'admin'}
            to="/admin"
            title="Admin Panel"
            icon="lock"
          />
        ) : null,
        user.admin ? <Menu.Divider /> : null,
        <NavMenuItem onSelect={this.signOut} title="Sign Out" icon="log-out" />,
      ];
    } else {
      return [
        <NavMenuItem
          active={this.activeRoute() === 'calculators'}
          to="/calculators/mortgage"
          title="Mortgage"
          icon="home"
        />,
        <Menu.Divider />,
        <Menu.Item
          icon={
            <Icon
              icon={'log-in'}
              marginLeft={16}
              marginRight={-4}
              color={colors.primary}
            />
          }
        >
          <SignIn resetSignIn={this.props.resetSignIn} />
        </Menu.Item>,
      ];
    }
  };

  activeRoute() {
    switch (true) {
      case /\/budgets/.test(window.location.pathname):
        return 'budgets';
      case /\/detailed-budgets/.test(window.location.pathname):
        return 'detailed-budgets';
      case /\/annual-budgets/.test(window.location.pathname):
        return 'annual-budgets';
      case /\/net-worth/.test(window.location.pathname):
        return 'net-worth';
      case /\/calculators\/mortgage/.test(window.location.pathname):
        return 'calculators';
      case /\/account-settings/.test(window.location.pathname):
        return 'account-settings';
      case /\/monthly-statistics/.test(window.location.pathname):
        return 'statistics';
      case /\/admin/.test(window.location.pathname):
        return 'admin';
      default:
        return '';
    }
  }

  render() {
    return (
      <Pane
        position="fixed"
        width="100%"
        elevation={2}
        background="rgba(16, 142, 233, 0.96)"
        zIndex={20}
        paddingX={50}
        paddingY={0}
        height="64px"
        lineHeight="64px"
        flex="0 0 auto"
      >
        <Pane
          className="header"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Link to="/">
            <Pane
              width={52}
              height={52}
              margin={6}
              marginLeft={0}
              borderWidth={1}
              borderColor="white"
              borderStyle="solid"
              borderRadius={8}
            >
              <img alt="Budgetal" width="100%" src="/app_logo.png" />
            </Pane>
          </Link>

          <Pane
            className="nav-menu"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            {this.renderMenuItems()}
          </Pane>
          <Pane
            className="small-nav-menu"
            display="none"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <Popover
              position={Position.TOP_LEFT}
              top={64}
              content={
                <Menu>
                  <Menu.Group>{this.renderMobileMenuItems()}</Menu.Group>
                </Menu>
              }
            >
              <Pane
                height={64}
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <IconButton icon="menu" />
              </Pane>
            </Popover>
          </Pane>
        </Pane>
      </Pane>
    );
  }
}

export default Header;
