import { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { Button, ScrollView, Text, Textarea, View } from '@tarojs/components'
import { CartLineItem, Payer } from '@/types'
import {
  calcTotalCount,
  calcTotalPrice,
  clearCart,
  getCart,
  withCartLineTotal
} from '@/utils/cart'
import { createOrderId, formatDateTime, saveOrder } from '@/utils/order'
import './index.scss'

const payerOptions: Payer[] = ['我请客', 'TA 请客', 'AA', '下次再说']
const quickRemarks = ['少辣', '不要香菜', '今天我请客']

export default function CheckoutPage() {
  const [cartList, setCartList] = useState<CartLineItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [peopleCount, setPeopleCount] = useState(2)
  const [payer, setPayer] = useState<Payer>('AA')
  const [remark, setRemark] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const refreshOrder = () => {
    const cart = getCart()
    setCartList(withCartLineTotal(cart))
    setTotalCount(calcTotalCount(cart))
    setTotalPrice(calcTotalPrice(cart))
  }

  useDidShow(refreshOrder)

  const isEmpty = totalCount === 0

  const decreasePeople = () => {
    setPeopleCount((value) => Math.max(1, value - 1))
  }

  const increasePeople = () => {
    setPeopleCount((value) => Math.min(8, value + 1))
  }

  const addQuickRemark = (text: string) => {
    const current = remark.trim()
    const nextRemark = current ? `${current}，${text}` : text
    setRemark(nextRemark.slice(0, 120))
  }

  const goMenu = () => {
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }

  const submitOrder = () => {
    if (submitting) {
      return
    }

    const cart = getCart()
    const nextTotalCount = calcTotalCount(cart)

    if (nextTotalCount === 0) {
      Taro.showToast({
        title: '餐桌还是空的',
        icon: 'none'
      })
      refreshOrder()
      return
    }

    setSubmitting(true)
    saveOrder({
      orderId: createOrderId(),
      createTime: formatDateTime(),
      items: cart,
      totalPrice: calcTotalPrice(cart),
      totalCount: nextTotalCount,
      peopleCount,
      remark: remark.trim(),
      payer,
      status: '已完成'
    })
    clearCart()

    Taro.showToast({
      title: '点餐成功，祝你们用餐愉快',
      icon: 'none',
      duration: 900
    })

    setTimeout(() => {
      Taro.redirectTo({
        url: '/pages/orders/index'
      })
    }, 700)
  }

  return (
    <>
      <ScrollView className='page-scroll' scrollY>
        <View className='hm-page checkout-page'>
          <View className='checkout-header'>
            <View className='hm-page-title'>确认点餐</View>
            <View className='hm-page-subtitle'>美味马上就安排～</View>
          </View>

          {isEmpty ? (
            <View className='empty-state hm-card'>
              <View className='empty-mark'>餐桌</View>
              <View className='empty-title'>还没有选择菜品</View>
              <View className='empty-desc'>先去菜单里挑几道吧</View>
              <Button className='hm-primary-button empty-action' hoverClass='button-hover' onClick={goMenu}>
                去点餐
              </Button>
            </View>
          ) : (
            <>
              <View className='section-card hm-card'>
                <View className='section-title'>订单菜品</View>
                {cartList.map((dish) => (
                  <View key={dish.dishId} className='checkout-item'>
                    <View className='checkout-item-main'>
                      <Text className='checkout-name'>{dish.name}</Text>
                      <Text className='checkout-count'>x{dish.count}</Text>
                    </View>
                    <View className='checkout-line-total'>¥{dish.lineTotal}</View>
                  </View>
                ))}
              </View>

              <View className='section-card hm-card'>
                <View className='section-title'>用餐人数</View>
                <View className='people-stepper'>
                  <Button
                    className={`people-button ${peopleCount <= 1 ? 'is-disabled' : ''}`}
                    disabled={peopleCount <= 1}
                    hoverClass='button-hover'
                    onClick={decreasePeople}
                  >
                    −
                  </Button>
                  <View className='people-value'>
                    <Text>{peopleCount}</Text>
                    <Text>人</Text>
                  </View>
                  <Button
                    className={`people-button is-plus ${peopleCount >= 8 ? 'is-disabled' : ''}`}
                    disabled={peopleCount >= 8}
                    hoverClass='button-hover'
                    onClick={increasePeople}
                  >
                    +
                  </Button>
                </View>
              </View>

              <View className='section-card hm-card'>
                <View className='section-title'>今天谁请客？</View>
                <View className='payer-list'>
                  {payerOptions.map((option) => (
                    <Button
                      key={option}
                      className={`payer-option ${payer === option ? 'is-active' : ''}`}
                      hoverClass='button-hover'
                      onClick={() => setPayer(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </View>
              </View>

              <View className='preference-card hm-card'>
                <View className='preference-title'>口味提醒</View>
                <View className='preference-desc'>可以在备注里写下 TA 的口味，比如少辣、不吃香菜。</View>
              </View>

              <View className='section-card hm-card'>
                <View className='section-title'>情侣备注</View>
                <Textarea
                  className='remark-input'
                  value={remark}
                  maxlength={120}
                  placeholder='比如：少辣，不要香菜，今天想吃甜一点～'
                  onInput={(event) => setRemark(event.detail.value)}
                />
                <View className='quick-remarks'>
                  {quickRemarks.map((text) => (
                    <Button key={text} className='quick-chip' hoverClass='button-hover' onClick={() => addQuickRemark(text)}>
                      {text}
                    </Button>
                  ))}
                </View>
              </View>

              <View className='summary-card hm-card'>
                <View className='summary-row'>
                  <Text>菜品数量</Text>
                  <Text>{totalCount} 件</Text>
                </View>
                <View className='summary-row'>
                  <Text>用餐人数</Text>
                  <Text>{peopleCount} 人</Text>
                </View>
                <View className='summary-row total'>
                  <Text>合计</Text>
                  <Text>¥{totalPrice}</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {!isEmpty && (
        <View className='checkout-submit-bar'>
          <View className='submit-total'>
            <View className='submit-label'>合计</View>
            <View className='submit-price'>¥{totalPrice}</View>
          </View>
          <Button className='hm-primary-button submit-button' loading={submitting} hoverClass='button-hover' onClick={submitOrder}>
            确认下单
          </Button>
        </View>
      )}
    </>
  )
}
