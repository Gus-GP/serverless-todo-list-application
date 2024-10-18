import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'

const logger = createLogger('http-createTodo')

//Following the set up on lesson 4 exercise 5 middy solutio
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {

    logger.info('Processing createTodo')

    const newTodo = JSON.parse(event.body)

    const userId = getUserId(event)

    const todo = await createTodo(newTodo, userId)

    logger.info(`TODO created ${JSON.stringify(todo)}`)

    return {
      statusCode: 201, body: JSON.stringify({
        todo
      })
    }
  })