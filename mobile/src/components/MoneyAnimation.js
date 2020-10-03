import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Lottie from "lottie-react-native";
import { moneyJson } from "@src/assets/money";

class MoneyAnimation extends Component {
  componentDidMount() {
    setTimeout(this.playAnimation, 500);
  }

  playAnimation = () => {
    if (this.animation) {
      this.animation.reset();
      this.animation.play();
    }
  };

  render() {
    return (
      <View style={styles.animationContainer}>
        <Lottie
          ref={animation => {
            this.animation = animation;
          }}
          style={{
            width: 100,
            height: 50,
            backgroundColor: "transparent",
          }}
          source={moneyJson}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MoneyAnimation;
