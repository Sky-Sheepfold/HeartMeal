const { STORAGE_KEYS, getStorage, setStorage, removeStorage } = require('./storage')

function normalizeCart(cart) {
  if (!Array.isArray(cart)) {
    return []
  }

  return cart
    .map((item) => {
      const dishId = item ? Number(item.dishId || item.id) : 0
      const count = item ? Number(item.count) : 0

      return {
        dishId,
        name: item ? item.name : '',
        price: item ? Number(item.price) : 0,
        cover: item ? item.cover || '' : '',
        tone: item ? item.tone || 'coral' : 'coral',
        count
      }
    })
    .filter((item) => item.dishId > 0 && item.count > 0)
}

function getCart() {
  return normalizeCart(getStorage(STORAGE_KEYS.CART, []))
}

function saveCart(cart) {
  setStorage(STORAGE_KEYS.CART, normalizeCart(cart))
}

function addDishToCart(dish, currentCart) {
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

function updateCartItemCount(dishId, delta, currentCart) {
  const id = Number(dishId)
  const cart = normalizeCart(currentCart || getCart())
    .map((item) => {
      if (item.dishId !== id) {
        return item
      }

      return Object.assign({}, item, {
        count: item.count + delta
      })
    })
    .filter((item) => item.count > 0)

  saveCart(cart)
  return cart
}

function removeCartItem(dishId, currentCart) {
  const id = Number(dishId)
  const cart = normalizeCart(currentCart || getCart()).filter((item) => item.dishId !== id)
  saveCart(cart)
  return cart
}

function clearCart() {
  removeStorage(STORAGE_KEYS.CART)
}

function calcTotalPrice(items) {
  const total = normalizeCart(items).reduce((sum, item) => sum + item.price * item.count, 0)
  return Number(total.toFixed(2))
}

function calcTotalCount(items) {
  return normalizeCart(items).reduce((sum, item) => sum + item.count, 0)
}

function withCartLineTotal(items) {
  return normalizeCart(items).map((item) => Object.assign({}, item, {
    lineTotal: Number((item.price * item.count).toFixed(2))
  }))
}

module.exports = {
  getCart,
  saveCart,
  addDishToCart,
  updateCartItemCount,
  removeCartItem,
  clearCart,
  calcTotalPrice,
  calcTotalCount,
  withCartLineTotal
}
