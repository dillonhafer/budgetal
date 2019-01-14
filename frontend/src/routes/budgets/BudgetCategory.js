import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { importedBudgetItems, updateBudgetCategory } from 'actions/budgets';

// Components
import BudgetItemList from './BudgetItemList';
import { ImportCategoryRequest } from '@shared/api/budgets';
import { notice } from 'window';
import { currencyf, reduceSum } from '@shared/helpers';

import { Card, Modal } from 'antd';
import Progress from 'components/Progress';
import { Icon } from 'evergreen-ui';

class BudgetCategory extends Component {
  clickImport = e => {
    e.preventDefault();
    const budgetCategory = this.props.currentBudgetCategory;
    Modal.confirm({
      okText: `Import ${budgetCategory.name}`,
      cancelText: 'Cancel',
      title: 'Import Budget Items',
      content: `Do you want to import budget items from your previous month's ${
        budgetCategory.name
      } category?`,
      onOk: this.importPreviousItems,
      onCancel() {},
    });
  };

  importPreviousItems = async budgetCategoryId => {
    const resp = await ImportCategoryRequest(
      this.props.currentBudgetCategory.id,
    );
    if (resp && resp.ok) {
      this.props.importedBudgetItems(resp.budgetItems);
      notice(resp.message);
    }
  };

  emptyList(hasBudgetItems, isLoading) {
    if (!hasBudgetItems && !isLoading) {
      return (
        <p className="text-center">You haven't added any budget items yet.</p>
      );
    }
  }

  percentSpent = (budgeted, spent) => {
    const p = (spent / budgeted) * 100;
    if (p > 99.99) {
      return 100;
    }

    if (isNaN(p)) {
      return 0;
    }

    return parseInt(p, 10);
  };

  render() {
    const items = this.props.budgetItems.filter(item => {
      return item.budgetCategoryId === this.props.currentBudgetCategory.id;
    });
    const itemIds = items.map(i => i.id);
    const expenses = this.props.budgetItemExpenses.filter(e => {
      return itemIds.includes(e.budgetItemId);
    });

    const spent = reduceSum(expenses);
    const budgeted = reduceSum(items);
    const remaining = budgeted - spent;
    const percentSpent = this.percentSpent(budgeted, spent);

    const budgetCategory = this.props.currentBudgetCategory;

    let status = 'normal';
    if (remaining < 0) {
      status = 'exception';
    } else if (remaining === 0.0) {
      status = 'success';
    }

    return (
      <div className="budget-category-row">
        <Card
          noHovering
          title={
            <span>
              <span
                className={`category-card-header category-card-header-${budgetCategory.name
                  .toLowerCase()
                  .replace('/', '-')}`}
              />
              {budgetCategory.name}
            </span>
          }
          extra={
            <button
              style={{
                border: 'none',
                background: 'none',
                color: '#108ee9',
                cursor: 'pointer',
                outline: 'none',
              }}
              onClick={this.clickImport}
              title="Import items from previous budget"
            >
              <Icon icon="import" />
            </button>
          }
        >
          <div className="body-row">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h3>Spent: {currencyf(spent)}</h3>
                <h3>Remaining: {currencyf(remaining)}</h3>
              </div>
              <Progress
                strokeWidth={20}
                status={status}
                percent={percentSpent}
              />
            </div>
            <br />
            <ul className="main-budget-categories">
              <li>{!this.props.loading && <BudgetItemList />}</li>
            </ul>
          </div>
        </Card>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    importedBudgetItems: budgetItems => {
      dispatch(importedBudgetItems(budgetItems));
    },
    changeCategory: budgetCategory => {
      dispatch(updateBudgetCategory({ budgetCategory }));
    },
  }),
)(BudgetCategory);
