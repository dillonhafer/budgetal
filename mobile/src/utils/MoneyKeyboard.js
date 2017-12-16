import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { currencyf } from 'utils/helpers';
import colors from 'utils/colors';

const KeyboardNumber = ({ number, onPress }) => {
  const isDelete = String(number).length > 2;
  const handleOnPress = () => {
    const pressedValue = isDelete ? 'delete' : number;
    onPress(pressedValue);
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      {!isDelete ? (
        <View style={keyboardStyles.numberButton}>
          <Text style={[keyboardStyles.numberButtonText]}>{number}</Text>
        </View>
      ) : (
        <View style={keyboardStyles.numberButton}>{number}</View>
      )}
    </TouchableOpacity>
  );
};

class MoneyKeyboard extends Component {
  state = {
    income: null,
  };

  formatNumber(number) {
    return currencyf((number / 100).toFixed(2));
  }

  handleOnPress = valuePressed => {
    const _income = `${this.state.income || this.props.defaultValue || '0'}`;
    let income = `${this.state.income || this.props.defaultValue || '0'}`;

    switch (valuePressed) {
      case 'delete':
        income =
          _income.length === 1 ? '0' : _income.substring(0, _income.length - 1);
        break;
      default:
        income += valuePressed;
    }
    this.setState({ income });
    const floatValue = parseFloat(
      this.formatNumber(income)
        .replace(',', '')
        .replace('$', ''),
    );
    this.props.onChange(floatValue);
  };

  render() {
    const { onPress, defaultValue } = this.props;
    const { income } = this.state;
    const displayIncome = income || defaultValue || '0';
    return (
      <View style={keyboardStyles.container}>
        <View style={keyboardStyles.valueContainer}>
          <Text numberOfLines={1} style={keyboardStyles.valueText}>
            {this.formatNumber(displayIncome)}
          </Text>
          <View style={keyboardStyles.submitButtonContainer}>
            {onPress && (
              <TouchableOpacity
                style={keyboardStyles.submitButton}
                onPress={onPress}
              >
                <Ionicons name="ios-arrow-dropright" color="#fff" size={28} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={keyboardStyles.numberRow}>
          <KeyboardNumber onPress={this.handleOnPress} number={'1'} />
          <KeyboardNumber onPress={this.handleOnPress} number={'2'} />
          <KeyboardNumber onPress={this.handleOnPress} number={'3'} />
        </View>

        <View style={keyboardStyles.numberRow}>
          <KeyboardNumber onPress={this.handleOnPress} number={'4'} />
          <KeyboardNumber onPress={this.handleOnPress} number={'5'} />
          <KeyboardNumber onPress={this.handleOnPress} number={'6'} />
        </View>

        <View style={keyboardStyles.numberRow}>
          <KeyboardNumber onPress={this.handleOnPress} number={'7'} />
          <KeyboardNumber onPress={this.handleOnPress} number={'8'} />
          <KeyboardNumber onPress={this.handleOnPress} number={'9'} />
        </View>

        <View style={keyboardStyles.numberRow}>
          <KeyboardNumber onPress={this.handleOnPress} number={'00'} />
          <KeyboardNumber onPress={this.handleOnPress} number={'0'} />
          <KeyboardNumber
            onPress={this.handleOnPress}
            number={<Ionicons name="ios-backspace-outline" size={28} />}
          />
        </View>
      </View>
    );
  }
}

const keyboardStyles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f7f7f7',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  numberButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButtonText: {
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },
  valueContainer: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    width: '70%',
    marginLeft: '15%',
    textAlign: 'center',
    color: '#fff',
    fontSize: 26,
    padding: 10,
    fontWeight: '700',
    fontFamily: 'Helvetica',
  },
  submitButtonContainer: {
    width: '15%',
  },
  submitButton: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 15,
  },
});

export default MoneyKeyboard;
