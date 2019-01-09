import React, { Component } from 'react';

import { currencyf } from '@shared/helpers';
import moment from 'moment';
import { round } from 'lodash';
import { Badge, Pane, Text, Paragraph, Heading, Strong } from 'evergreen-ui';
import EditMenu from './EditMenu';

class AnnualBudgetItem extends Component {
  render() {
    const { item, loading } = this.props;
    const { name } = item;
    const month = currencyf(round(item.amount / item.interval));
    const color = item.paid ? 'green' : 'neutral';

    return (
      <Pane
        margin={16}
        marginLeft={0}
        marginBottom={0}
        minWidth={252}
        display="flex"
        flex="1 0 30%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          border="default"
          borderBottomWidth={0}
          padding={16}
        >
          <Pane flex={1} alignItems="center" display="flex">
            <Heading size={400}>{loading ? '...' : name}</Heading>
          </Pane>
          <Pane>
            <EditMenu item={this.props.item} />
          </Pane>
        </Pane>
        <Pane
          width="100%"
          border="default"
          display="flex"
          padding={16}
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
        >
          <Text textAlign="center">
            <Paragraph>
              In order to reach <Strong>{currencyf(item.amount)}</Strong>
            </Paragraph>
            <Paragraph>
              by <Strong>{moment(item.dueDate).format('LL')}</Strong>
            </Paragraph>
            <Paragraph>you need to save</Paragraph>
            <Paragraph>
              <Strong>
                {month}
                /month
              </Strong>
            </Paragraph>
          </Text>
          <Badge
            isSolid
            margin={8}
            padding={8}
            height={32}
            paddingX={16}
            color={color}
          >
            Paid
          </Badge>
        </Pane>
      </Pane>
    );
  }
}

export default AnnualBudgetItem;
