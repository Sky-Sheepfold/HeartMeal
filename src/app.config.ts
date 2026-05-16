export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/cart/index',
    'pages/checkout/index',
    'pages/orders/index'
  ],
  window: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '情侣餐桌',
    navigationBarBackgroundColor: '#F8F8F8',
    backgroundColor: '#F8F8F8',
    backgroundTextStyle: 'light'
  },
  lazyCodeLoading: 'requiredComponents',
  sitemapLocation: 'sitemap.json'
})
