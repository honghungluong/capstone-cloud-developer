import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateItem } from '../../businessLogic/items'
import { UpdateItemRequest } from '../../requests/UpdateItemRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const itemId = event.pathParameters.itemId
      const updatedItem: UpdateItemRequest = JSON.parse(event.body)
      const userId: string = getUserId(event)
      const updateIte = await updateItem(itemId, userId, updatedItem)
  
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          "item": updateIte
        })
      }
    } catch (error) {
      // log error
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Error: Cannot update Item"})
        }
      }
    })


handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
