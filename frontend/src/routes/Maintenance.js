import React, { Component } from 'react';
import { title, scrollTop } from 'window';
import { Progress } from 'antd';
import { maintenanceCheck } from 'api';
import { Spinner, Text, Pane, toaster } from 'evergreen-ui';

class Maintenance extends Component {
  state = {
    timer: 15,
    statusLoading: false,
  };

  componentDidMount() {
    title('503 Maintenance');
    scrollTop();
    this.interval = setInterval(this.countDown, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  checkStatus = () => {
    toaster.notify(
      <Pane
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Spinner size={16} />
        <Text marginLeft={8}>Checking status...</Text>
      </Pane>,
      0,
    );
    maintenanceCheck()
      .then(r => {
        if (r.status === 0) {
          throw r;
        }

        setTimeout(() => {
          toaster.closeAll();
          toaster.success('We are back online!');
          setTimeout(() => {
            window.location = '/';
          }, 500);
        }, 3000);
      })
      .catch(() => {
        setTimeout(() => {
          toaster.closeAll();
          toaster.warning('We are still in maintenance');
          this.setState({ timer: 15 });
          this.interval = setInterval(this.countDown, 1000);
        }, 3000);
      });
  };

  countDown = () => {
    const nextTime = this.state.timer - 1;
    const timeout = nextTime < 1;

    if (timeout) {
      clearInterval(this.interval);
      this.checkStatus();
    }
    this.setState({ timer: nextTime });
  };

  render() {
    const { timer } = this.state;
    return (
      <div className="error-page">
        <h1>We are performing scheduled maintenance right now.</h1>
        <hr />
        <p style={{ marginBottom: '15px' }}>Refreshing automatically in</p>
        <div style={{ color: '#1a98fc' }}>
          <Progress
            type="circle"
            status="active"
            percent={(timer / 15) * 100}
            format={p => `${timer}`}
          />
        </div>
        <p style={{ marginBottom: '30px' }}>We should be done shortly.</p>
        <img alt="503" src="/500.svg" />
      </div>
    );
  }
}

export default Maintenance;
