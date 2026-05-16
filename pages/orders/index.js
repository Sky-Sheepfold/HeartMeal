const { saveCart } = require('../../utils/cart')
const {
  getOrders,
  clearOrders: clearOrdersStorage
} = require('../../utils/order')

Page({
  data: {
    orders: [],
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
    }))

    this.setData({
      orders,
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

    saveCart(order.items)
    wx.showToast({
      title: '已放回餐桌',
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
