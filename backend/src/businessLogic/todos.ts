import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from  'uuid'

// TODO: Implement businessLogic
const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()


// get Todo for user
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  try {
    return await todosAccess.getAllTodos(userId)
  } catch (error) {
    logger.error('Error getting user todos', error)
    throw error; 
  }
}

// create Todo
export const createTodo = async (
  newTodo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> => {
  logger.info('Create todo function')
  const todoId = uuid.v4()
  const attachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  const createdAt = new Date().toString()
  const newItem = {
    userId,
    todoId,
    createdAt,
    attachmentUrl,
    done: false,
    ...newTodo
  }

  return await todosAccess.createTodoItem(newItem)
}

// delete Todo
export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<void> {
  return await todosAccess.deleteTodoItem(todoId, userId)
}

// update Todo
export async function updateTodo(
  todoId: string,
  userId: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<void> {
  createLogger('Updating todo')
  return await todosAccess.updateTodoItem(todoId, userId, updateTodoRequest)
}

// create attachment presigned url function
export async function createAttachmentPresignedUrl(
  todoId: string
): Promise<String> {
  return attachmentUtils.getUploadUrl(todoId)
}