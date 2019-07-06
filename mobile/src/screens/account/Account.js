import React, { PureComponent } from "react";
import {
  StyleSheet,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  View,
  SectionList,
} from "react-native";

// Navigation
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";

// Components
import { notice, error } from "@src/notify";
import { colors } from "@shared/theme";
import { Updates } from "expo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import Device from "@src/utils/Device";
const isTablet = Device.isTablet();

import Header from "./Header";

class AccountScreen extends PureComponent {
  state = {
    isAvailable: false,
    loading: false,
    updateDownloading: false,
  };

  editAccount = () => {
    this.props.navigation.navigate("AccountEdit");
  };

  navChangePassword = () => {
    this.props.navigation.navigate("ChangePassword");
  };

  navSessions = () => {
    this.props.navigation.navigate("Sessions");
  };

  navLegal = () => {
    this.props.navigation.navigate("Legal");
  };

  componentDidMount() {
    Updates.checkForUpdateAsync()
      .then(({ isAvailable }) => {
        this.setState({ isAvailable });
      })
      .catch(() => {
        // ignore failures
      });
  }

  checkForUpdate = async () => {
    if (this.state.isAvailable) {
      try {
        this.setState({ updateDownloading: true });
        await Updates.fetchUpdateAsync();
        Updates.reload();
      } catch (e) {
        error("Could not download update");
      } finally {
        this.setState({ updateDownloading: false });
      }
      return;
    }

    try {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      this.setState({ isAvailable });
      if (isAvailable) {
        notice("New Update");
      } else {
        notice("You're up to date!");
      }
    } catch (e) {
      error("Could not check for updates");
    }
  };

  renderSeparator = () => {
    return (
      <View style={styles.listSeparatorContainer}>
        <View style={styles.listSeparator} />
      </View>
    );
  };

  renderHeader({ section }) {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  }

  renderButton = ({ item }) => {
    const defaultRight = isTablet ? null : (
      <Ionicons
        name="ios-arrow-forward"
        size={22}
        style={{ paddingRight: 15 }}
        color={"#ced0ce"}
      />
    );

    const onPress = item.onPress;
    const iconStyles = item.icon.backgroundColor
      ? [styles.listItemIcon, { backgroundColor: item.icon.backgroundColor }]
      : styles.listItemIcon;

    return (
      <TouchableOpacity
        style={[styles.listItem, item.style]}
        onPress={onPress}
        disabled={!item.onPress}
      >
        <View
          style={{
            flexDirection: "row",
            width: "65%",
            alignItems: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "22%",
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <View style={iconStyles}>
              <MaterialCommunityIcons
                name={item.icon.name}
                size={22}
                color={"#fff"}
              />
            </View>
          </View>
          <Text style={styles.listItemText}>{item.label}</Text>
        </View>
        {item.right || defaultRight}
      </TouchableOpacity>
    );
  };

  render() {
    const buttons = [
      {
        title: "ACCOUNT",
        data: [
          {
            key: "sessions",
            label: "Sessions",
            icon: { name: "folder-lock-open" },
            onPress: this.navSessions,
            style: styles.first,
          },
          {
            key: "password",
            label: "Change Password",
            icon: { name: "account-key" },
            onPress: this.navChangePassword,
            style: styles.last,
          },
        ],
      },
      {
        title: "UPDATES",
        data: [
          {
            key: "update",
            label: this.state.updateDownloading
              ? "Downloading Update..."
              : this.state.isAvailable
              ? "Download Update"
              : "Check for updates",
            icon: {
              name: "update",
              backgroundColor: this.state.updateDownloading
                ? colors.yellow
                : this.state.isAvailable
                ? colors.success
                : colors.primary,
            },
            onPress: this.state.updateDownloading ? null : this.checkForUpdate,
            style: [styles.first, styles.last],
            right: <View />,
          },
        ],
      },
    ];

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SectionList
          {...BlurViewInsetProps}
          ListHeaderComponent={() => {
            return <Header onPress={this.editAccount} />;
          }}
          style={styles.list}
          stickySectionHeadersEnabled={false}
          sections={buttons}
          ItemSeparatorComponent={this.renderSeparator}
          renderSectionHeader={this.renderHeader}
          renderItem={this.renderButton}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "white",
    alignSelf: "stretch",
    borderWidth: 0.5,
    borderColor: "#aaa",
    borderLeftColor: "#fff",
    borderRightColor: "#fff",
  },
  imageContainer: {
    marginLeft: 25,
    borderRadius: 35,
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: "#aaa",
    backgroundColor: "#aaa",
    overflow: "hidden",
  },
  image: {
    width: 70,
    height: 70,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#444",
  },
  emailText: {
    color: "#888",
  },
  list: {
    backgroundColor: "transparent",
  },
  listSeparatorContainer: {
    backgroundColor: "#fff",
  },
  listSeparator: {
    height: 1,
    width: "86%",
    backgroundColor: "#CED0CE",
    marginLeft: "14%",
  },
  listItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listItemText: {
    fontSize: 17,
    textAlign: "left",
    color: "#444",
  },
  listItemIcon: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderColor: "transparent",
    borderWidth: 1,
    borderRadius: 6,
  },
  first: {
    borderWidth: 1,
    borderColor: "#fff",
    borderTopColor: colors.lines,
  },
  last: {
    borderWidth: 1,
    borderColor: "#fff",
    borderBottomColor: colors.lines,
  },
  headerText: {
    marginTop: 15,
    padding: 5,
    paddingLeft: 15,
    fontSize: 14,
    color: "#aaa",
    fontWeight: "600",
  },
});

export default AccountScreen;
