import InsetScrollView from "@src/components/InsetScrollView";
import { DangerButton } from "@src/forms";
import { notice } from "@src/notify";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import Form from "./Form";

interface Props extends NavigationScreenConfigProps {}

const EditAnnualBudgetItemScreen = ({ navigation }: Props) => {
  const annualBudgetItem = navigation.getParam("annualBudgetItem");
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <InsetScrollView>
        <Form
          item={annualBudgetItem}
          afterSubmit={() => {
            notice("Item saved");
            navigation.goBack();
          }}
        />
        <DangerButton
          title="Cancel"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </InsetScrollView>
    </>
  );
};

export default EditAnnualBudgetItemScreen;
