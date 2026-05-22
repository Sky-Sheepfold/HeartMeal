import { Image, View } from '@tarojs/components'
import { heartMealIconSources, HeartMealIconName } from '@/assets/icons'
import './index.scss'

interface HeartMealIconProps {
  name: HeartMealIconName
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function HeartMealIcon({ name, size = 'md', className = '' }: HeartMealIconProps) {
  const classes = ['hm-icon', `hm-icon--${size}`, className].filter(Boolean).join(' ')

  return (
    <View className={classes}>
      <Image className='hm-icon__image' src={heartMealIconSources[name]} mode='aspectFit' />
    </View>
  )
}

export default HeartMealIcon
