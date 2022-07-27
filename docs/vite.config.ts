import { resolve } from 'path'

export default {
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './.vitepress')}
    ]
  }
}

