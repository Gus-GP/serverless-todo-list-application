
import middy from "@middy/core";
import cors from '@middy/http-cors'
import httpErrorHandler from "@middy/http-error-handler";
import { createLogger } from '../../utils/logger.mjs'
import { updateTodo } from "../../businessLogic/todos.mjs";
import { getUserId } from "../utils.mjs";


const logger = createLogger('http-updateTodo')

//Following the set up on lesson 4 exercise 5 middy solution
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {

    const updateRequest = JSON.parse(event.body)

    //get todoID from the path parameter
    const todoId = event.pathParameters.todoId

    const userId = getUserId(event)

    logger.info(`Processing updateTodo ${JSON.stringify(updateRequest)}, id: ${todoId}`)

    await updateTodo(userId, todoId, updateRequest);

    return {
      statusCode: 200, 
      body: JSON.stringify({message: "great success!"})
    };
  });
