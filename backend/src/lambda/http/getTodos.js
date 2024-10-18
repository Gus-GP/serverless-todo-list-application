import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('http-getTodos')

//Following the set up on lesson 4 exercise 5 middy solution
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {

    const userId = getUserId(event)

    const todos = await getTodo(userId)

    logger.info(`Processing get Todos for user id: ${userId}`)

    return {
      statusCode: 200, body: JSON.stringify({ todos })
    }
  })