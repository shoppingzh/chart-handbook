<template>
  <div ref="el" class="w-full h-[400px]" />
</template>

<script setup lang="ts">
import useChart from '@/hooks/useChart'
import { computed } from 'vue'

const options = computed<echarts.EChartsOption>(() => {
  return {
    geo: [{
      map: 'china',
      zlevel: -3,
      roam: true,
      itemStyle: {
        shadowColor: 'rgba(29, 57, 196, .35)',
        shadowOffsetX: 0,
        shadowOffsetY: 30,
      },
    }, {
      map: 'china',
      zlevel: -2,
      itemStyle: {
        shadowColor: 'rgba(29, 57, 196, .5)',
        shadowOffsetX: 0,
        shadowOffsetY: 20
      }
    }],
    series: [{
      type: 'map',
      map: 'china',
      itemStyle: {
        areaColor: 'rgba(29, 57, 196, 1)',
      }
    }]
  }
})

const { el } = useChart(options)
</script>