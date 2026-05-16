import { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { Button, ScrollView, Text, View } from '@tarojs/components'
import { CartItem, Order, OrderView } from '@/types'
import { getCart, saveCart } from '@/utils/cart'
import { clearOrders, getOrders } from '@/utils/order'
import './index.scss'

function mergeCartItems(currentCart: CartItem[], orderItems: CartItem[]): CartItem[] {
  const nextCart = currentCart.map((item) => ({ ...item }))

  orderItems.forEach((dish) => {
    const existed = nextCart.find((item) => item.dishId === dish.dishId)

    if (existed) {
      existed.count += dish.count
      return
    }

    nextCart.push({ ...dish })
  })

  return nextCart
}

function toOrderView(order: Order): OrderView {
  const items = order.items.map((dish) => ({
    ...dish,
    lineTotal: Number((dish.price * dish.count).toFixed(2))
  }))
  const itemCount = order.items.reduce((sum, dish) => sum + dish.count, 0)

  return {
    ...order,
    itemCount,
    previewItems: items.slice(0, 3),
    extraCount: Math.max(items.length - 3, 0)
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderView[]>([])

  const refreshOrders = () => {
    setOrders(getOrders().map(toOrderView))
  }

  useDidShow(refreshOrders)

  const isEmpty = orders.length === 0
  const latestOrderTime = orders.length > 0 ? orders[0].createTime : ''

  const goMenu = () => {
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }

  const handleClearOrders = () => {
    if (isEmpty) {
      return
    }

    Taro.showModal({
      title: '清空记录',
      content: '确定要清空历史订单吗？',
      confirmText: '清空',
      confirmColor: '#ff7f9f'
    }).then((res) => {
      if (!res.confirm) {
        return
      }

      clearOrders()
      refreshOrders()
    })
  }

  const reorder = (order: OrderView) => {
    saveCart(mergeCartItems(getCart(), order.items))
    Taro.showToast({
      title: '已放回你们的餐桌',
      icon: 'none',
      duration: 700
    })

    setTimeout(() => {
      Taro.redirectTo({
        url: '/pages/cart/index'
      })
    }, 450)
  }

  return (
    <ScrollView className='page-scroll' scrollY>
      <View className='hm-page orders-page'>
        <View className='orders-header'>
          <View>
            <View className='hm-page-title'>一起吃过</View>
            <View className='hm-page-subtitle'>记录你们的每一顿美味</View>
          </View>
          {!isEmpty && (
            <Button className='clear-button' hoverClass='button-hover' onClick={handleClearOrders}>
              清空
            </Button>
          )}
        </View>

        {isEmpty ? (
          <View className='empty-state hm-card'>
            <View className='empty-mark'>记录</View>
            <View className='empty-title'>还没有一起吃过的记录哦</View>
            <View className='empty-desc'>去点第一餐，给今天留一条好吃的回忆</View>
            <Button className='hm-primary-button empty-action' hoverClass='button-hover' onClick={goMenu}>
              去点第一餐
            </Button>
          </View>
        ) : (
          <>
            <View className='orders-summary hm-card'>
              <View className='summary-cell'>
                <View className='summary-label'>一起吃过</View>
                <View className='summary-value'>{orders.length} 次</View>
              </View>
              <View className='summary-divider' />
              <View className='summary-cell'>
                <View className='summary-label'>最近一餐</View>
                <View className='summary-value small'>{latestOrderTime}</View>
              </View>
            </View>

            <View className='order-list'>
              {orders.map((order) => (
                <View key={order.orderId} className='order-card hm-card'>
                  <View className='order-top'>
                    <View>
                      <View className='order-time'>{order.createTime}</View>
                      <View className='order-id'>订单 {order.orderId}</View>
                    </View>
                    <View className='order-status'>{order.status}</View>
                  </View>

                  <View className='order-items'>
                    {order.previewItems.map((dish) => (
                      <View key={dish.dishId} className='order-item'>
                        <Text>{dish.name} x{dish.count}</Text>
                        <Text>¥{dish.lineTotal}</Text>
                      </View>
                    ))}
                    {order.extraCount > 0 && (
                      <View className='order-more'>还有 {order.extraCount} 道菜</View>
                    )}
                  </View>

                  {order.remark && (
                    <View className='order-remark'>备注：{order.remark}</View>
                  )}

                  <View className='order-bottom'>
                    <View>
                      <View className='payer'>{order.payer} · {order.peopleCount} 人 · {order.itemCount} 件</View>
                      <View className='order-total'>¥{order.totalPrice}</View>
                    </View>
                    <Button className='hm-secondary-button reorder-button' hoverClass='button-hover' onClick={() => reorder(order)}>
                      再来一单
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  )
}
