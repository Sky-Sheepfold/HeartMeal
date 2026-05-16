const { getCart, saveCart } = require('../../utils/cart')
const {
  getOrders,
  clearOrders: clearOrdersStorage
} = require('../../utils/order')

function mergeCartItems(currentCart, orderItems) {
  const nextCart = (currentCart || []).map((item) => Object.assign({}, item))
  const sourceItems = orderItems || []

  sourceItems.forEach((dish) => {
    const existed = nextCart.find((item) => item.dishId === dish.dishId)

    if (existed) {
      existed.count += dish.count
      return
    }

    nextCart.push(Object.assign({}, dish))
  })

  return nextCart
}

Page({
  data: {
    orders: [],
    orderCount: 0,
    latestOrderTime: '',
    isEmpty: true
  },

  onShow() {
    this.refreshOrders()
  },

  refreshOrders() {
    const orders = getOrders().map((order) => Object.assign({}, order, {
      items: (order.items || []).map((dish) => Object.assign({}, dish, {
        lineTotal: Number((dish.price * dish.count).toFixed(2))
      }))
    })).map((order) => {
      const itemCount = order.items.reduce((sum, dish) => sum + dish.count, 0)

      return Object.assign({}, order, {
        itemCount,
        previewItems: order.items.slice(0, 3),
        extraCount: Math.max(order.items.length - 3, 0)
      })
    })

    this.setData({
      orders,
      orderCount: orders.length,
      latestOrderTime: orders.length > 0 ? orders[0].createTime : '',
      isEmpty: orders.length === 0
    })
  },

  goMenu() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  clearOrders() {
    if (this.data.isEmpty) {
      return
    }

    wx.showModal({
      title: '清空记录',
      content: '确定要清空历史订单吗？',
      confirmText: '清空',
      confirmColor: '#ff5f86',
      success: (res) => {
        if (!res.confirm) {
          return
        }

        clearOrdersStorage()
        this.refreshOrders()
      }
    })
  },

  reorder(event) {
    const orderId = event.currentTarget.dataset.id
    const order = this.data.orders.find((item) => item.orderId === orderId)

    if (!order) {
      return
    }

    saveCart(mergeCartItems(getCart(), order.items))
    wx.showToast({
      title: '已放回你们的餐桌',
      icon: 'none',
      duration: 700
    })

    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/cart/index'
      })
    }, 450)
  }
})
