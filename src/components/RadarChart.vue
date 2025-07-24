<template>
  <div class="chart-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  labels: Array,
  scores: Array
})

const canvas = ref(null)
let chartInstance = null

const createRadarChart = () => {
  if (!canvas.value) return
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(canvas.value, {
    type: 'radar',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: '各模块得分',
          data: props.scores,
          fill: true,
          borderColor: 'rgba(54, 162, 235, 0.6)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      animation: {
        duration: 800
      },
      elements: {
        line: {
          tension: 0.3
        }
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              size: 13
            }
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            backdropColor: 'transparent',
            color: '#666'
          },
          pointLabels: {
            font: {
              size: 14
            },
            color: '#444'
          },
          grid: {
            color: 'rgba(200,200,200,0.3)'
          }
        }
      }
    }
  })
}

onMounted(() => {
  createRadarChart()
})

watch(() => [props.labels, props.scores], () => {
  createRadarChart()
})
</script>

<style scoped>
.chart-container {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 1rem;
}
canvas {
  width: 100%;
  height: auto;
}
</style>
