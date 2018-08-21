import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, ScrollView } from 'react-native';

// Redux
import { connect } from 'react-redux';
import { createdExpense } from 'actions/budget-item-expenses';

// API
import { CreateExpenseRequest } from 'api/budget-item-expenses';

// Helpers
import { BlurViewInsetProps } from 'utils/navigation-helpers';
import { error, notice } from 'notify';

// Components
import {
  PrimaryButton,
  DangerButton,
  FieldContainer,
  MoneyInput,
  OptionInput,
} from 'forms';

class NewMonthItemScreen extends Component {
  goBack = () => {
    this.props.navigation.goBack();
  };

  inputs = [];

  state = {
    loading: false,
    showMoneyKeyboard: false,
    name: '',
    amount: 0.0,
  };

  componentDidMount() {
    const { budgetItem } = this.props.navigation.state.params;
    this.setState({ budgetItem });
  }

  validateFields = () => {
    const { name, amount } = this.state;
    return name.length > 0 && amount > 0;
  };

  showMoneyKeyboard = () => {
    StatusBar.setBarStyle('light-content', true);
    this.setState({ showMoneyKeyboard: true });
  };

  hideMoneyKeyboard = () => {
    StatusBar.setBarStyle('light-dark', true);
    this.setState({ showMoneyKeyboard: false });
  };

  createExpense = async () => {
    const { name, amount, date, budgetItem } = this.state;

    try {
      const resp = await CreateExpenseRequest({
        name,
        amount,
        date: date.format('YYYY-MM-DD'),
        budgetItemId: budgetItem.id,
      });

      if (resp && resp.ok) {
        this.props.createdExpense(resp.budgetItemExpense);
        this.goBack();
        notice('Expense saved');
      }
    } catch (err) {
      error('Could not create expense');
    }
  };

  handleOnPress = async () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        await this.createExpense();
      } else {
        error('Form is not valid');
      }
    } catch (err) {
      // console.log(err)
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { name, amount, loading } = this.state;
    const valid = this.validateFields();

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        {...BlurViewInsetProps}
      >
        <StatusBar barStyle="dark-content" />
        <FieldContainer position="first">
          <OptionInput
            navigation={this.props.navigation}
            options={this.props.navigation.state.params.options}
            placeholder="Select An Item"
            defaultValue={name}
            onChange={name => this.setState({ name })}
          />
        </FieldContainer>
        <FieldContainer>
          <MoneyInput
            title="Expense Amount"
            displayAmount={amount}
            defaultValue={(amount * 100).toFixed()}
            onChange={amount => this.setState({ amount })}
          />
        </FieldContainer>

        <View style={{ height: 10 }} />

        <PrimaryButton
          title={`Save ${this.props.navigation.state.params.title}`}
          onPress={this.handleOnPress}
          loading={!valid || loading}
        />

        <DangerButton title="Cancel" onPress={this.goBack} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 40,
    paddingTop: 15,
  },
});

export default connect(
  null,
  dispatch => ({
    createdExpense: expense => {
      dispatch(createdExpense(expense));
    },
  }),
)(NewMonthItemScreen);
