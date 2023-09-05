/**
 * Fields in a request to update a single CART item.
 */
export interface UpdateItemRequest {
  name: string
  price: string
  buy: boolean
}