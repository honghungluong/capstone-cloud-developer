import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteItem } from '../../businessLogic/items'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const itemId = event.pathParameters.itemId    
      const userId = getUserId(event)
      await deleteItem(itemId, userId)
  
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: 'deleted'
      }
    } catch (error) {
      // log error
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Error: Cannot delete Item"})
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
