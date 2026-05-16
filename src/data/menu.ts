import { Dish } from '@/types'

export const categories = ['推荐', '主食', '小吃', '饮品', '甜品', '套餐']

export const menuList: Dish[] = [
  {
    id: 1,
    name: '番茄牛腩饭',
    category: '主食',
    price: 28,
    cover: '番茄',
    desc: '酸甜番茄搭配软烂牛腩，适合两个人分享',
    tags: ['推荐', '情侣必点'],
    spicy: '不辣',
    stock: true,
    tone: 'coral'
  },
  {
    id: 2,
    name: '双人炸鸡拼盘',
    category: '小吃',
    price: 39,
    cover: '炸鸡',
    desc: '外酥里嫩的小食组合，聊天追剧都很搭',
    tags: ['双人推荐', '热销'],
    spicy: '微辣',
    stock: true,
    tone: 'amber'
  },
  {
    id: 3,
    name: '草莓奶昔',
    category: '饮品',
    price: 18,
    cover: '草莓',
    desc: '清甜草莓和牛乳打在一起，饭前饭后都刚好',
    tags: ['甜蜜', '女生喜欢'],
    spicy: '不辣',
    stock: true,
    tone: 'rose'
  },
  {
    id: 4,
    name: '芒果布丁',
    category: '甜品',
    price: 12,
    cover: '芒果',
    desc: '果香浓郁，口感软糯，给这顿饭一个小结尾',
    tags: ['轻甜', '饭后'],
    spicy: '不辣',
    stock: true,
    tone: 'sun'
  },
  {
    id: 5,
    name: '黑椒牛柳饭',
    category: '主食',
    price: 26,
    cover: '黑椒',
    desc: '黑椒香气浓一点，适合想吃扎实主食的时候',
    tags: ['热销', '饱腹'],
    spicy: '微辣',
    stock: true,
    tone: 'moss'
  },
  {
    id: 6,
    name: '双人分享套餐',
    category: '套餐',
    price: 68,
    cover: '套餐',
    desc: '主食、小吃和饮品一次配好，选择困难也能轻松开饭',
    tags: ['推荐', '双人推荐'],
    spicy: '可备注',
    stock: true,
    tone: 'berry'
  },
  {
    id: 7,
    name: '蜂蜜柚子茶',
    category: '饮品',
    price: 16,
    cover: '柚子',
    desc: '酸甜清爽，适合配炸物或重口主食',
    tags: ['清爽', '热饮'],
    spicy: '不辣',
    stock: true,
    tone: 'mint'
  },
  {
    id: 8,
    name: '芝士年糕',
    category: '小吃',
    price: 22,
    cover: '年糕',
    desc: '软糯年糕包着芝士，趁热分享最开心',
    tags: ['情侣必点', '拉丝'],
    spicy: '不辣',
    stock: true,
    tone: 'cream'
  }
]
