import { useMemo, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { Button, ScrollView, Text, View } from '@tarojs/components'
import { HeartMealIcon } from '@/components/Icon'
import { categories, menuList } from '@/data/menu'
import { HeartMealIconName } from '@/assets/icons'
import { CartItem, Dish } from '@/types'
import {
  addDishToCart,
  calcTotalCount,
  calcTotalPrice,
  getCart,
  updateCartItemCount
} from '@/utils/cart'
import './index.scss'

interface DishView extends Dish {
  count: number
}

const categoryIconMap: Record<string, HeartMealIconName> = {
  推荐: 'heart',
  主食: 'rice',
  小吃: 'snack',
  饮品: 'drink',
  甜品: 'dessert',
  套餐: 'dish'
}

function isRecommendedDish(dish: Dish): boolean {
  return dish.tags.includes('推荐') || dish.tags.includes('情侣必点') || dish.tags.includes('双人推荐')
}

export default function IndexPage() {
  const [activeCategory, setActiveCategory] = useState('推荐')
  const [cartList, setCartList] = useState<CartItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  const refreshCart = () => {
    const nextCart = getCart()
    setCartList(nextCart)
    setTotalCount(calcTotalCount(nextCart))
    setTotalPrice(calcTotalPrice(nextCart))
  }

  useDidShow(refreshCart)

  const dishList = useMemo<DishView[]>(() => {
    const filteredList = activeCategory === '推荐'
      ? menuList.filter(isRecommendedDish)
      : menuList.filter((dish) => dish.category === activeCategory)

    return filteredList.map((dish) => {
      const cartItem = cartList.find((item) => item.dishId === dish.id)
      return {
        ...dish,
        count: cartItem ? cartItem.count : 0
      }
    })
  }, [activeCategory, cartList])

  const syncCart = (nextCart: CartItem[]) => {
    setCartList(nextCart)
    setTotalCount(calcTotalCount(nextCart))
    setTotalPrice(calcTotalPrice(nextCart))
  }

  const handleAdd = (dishId: number) => {
    const dish = menuList.find((item) => item.id === dishId)

    if (!dish || !dish.stock) {
      Taro.showToast({
        title: '这道菜暂时点不了',
        icon: 'none'
      })
      return
    }

    syncCart(addDishToCart(dish, cartList))
    Taro.showToast({
      title: '已加入你们的餐桌',
      icon: 'none'
    })
  }

  const handleDecrease = (dishId: number) => {
    syncCart(updateCartItemCount(dishId, -1, cartList))
  }

  const goCart = () => {
    Taro.navigateTo({
      url: '/pages/cart/index'
    })
  }

  const goCheckout = () => {
    if (totalCount === 0) {
      Taro.showToast({
        title: '先选一道好吃的吧',
        icon: 'none'
      })
      return
    }

    Taro.navigateTo({
      url: '/pages/checkout/index'
    })
  }

  const cartText = totalCount > 0 ? `已选 ${totalCount} 件` : '餐桌还是空的'
  const cartDesc = totalCount > 0 ? `合计 ¥${totalPrice}` : '挑几道你们爱吃的吧'

  return (
    <>
      <ScrollView className='page-scroll' scrollY>
        <View className='hm-page index-page'>
          <View className='menu-head'>
            <View className='menu-copy'>
              <View className='menu-kicker'>HeartMeal</View>
              <View className='hm-page-title'>今天想和 TA 吃点什么？</View>
              <View className='hm-page-subtitle'>先挑几道喜欢的，再慢慢决定谁请客。</View>
            </View>
            <View className='taste-entry'>
              <HeartMealIcon name='person-two' size='sm' />
              <Text>2人</Text>
            </View>
          </View>

          <View className='menu-brief hm-card'>
            <View className='brief-block'>
              <View className='brief-label'>默认</View>
              <View className='brief-value'>2 人餐桌</View>
            </View>
            <View className='brief-line' />
            <View className='brief-block'>
              <View className='brief-label'>今日</View>
              <View className='brief-value'>情侣推荐</View>
            </View>
          </View>

          <ScrollView className='category-tabs' scrollX enableFlex>
            {categories.map((category) => (
              <View
                key={category}
                className={`category-tab ${activeCategory === category ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                <HeartMealIcon name={categoryIconMap[category] || 'menu'} size='sm' />
                {category}
              </View>
            ))}
          </ScrollView>

          <View className='dish-list'>
            {dishList.map((dish) => (
              <View key={dish.id} className={`dish-card hm-card ${dish.stock ? '' : 'is-soldout'}`}>
                <View className={`dish-cover ${dish.tone}`}>
                  <Text>{dish.cover}</Text>
                </View>
                <View className='dish-info'>
                  <View className='dish-head'>
                    <Text className='dish-name'>{dish.name}</Text>
                    <Text className='dish-spicy'>{dish.spicy}</Text>
                  </View>
                  <View className='dish-desc'>{dish.desc}</View>
                  <View className='dish-tags'>
                    {dish.tags.map((tag) => (
                      <Text key={tag} className='dish-tag'>{tag}</Text>
                    ))}
                  </View>
                  <View className='dish-bottom'>
                    <View className='dish-price'>¥{dish.price}</View>
                    {dish.count > 0 ? (
                      <View className='dish-stepper'>
                        <Button className='stepper-button' hoverClass='button-hover' onClick={() => handleDecrease(dish.id)}>
                          −
                        </Button>
                        <Text className='stepper-value'>{dish.count}</Text>
                        <Button className='stepper-button is-plus' hoverClass='button-hover' onClick={() => handleAdd(dish.id)}>
                          +
                        </Button>
                      </View>
                    ) : (
                      <View className='dish-actions'>
                        <Button
                          className='add-button'
                          disabled={!dish.stock}
                          hoverClass='button-hover'
                          onClick={() => handleAdd(dish.id)}
                        >
                          {dish.stock ? '+' : '售罄'}
                        </Button>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className={`cart-bar ${totalCount > 0 ? 'is-ready' : 'is-empty'}`}>
        <View className='cart-summary' onClick={goCart}>
          <View className='cart-mark'>
            {totalCount > 0 ? <Text>{totalCount}</Text> : <HeartMealIcon name='cart' size='md' />}
          </View>
          <View className='cart-copy'>
            <View className='cart-title'>{cartText}</View>
            <View className='cart-desc'>{cartDesc}</View>
          </View>
        </View>
        <Button className={`cart-action ${totalCount > 0 ? '' : 'is-disabled'}`} hoverClass='button-hover' onClick={goCheckout}>
          {totalCount > 0 ? '去结算' : '先点餐'}
        </Button>
      </View>
    </>
  )
}
