import { CartItem, CartLineItem, Dish } from '@/types'
import { STORAGE_KEYS, getStorage, removeStorage, setStorage } from './storage'

function normalizeCart(cart: unknown): CartItem[] {
  if (!Array.isArray(cart)) {
    return []
  }

  return cart
    .map((item) => {
      const value = item as Partial<CartItem> & { id?: number }
      const dishId = Number(value.dishId || value.id || 0)
      const count = Number(value.count || 0)

      return {
        dishId,
        name: value.name || '',
        price: Number(value.price || 0),
        cover: value.cover || '',
        tone: value.tone || 'coral',
        count
      }
    })
    .filter((item) => item.dishId > 0 && item.count > 0)
}

export function getCart(): CartItem[] {
  return normalizeCart(getStorage<unknown>(STORAGE_KEYS.CART, []))
}

export function saveCart(cart: CartItem[]): void {
  setStorage(STORAGE_KEYS.CART, normalizeCart(cart))
}

export function addDishToCart(dish: Dish, currentCart?: CartItem[]): CartItem[] {
  const cart = normalizeCart(currentCart || getCart())
  const existed = cart.find((item) => item.dishId === dish.id)

  if (existed) {
    existed.count += 1
  } else {
    cart.push({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      cover: dish.cover,
      tone: dish.tone,
      count: 1
    })
  }

  saveCart(cart)
  return cart
}

export function updateCartItemCount(dishId: number, delta: number, currentCart?: CartItem[]): CartItem[] {
  const cart = normalizeCart(currentCart || getCart())
    .map((item) => {
      if (item.dishId !== dishId) {
        return item
      }

      return {
        ...item,
        count: item.count + delta
      }
    })
    .filter((item) => item.count > 0)

  saveCart(cart)
  return cart
}

export function removeCartItem(dishId: number, currentCart?: CartItem[]): CartItem[] {
  const cart = normalizeCart(currentCart || getCart()).filter((item) => item.dishId !== dishId)
  saveCart(cart)
  return cart
}

export function clearCart(): void {
  removeStorage(STORAGE_KEYS.CART)
}

export function calcTotalPrice(items: CartItem[]): number {
  const total = normalizeCart(items).reduce((sum, item) => sum + item.price * item.count, 0)
  return Number(total.toFixed(2))
}

export function calcTotalCount(items: CartItem[]): number {
  return normalizeCart(items).reduce((sum, item) => sum + item.count, 0)
}

export function withCartLineTotal(items: CartItem[]): CartLineItem[] {
  return normalizeCart(items).map((item) => ({
    ...item,
    lineTotal: Number((item.price * item.count).toFixed(2))
  }))
}
