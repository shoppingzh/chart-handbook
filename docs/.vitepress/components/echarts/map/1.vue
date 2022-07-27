<template>
  <div ref="el" class="w-full h-[400px]" />
  <div class="mt-4">
    <el-form label-suffix="：" label-position="left" label-width="100px">
      <el-form-item label="数量">
        <el-input-number v-model="config.count" placeholder="数量" />
      </el-form-item>
      <el-form-item label="特效效果">
        <el-radio-group v-model="config.effect">
          <el-radio label="fill">填充</el-radio>
          <el-radio label="stroke">轮廓</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="飞线图标">
        <el-input v-model="config.symbol" type="textarea" :autosize="{ minRows: 5 }" />
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch, watchEffect } from 'vue'
import { random } from 'lodash'
import useChart from '@/hooks/useChart'

interface Loc {
  name: string,
  coord: [number, number]
}

interface Destination {
  from: Loc,
  to: Loc
}

interface Config {
  count: number,
  effect: 'fill' | 'stroke',
  symbol: string
}

const data: Loc[] = echarts.getMap('china').geoJSON.features.map(o => {
  const prop = o.properties
  return {
    name: prop.name,
    coord: prop.cp
  }
})

const config = reactive<Config>({
  count: 20,
  effect: 'fill',
  symbol: 'circle'
})


const options = computed<echarts.EChartsOption>(() => {
  const list = new Array(config.count).fill(null).map(_ => {
    const from = data[random(0, data.length - 1, false)]
    const to = data[random(0, data.length - 1, false)]
    return {
      from,
      to
    }
  })
  return {
    backgroundColor: '#013954',
    geo: {
      map: 'china',
      roam: true, // 缩放、平移
      // aspectScale: 0.8,
      scaleLimit: {
        min: 1,
        max: 5,
      },
      zoom: 1.2,
      label: {
        show: true,
        formatter: ({ name }) => {
          return name.replace(/^(.*?)(省|自治区|市)$/, '$1')
        },
        fontSize: 8,
        color: 'rgba(255, 255, 255, .7)',
      },
      itemStyle: {
        areaColor: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.8,
          colorStops: [{
            offset: 0,
            color: 'rgba(147, 235, 248, 0)' // 0% 处的颜色
          }, {
            offset: 1,
            color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
          }],
        },
        // 边框
        borderColor: 'rgba(200, 200, 200, .5)',
        borderWidth: 1.5,
        borderCap: 'round',
        borderType: 'dashed',
        // 阴影
        // shadowColor: 'rgba(147, 235, 248, .8)',
        // shadowOffsetX: 0,
        // shadowOffsetY: 15,
      },
    },
    series: [{
      type: 'map',
      geoIndex: 0,
      map: 'china', // 此参数为了防止ts报错
      data: [{
        name: '广东省',
        value: 30
      }]
    }, {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      // 涟漪特效
      rippleEffect: {
        number: 3,
        period: 5,
        scale: 4,
        brushType: config.effect
      },
      itemStyle: {
        color: 'orange'
      },
      data: Object.values(list.reduce((all, o) => {
        all[o.from.name] = o.from
        all[o.to.name] = o.to
        return all
      }, ({} as Record<string, Loc>))).map(o => ({
        value: o.coord,
        symbolSize: random(1, 18)
      }))
    }, {
      type: 'lines',
      coordinateSystem: 'geo',
      geoIndex: 0,
      data: list.map(o => ({
        coords: [
          o.from.coord,
          o.to.coord
        ]
      })),
      effect: {
        show: true,
        period: 20,
        color: 'cyan',
        symbolSize: 15,
        trailLength: 0, // 尾迹数量
          // symbol: 'circle',
        symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAArNJREFUOE9jZEAD1nUHXP8zM3uzMjKo6ckLGPz795/n6pPPO379/XfkP9O/w8fr7M8ja2FE5lg3HOozUhAo9NAXY1AU42a4+/IrWFpZnJvhwetvDDsuvvx55v77jmMN9g0wfXADXFuPbcr3UvIFKdx58RXDu6+/UdwmxM3K4K4vxqAgysUwcdv93burLd1ACsAGWDccCaryV1nbtvE2iqZoaxkGeRFOBnTx6gA1htaNt2OO1tssZbRtOKRnoix01EVHhAdd4ZF6G7CBNo1HUAyu8ldl2HnpNcO5Ox8sGK0bjxTWBqj2zdn/iOH5hx8oCnEZICnAwZDiKMfQtP7WNEaX1mNr+2K1gzLnXULR7KIjytAQrA4Wy5h7keHKk88o8tOT9BgKF185xFiw6PIre00R0Z6td+AKMpwVGGJsZFA0NKy9ybDnymu4WIm3CsOBa28+MOYvuvzORUdUsGPTbQZRXjaGcj9VBgsVQYbzDz4yGCrwgzXA2Aeuv2GoWXUDLFbhp8pw4OqbF4wu7cd3T4rTcUmdfYFhcrwuWHLewUdgTchhYKokwBBnK8sgysfGEDH5LMPsVAOGosVXljBaNxyaVB+kkTt55z0GeVEusEYYwBaIXgbiDCduv2PIdVdiaFp/M4cRlHRNVYR3qUhwMyw/9pSoWIi0kma49/Lrz+P331lCE9KhvtpA9cLm9bfABoBS24RYHYaff/4xfPr+h0FRlIuhdNlVuOtqAtQYmjfeajhWb9sIT8puHcc3FXgo+f7//59h/sHHGGkCFPeJ9rIMjIyMDBO23d2zq8rKFZ6UYe4GJWlTZYGFbrqiPDJCHAx3X36DZiYuhqfvfjBsv/iK4eyDj+AkjJGZYAKgpP2PkcmZhYnRSleO147hHwPblSefL/76++8q01+GRUeabU8iBxQAwiUWqH6cDPsAAAAASUVORK5CYII=',
          // symbol: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
      },
        // 线条
      lineStyle: {
        color: 'cyan',
        width: 1.5,
        type: 'solid',
        curveness: 0.1, // 线条的曲度
      }
    }]
  }
})

const { el, chart } = useChart(options)

</script>
