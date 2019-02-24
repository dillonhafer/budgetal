import React, { Component } from 'react';

// Components
import BudgetItemList from '../BudgetItemList';
import SpentProgress from 'components/Progress/SpentProgress';
import { Dialog, Alert, Text, Heading, Pane, Button } from 'evergreen-ui';

// Helpers
import { ImportCategoryRequest } from '@shared/api/budgets';
import { notice, error } from 'window';
import { monthName, reduceSum } from '@shared/helpers';
import './budget-category.css';
import Card from 'components/Card';

class BudgetCategory extends Component {
  state = {
    importing: false,
    importConfirmationVisible: false,
  };

  importPreviousItems = async () => {
    this.setState({ importing: true });

    try {
      const resp = await ImportCategoryRequest(
        this.props.currentBudgetCategory.id,
      );
      if (resp && resp.ok) {
        this.props.importedBudgetItems(resp.budgetItems);
        notice(resp.message);
      }
    } catch {
      error('Something went wrong');
    } finally {
      this.setState({ importing: false, importConfirmationVisible: false });
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

  lastMonth = () => {
    const previousMonth =
      this.props.budget.month === 1 ? 12 : this.props.budget.month - 1;
    return monthName(previousMonth);
  };

  render() {
    const { importing, importConfirmationVisible } = this.state;
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

    const previousMonth = this.lastMonth();

    return (
      <Pane marginRight={24} marginLeft="1.5rem">
        <Card
          title={
            <Pane
              flex={1}
              alignItems="center"
              justifyContent="space-between"
              display="flex"
            >
              <Pane display="flex" flexDirection="row" alignItems="center">
                <span
                  className={`category-card-header category-card-header-${budgetCategory.name
                    .toLowerCase()
                    .replace('/', '-')}`}
                />
                <Heading marginLeft={8} size={400}>
                  {budgetCategory.name}
                </Heading>
              </Pane>
              <Pane>
                <Button
                  iconBefore="import"
                  onClick={() => {
                    this.setState({ importConfirmationVisible: true });
                  }}
                >
                  Copy {previousMonth} Items
                </Button>
                <Dialog
                  preventBodyScrolling
                  width={350}
                  hasHeader={false}
                  isConfirmLoading={importing}
                  confirmLabel={`Copy ${previousMonth} Items`}
                  onConfirm={this.importPreviousItems}
                  onCloseComplete={() => {
                    this.setState({ importConfirmationVisible: false });
                  }}
                  isShown={importConfirmationVisible}
                >
                  <Alert intent="none" title="Copy Budget Items">
                    <Text>
                      Do you want to copy budget items from {previousMonth}?
                    </Text>
                  </Alert>
                </Dialog>
              </Pane>
            </Pane>
          }
        >
          <Pane>
            <Pane marginBottom={16}>
              <SpentProgress
                status={status}
                percent={percentSpent}
                spent={spent}
                remaining={remaining}
              />
            </Pane>
            <BudgetItemList />
          </Pane>
        </Card>
      </Pane>
    );
  }
}

export default BudgetCategory;
