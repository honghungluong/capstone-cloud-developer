import { ItemsAccess } from '../dataLayer/itemsAcess'
import { AttachmentUtils } from './attachmentUtils';
import { CartItem } from '../models/CartItem'
import { CreateItemRequest } from '../requests/CreateItemRequest'
import { UpdateItemRequest } from '../requests/UpdateItemRequest'
import { createLogger } from '../utils/logger'
import * as uuid from  'uuid'

// businessLogic
const logger = createLogger('ItemsAccess')
const attachmentUtils = new AttachmentUtils()
const itemsAccess = new ItemsAccess()


// get Item for user
export async function getItemsForUser(userId: string): Promise<CartItem[]> {
  try {
    return await itemsAccess.getAllItems(userId)
  } catch (error) {
    logger.error('Error getting user items', error)
    throw error; 
  }
}

// create Item
export const createItem = async (
  newCartItem: CreateItemRequest,
  userId: string
): Promise<CartItem> => {
  logger.info('Create item function')
  const itemId = uuid.v4()
  const attachmentUrl = attachmentUtils.getAttachmentUrl(itemId)
  const createdAt = new Date().toString()
  const newItem = {
    userId,
    itemId,
    createdAt,
    attachmentUrl,
    buy:false,
    ...newCartItem
  }

  return await itemsAccess.createCartItem(newItem)
}

// delete Item
export async function deleteItem(
  itemId: string,
  userId: string
): Promise<void> {
  return await itemsAccess.deleteCartItem(itemId, userId)
}

// update Item
export async function updateItem(
  itemId: string,
  userId: string,
  updateItemRequest: UpdateItemRequest
): Promise<void> {
  createLogger('Updating cart item')
  return await itemsAccess.updateCartItem(itemId, userId, updateItemRequest)
}

// create attachment presigned url function
export async function createAttachmentPresignedUrl(
  itemId: string
): Promise<String> {
  return attachmentUtils.getUploadUrl(itemId)
}