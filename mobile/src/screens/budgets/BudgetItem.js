import React, { PureComponent } from 'react';
import { StyleSheet, StatusBar, View, SectionList } from 'react-native';

// Redux
import { connect } from 'react-redux';
import { removeExpense } from '@src/actions/budget-item-expenses';

// Helpers
import { BlurViewInsetProps } from '@src/utils/navigation-helpers';

// Components
import { groupBy, orderBy, transform } from 'lodash';
import { reduceSum } from '@shared/helpers';
import moment from 'moment';
import PlusButton from '@src/utils/PlusButton';
import Card, { SplitBackground } from '@src/components/Card';
import EmptyList from '@src/components/EmptyList';
import ListBackgroundFill from '@src/components/ListBackgroundFill';
import Expense from '@src/components/Expense';
import { Bold } from '@src/components/Text';

class BudgetItemScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const budgetItem = params.budgetItem;
    const onPress = () => {
      navigation.navigate('NewBudgetItemExpense', {
        budgetItem,
      });
    };
    return {
      headerRight: <PlusButton onPress={onPress} />,
    };
  };

  state = {
    visibleExpenseId: null,
  };

  toggleVisibleExpense = id => {
    this.setState({
      visibleExpenseId: id === this.state.visibleExpenseId ? null : id,
    });
  };

  renderExpense = ({ item }) => {
    const active = this.state.visibleExpenseId === item.id;
    return (
      <Expense
        expense={item}
        active={active}
        navigation={this.props.navigation}
        removeExpense={this.props.removeExpense}
        toggleVisibleExpense={this.toggleVisibleExpense}
      />
    );
  };

  renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.header}>
        <Bold style={styles.headerText}>
          {moment(section.title, 'YYYY-MM-DD')
            .format('MMMM DD')
            .toUpperCase()}
        </Bold>
      </View>
    );
  };

  renderHeader = () => {
    const { budgetItem } = this.props.navigation.state.params;

    const expenses = this.props.budgetItemExpenses.filter(e => {
      return budgetItem.id === e.budgetItemId;
    });

    const amountSpent = reduceSum(expenses);
    const amountBudgeted = budgetItem.amount;
    const remaining = amountBudgeted - amountSpent;

    return (
      <SplitBackground>
        <Card
          label={budgetItem.name}
          budgeted={amountBudgeted}
          spent={amountSpent}
          remaining={remaining}
        />
      </SplitBackground>
    );
  };

  empty() {
    return <EmptyList message="There aren't any expenses yet" />;
  }

  render() {
    const item = this.props.navigation.state.params.budgetItem;
    const expenses = this.props.budgetItemExpenses.filter(
      i => i.budgetItemId === item.id,
    );
    const sections = transform(
      groupBy(orderBy(expenses, ['date', 'id'], ['desc', 'desc']), 'date'),
      (result, value, key) => {
        result.push({ data: value, title: key });
      },
      [],
    );

    const expenseSections = sections.map(sec => {
      return {
        ...sec,
        data: sec.data.map((ex, i) => {
          let position = '';
          if (i === 0) {
            position = 'first';
          }
          if (i === sec.data.length - 1) {
            position = 'last';
          }

          if (sec.data.length === 1) {
            position = 'only';
          }

          return { ...ex, position };
        }),
      };
    });

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ListBackgroundFill />
        <SectionList
          {...BlurViewInsetProps}
          ListHeaderComponent={this.renderHeader}
          style={styles.list}
          contentContainerStyle={styles.contentStyles}
          stickySectionHeadersEnabled={false}
          keyExtractor={i => i.id}
          sections={expenseSections}
          renderSectionHeader={this.renderSectionHeader}
          ListEmptyComponent={this.empty}
          renderItem={this.renderExpense}
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
  contentStyles: {
    backgroundColor: '#d8dce0',
    minHeight: '100%',
  },
  header: {
    margin: 20,
    marginBottom: 5,
    backgroundColor: 'transparent',
    padding: 5,
  },
  headerText: {
    color: '#555',
    fontWeight: 'bold',
  },
});

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    removeExpense: expense => {
      dispatch(removeExpense(expense));
    },
  }),
)(BudgetItemScreen);
