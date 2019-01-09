import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Dialog,
  Heading,
  IconButton,
  Menu,
  Pane,
  Paragraph,
  Popover,
  Position,
  Table,
} from 'evergreen-ui';
import { notice, error } from 'window';
import orderBy from 'lodash/orderBy';
import AssetLiabilityForm from './AssetLiabilityForm';

const TableHeader = ({ title }) => (
  <Pane
    display="flex"
    padding={16}
    marginBottom={8}
    background="tint2"
    borderRadius={3}
  >
    <Pane flex={1} alignItems="center" display="flex">
      <Heading size={600}>{title}</Heading>
    </Pane>
  </Pane>
);

class AssetListTable extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
    title: PropTypes.string.isRequired,
    emptyText: PropTypes.string.isRequired,
    buttonTitle: PropTypes.string.isRequired,
    deleteAssetLiability: PropTypes.func.isRequired,
  };

  state = {
    isSubmitting: false,
    showDeleteConfirmation: false,
    assetLiabilityFormVisible: false,
    item: null,
  };

  handleOnAdd = () => {
    const isAsset = this.props.title === 'Assets';
    this.setState({
      item: { name: '', isAsset },
      assetLiabilityFormVisible: true,
    });
  };

  handleOnEdit = item => {
    this.setState({
      item,
      assetLiabilityFormVisible: true,
    });
  };

  handleOnDelete = item => {
    this.setState({ isSubmitting: true });

    this.props
      .deleteAssetLiability(item)
      .then(() => {
        notice(`${item.name} Deleted`);
      })
      .finally(() => {
        this.setState({
          isSubmitting: false,
          showDeleteConfirmation: false,
          item: null,
        });
      })
      .catch(() => {
        error('Something went wrong');
      });
  };

  render() {
    const { title, items, emptyText, buttonTitle } = this.props;

    return (
      <Pane minWidth={252} display="flex" flexDirection="column" flex="1 0 45%">
        <TableHeader title={title} />
        <Table flex="1">
          <Table.Head accountForScrollbar>
            <Table.TextHeaderCell>Name</Table.TextHeaderCell>
            <Table.TextHeaderCell />
          </Table.Head>
          <Table.Body>
            {orderBy(items, 'name', 'asc').map(item => (
              <Table.Row key={`${item.id}`}>
                <Table.TextCell>{item.name}</Table.TextCell>
                <Table.TextCell align="right">
                  <Popover
                    position={Position.BOTTOM_LEFT}
                    content={
                      <Menu>
                        <Menu.Group>
                          <Menu.Item
                            icon="edit"
                            onSelect={() => this.handleOnEdit(item)}
                          >
                            Rename
                          </Menu.Item>
                        </Menu.Group>
                        <Menu.Divider />
                        <Menu.Group>
                          <Menu.Item
                            icon="trash"
                            intent="danger"
                            onSelect={() =>
                              this.setState({
                                showDeleteConfirmation: true,
                                item,
                              })
                            }
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Group>
                      </Menu>
                    }
                  >
                    <IconButton appearance="minimal" icon="more" />
                  </Popover>
                </Table.TextCell>
              </Table.Row>
            ))}
            <Table.Row>
              <Table.TextCell />
              <Table.TextCell align="right">
                <Button
                  onClick={this.handleOnAdd}
                  iconBefore="add"
                  appearance="primary"
                >
                  {buttonTitle}
                </Button>
              </Table.TextCell>
            </Table.Row>
            {items.length === 0 && (
              <Table.Row>
                <Table.TextCell>{emptyText}</Table.TextCell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <Dialog
          width={450}
          intent="danger"
          hasHeader={false}
          confirmLabel={`Delete`}
          isConfirmLoading={this.state.isSubmitting}
          onConfirm={() => {
            this.handleOnDelete(this.state.item);
          }}
          onCloseComplete={() => {
            this.setState({
              showDeleteConfirmation: false,
              item: null,
            });
          }}
          isShown={this.state.showDeleteConfirmation}
        >
          <Alert
            intent="danger"
            title={`Are you sure you want to delete ${this.state.item &&
              this.state.item.name}?`}
          >
            <Paragraph>
              This will remove all items from past records. This cannot be
              undone.
            </Paragraph>
          </Alert>
        </Dialog>
        <AssetLiabilityForm
          item={this.state.item}
          visible={this.state.assetLiabilityFormVisible}
          onCancel={() => this.setState({ item: null })}
          close={() => this.setState({ assetLiabilityFormVisible: false })}
        />
      </Pane>
    );
  }
}

export default AssetListTable;
