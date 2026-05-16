const STORAGE_KEYS = {
  CART: 'cart',
  ORDERS: 'orders',
  COUPLE_PROFILE: 'couple_profile'
}

function isEmptyStorageValue(value) {
  return value === '' || value === null || value === undefined
}

function getStorage(key, defaultValue) {
  try {
    const value = wx.getStorageSync(key)
    return isEmptyStorageValue(value) ? defaultValue : value
  } catch (error) {
    console.error('getStorage error:', key, error)
    return defaultValue
  }
}

function setStorage(key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (error) {
    console.error('setStorage error:', key, error)
  }
}

function removeStorage(key) {
  try {
    wx.removeStorageSync(key)
  } catch (error) {
    console.error('removeStorage error:', key, error)
  }
}

module.exports = {
  STORAGE_KEYS,
  getStorage,
  setStorage,
  removeStorage
}
