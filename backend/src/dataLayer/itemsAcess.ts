import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { CartItem } from '../models/CartItem'
import { ItemUpdate } from '../models/ItemUpdate'

var AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('ItemsAccess')

// Implement the dataLayer logic
export class ItemsAccess {
    constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly itemsTable = process.env.ITEMS_TABLE,
      private readonly itemsIndex = process.env.INDEX_NAME
    ) {}
  
    async getAllItems(userId: string): Promise<CartItem[]> {
      logger.info('Get all items func')
  
      const result = await this.docClient
        .query({
          TableName: this.itemsTable,
          IndexName: this.itemsIndex,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          }
        })
        .promise()
  
      const items = result.Items
      return items as CartItem[]
    }
  
    async createCartItem(cartItem: CartItem): Promise<CartItem> {
      logger.info('Create cart item func')
  
      await this.docClient
        .put({
          TableName: this.itemsTable,
          Item: cartItem
        })
        .promise()
  
      return cartItem as CartItem
    }
  
    async updateCartItem(
      itemId: string,
      userId: string,
      itemUpdate: ItemUpdate
    ): Promise<void> {
      logger.info(`Updating cart item id: ${itemId}`)
      await this.docClient
        .update({
          TableName: this.itemsTable,
          Key: { userId, itemId },
          ConditionExpression: 'attribute_exists(itemId)',
          UpdateExpression: 'set #n = :n, price = :pric, buy = :bu',
          ExpressionAttributeNames: { '#n': 'name' },
          ExpressionAttributeValues: {
            ':n': itemUpdate.name,
            ':pric': itemUpdate.price,
            ':bu': itemUpdate.buy
          }
        })
        .promise()
    }
  
    async deleteCartItem(itemId: string, userId: string): Promise<void> {
      logger.info('Delete cart item func')
  
      await this.docClient
        .delete({
          TableName: this.itemsTable,
          Key: {
            itemId,
            userId
          }
        })
        .promise()
    }
  }