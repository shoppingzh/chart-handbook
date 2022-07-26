<template>
  <div ref="el" class="w-full h-[400px]" />
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

const el = ref<HTMLElement>()

onMounted(() => {
  const chart = echarts.init(el.value)
  chart.setOption({
    series: [{
      type: 'map',
      map: 'china',
      roam: true,
    }, {
      type: 'lines',
      coordinateSystem: 'geo',
      // polyline: true,
      data: [{
        fromName: '四川省',
        toName: '辽宁省',
        value: 30,
        coords: [
          [101.9199,30.1904],
          [122.0438,41.088]
        ]
      }],
      effect: {},
      lineStyle: {
        color: 'purple',
        opacity: 0.6,
        width: 1
      }
    }]
  } as echarts.EChartsOption)
})
</script>