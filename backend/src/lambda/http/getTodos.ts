import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const userId: string = getUserId(event)
      const todos = await getTodosForUser(userId)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          items: todos
        })
      }
    } catch (error) {
      // log error
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Error: Cannot get TODOs"})
    }
  }
})

handler.use(
  cors({
    credentials: true
  })
)
