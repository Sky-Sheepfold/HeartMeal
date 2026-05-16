import { defineConfig } from '@tarojs/cli'
import path from 'path'

export default defineConfig({
  projectName: 'HeartMeal',
  date: '2026-05-16',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  alias: {
    '@': path.resolve(__dirname, '..', 'src')
  },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false
    }
  },
  plugins: ['@tarojs/plugin-framework-react', '@tarojs/plugin-platform-weapp'],
  copy: {
    patterns: [
      {
        from: 'sitemap.json',
        to: 'dist/sitemap.json'
      }
    ],
    options: {}
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {}
})
