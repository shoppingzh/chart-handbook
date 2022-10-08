<template>
  <div ref="el" class="h-[400px]" />
</template>

<script setup lang="ts">
import useChart from '@/hooks/useChart'
import { EChartsOption } from 'echarts'
import { computed, ref } from 'vue'
import { random } from 'lodash-es'

const data = ref(new Array(12).fill(null).map((_, index) => {
  return {
    date: 1995 + index,
    amount: random(3000, 100000, false),
    rate: random(0, 100, true)
  }
}))

const options = computed<EChartsOption>(() => {
  return {
    title: {
      text: '北京人口趋势'
    },
    xAxis: {
      data: data.value.map(o => o.date)
    },
    yAxis: [{
      name: '人'
    }, {
      name: '%'
    }],
    legend: {},
    tooltip: {
      trigger: 'axis'
    },
    series: [{
      name: '人数',
      type: 'bar',
      data: data.value.map(o => o.amount)
    }, {
      type: 'line',
      name: '上升趋势',
      data: data.value.map(o => o.rate),
      yAxisIndex: 1
    }]
  }
})

const { el } = useChart(options)
</script>