// App Concerns
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { IsAuthenticated } from 'authentication';
import 'css/App.css';

// Locale
import { Layout } from 'antd';

// Layout
import Header from 'layouts/Header';
import ApplicationLayout from 'layouts/ApplicationLayout';
import Footer from 'layouts/Footer';

// Redux
import { throttle } from 'lodash';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { loadState, saveState } from 'persistant-state';
import reducers from 'reducers';

const persistedState = loadState();
const store = createStore(
  reducers,
  { ...persistedState },
  applyMiddleware(thunk),
);
store.subscribe(
  throttle(() => {
    saveState({
      mortgageCalculator: store.getState().mortgageCalculator,
    });
  }, 1000),
);

class App extends Component {
  state = {
    signedIn: IsAuthenticated(),
  };

  resetSignIn = () => {
    this.setState({ signedIn: IsAuthenticated() });
  };

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Layout>
              <Header resetSignIn={this.resetSignIn} />
              <ApplicationLayout />
              <Footer />
            </Layout>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
