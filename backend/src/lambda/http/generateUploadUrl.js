import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {createLogger} from '../../utils/logger.mjs'
import {setAttachmentUrl} from '../../businessLogic/todos.mjs'
import {getUserId} from "../utils.mjs";
import {getFormattedUrl, getUploadUrl} from "../../fileStorage/attachmentUtils.mjs";

const logger = createLogger('http-generateUploadUrl')

//Following the set up on lesson 4 exercise 5 middy solution
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {

    //get todoID from the path parameter
    const todoId = event.pathParameters.todoId

    logger.info(`Uploading attachment for ${todoId}`)

    const userId = getUserId(event);

    const attachmentUrl = getFormattedUrl(todoId)

    const uploadUrl = await getUploadUrl(todoId)

    await setAttachmentUrl(userId, todoId, attachmentUrl)

    return {
      statusCode: 201, body: JSON.stringify({
        uploadUrl
      })
    }
  })