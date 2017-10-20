import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import Layout from 'antd/lib/layout';

// Route Components
import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Privacy from './Privacy';
import NoMatch from './NoMatch';
import MortgageCalculator from './MortgageCalculator';
import AnnualBudget from './AnnualBudget';

class ApplicationLayout extends Component {
  render() {
    return (
      <Layout.Content>
        <Route
          render={({location}) => (
            <TransitionGroup>
              <CSSTransition key={location.key} classNames="fade" timeout={300}>
                <div>
                  <Switch key={location.key} location={location}>
                    <Route exact path="/" component={Home} />
                    <Route path="/privacy" component={Privacy} />
                    <Route
                      path="/calculators/mortgage"
                      component={MortgageCalculator}
                    />
                    <PrivateRoute
                      path="/annual-budgets/:year"
                      component={AnnualBudget}
                    />
                    <Route component={NoMatch} />
                  </Switch>
                </div>
              </CSSTransition>
            </TransitionGroup>
          )}
        />
      </Layout.Content>
    );
  }
}

export default ApplicationLayout;
