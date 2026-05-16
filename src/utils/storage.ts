import Taro from '@tarojs/taro'

export const STORAGE_KEYS = {
  CART: 'cart',
  ORDERS: 'orders',
  COUPLE_PROFILE: 'couple_profile'
} as const

export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const value = Taro.getStorageSync<T>(key)
    return value || defaultValue
  } catch (error) {
    console.error(`getStorage error: ${key}`, error)
    return defaultValue
  }
}

export function setStorage<T>(key: string, value: T): void {
  try {
    Taro.setStorageSync(key, value)
  } catch (error) {
    console.error(`setStorage error: ${key}`, error)
  }
}

export function removeStorage(key: string): void {
  try {
    Taro.removeStorageSync(key)
  } catch (error) {
    console.error(`removeStorage error: ${key}`, error)
  }
}
