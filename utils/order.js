const { STORAGE_KEYS, getStorage, setStorage, removeStorage } = require('./storage')

function pad(value) {
  return String(value).padStart(2, '0')
}

function createOrderId() {
  const now = new Date()
  const date = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate())
  ].join('')
  const time = [
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join('')
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0')

  return `${date}${time}${random}`
}

function formatDateTime(date) {
  const value = date || new Date()

  return [
    value.getFullYear(),
    pad(value.getMonth() + 1),
    pad(value.getDate())
  ].join('-') + ' ' + [
    pad(value.getHours()),
    pad(value.getMinutes()),
    pad(value.getSeconds())
  ].join(':')
}

function getOrders() {
  const orders = getStorage(STORAGE_KEYS.ORDERS, [])
  return Array.isArray(orders) ? orders : []
}

function saveOrder(order) {
  const orders = getOrders()
  setStorage(STORAGE_KEYS.ORDERS, [order].concat(orders))
}

function clearOrders() {
  removeStorage(STORAGE_KEYS.ORDERS)
}

module.exports = {
  createOrderId,
  formatDateTime,
  getOrders,
  saveOrder,
  clearOrders
}
