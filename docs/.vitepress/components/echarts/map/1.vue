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
    }]
  } as echarts.EChartsOption)
})
</script>