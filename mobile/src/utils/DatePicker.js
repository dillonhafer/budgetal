import React, { Component } from 'react';
import {
  LayoutAnimation,
  Picker,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import { range } from 'lodash';
import { colors } from '@shared/theme';
import { Ionicons } from '@expo/vector-icons';
import { Bold } from '@src/components/Text';

class DatePicker extends Component {
  state = {
    showPicker: false,
    month: null,
    year: null,
    months: moment.months().map((m, i) => {
      return <Picker.Item key={m} label={m} value={i + 1} />;
    }),
    years: range(2015, new Date().getFullYear() + 3),
  };

  onValueChange = ({ month, year }) => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ month: month, year: year, showPicker: false });
    this.props.onChange({ month, year });
  };

  togglePicker = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ showPicker: !this.state.showPicker });
  };

  render() {
    const { month, year } = this.props;

    let date = moment(`${year}-${month}`, 'YYYY-MM');
    let yearWidth = '40%';
    let monthWidth = '60%';
    let format = 'MMMM YYYY';

    if (month === undefined) {
      date = moment(`${year}-1`, 'YYYY-MM');
      yearWidth = '100%';
      monthWidth = '0%';
      format = 'YYYY';
    }

    const selectedMonth = parseInt(this.state.month || month, 10);

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.dateButton} onPress={this.togglePicker}>
          <View style={styles.dateTextContainer}>
            <Bold style={styles.currentDate}>{date.format(format)}</Bold>
            {!this.state.showPicker && (
              <Ionicons
                name="ios-arrow-down"
                color={colors.primary}
                size={26}
              />
            )}
          </View>
        </TouchableOpacity>
        {this.state.showPicker && (
          <View style={styles.picker}>
            <Picker
              style={{ width: monthWidth }}
              itemStyle={{ fontFamily: 'System' }}
              selectedValue={selectedMonth}
              onValueChange={itemValue =>
                this.onValueChange({ month: itemValue, year })
              }
            >
              {this.state.months}
            </Picker>
            <Picker
              style={{ width: yearWidth }}
              selectedValue={`${this.state.year || year}`}
              itemStyle={{ fontFamily: 'System' }}
              onValueChange={itemValue =>
                this.onValueChange({ year: itemValue, month })
              }
            >
              {range(2015, new Date().getFullYear() + 3).map(y => {
                return (
                  <Picker.Item key={y} label={String(y)} value={String(y)} />
                );
              })}
            </Picker>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    paddingTop: 10,
  },
  picker: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primary,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  dateButton: {
    padding: 10,
  },
  currentDate: {
    textAlign: 'left',
    fontWeight: '800',
    fontSize: 18,
    color: '#444',
  },
  dateTextContainer: {
    borderWidth: 0,
    borderColor: '#fff',
    marginHorizontal: 10,
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default DatePicker;
