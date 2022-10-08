<template>
  <el-form class="px-10" @submit.prevent>
    <el-form-item label="起始值">
      <el-input-number v-model="start" placeholder="设定起始值" />
    </el-form-item>
  </el-form>
  <div ref="el" class="h-[300px]" />
</template>

<script setup lang="ts">
import useChart from '@/hooks/useChart'
import { ref, computed } from 'vue'
import * as echarts from 'echarts'

const start = ref(20)

function getFallData(start: number, offsets: number[]) {
  const all = offsets.reduce((all, offset = 0, index) => {
    const prev = index <= 0 ? start : all[all.length - 1]
    all.push(prev + offset)
    return all
  }, [])
  const min = all.reduce((min, value) => Math.min(min, value), 0)
  const vitualStart = Math.abs(min)

  const newOffsets = [start, ...offsets]
  const bottom = newOffsets.reduce((all, offset = 0, index) => {
    const prev = index <= 0 ? vitualStart : all[all.length - 1].total
    all.push({
      total: prev + offset,
      offset
    })
    return all
  }, []).map(o => o.offset < 0 ? o.total : o.total - o.offset)

  return {
    top: newOffsets,
    bottom,
    offset: min
  }
}

const options = computed<echarts.EChartsOption>(() => {
  const fallData = getFallData(start.value, [3, -2, -5, 6, -15, 0, 2, -3, -5, 8, -12, -5, -3, 12])
  return {
    xAxis: {
      type: 'category'
    },
    yAxis: {
      axisLabel: {
        formatter: (value) => `${value + fallData.offset}`
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {},
    series: [{
      type: 'bar',
      data: fallData.bottom,
      itemStyle: {
        color: 'rgba(0, 0, 0, 0)'
      },
      stack: '1',
      tooltip: {
        show: false
      }
    }, {
      type: 'bar',
      data: fallData.top.map((value, index) => ({
        value: Math.abs(value),
        itemStyle: {
          color: index <= 0 ? '#096dd9' : value < 0 ? '#f5222d' : '#52c41a'
        }
      })),
      stack: '1',
      barWidth: 20,
      label: {
        show: true,
        position: 'top',
        formatter: (params) => {
          return `${fallData.top[params.dataIndex]}`
        }
      }
    }]
  }
})

const { el } = useChart(options)

</script>