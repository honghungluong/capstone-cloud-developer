import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getItemsForUser as getItemsForUser } from '../../businessLogic/items'
import { getUserId } from '../utils';

// Get all Cart items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const userId: string = getUserId(event)
      const userItems = await getItemsForUser(userId)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          items: userItems
        })
      }
    } catch (error) {
      // log error
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Error: Cannot get Items"})
    }
  }
})

handler.use(
  cors({
    credentials: true
  })
)
