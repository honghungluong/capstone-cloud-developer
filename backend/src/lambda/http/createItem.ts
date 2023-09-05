import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateItemRequest } from '../../requests/CreateItemRequest'
import { getUserId } from '../utils';
import { createItem } from '../../businessLogic/items'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const newItem: CreateItemRequest = JSON.parse(event.body)
      const userId = getUserId(event)
      const newIte = await createItem(newItem, userId)
      //
      return {
        statusCode : 201,
        headers: {
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          item: newIte
        })
      }
    } catch (error) {
      // log error
      return{
        statusCode : 500,
        headers: {
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          error: "Error: Cannot create new cart Item"})
      }
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
