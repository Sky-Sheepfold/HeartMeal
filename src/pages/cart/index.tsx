import { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { Button, ScrollView, View } from '@tarojs/components'
import { HeartMealIcon } from '@/components/Icon'
import { CartLineItem } from '@/types'
import {
  calcTotalCount,
  calcTotalPrice,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemCount,
  withCartLineTotal
} from '@/utils/cart'
import './index.scss'

export default function CartPage() {
  const [cartList, setCartList] = useState<CartLineItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  const refreshCart = () => {
    const cart = getCart()
    setCartList(withCartLineTotal(cart))
    setTotalCount(calcTotalCount(cart))
    setTotalPrice(calcTotalPrice(cart))
  }

  useDidShow(refreshCart)

  const isEmpty = totalCount === 0

  const increase = (dishId: number) => {
    updateCartItemCount(dishId, 1)
    refreshCart()
  }

  const decrease = (dishId: number) => {
    updateCartItemCount(dishId, -1)
    refreshCart()
  }

  const removeItem = (dishId: number, name: string) => {
    Taro.showModal({
      title: '移出菜品',
      content: `确定不点「${name}」了吗？`,
      confirmText: '移出',
      confirmColor: '#ff7f9f'
    }).then((res) => {
      if (!res.confirm) {
        return
      }

      removeCartItem(dishId)
      refreshCart()
    })
  }

  const handleClearCart = () => {
    if (isEmpty) {
      return
    }

    Taro.showModal({
      title: '清空餐桌',
      content: '确定要清空已选菜品吗？',
      confirmText: '清空',
      confirmColor: '#ff7f9f'
    }).then((res) => {
      if (!res.confirm) {
        return
      }

      clearCart()
      refreshCart()
    })
  }

  const goMenu = () => {
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }

  const goCheckout = () => {
    if (isEmpty) {
      Taro.showToast({
        title: '餐桌还是空的',
        icon: 'none'
      })
      return
    }

    Taro.navigateTo({
      url: '/pages/checkout/index'
    })
  }

  return (
    <>
      <ScrollView className='page-scroll' scrollY>
        <View className='hm-page cart-page'>
          <View className='cart-header'>
            <View>
              <View className='hm-page-title'>我们的餐桌</View>
              <View className='hm-page-subtitle'>看看你们选了哪些好吃的</View>
            </View>
            {!isEmpty && (
              <Button className='clear-button' hoverClass='button-hover' onClick={handleClearCart}>
                清空
              </Button>
            )}
          </View>

          {isEmpty ? (
            <View className='empty-state hm-card'>
              <View className='empty-mark'>
                <HeartMealIcon name='empty' size='lg' />
              </View>
              <View className='empty-title'>餐桌还是空的</View>
              <View className='empty-desc'>快去选点你们爱吃的吧</View>
              <Button className='hm-primary-button empty-action' hoverClass='button-hover' onClick={goMenu}>
                去点餐
              </Button>
            </View>
          ) : (
            <>
              <View className='cart-stats hm-card'>
                <View className='stat-item'>
                  <View className='stat-label'>已选</View>
                  <View className='stat-value'>{totalCount} 件</View>
                </View>
                <View className='stat-divider' />
                <View className='stat-item'>
                  <View className='stat-label'>合计</View>
                  <View className='stat-value price'>¥{totalPrice}</View>
                </View>
              </View>

              <View className='cart-list'>
                {cartList.map((dish) => (
                  <View key={dish.dishId} className='cart-card hm-card'>
                    <View className={`cart-cover ${dish.tone}`}>{dish.cover}</View>
                    <View className='cart-info'>
                      <View className='cart-row'>
                        <View className='cart-name'>{dish.name}</View>
                        <Button
                          className='remove-button'
                          hoverClass='button-hover'
                          onClick={() => removeItem(dish.dishId, dish.name)}
                        >
                          删除
                        </Button>
                      </View>
                      <View className='cart-price'>单价 ¥{dish.price} / 份</View>
                      <View className='cart-bottom'>
                        <View className='line-total'>小计 ¥{dish.lineTotal}</View>
                        <View className='quantity-control'>
                          <Button className='quantity-button' hoverClass='button-hover' onClick={() => decrease(dish.dishId)}>
                            −
                          </Button>
                          <View className='quantity-value'>{dish.count}</View>
                          <Button className='quantity-button is-plus' hoverClass='button-hover' onClick={() => increase(dish.dishId)}>
                            +
                          </Button>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              <View className='taste-tip hm-card'>
                <View className='taste-title'>
                  <HeartMealIcon name='taste' size='sm' />
                  <View>口味提醒</View>
                </View>
                <View className='taste-desc'>下单前可以在备注里写下 TA 的口味，比如少辣、不吃香菜。</View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {!isEmpty && (
        <View className='cart-total-bar'>
          <View className='total-copy'>
            <View className='total-label'>合计</View>
            <View className='total-price'>¥{totalPrice}</View>
          </View>
          <Button className='hm-primary-button total-button' hoverClass='button-hover' onClick={goCheckout}>
            去下单
          </Button>
        </View>
      )}
    </>
  )
}
