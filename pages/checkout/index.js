const {
  getCart,
  clearCart: clearCartStorage,
  calcTotalCount,
  calcTotalPrice,
  withCartLineTotal
} = require('../../utils/cart')
const {
  createOrderId,
  formatDateTime,
  saveOrder
} = require('../../utils/order')

Page({
  data: {
    cartList: [],
    totalCount: 0,
    totalPrice: 0,
    isEmpty: true,
    peopleOptions: [1, 2, 3, 4],
    peopleIndex: 1,
    peopleCount: 2,
    payerOptions: ['我请客', 'TA 请客', 'AA', '下次再说'],
    payer: '我请客',
    remark: '',
    submitting: false
  },

  onShow() {
    this.refreshOrder()
  },

  refreshOrder() {
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

  onPeopleChange(event) {
    const peopleIndex = Number(event.detail.value)
    this.setData({
      peopleIndex,
      peopleCount: this.data.peopleOptions[peopleIndex]
    })
  },

  selectPayer(event) {
    this.setData({
      payer: event.currentTarget.dataset.payer
    })
  },

  onRemarkInput(event) {
    this.setData({
      remark: event.detail.value
    })
  },

  goMenu() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  submitOrder() {
    if (this.data.submitting) {
      return
    }

    const cart = getCart()
    const totalCount = calcTotalCount(cart)

    if (totalCount === 0) {
      wx.showToast({
        title: '餐桌还是空的',
        icon: 'none'
      })
      this.refreshOrder()
      return
    }

    const order = {
      orderId: createOrderId(),
      createTime: formatDateTime(),
      items: cart,
      totalPrice: calcTotalPrice(cart),
      totalCount,
      peopleCount: this.data.peopleCount,
      remark: this.data.remark.trim(),
      payer: this.data.payer,
      status: '已完成'
    }

    this.setData({ submitting: true })
    saveOrder(order)
    clearCartStorage()

    wx.showToast({
      title: '点餐成功，祝你们用餐愉快',
      icon: 'none',
      duration: 900
    })

    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/orders/index'
      })
    }, 700)
  }
})
