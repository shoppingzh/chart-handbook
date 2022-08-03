<template>
  <div ref="el" class="h-[300px]" />
</template>

<script setup lang="ts">
import useChart from '@/hooks/useChart'
import { computed } from 'vue'
import * as echarts from 'echarts'

const START = 20

// const offsets = new Array(10).fill(null).map(_ => random(-15, 10, false))

const offsets = [3, -2, -5, 6, 0, 2, -3, -5, 8, -12, -5, -3, 12]

const all = offsets.reduce((all, offset = 0, index) => {
  const from = index <= 0 ? START : all[all.length - 1].total
  all.push({
    total: from + offset,
    offset
  })
  return all
}, []).reduce((arr, o) => {
  arr.push(o.offset < 0 ? o.total : (o.total - o.offset))
  return arr
}, [])



const options = computed<echarts.EChartsOption>(() => ({
  xAxis: {
    type: 'category'
  },
  yAxis: {},
  tooltip: {},
  legend: {},
  series: [{
    type: 'bar',
    data: [0, ...all],
    itemStyle: {
      color: 'rgba(0, 0, 0, 0)'
    },
    stack: '1'
  }, {
    type: 'bar',
    data: [START, ...offsets.map(o => Math.abs(o))],
    stack: '1',
    barWidth: 20,
    label: {
      show: true,
      position: 'top',
      formatter: (params) => {
        return params.dataIndex < 1 ? null : `${offsets[params.dataIndex - 1]}`
      }
    }
  }]
}))

const { el } = useChart(options)

</script>