import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import {
  BudgetalText,
  HeaderText,
  headerBackTitleStyle,
} from 'components/Text';

import TabletNavigator from 'navigators/TabletNavigator';

// Screens
import AnnualBudgetsScreen from 'screens/annual-budgets/AnnualBudgets';
import NewAnnualBudgetItemScreen from 'screens/annual-budgets/NewAnnualBudgetItem';
import EditAnnualBudgetItemScreen from 'screens/annual-budgets/EditAnnualBudgetItem';
import AnnualBudgetItemProgressScreen from 'screens/annual-budgets/AnnualBudgetItemProgress';

import {
  NavigationHeight,
  BlurViewNavigationOptions,
  BurgerNavigationOptions,
  drawerIcon,
} from 'utils/navigation-helpers';

const headerStyle = {
  height: NavigationHeight,
};

const AnnualBudgetNavigatorStack = createStackNavigator(
  {
    AnnualBudget: {
      screen: AnnualBudgetsScreen,
      path: 'annual-budgets/:year',
      navigationOptions: ({ navigation }) => {
        const year =
          (navigation.state.params && navigation.state.params.year) ||
          new Date().getFullYear();

        return {
          gesturesEnabled: false,
          headerTitle: <HeaderText>ANNUAL BUDGETS</HeaderText>,
          headerBackTitle: `${year}`,
          headerStyle,
          headerBackTitleStyle,
          ...BurgerNavigationOptions,
        };
      },
    },
    AnnualBudgetProgress: {
      screen: AnnualBudgetItemProgressScreen,
      path: 'annual-budgets/:budgetItem',
      navigationOptions: () => ({
        headerTitle: <HeaderText>PROGRESS</HeaderText>,
        headerStyle,
      }),
    },
    NewAnnualBudgetItem: {
      screen: NewAnnualBudgetItemScreen,
      path: 'newAnnualBudgetItem',
      navigationOptions: () => ({
        headerTitle: <HeaderText>NEW ANNUAL ITEM</HeaderText>,
        headerStyle,
      }),
    },
    EditAnnualBudgetItem: {
      screen: EditAnnualBudgetItemScreen,
      path: 'editAnnualBudgetItem',
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <HeaderText>
            EDIT {navigation.state.params.annualBudgetItem.name.toUpperCase()}
          </HeaderText>
        ),
        headerStyle,
      }),
    },
  },
  {
    cardStyle: {
      backgroundColor: '#ececec',
      shadowOpacity: 0,
    },
    navigationOptions: BlurViewNavigationOptions,
  },
);

const AnnualBudgetSidebarNavigatorStack = createStackNavigator(
  {
    Main: {
      screen: View,
      navigationOptions: { header: null },
    },
    AnnualBudgetProgress: {
      screen: AnnualBudgetItemProgressScreen,
      path: 'annual-budgets/:budgetItem',
      navigationOptions: () => ({
        headerTitle: <HeaderText>PROGRESS</HeaderText>,
        headerStyle,
      }),
    },
    NewAnnualBudgetItem: {
      screen: NewAnnualBudgetItemScreen,
      path: 'newAnnualBudgetItem',
      navigationOptions: () => ({
        headerTitle: <HeaderText>NEW ANNUAL ITEM</HeaderText>,
        headerStyle,
      }),
    },
    EditAnnualBudgetItem: {
      screen: EditAnnualBudgetItemScreen,
      path: 'editAnnualBudgetItem',
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <HeaderText>
            EDIT {navigation.state.params.annualBudgetItem.name.toUpperCase()}
          </HeaderText>
        ),
        headerStyle,
      }),
    },
  },
  { navigationOptions: BlurViewNavigationOptions },
);

class AnnualBudgetNavigator extends TabletNavigator {
  MainNavigator = AnnualBudgetNavigatorStack;
  SideNavigator = AnnualBudgetSidebarNavigatorStack;

  static navigationOptions = {
    // eslint-disable-next-line react/display-name
    drawerLabel: ({ tintColor }) => (
      <BudgetalText style={{ color: tintColor }}>ANNUAL BUDGETS</BudgetalText>
    ),
    // Width 32 Fix for react-navigation bugs
    // eslint-disable-next-line react/display-name
    drawerIcon: drawerIcon('md-calendar'),
  };
}

export default AnnualBudgetNavigator;
