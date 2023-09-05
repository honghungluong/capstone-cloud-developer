import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const newTodo: CreateTodoRequest = JSON.parse(event.body)
      const userId = getUserId(event)
      const newItem = await createTodo(newTodo, userId)
      //
      return {
        statusCode : 201,
        headers: {
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          item: newItem
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
          error: "Error: Cannot create new TODO"})
      }
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
