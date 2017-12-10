import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  StatusBar,
  View,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { budgetLoaded, updateBudgetCategory } from 'actions/budgets';

// API
import { BudgetRequest } from 'api/budgets';

// Components
import { Ionicons } from '@expo/vector-icons';
import { categoryImage, currencyf, reduceSum } from 'utils/helpers';
import Progress from 'utils/Progress';

class BudgetsScreen extends Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    this.loadBudget();
  }

  percentSpent = (budgeted, spent) => {
    const p = spent / budgeted * 100;
    if (p > 99.99) {
      return 100;
    }

    if (isNaN(p)) {
      return 0;
    }

    return parseInt(p, 10);
  };

  loadBudget = async () => {
    this.setState({ loading: true });
    try {
      // const { month, year } = this.props.match.params;
      const resp = await BudgetRequest({ month: 12, year: 2017 });
      if (resp && resp.ok) {
        this.props.budgetLoaded(resp);
      }
    } catch (err) {
      // console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  renderCategory = ({ item: budgetCategory }) => {
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
    const percentSpent = this.percentSpent(amountBudgeted, amountSpent);
    let status = 'normal';
    if (remaining < 0) {
      status = 'exception';
    } else if (remaining === 0.0) {
      status = 'success';
    }

    return (
      <TouchableOpacity
        style={styles.categoryRow}
        key={budgetCategory.id}
        onPress={() => {
          this.props.navigation.navigate('BudgetCategory', {
            budgetCategory,
          });
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={styles.categoryImage}
            source={categoryImage(budgetCategory.name)}
          />
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <Text style={styles.categoryName}>{budgetCategory.name}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ flex: 1, fontWeight: '700' }}>Spent</Text>
              <Text style={{ flex: 1, fontWeight: '700' }}>Remaining</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ flex: 1, fontWeight: '700' }}>
                {currencyf(amountSpent)}
              </Text>
              <Text style={{ flex: 1, fontWeight: '700' }}>
                {currencyf(remaining)}
              </Text>
            </View>
            <Progress percent={percentSpent} status={status} />
          </View>
        </View>
      </TouchableOpacity>
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

  render() {
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" animated={true} />
        <FlatList
          style={styles.list}
          refreshing={loading}
          onRefresh={this.loadBudget}
          keyExtractor={i => i.id}
          data={this.props.budgetCategories}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={this.renderCategory}
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
  categoryRow: {
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'center',
  },
  categoryImage: {
    width: 64,
    height: 64,
    margin: 10,
  },
  categoryName: {
    fontWeight: '700',
    color: '#444',
    fontSize: 18,
    marginBottom: 5,
  },
});

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    budgetLoaded: ({
      budget,
      budgetCategories,
      budgetItems,
      budgetItemExpenses,
    }) => {
      dispatch(
        budgetLoaded({
          budget,
          budgetCategories,
          budgetItems,
          budgetItemExpenses,
        }),
      );
    },
    changeCategory: budgetCategory => {
      dispatch(updateBudgetCategory({ budgetCategory }));
    },
  }),
)(BudgetsScreen);
