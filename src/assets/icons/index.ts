import calendarIcon from './svg/calendar.svg'
import cartIcon from './svg/cart.svg'
import checkoutIcon from './svg/checkout.svg'
import clearIcon from './svg/clear.svg'
import clockIcon from './svg/clock.svg'
import coupleIcon from './svg/couple.svg'
import couponIcon from './svg/coupon.svg'
import deleteIcon from './svg/delete.svg'
import dessertIcon from './svg/dessert.svg'
import dishIcon from './svg/dish.svg'
import drinkIcon from './svg/drink.svg'
import emptyIcon from './svg/empty.svg'
import favoriteIcon from './svg/favorite.svg'
import filterIcon from './svg/filter.svg'
import heartIcon from './svg/heart.svg'
import homeIcon from './svg/home.svg'
import hotIcon from './svg/hot.svg'
import imageIcon from './svg/image.svg'
import menuIcon from './svg/menu.svg'
import minusIcon from './svg/minus.svg'
import noteIcon from './svg/note.svg'
import ordersIcon from './svg/orders.svg'
import personTwoIcon from './svg/person-two.svg'
import plusIcon from './svg/plus.svg'
import profileIcon from './svg/profile.svg'
import receiptIcon from './svg/receipt.svg'
import reorderIcon from './svg/reorder.svg'
import riceIcon from './svg/rice.svg'
import searchIcon from './svg/search.svg'
import settingIcon from './svg/setting.svg'
import snackIcon from './svg/snack.svg'
import spicyIcon from './svg/spicy.svg'
import starIcon from './svg/star.svg'
import successIcon from './svg/success.svg'
import tasteIcon from './svg/taste.svg'
import warningIcon from './svg/warning.svg'

export const heartMealIconNames = [
  'home',
  'menu',
  'cart',
  'orders',
  'profile',
  'plus',
  'minus',
  'delete',
  'clear',
  'checkout',
  'reorder',
  'dish',
  'rice',
  'snack',
  'drink',
  'dessert',
  'spicy',
  'hot',
  'heart',
  'couple',
  'taste',
  'note',
  'favorite',
  'person-two',
  'calendar',
  'clock',
  'receipt',
  'success',
  'empty',
  'warning',
  'search',
  'filter',
  'setting',
  'star',
  'image',
  'coupon'
] as const

export type HeartMealIconName = typeof heartMealIconNames[number]

export const heartMealIconGroups = {
  navigation: ['home', 'menu', 'cart', 'orders', 'profile'],
  action: ['plus', 'minus', 'delete', 'clear', 'checkout', 'reorder'],
  food: ['dish', 'rice', 'snack', 'drink', 'dessert', 'spicy', 'hot'],
  couple: ['heart', 'couple', 'taste', 'note', 'favorite', 'person-two'],
  order: ['calendar', 'clock', 'receipt', 'success', 'empty', 'warning'],
  future: ['search', 'filter', 'setting', 'star', 'image', 'coupon']
} as const satisfies Record<string, readonly HeartMealIconName[]>

export const heartMealIconColorNotes = {
  default: '#333333', // default: #333333
  pink: '#FF7F9F', // pink: #FF7F9F
  warm: '#FF8A3D', // warm: #FF8A3D
  muted: '#888888'
} as const

export const heartMealIconSizeNotes = {
  sm: 16,
  md: 20,
  lg: 24
} as const

export const heartMealIconSources: Record<HeartMealIconName, string> = {
  home: homeIcon,
  menu: menuIcon,
  cart: cartIcon,
  orders: ordersIcon,
  profile: profileIcon,
  plus: plusIcon,
  minus: minusIcon,
  delete: deleteIcon,
  clear: clearIcon,
  checkout: checkoutIcon,
  reorder: reorderIcon,
  dish: dishIcon,
  rice: riceIcon,
  snack: snackIcon,
  drink: drinkIcon,
  dessert: dessertIcon,
  spicy: spicyIcon,
  hot: hotIcon,
  heart: heartIcon,
  couple: coupleIcon,
  taste: tasteIcon,
  note: noteIcon,
  favorite: favoriteIcon,
  'person-two': personTwoIcon,
  calendar: calendarIcon,
  clock: clockIcon,
  receipt: receiptIcon,
  success: successIcon,
  empty: emptyIcon,
  warning: warningIcon,
  search: searchIcon,
  filter: filterIcon,
  setting: settingIcon,
  star: starIcon,
  image: imageIcon,
  coupon: couponIcon
}

export function getHeartMealIconAssetPath(name: HeartMealIconName): string {
  return `src/assets/icons/svg/${name}.svg`
}
