export type Payer = '我请客' | 'TA 请客' | 'AA' | '下次再说'

export interface Dish {
  id: number
  name: string
  category: string
  price: number
  cover: string
  desc: string
  tags: string[]
  spicy: string
  stock: boolean
  tone: string
}

export interface CartItem {
  dishId: number
  name: string
  price: number
  cover: string
  tone: string
  count: number
}

export interface CartLineItem extends CartItem {
  lineTotal: number
}

export interface Order {
  orderId: string
  createTime: string
  items: CartItem[]
  totalPrice: number
  totalCount: number
  peopleCount: number
  remark: string
  payer: Payer
  status: '已完成'
}

export interface OrderView extends Order {
  itemCount: number
  previewItems: CartLineItem[]
  extraCount: number
}
