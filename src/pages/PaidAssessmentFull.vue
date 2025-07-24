<template>
  <div class="card max-w-2xl mx-auto">
    <h2>199元完整版 · 八大模块测评</h2>

    <div v-if="!submitted">
      <div v-if="currentQuestion">
        <h3 class="font-semibold mb-2">
          【{{ currentQuestion.moduleTitle }}】
          {{ index + 1 }}. {{ currentQuestion.text }}
        </h3>

        <div v-if="!showAnalysis" class="space-y-2">
          <button
            v-for="opt in currentQuestion.options"
            :key="opt.label"
            @click="selectOption(opt)"
            class="btn w-full text-left"
            style="background: var(--color-bg-secondary); color: var(--color-text); border: 1px solid var(--color-border);"
          >
            {{ opt.label }}. {{ opt.text }}
          </button>
        </div>

        <div v-if="showAnalysis" class="mt-4">
          <p class="font-semibold" style="color: var(--color-accent);">
            你选择的选项：{{ selectedOption.label }}. {{ selectedOption.text }}（{{ selectedOption.score }}分）
          </p >
          <div class="mt-2">
            <p class="text-sm font-medium mb-1">所有选项评分：</p >
            <ul class="text-sm space-y-1">
              <li
                v-for="opt in currentQuestion.options"
                :key="opt.label"
                :class="{ 'font-semibold': selectedOption.label === opt.label }"
                style="color: var(--color-accent);"
              >
                {{ opt.label }}. {{ opt.text }}（{{ opt.score }}分）
                <span v-if="selectedOption.label === opt.label">← 你选的</span>
              </li>
            </ul>
          </div>
          <p class="mt-3 text-secondary text-sm whitespace-pre-wrap">
            解析：{{ currentQuestion.explanation || '暂无解析' }}
          </p >

          <button @click="goNext" class="btn mt-4">
            下一题
          </button>
        </div>
      </div>
    </div>

    <div v-else>
      <h3 class="font-semibold" style="color: var(--color-accent);">测评完成，正在生成您的报告...</h3>
      <router-link to="/paid-199-report" class="btn" style="background: var(--color-accent-hover); color: #fff;">点击查看完整报告</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import paidQuestions from '../data/parentnav_paid_199.json'

const index = ref(0)
const answers = ref([])
const currentQuestion = ref(null)
const submitted = ref(false)
const showAnalysis = ref(false)
const selectedOption = ref(null)
const flatQuestions = ref([])

const loadNext = () => {
  if (index.value >= flatQuestions.value.length) {
    submitted.value = true
    localStorage.setItem('paid_199_answers', JSON.stringify(answers.value))
  } else {
    currentQuestion.value = flatQuestions.value[index.value]
  }
}

const selectOption = (opt) => {
  answers.value.push({
    question: currentQuestion.value.text,
    module: currentQuestion.value.moduleTitle,
    score: opt.score,
    selected: opt.label
  })
  selectedOption.value = opt
  showAnalysis.value = true
}

const goNext = () => {
  index.value++
  showAnalysis.value = false
  selectedOption.value = null
  loadNext()
}

onMounted(() => {
  paidQuestions.forEach(module => {
    module.questions.forEach(q => {
      flatQuestions.value.push({
        moduleTitle: module.moduleTitle,
        ...q // ✅ 不再覆盖 text 字段
      })
    })
  })

  loadNext()
})
</script>

<style scoped>
button {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}
</style>