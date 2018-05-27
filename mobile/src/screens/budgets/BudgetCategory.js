import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  View,
  FlatList,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { importedBudgetItems, removeBudgetItem } from 'actions/budgets';

// API
import { ImportCategoryRequest } from 'api/budgets';
import { DeleteItemRequest } from 'api/budget-items';

// Helpers
import { BlurViewInsetProps } from 'utils/navigation-helpers';

// Components
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MoneyAnimation from 'components/MoneyAnimation';
import moment from 'moment';
import colors from 'utils/colors';
import { notice, confirm } from 'notify';
import Progress from 'utils/Progress';
import { reduceSum, categoryImage, percentSpent } from 'utils/helpers';
import { PrimaryButton } from 'forms';
import PlusButton from 'utils/PlusButton';
import Swipeout from 'react-native-swipeout';

import Card, { SplitBackground } from 'components/Card';

class BudgetCategoryScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const budgetCategory = params.budgetCategory;
    const onPress = () => {
      navigation.navigate('NewBudgetItem', {
        budgetCategory,
      });
    };
    return {
      headerRight: <PlusButton onPress={onPress} />,
    };
  };

  state = {
    scrollEnabled: true,
  };

  importPreviousItems = async () => {
    const budgetCategory = this.props.navigation.state.params.budgetCategory;
    const resp = await ImportCategoryRequest(budgetCategory.id);
    if (resp && resp.ok) {
      this.props.importedBudgetItems(resp.budgetItems);
      notice(resp.message);
    }
  };

  onImportPress = () => {
    const budgetCategory = this.props.navigation.state.params.budgetCategory;
    confirm({
      okText: `Copy ${budgetCategory.name}`,
      cancelText: 'Cancel',
      title: 'Copy Budget Items',
      content: `Do you want to copy budget items from your previous month's ${
        budgetCategory.name
      } category?`,
      onOk: this.importPreviousItems,
      onCancel() {},
    });
  };

  itemButtons = budgetItem => {
    return [
      {
        component: (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <MaterialCommunityIcons name="pencil" color={'#fff'} size={20} />
          </View>
        ),
        backgroundColor: colors.primary,
        underlayColor: colors.primary + '70',
        onPress: () =>
          this.props.navigation.navigate('EditBudgetItem', {
            budgetItem,
          }),
      },
      {
        component: (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <MaterialCommunityIcons name="delete" color={'#fff'} size={20} />
          </View>
        ),
        backgroundColor: colors.error,
        underlayColor: colors.error + '70',
        onPress: () => this.confirmDelete(budgetItem),
      },
    ];
  };

  renderItem = ({ item: budgetItem }) => {
    const expenses = this.props.budgetItemExpenses.filter(e => {
      return budgetItem.id === e.budgetItemId;
    });

    const amountSpent = reduceSum(expenses);
    const amountBudgeted = budgetItem.amount;
    const remaining = amountBudgeted - amountSpent;
    const percentage = percentSpent(amountBudgeted, amountSpent);
    let status = 'normal';
    if (remaining < 0) {
      status = 'exception';
    } else if (remaining === 0.0) {
      status = 'success';
    }
    const buttons = this.itemButtons(budgetItem);

    return (
      <Swipeout
        buttonWidth={84}
        autoClose={true}
        scroll={scrollEnabled => {
          this.setState({ scrollEnabled });
        }}
        right={buttons}
      >
        <TouchableOpacity
          style={styles.itemRow}
          key={budgetItem.id}
          onPress={() => {
            this.props.navigation.navigate('BudgetItem', {
              budgetItem,
              amountSpent,
              amountBudgeted,
              remaining,
            });
          }}
        >
          <Card
            label={budgetItem.name}
            color={'#fff'}
            light={true}
            budgeted={amountBudgeted}
            spent={amountSpent}
            remaining={remaining}
          >
            <Progress percent={percentage} status={status} />
          </Card>
        </TouchableOpacity>
      </Swipeout>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  renderHeader = length => {
    if (length > 0) {
      const { budgetCategory } = this.props.navigation.state.params;
      const items = this.props.budgetItems.filter(
        i => i.budgetCategoryId === budgetCategory.id,
      );
      const itemIds = items.map(i => {
        return i.id;
      });
      const expenses = this.props.budgetItemExpenses.filter(e => {
        return itemIds.includes(e.budgetItemId);
      });

      const amountSpent = reduceSum(expenses);
      const amountBudgeted = reduceSum(items);
      const remaining = amountBudgeted - amountSpent;

      return (
        <SplitBackground>
          <Card
            image={categoryImage(budgetCategory.name)}
            label={budgetCategory.name}
            budgeted={amountBudgeted}
            spent={amountSpent}
            remaining={remaining}
          />
        </SplitBackground>
      );
    }
    return (
      <View style={{ padding: 20, paddingTop: 40, alignItems: 'center' }}>
        <MoneyAnimation />
        <Text style={{ margin: 5, textAlign: 'center', fontWeight: 'bold' }}>
          There aren't any buget items yet
        </Text>
      </View>
    );
  };

  deleteItem = async item => {
    const resp = await DeleteItemRequest(item.id);
    if (resp && resp.ok) {
      this.props.removeBudgetItem(item);
      notice(`${item.name} Deleted`);
    }
  };

  confirmDelete = item => {
    confirm({
      title: `Delete ${item.name}?`,
      okText: 'Delete',
      onOk: () => {
        this.deleteItem(item);
      },
    });
  };

  render() {
    const currentMonth = this.props.budget.month;
    const previousMonthDigit = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousMonth = moment.months()[previousMonthDigit - 1];

    const category = this.props.navigation.state.params.budgetCategory;
    const items = this.props.budgetItems.filter(
      i => i.budgetCategoryId === category.id,
    );
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View
          style={[
            StyleSheet.absoluteFill,
            { top: 300, backgroundColor: '#d8dce0' },
          ]}
        />
        <FlatList
          {...BlurViewInsetProps}
          scrollEnabled={this.state.scrollEnabled}
          ListHeaderComponent={() => {
            return this.renderHeader(items.length);
          }}
          style={styles.list}
          keyExtractor={i => String(i.id)}
          data={items}
          renderItem={this.renderItem}
          ListFooterComponent={
            <View style={{ paddingBottom: 30 }}>
              <PrimaryButton
                title={`Copy ${previousMonth} Items`}
                onPress={this.onImportPress}
              />
            </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
  },
  list: {
    alignSelf: 'stretch',
  },
  itemRow: {
    backgroundColor: '#d8dce0',
    justifyContent: 'center',
  },
});

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    importedBudgetItems: budgetItems => {
      dispatch(importedBudgetItems(budgetItems));
    },
    removeBudgetItem: budgetItem => {
      dispatch(removeBudgetItem(budgetItem));
    },
  }),
)(BudgetCategoryScreen);
