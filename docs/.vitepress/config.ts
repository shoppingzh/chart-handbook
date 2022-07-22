import { defineConfig } from 'vitepress'
import { autoGenerateSidebar, getFirstDocLink } from 'press-util'

export default defineConfig({
  title: 'Chart Handbook',

  themeConfig: {
    nav: [{
      text: 'echarts手册',
      link: getFirstDocLink('echarts')
    }],

    sidebar: autoGenerateSidebar()
  }
})
