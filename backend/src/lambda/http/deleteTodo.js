import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from "../utils.mjs";


const logger = createLogger('http-deleteTodo')

//Following the set up on lesson 4 exercise 5 middy solution
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {

    //get todoID from the path parameter
    const todoId = event.pathParameters.todoId

    logger.info(`Processing deleteTodo ${todoId}`)

    const userId = getUserId(event)

    await deleteTodo(userId, todoId)

    return {
      statusCode: 200, 
      body: JSON.stringify({message: "great success!"})
    }
  })