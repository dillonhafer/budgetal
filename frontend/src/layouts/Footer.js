import React, { Component } from 'react';
import { Layout, Modal } from 'antd';
import { Link } from 'react-router-dom';
const HELP_FRAME = process.env.REACT_APP_HELP_FRAME || '';

export default class Footer extends Component {
  state = {
    showHelpModal: false,
  };

  handleHelpClick = () => {
    this.setState({ showHelpModal: true });
  };

  handleHelpClose = () => {
    this.setState({ showHelpModal: false });
  };

  render() {
    return (
      <Layout.Footer>
        Budgetal © 2013-{new Date().getFullYear()} All rights reserved
        <p>
          <Link to="/privacy">Privacy</Link> |{' '}
          <a onClick={this.handleHelpClick}>Help</a>
        </p>
        <Modal
          title=""
          wrapClassName="help-modal"
          visible={this.state.showHelpModal}
          footer={null}
          onOk={this.handleHelpClose}
          onCancel={this.handleHelpClose}
        >
          <iframe title="help" src={HELP_FRAME} className="help-frame" />
        </Modal>
      </Layout.Footer>
    );
  }
}
