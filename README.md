# HeartMeal 情侣餐桌

HeartMeal 是一款面向情侣日常点餐场景的微信小程序。它把菜单浏览、双人选餐、购物车汇总、确认下单和历史订单复购串成一个轻量闭环，让两个人可以快速挑选喜欢的菜品，记录口味备注，并在下一次用餐时一键把曾经点过的菜重新放回餐桌。

## 功能特性

- 菜品浏览：按推荐、主食、小吃、饮品、甜品、套餐分类查看菜单。
- 餐桌购物车：支持添加、减少、删除菜品，并实时计算数量和总价。
- 确认点餐：支持调整用餐人数、选择付款方式、填写或追加快捷备注。
- 历史订单：展示已完成订单、订单摘要、备注和最近用餐记录。
- 再来一单：可将历史订单菜品合并回当前餐桌，便于快速复购。
- 本地存储：购物车和订单数据通过微信小程序本地存储保存。

## 技术栈

- Taro 4
- React 18
- TypeScript
- SCSS
- 微信小程序

## 快速开始

安装依赖：

```bash
npm install
```

启动微信小程序开发构建：

```bash
npm run dev:weapp
```

生产构建：

```bash
npm run build:weapp
```

类型检查：

```bash
npm run typecheck
```

## 微信开发者工具

项目已在 `project.config.json` 中配置：

- 项目名称：`HeartMeal`
- 小程序根目录：`dist/`
- 小程序 AppID：`wxc3d00795264019db`

开发时先运行 `npm run dev:weapp` 生成并监听 `dist/`，再用微信开发者工具导入当前项目目录。

## 目录结构

```text
.
├── config/                 # Taro 构建配置
├── src/
│   ├── app.config.ts       # 小程序全局页面与窗口配置
│   ├── app.scss            # 全局样式
│   ├── data/               # 菜单数据
│   ├── pages/              # 首页、购物车、结算、订单页面
│   ├── types/              # 业务类型定义
│   └── utils/              # 购物车、订单、本地存储工具
├── package.json            # 依赖与脚本
├── project.config.json     # 微信开发者工具配置
└── tsconfig.json           # TypeScript 配置
```

## 页面说明

- `src/pages/index`：菜单首页，负责分类筛选、添加菜品和底部餐桌入口。
- `src/pages/cart`：购物车页，负责菜品数量调整、删除和结算入口。
- `src/pages/checkout`：确认点餐页，负责人数、付款方式、备注和订单提交。
- `src/pages/orders`：订单页，负责历史订单展示、清空记录和再来一单。

## 数据说明

当前版本未接入后端服务，核心数据保存在微信小程序本地缓存中：

- `heartmeal_cart`：当前餐桌购物车。
- `heartmeal_orders`：历史订单列表。

后续如果接入云开发或服务端接口，可以优先替换 `src/utils/storage.ts`、`src/utils/cart.ts` 和 `src/utils/order.ts` 中的数据读写逻辑。
