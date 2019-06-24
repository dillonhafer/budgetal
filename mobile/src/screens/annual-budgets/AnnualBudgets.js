import React, { PureComponent } from "react";
import {
  StyleSheet,
  StatusBar,
  FlatList,
  View,
  RefreshControl,
} from "react-native";

// Redux
import { connect } from "react-redux";
import { itemsFetched } from "@src/actions/annual-budget-items";

// API
import { AllAnnualBudgetItemsRequest } from "@shared/api/annual-budget-items";

// Helpers
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";

// Components
import { Bold } from "@src/components/Text";
import { error } from "@src/notify";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@shared/theme";
import DatePicker from "@src/utils/DatePicker";
import PlusButton from "@src/utils/PlusButton";
import Spin from "@src/utils/Spin";
import AnnualBudgetItemRow from "./AnnualBudgetItemRow";

class AnnualBudgetsScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const annualBudgetId = navigation.getParam("annualBudgetId");
    const onPress = () => {
      navigation.navigate("NewAnnualBudgetItem", {
        annualBudgetId,
      });
    };

    return {
      headerRight: <PlusButton onPress={onPress} />,
    };
  };

  state = {
    loading: false,
    refreshing: false,
    year: new Date().getFullYear(),
    scrollEnabled: true,
  };

  componentDidMount() {
    this.loadBudgetItems({ year: new Date().getFullYear() });
  }

  loadBudgetItems = async ({ year }) => {
    this.setState({ loading: true });
    try {
      const resp = await AllAnnualBudgetItemsRequest(year);

      if (resp && resp.ok) {
        this.props.navigation.setParams({
          year,
          annualBudgetId: resp.annualBudgetId,
        });
        this.props.itemsFetched(resp.annualBudgetId, resp.annualBudgetItems);
      }
    } catch (err) {
      error("Problem downloading Annual budget data");
    } finally {
      this.setState({ loading: false });
    }
  };

  renderItem = ({ item }) => {
    return (
      <AnnualBudgetItemRow
        budgetItem={item}
        navigate={this.props.navigation.navigate}
      />
    );
  };

  renderHeader = () => {
    return (
      <React.Fragment>
        <DatePicker year={this.state.year} onChange={this.onDateChange} />
        {this.props.annualBudgetItems.length === 0 && (
          <View style={{ padding: 20, paddingTop: 40, alignItems: "center" }}>
            <FontAwesome name="money" size={32} color={colors.success} />
            <Bold
              style={{ margin: 5, textAlign: "center", fontWeight: "bold" }}
            >
              There aren't any items yet
            </Bold>
          </View>
        )}
      </React.Fragment>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    try {
      await this.loadBudgetItems({ year: this.state.year });
    } catch (err) {
      error("There was a problem refreshing the list");
    } finally {
      this.setState({ refreshing: false });
    }
  };

  onDateChange = ({ year }) => {
    this.loadBudgetItems({ year });
    this.setState({ year });
  };

  render() {
    const { loading, refreshing } = this.state;
    const { annualBudgetItems } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FlatList
          {...BlurViewInsetProps}
          ListHeaderComponent={this.renderHeader}
          refreshControl={
            <RefreshControl
              tintColor={"lightskyblue"}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
          scrollEnabled={this.state.scrollEnabled}
          style={styles.list}
          keyExtractor={i => String(i.id)}
          data={annualBudgetItems}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={this.renderItem}
        />
        <Spin spinning={loading && !refreshing} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "column",
  },
  list: {
    alignSelf: "stretch",
  },
});

export default connect(
  state => ({
    ...state.annualBudgetId,
    ...state.annualBudgetItems,
  }),
  dispatch => ({
    itemsFetched: (annualBudgetId, annualBudgetItems) => {
      dispatch(itemsFetched(annualBudgetId, annualBudgetItems));
    },
  })
)(AnnualBudgetsScreen);
