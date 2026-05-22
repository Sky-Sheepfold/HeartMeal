# HeartMeal Icons

本目录保存 HeartMeal / 情侣餐桌的本地 SVG 图标库。

- 风格：温柔圆角线性。
- 画布：`24 x 24`。
- 线宽：默认 `1.9`，贴近设计规格中的 `1.75 / 2 px`。
- 端点和转角：`round`。
- 颜色语义：`#333333`、`#FF7F9F`、`#FF8A3D`、`#888888`。

运行校验：

```bash
node scripts/validate-icons.mjs
```

小程序页面接入时，可以用 `heartMealIconNames` / `heartMealIconGroups` 做类型安全的名称来源；具体渲染建议后续封装 Icon 组件，用显式 `import`、构建复制配置或 CSS mask 处理 Taro / 微信小程序的静态资源路径。
