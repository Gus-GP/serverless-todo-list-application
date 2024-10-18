import { v4 as uuidv4 } from 'uuid'
import {TodosAccess} from "../dataLayer/todosAccess.mjs"
import {createLogger} from "../utils/logger.mjs"

//following hexagonal architecture demo example

const logger = createLogger('businessLogic')

const todosAccess = new TodosAccess();

/**
 * Business logic function to get Todos
 * @param userId user id
 * @returns results from querying the dynamo DB table
 */
export async function getTodo(userId) {
  logger.info(`getTodo from ${userId}`)
  return todosAccess.getTodo(userId);
}

/**
 * Business logic function to create Todos
 * @param createTodoRequest request from user following the right schema
 * @param userId user id
 * @returns results from interacting with the dynamo DB table
 */
export async function createTodo(createTodoRequest, userId) {

  const todoId = uuidv4()

  logger.info(`createTodo ${userId} todoId ${todoId}`)

  return await todosAccess.create({
    todoId: todoId, 
    userId: userId, 
    createdAt: new Date().toISOString(),
    attachmentUrl: '',
    done: false,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate
  });
}

/**
 * Business logic function to update Todos
 * @param userId user id
 * @param todoId user id
 * @param updateTodoRequest request from user following the right schema
 * @returns results from interacting with the dynamo DB table
 */
export async function updateTodo(userId, todoId, updateTodoRequest) {
  logger.info(`updateTodo ${userId} todoId ${todoId} request ${JSON.stringify(updateTodoRequest, null, 2)}`)
  return await todosAccess.update(userId, todoId, {...updateTodoRequest});
}

/**
 * Business logic function to allow user to attach images to todos
 * @param userId user id
 * @param todoId user id
 * @param image the image the user wants to attach
 * @param attachmentUrl the path to update this image
 * @returns results from interacting with the dynamo DB table
 */
export async function setAttachmentUrl(userId, todoId, attachmentUrl) {
  logger.info(`setAttachmentUrl ${userId} todoId ${todoId} attachmentUrl ${attachmentUrl}`)
  return await todosAccess.setAttachmentUrl(userId, todoId, attachmentUrl);
}

/**
 * Business logic function to allow user to delete todos
 * @param userId user id
 * @param todoId user id
 * @returns results from interacting with the dynamo DB table
 */
export async function deleteTodo(userId, todoId) {
  logger.info(`createTodo ${userId} todoId ${todoId}`)
  return await todosAccess.delete(userId, todoId);
}