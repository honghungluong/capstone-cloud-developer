import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createItem, deleteItem, getItems, patchItem } from '../api/items-api'
import Auth from '../auth/Auth'
import { Item } from '../types/Item'

interface ItemsProps {
  auth: Auth
  history: History
}

interface ItemsState {
  items: Item[]
  newItemName: string
  loadingItems: boolean
}

export class Items extends React.PureComponent<ItemsProps, ItemsState> {
  state: ItemsState = {
    items: [],
    newItemName: '',
    loadingItems: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newItemName: event.target.value })
  }

  onEditButtonClick = (itemId: string) => {
    this.props.history.push(`/items/${itemId}/edit`)
  }

  onItemCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const price = this.calculatePrice()
      const newItem = await createItem(this.props.auth.getIdToken(), {
        name: this.state.newItemName,
        price
      })
      this.setState({
        items: [...this.state.items, newItem],
        newItemName: ''
      })
    } catch {
      alert('Cart item creation failed. Something went wrong!')
    }
  }

  onItemDelete = async (itemId: string) => {
    try {
      await deleteItem(this.props.auth.getIdToken(), itemId)
      this.setState({
        items: this.state.items.filter(item => item.itemId !== itemId)
      })
    } catch {
      alert('Cart item deletion failed')
    }
  }

  onItemCheck = async (pos: number) => {
    try {
      const item = this.state.items[pos]
      await patchItem(this.props.auth.getIdToken(), item.itemId, {
        name: item.name,
        price: item.price,
        buy: !item.buy
      })
      this.setState({
        items: update(this.state.items, {
          [pos]: { buy: { $set: !item.buy } }
        })
      })
    } catch {
      alert('Cart item deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const items = await getItems(this.props.auth.getIdToken())
      this.setState({
        items,
        loadingItems: false
      })
    } catch (e) {
      alert(`Failed to fetch Cart item: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1" color = "pink">Wish List Items Cart</Header>

        {this.renderCreateItemInput()}

        {this.renderItems()}
      </div>
    )
  }

  renderCreateItemInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'pink',
              labelPosition: 'left',
              icon: 'add',
              content: 'New cart item',
              onClick: this.onItemCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Iphone 15 Pro Max"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderItems() {
    if (this.state.loadingItems) {
      return this.renderLoading()
    }

    return this.renderItemsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Wish List Items Cart
        </Loader>
      </Grid.Row>
    )
  }

  renderItemsList() {
    return (
      <Grid padded>
        {this.state.items.map((item, pos) => {
          return (
            <Grid.Row key={item.itemId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onItemCheck(pos)}
                  checked={item.buy}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {item.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {item.price}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(item.itemId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onItemDelete(item.itemId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {item.attachmentUrl && (
                <Image src={item.attachmentUrl} size="small" wrapped onError={(e:any)=>{e.target.style.display='none'}}/>
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculatePrice(): string {
  // Generate a random price between 1000 and 10000
  const minPrice = 1000;
  const maxPrice = 10000;
  const randomPrice = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;

  return randomPrice.toString() + '$';
  }
}
