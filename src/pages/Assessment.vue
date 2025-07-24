<template>
  <div class="card max-w-2xl mx-auto">
    <h2>家长测评问卷</h2>
    <div v-for="(question, index) in paginatedQuestions" :key="index" class="mb-6">
      <p class="font-semibold">
        {{ (currentPage - 1) * pageSize + index + 1 }}. {{ question.text }}
      </p>
      <div v-for="(option, optIndex) in question.options" :key="optIndex" class="ml-4">
        <label class="flex items-center gap-2">
          <input
            type="radio"
            :name="'q' + ((currentPage - 1) * pageSize + index)"
            :value="option.score"
            v-model="answers[question.id]"
          />
          <span>{{ option.label }}</span>
        </label>
      </div>
    </div>

    <div class="flex gap-4 mt-6">
      <button v-if="currentPage > 1" @click="prevPage" class="btn" style="background: var(--color-border); color: var(--color-text-secondary);">上一页</button>
      <button v-if="currentPage < totalPages" @click="nextPage" class="btn">下一页</button>
      <button v-if="currentPage === totalPages" @click="submit" class="btn" style="background: var(--color-accent-hover);">提交</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import questions from '../data/parentnav_questions.json'

const router = useRouter()
const answers = ref({})
const currentPage = ref(1)
const pageSize = 4

const totalPages = Math.ceil(questions.length / pageSize)
const paginatedQuestions = computed(() =>
  questions.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)

function nextPage() {
  if (currentPage.value < totalPages) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function submit() {
  // 构建模块总分统计对象
  const moduleScores = {}
  const moduleCounts = {}

  questions.forEach((q) => {
    const selected = answers.value[q.id]
    const dimension = q.dimension || '未分类'

    if (!moduleScores[dimension]) {
      moduleScores[dimension] = 0
      moduleCounts[dimension] = 0
    }

    if (selected !== undefined) {
      moduleScores[dimension] += Number(selected)
      moduleCounts[dimension]++
    }
  })

  // 跳转到结果页，传递 JSON.stringify(scores)
  router.push({
    path: '/result',
    query: {
      scores: JSON.stringify(moduleScores)
    }
  })
}
</script>
