<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="card">
      <h1>🎉 收费版评估结果概览</h1>

      <div v-if="results.length === 0" class="muted">
        ⚠️ 无评分数据，请重新提交评估。
      </div>

      <div v-else>
        <!-- PDF 内容区域 -->
        <div id="pdf-content">
          <!-- 雷达图 -->
          <div ref="radarChart" style="width: 100%; height: 400px;" class="mb-8"></div>

          <!-- 每个模块结果卡片 -->
          <div v-for="result in results" :key="result.dimension" class="card shadow">
            <h2 class="text-xl font-semibold">{{ result.dimension }}（{{ result.level }}）</h2>
            <p class="muted">得分：{{ result.score }} 分</p>
            <p class="text-secondary text-sm">建议：{{ result.suggestion }}</p>
          </div>
        </div>

        <!-- 下载按钮 -->
        <button @click="downloadPDF" class="btn mt-4">
          下载完整 PDF 报告
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import adviceMap from '../data/paid_result_advice.json'
import html2pdf from 'html2pdf.js'

const radarChart = ref(null)
const rawAnswers = JSON.parse(localStorage.getItem('parentnav_paid_answers') || '{}')
const results = ref([])

const levelDescription = {
  '初步探索': '尚处于起步阶段，需要更多关注和反思。',
  '基础阶段': '已经建立一定意识，但实践尚浅。',
  '进阶阶段': '有系统的行动意识与部分能力，需持续加强。',
  '高级阶段': '表现良好，有体系有引导，接近成熟状态。',
  '优秀阶段': '理念与行动均非常成熟，可持续影响他人。'
}

function getLevel(score) {
  if (score < 50) return '初步探索'
  if (score < 70) return '基础阶段'
  if (score < 85) return '进阶阶段'
  if (score < 95) return '高级阶段'
  return '优秀阶段'
}

onMounted(async () => {
  const questionSet = await import('../data/parentnav_paid_19.json')
  const dimensionScores = {}
  const dimensionCounts = {}

  questionSet.default.forEach((q) => {
    const selectedScore = rawAnswers[q.id]
    const dim = q.dimension || '未分类'
    if (selectedScore !== undefined) {
      if (!dimensionScores[dim]) {
        dimensionScores[dim] = 0
        dimensionCounts[dim] = 0
      }
      dimensionScores[dim] += Number(selectedScore)
      dimensionCounts[dim] += 1
    }
  })

  for (const dimension in dimensionScores) {
    const maxScore = dimensionCounts[dimension] * 5
    const percentScore = Math.round((dimensionScores[dimension] / maxScore) * 100)
    const level = getLevel(percentScore)
    results.value.push({
      dimension,
      score: percentScore,
      level,
      suggestion: adviceMap[dimension]?.[level] || '暂无建议'
    })
  }

  if (radarChart.value) {
    const chart = echarts.init(radarChart.value)
    chart.setOption({
      tooltip: {},
      radar: {
        indicator: results.value.map((r) => ({ name: r.dimension, max: 100 }))
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: results.value.map((r) => r.score),
              name: '综合评估'
            }
          ]
        }
      ]
    })
  }
})

function downloadPDF() {
  const element = document.getElementById('pdf-content')
  html2pdf().from(element).save('测评报告.pdf')
}
</script>

<style scoped>
</style>