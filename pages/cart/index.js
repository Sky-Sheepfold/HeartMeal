const {
  getCart,
  updateCartItemCount,
  removeCartItem,
  clearCart: clearCartStorage,
  calcTotalCount,
  calcTotalPrice,
  withCartLineTotal
} = require('../../utils/cart')

Page({
  data: {
    cartList: [],
    totalCount: 0,
    totalPrice: 0,
    isEmpty: true
  },

  onShow() {
    this.refreshCart()
  },

  refreshCart() {
    const cart = getCart()
    const cartList = withCartLineTotal(cart)
    const totalCount = calcTotalCount(cart)
    const totalPrice = calcTotalPrice(cart)

    this.setData({
      cartList,
      totalCount,
      totalPrice,
      isEmpty: totalCount === 0
    })
  },

  increase(event) {
    const dishId = event.currentTarget.dataset.id
    updateCartItemCount(dishId, 1)
    this.refreshCart()
  },

  decrease(event) {
    const dishId = event.currentTarget.dataset.id
    updateCartItemCount(dishId, -1)
    this.refreshCart()
  },

  removeItem(event) {
    const dishId = event.currentTarget.dataset.id
    const name = event.currentTarget.dataset.name

    wx.showModal({
      title: '移出菜品',
      content: `确定不点「${name}」了吗？`,
      confirmText: '移出',
      confirmColor: '#ff5f86',
      success: (res) => {
        if (!res.confirm) {
          return
        }

        removeCartItem(dishId)
        this.refreshCart()
      }
    })
  },

  clearCart() {
    if (this.data.isEmpty) {
      return
    }

    wx.showModal({
      title: '清空餐桌',
      content: '确定要清空已选菜品吗？',
      confirmText: '清空',
      confirmColor: '#ff5f86',
      success: (res) => {
        if (!res.confirm) {
          return
        }

        clearCartStorage()
        this.refreshCart()
      }
    })
  },

  goMenu() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  goCheckout() {
    if (this.data.isEmpty) {
      wx.showToast({
        title: '餐桌还是空的',
        icon: 'none'
      })
      return
    }

    wx.navigateTo({
      url: '/pages/checkout/index'
    })
  }
})
