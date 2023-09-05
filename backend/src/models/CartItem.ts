export interface CartItem {
  userId: string
  itemId: string
  createdAt: string
  name: string
  price: string
  buy: boolean
  attachmentUrl?: string
}
