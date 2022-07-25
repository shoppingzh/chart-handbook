import Theme from 'vitepress/theme'
import ui from './ui'
import components from '../components'
import '../styles/index.less'
import * as echarts from 'echarts'
import china from '../china.json'

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.use(ui)
    app.use(components)

    echarts.registerMap('china', china)
  }
}