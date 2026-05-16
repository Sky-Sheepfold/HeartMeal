import { Order } from '@/types'
import { STORAGE_KEYS, getStorage, removeStorage, setStorage } from './storage'

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function createOrderId(): string {
  const now = new Date()
  const date = [now.getFullYear(), pad(now.getMonth() + 1), pad(now.getDate())].join('')
  const time = [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join('')
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0')

  return `${date}${time}${random}`
}

export function formatDateTime(date = new Date()): string {
  return [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-') + ' ' +
    [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(':')
}

export function getOrders(): Order[] {
  const orders = getStorage<Order[]>(STORAGE_KEYS.ORDERS, [])
  return Array.isArray(orders) ? orders : []
}

export function saveOrder(order: Order): void {
  const orders = getOrders()
  setStorage(STORAGE_KEYS.ORDERS, [order].concat(orders))
}

export function clearOrders(): void {
  removeStorage(STORAGE_KEYS.ORDERS)
}
