import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/items'
//import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const itemId = event.pathParameters.itemId
      const url = await createAttachmentPresignedUrl(itemId)
      return {
        statusCode: 202,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          uploadUrl: url
        })
      }
    } catch (error) {
      // log error
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Error: Cannot generate upload URL"})
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
