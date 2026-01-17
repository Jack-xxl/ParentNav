<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-6">199元完整版 · 八大模块测评报告</h2>

    <RadarChart :labels="radarLabels" :scores="radarScores" class="mb-8" />

    <div v-for="(entry, idx) in Object.values(resultByModule)" :key="idx" class="mb-6">
      <h3 class="text-md font-semibold">模块{{ idx + 1 }}：{{ entry.module }}</h3>
      <p class="text-sm">得分：{{ entry.score }} / {{ entry.max }} （评级：{{ entry.level }}）</p>
    </div>

    <div class="mt-6">
      <p class="font-semibold text-red-600" v-if="weakModules.length">
        存在成长盲点模块：{{ weakModules.join('、') }}，建议根据模块等级设定有针对性调整。
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RadarChart from '../components/RadarChart.vue'
import adviceMap from '../data/paid_result_advice.json'
import adviceStructure from '../data/parentnav_199_advice_structured.js'

const resultByModule = ref({})
const radarLabels = ref([])
const radarScores = ref([])
const weakModules = ref([])

onMounted(() => {
  const raw = localStorage.getItem('paid_199_answers')
  if (!raw) return
  const answers = JSON.parse(raw)

  // 汇总得分
  answers.forEach(ans => {
    const module = ans.module
    if (!resultByModule.value[module]) {
      resultByModule.value[module] = {
        module,
        score: 0,
        max: 0,
        questions: []
      }
    }
    resultByModule.value[module].score += ans.score
    resultByModule.value[module].max += 5
    resultByModule.value[module].questions.push(ans)
  })

  // 计算等级并生成雷达数据
  radarLabels.value = []
  radarScores.value = []

  for (const key in resultByModule.value) {
    const entry = resultByModule.value[key]
    const percent = Math.round((entry.score / entry.max) * 100)
    entry.percent = percent

    if (percent >= 85) entry.level = '优秀'
    else if (percent >= 70) entry.level = '良好'
    else if (percent >= 50) entry.level = '中等'
    else if (percent >= 35) entry.level = '需关注'
    else entry.level = '紧急'

    radarLabels.value.push(entry.module)
    radarScores.value.push(percent)

    if (percent < 50) weakModules.value.push(entry.module)
  }
})
</script>

<style scoped>
h2 {
  text-align: center;
}
</style>
