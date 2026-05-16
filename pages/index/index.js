const { categories, menuList } = require('../../data/menu')
const {
  getCart,
  addDishToCart,
  calcTotalCount,
  calcTotalPrice
} = require('../../utils/cart')

function isRecommendedDish(dish) {
  return dish.tags.indexOf('推荐') > -1 ||
    dish.tags.indexOf('情侣必点') > -1 ||
    dish.tags.indexOf('双人推荐') > -1
}

Page({
  data: {
    categories,
    activeCategory: '推荐',
    dishList: [],
    cartList: [],
    totalCount: 0,
    totalPrice: 0,
    cartText: '餐桌还是空的',
    cartDesc: '挑几道你们爱吃的吧'
  },

  onLoad() {
    this.refreshPage()
  },

  onShow() {
    this.refreshPage()
  },

  refreshPage() {
    const cartList = getCart()
    const totalCount = calcTotalCount(cartList)
    const totalPrice = calcTotalPrice(cartList)

    this.setData({
      cartList,
      totalCount,
      totalPrice,
      cartText: totalCount > 0 ? `已选 ${totalCount} 件` : '餐桌还是空的',
      cartDesc: totalCount > 0 ? `合计 ¥${totalPrice}` : '挑几道你们爱吃的吧'
    }, () => {
      this.updateDishList()
    })
  },

  updateDishList() {
    const activeCategory = this.data.activeCategory
    const cartList = this.data.cartList
    const filteredList = activeCategory === '推荐'
      ? menuList.filter(isRecommendedDish)
      : menuList.filter((dish) => dish.category === activeCategory)

    const dishList = filteredList.map((dish) => {
      const cartItem = cartList.find((item) => item.dishId === dish.id)
      return Object.assign({}, dish, {
        count: cartItem ? cartItem.count : 0
      })
    })

    this.setData({ dishList })
  },

  switchCategory(event) {
    const category = event.currentTarget.dataset.category

    this.setData({
      activeCategory: category
    }, () => {
      this.updateDishList()
    })
  },

  addToCart(event) {
    const dishId = Number(event.currentTarget.dataset.id)
    const dish = menuList.find((item) => item.id === dishId)

    if (!dish || !dish.stock) {
      wx.showToast({
        title: '这道菜暂时点不了',
        icon: 'none'
      })
      return
    }

    const cartList = addDishToCart(dish, this.data.cartList)
    const totalCount = calcTotalCount(cartList)
    const totalPrice = calcTotalPrice(cartList)

    this.setData({
      cartList,
      totalCount,
      totalPrice,
      cartText: `已选 ${totalCount} 件`,
      cartDesc: `合计 ¥${totalPrice}`
    }, () => {
      this.updateDishList()
    })

    wx.showToast({
      title: '已加入你们的餐桌',
      icon: 'none'
    })
  },

  goCart() {
    wx.navigateTo({
      url: '/pages/cart/index'
    })
  },

  goCheckout() {
    if (this.data.totalCount === 0) {
      wx.showToast({
        title: '先选一道好吃的吧',
        icon: 'none'
      })
      return
    }

    wx.navigateTo({
      url: '/pages/checkout/index'
    })
  }
})
