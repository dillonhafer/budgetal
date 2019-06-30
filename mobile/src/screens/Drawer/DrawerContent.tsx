import { SignOutRequest } from "@shared/api/sessions";
import { colors } from "@shared/theme";
import Monogram, { User } from "@src/components/Monogram";
import { Bold, Medium, Small } from "@src/components/Text";
import { error, notice } from "@src/notify";
import LegalModal from "@src/screens/Legal";
import { RemoveAuthentication } from "@src/utils/authentication";
import { WebBrowser } from "expo";
import Constants from "expo-constants";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { DrawerItemsProps, SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import DrawerItem from "./DrawerItem";

interface LHCProps {
  user: User;
  onPress(): void;
  active: boolean;
}

const LHC = ({ user, onPress, active }: LHCProps) => {
  const backgroundColor = active ? colors.drawerActive : "transparent";

  return (
    <View style={{ backgroundColor }}>
      <TouchableOpacity style={styles.profileContainer} onPress={onPress}>
        <View style={styles.imageContainer}>
          <Monogram user={user} />
        </View>
        <View style={styles.nameContainer}>
          <Bold style={styles.nameText}>
            {[user.firstName, user.lastName].join(" ")}
          </Bold>
          <Medium style={styles.emailText}>{user.email}</Medium>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ListHeaderComponent = connect(state => ({
  user: state.users,
}))(LHC);

interface Props extends DrawerItemsProps {}

const DrawerContent = ({ navigation }: Props) => {
  const [visible, setVisible] = useState(false);

  const signOut = async () => {
    try {
      await SignOutRequest();
      await RemoveAuthentication();
      navigation.navigate("AuthLoading");
      notice("You are now signed out");
    } catch (err) {
      error("Something went wrong. Try closing the app.");
    }
  };

  const confirmSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: signOut,
        },
      ],
      { cancelable: true }
    );
  };

  const currentRoute = [
    "budgets",
    "annual",
    "statistics",
    "networth",
    "account",
  ][navigation.state.index];

  return (
    <>
      <ScrollView>
        <SafeAreaView
          style={styles.container}
          forceInset={{ top: "always", horizontal: "never" }}
        >
          <View>
            <ListHeaderComponent
              active={currentRoute === "account"}
              onPress={() => {
                navigation.navigate("Account");
              }}
            />
          </View>
          <DrawerItem
            active={currentRoute === "budgets"}
            iconName="md-calculator"
            onPress={() => {
              navigation.navigate("Budget");
            }}
            label="BUDGETS"
          />
          <DrawerItem
            active={currentRoute === "annual"}
            iconName="md-calendar"
            onPress={() => {
              navigation.navigate("AnnualBudgets");
            }}
            label="ANNUAL BUDGETS"
          />
          <DrawerItem
            iconName="md-stats"
            active={currentRoute === "statistics"}
            onPress={() => {
              navigation.navigate("Statistics");
            }}
            label="STATISTICS"
          />
          <DrawerItem
            iconName="md-trending-up"
            active={currentRoute === "networth"}
            onPress={() => {
              navigation.navigate("NetWorth");
            }}
            label="NET WORTH"
          />
          <DrawerItem
            iconName="ios-eye-off"
            onPress={() => {
              WebBrowser.openBrowserAsync("https://www.budgetal.com/privacy");
            }}
            label="PRIVACY"
          />
          <DrawerItem
            iconName="ios-help-circle-outline"
            onPress={() => {
              WebBrowser.openBrowserAsync(
                "https://docs.google.com/forms/d/e/1FAIpQLSd-r56BTzaLCSeEUIhNeA_cGaGB7yssQByQnBIScFKuMxwhNA/viewform"
              );
            }}
            label="HELP"
          />
          <DrawerItem
            iconName="ios-power"
            onPress={confirmSignOut}
            label="SIGN OUT"
          />
          <View style={styles.footer}>
            <View>
              <Bold style={styles.versionText}>
                {`VERSION\n${Constants.nativeAppVersion} (${
                  Constants.manifest.ios.buildNumber
                })`}
              </Bold>

              <TouchableOpacity
                onPress={() => {
                  StatusBar.setBarStyle("dark-content", true);
                  setVisible(true);
                }}
              >
                <Small style={styles.legal}>LEGAL</Small>
              </TouchableOpacity>
              <LegalModal
                visible={visible}
                onClose={() => {
                  StatusBar.setBarStyle("light-content", true);
                  setVisible(false);
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
  },
  versionText: {
    flex: 1,
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
  },
  legal: {
    flex: 1,
    color: "#fff",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  footer: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: "flex-end",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  imageContainer: {
    marginLeft: 20,
    borderRadius: 35,
    width: 50,
    height: 50,
    backgroundColor: "#aaa",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  nameContainer: {
    paddingHorizontal: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  nameText: {
    fontSize: 18,
    color: "#fff",
  },
  emailText: {
    color: "#fff",
  },
});

export default DrawerContent;
