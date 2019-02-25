import React, { Component } from 'react';

// Components
import { BudgetRequest } from '@shared/api/budgets';
import ExpenseFormModal from './ExpenseFormModal';
import Sidebar from './Sidebar';
import BudgetCategory from './BudgetCategory';
import MonthlyOverview from './MonthlyOverview';
import MonthlyIncomeModal from './MonthlyIncomeModal';
import Spinner from 'components/Spinner';
import { Pane } from 'evergreen-ui';

// Helpers
import { scrollTop, title } from 'window';
import { monthName, currencyf } from '@shared/helpers';

import Card from 'components/Card';
import Header from 'components/Header';

class Budget extends Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    this.loadBudget();
    this.updateTitle(this.props.match.params);
    scrollTop();
  }

  updateTitle({ month, year }) {
    title(`${monthName(month)} ${year} | Budgets`);
  }

  findCurrentCategory(resp) {
    if (window.location.hash) {
      const hashCategory = `${this.props.location.hash}`.replace('#', '');
      return resp.budgetCategories.find(c => {
        return c.name.toLowerCase().replace('/', '-') === hashCategory;
      });
    }

    return resp.budgetCategories[0];
  }

  loadBudget = async () => {
    try {
      this.setState({ loading: true });
      const { month, year } = this.props.match.params;
      const resp = await BudgetRequest({ month, year });

      if (resp && resp.ok) {
        const currentCategory = this.findCurrentCategory(resp);

        this.props.budgetLoaded(resp);
        this.props.changeCategory(currentCategory);
        this.updateTitle(resp.budget);
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading } = this.state;
    const { budget } = this.props;
    return (
      <Pane>
        {loading && (
          <Pane
            position="fixed"
            top="100px"
            with="100%"
            left="50%"
            marginLeft="-32px"
          >
            <Spinner visible={true} />
          </Pane>
        )}
        <Pane opacity={loading ? 0.5 : 1}>
          <Header
            subtext="Your Monthly Budget"
            heading={`${monthName(budget.month)} ${budget.year}`}
          >
            <MonthlyIncomeModal />
          </Header>
          <Pane paddingX={24} marginTop={16} display="flex" flexDirection="row">
            <Pane
              display="flex"
              maxWidth={200}
              flexDirection="column"
              marginRight={16}
            >
              <Sidebar
                startLoading={() => {
                  this.setState({ loading: true });
                }}
                history={this.props.history}
                month={budget.month}
                year={budget.year}
              />
            </Pane>
            <Pane
              display="flex"
              flex="1"
              flexDirection="column"
              marginLeft={16}
            >
              <Pane>
                <Card title={`Budget Overview - ${currencyf(budget.income)}`}>
                  <MonthlyOverview />
                </Card>
              </Pane>

              <Pane flexGrow={1} marginTop={32}>
                <BudgetCategory />
              </Pane>
            </Pane>
          </Pane>
        </Pane>
        <ExpenseFormModal />
      </Pane>
    );
  }
}

export default Budget;
