import React, { Component } from 'react';
import { title, scrollTop } from 'window';
import { Pane, Paragraph, Text } from 'evergreen-ui';

class Home extends Component {
  componentDidMount() {
    title('');
    scrollTop();
  }

  render() {
    return (
      <Pane className="home-screen" paddingY={40} marginTop={24}>
        <Pane
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          minWidth={320}
          flexWrap={'wrap'}
        >
          <Pane
            minWidth={320}
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            flex="1 0 40%"
          >
            <img
              src={require('images/app-logo.png')}
              style={styles.image}
              alt="budgetal"
            />
          </Pane>
          <Pane
            minWidth={320}
            display="flex"
            flexDirection="column"
            flex="1 0 40%"
          >
            <Pane display="flex" flexDirection="row" alignItems="center">
              <Pane>
                <img
                  alt="Budgetal"
                  style={{ margin: '14px', width: '64px' }}
                  src={'/app_logo.png'}
                />
              </Pane>
              <Pane>
                <Text fontSize={36}>Budgetal</Text>
              </Pane>
            </Pane>
            <Pane display="flex" flexDirection="row" alignItems="center">
              <Pane>
                <Paragraph
                  paddingLeft={14}
                  fontSize={22}
                  paddingTop={10}
                  paddingBottom={10}
                >
                  Because personal finances
                  <br /> are personal.
                </Paragraph>
              </Pane>
            </Pane>
            <Pane display="flex" flexDirection="row" alignItems="center">
              <Pane>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://itunes.apple.com/us/app/budgetal-app/id1326525398?mt=8"
                >
                  <img
                    src={require('images/app-store.png')}
                    style={{ height: '75px' }}
                    alt="App Store"
                  />
                </a>

                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://play.google.com/store/apps/details?id=com.budgetal.app"
                >
                  <img
                    src={require('images/play-store.png')}
                    style={{ height: '75px' }}
                    alt="App Store"
                  />
                </a>
              </Pane>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    );
  }
}

const styles = {
  image: {
    border: '5px solid #ececec',
    width: '300px',
    borderRadius: '50%',
    boxShadow: '0px 0px 6px #bbb',
    marginRight: 30,
    maxWidth: '100%',
  },
};

export default Home;
