import React, {Component} from 'react';
import moment from 'moment';
import {times} from 'lodash';

import Radio from 'antd/lib/radio';
import Table from 'antd/lib/table';
import Icon from 'antd/lib/icon';

import Month from './Month';
import {currencyf} from 'helpers';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class MonthChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartType: 'grid',
    };
  }

  handleChartTypeChange = e => {
    const chartType = e.target.value === 'grid' ? 'grid' : 'list';
    this.setState({chartType});
  };

  renderGrid(months, startYear, startMonth) {
    const squares = months.map((month, i) => {
      const date = moment([startYear, startMonth, 1]).add(i, 'M');
      const key = `grid-${date.year()}-${date.month()}`;
      return <Month key={key} month={month} date={date} />;
    });
    return (
      <div
        style={{
          borderRadius: '4px',
          padding: '18px 8px 18px 18px',
          border: '1px solid #e9e9e9',
        }}
      >
        {squares}
      </div>
    );
  }

  renderList(months, startYear, startMonth) {
    const validMonth = month => {
      return !month.pastMonth && !month.early;
    };

    const today = new Date();

    const columns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Payment',
        dataIndex: 'payment',
        key: 'payment',
      },
      {
        title: 'Extra Principle',
        dataIndex: 'extra',
        key: 'extra',
      },
      {
        title: 'Principle',
        dataIndex: 'principle',
        key: 'principle',
      },
      {
        title: 'Interest',
        dataIndex: 'interest',
        key: 'interest',
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
      },
    ];

    const dataSource = months.filter(validMonth).map((month, i) => {
      const date = moment([today.getFullYear(), today.getMonth() + 1, 1]).add(
        i,
        'M',
      );

      return {
        key: `ds-${date.format('MMMM-YYY')}`,
        date: date.format('MMMM YYYY'),
        payment: currencyf(month.principal + month.interest),
        principle: currencyf(month.principal - month.extra),
        extra: currencyf(month.extra),
        interest: currencyf(month.interest),
        balance: currencyf(month.balance),
      };
    });

    const years = dataSource.length / 12 + 1;
    const pageSizeOptions = times(years, i => {
      return String((i + 1) * 12);
    });

    return (
      <Table
        bordered={true}
        pagination={{
          pageSize: 12,
          pageSizeOptions,
          showSizeChanger: true,
        }}
        dataSource={dataSource}
        rowClassName={(r, i) => (r.date.startsWith('January') ? 'newYear' : '')}
        columns={columns}
      />
    );
  }

  render() {
    const {months, startYear, startMonth} = this.props;

    const {chartType} = this.state;
    const renderChart =
      chartType === 'grid' ? this.renderGrid : this.renderList;

    return (
      <div>
        <div className="text-center">
          <RadioGroup
            defaultValue="grid"
            size="large"
            onChange={this.handleChartTypeChange}
          >
            <RadioButton value="grid">
              <Icon type="calendar" /> <span>Grid</span>
            </RadioButton>
            <RadioButton value="list">
              <Icon type="bars" /> <span>List</span>
            </RadioButton>
          </RadioGroup>
        </div>
        <br />
        <br />
        <div className="monthChart">
          {renderChart(months, startYear, startMonth)}
        </div>
      </div>
    );
  }
}

export default MonthChart;