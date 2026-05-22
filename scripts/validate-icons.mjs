import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const svgDir = join(rootDir, 'src/assets/icons/svg')
const indexPath = join(rootDir, 'src/assets/icons/index.ts')
const componentPath = join(rootDir, 'src/components/Icon/index.tsx')
const componentStylePath = join(rootDir, 'src/components/Icon/index.scss')
const assetTypePath = join(rootDir, 'src/types/assets.d.ts')

const expectedIcons = [
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
]

function fail(message) {
  console.error(message)
  process.exitCode = 1
}

if (!existsSync(svgDir)) {
  fail(`Missing icon SVG directory: ${svgDir}`)
} else {
  const files = readdirSync(svgDir).filter((file) => file.endsWith('.svg')).sort()
  const expectedFiles = expectedIcons.map((name) => `${name}.svg`).sort()

  if (files.length !== expectedFiles.length) {
    fail(`Expected ${expectedFiles.length} SVG files, found ${files.length}`)
  }

  for (const file of expectedFiles) {
    if (!files.includes(file)) {
      fail(`Missing SVG file: ${file}`)
      continue
    }

    const content = readFileSync(join(svgDir, file), 'utf8')
    const checks = [
      ['viewBox="0 0 24 24"', '24px viewBox'],
      ['fill="none"', 'no fill base'],
      ['stroke-linecap="round"', 'round line caps'],
      ['stroke-linejoin="round"', 'round line joins']
    ]

    for (const [needle, label] of checks) {
      if (!content.includes(needle)) {
        fail(`${file} is missing ${label}`)
      }
    }
  }
}

if (!existsSync(indexPath)) {
  fail(`Missing icon index: ${indexPath}`)
} else {
  const indexContent = readFileSync(indexPath, 'utf8')

  for (const name of expectedIcons) {
    if (!indexContent.includes(`'${name}'`)) {
      fail(`Icon index is missing '${name}'`)
    }
  }

  for (const token of ['default: #333333', 'pink: #FF7F9F', 'warm: #FF8A3D']) {
    if (!indexContent.includes(token)) {
      fail(`Icon index is missing color note: ${token}`)
    }
  }
}

if (!existsSync(assetTypePath)) {
  fail(`Missing SVG module declaration: ${assetTypePath}`)
}

if (!existsSync(componentPath)) {
  fail(`Missing Icon component: ${componentPath}`)
} else {
  const componentContent = readFileSync(componentPath, 'utf8')

  for (const needle of ['HeartMealIcon', 'heartMealIconSources', 'Image']) {
    if (!componentContent.includes(needle)) {
      fail(`Icon component is missing ${needle}`)
    }
  }
}

if (!existsSync(componentStylePath)) {
  fail(`Missing Icon component styles: ${componentStylePath}`)
}

const pageUsageChecks = [
  ['src/pages/index/index.tsx', ['HeartMealIcon', "name='cart'", "name='person-two'"]],
  ['src/pages/cart/index.tsx', ['HeartMealIcon', "name='empty'", "name='taste'"]],
  ['src/pages/checkout/index.tsx', ['HeartMealIcon', "name='receipt'", "name='person-two'", "name='note'"]],
  ['src/pages/orders/index.tsx', ['HeartMealIcon', "name='orders'", "name='reorder'"]]
]

for (const [relativePath, needles] of pageUsageChecks) {
  const pagePath = join(rootDir, relativePath)

  if (!existsSync(pagePath)) {
    fail(`Missing page for icon integration: ${relativePath}`)
    continue
  }

  const content = readFileSync(pagePath, 'utf8')
  for (const needle of needles) {
    if (!content.includes(needle)) {
      fail(`${relativePath} is missing icon usage: ${needle}`)
    }
  }
}

if (process.exitCode) {
  process.exit()
}

console.log(`Validated ${expectedIcons.length} HeartMeal icons.`)
