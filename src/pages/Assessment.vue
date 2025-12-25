<template>
  <div class="card max-w-2xl mx-auto">
    <h2>家长测评问卷</h2>

    <div v-for="(question, index) in paginatedQuestions" :key="question.id" class="mb-6">
      <p class="font-semibold">
        {{ (currentPage - 1) * pageSize + index + 1 }}. {{ question.text }}
      </p>

      <div v-for="(option, optIndex) in question.options" :key="optIndex" class="ml-4">
        <label class="flex items-center gap-2">
          <input
            type="radio"
            :name="'q' + question.id"
            :value="Number(option.score)"
            v-model.number="answers[question.id]"
          />
          <span>{{ option.label }}</span>
        </label>
      </div>

      <p v-if="showErrors && !isAnswered(question.id)" class="text-red-500 text-sm mt-1">
        请先选择一个选项
      </p>
    </div>

    <div class="flex gap-4 mt-6">
      <button
        v-if="currentPage > 1"
        @click="prevPage"
        class="btn"
        style="background: var(--color-border); color: var(--color-text-secondary);"
      >
        上一页
      </button>

      <button v-if="currentPage < totalPages" @click="nextPage" class="btn">
        下一页
      </button>

      <button
        v-if="currentPage === totalPages"
        @click="submit"
        class="btn"
        style="background: var(--color-accent-hover);"
      >
        提交
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import questions from '../data/parentnav_questions.json' // 这里放你的 30题免费题库

const router = useRouter()

const answers = ref({})
const currentPage = ref(1)
const pageSize = 4
const showErrors = ref(false)

const totalPages = Math.ceil(questions.length / pageSize)

const paginatedQuestions = computed(() =>
  questions.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)

function isAnswered(qid) {
  const v = answers.value[qid]
  return v !== undefined && v !== null && v !== ''
}

function nextPage() {
  // 可选：翻页也校验本页是否答完
  showErrors.value = true
  const allAnswered = paginatedQuestions.value.every(q => isAnswered(q.id))
  if (!allAnswered) return

  if (currentPage.value < totalPages) currentPage.value++
  showErrors.value = false
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
  showErrors.value = false
}

function submit() {
  showErrors.value = true
  const allAnswered = questions.every(q => isAnswered(q.id))
  if (!allAnswered) return

  const moduleScores = {}
  const maxMap = {}
  const moduleCounts = {}

  questions.forEach((q) => {
    const dimension = q.dimension || '未分类'

    if (!moduleScores[dimension]) moduleScores[dimension] = 0
    if (!maxMap[dimension]) maxMap[dimension] = 0
    if (!moduleCounts[dimension]) moduleCounts[dimension] = 0

    // 每题满分：取该题 options.score 最大值（你题库是1~4）
    const optionScores = (q.options || [])
      .map(o => Number(o.score))
      .filter(n => Number.isFinite(n))
    const qMax = optionScores.length ? Math.max(...optionScores) : 0

    maxMap[dimension] += qMax
    moduleCounts[dimension] += 1

    const selected = answers.value[q.id]
    const n = Number(selected)
    moduleScores[dimension] += Number.isFinite(n) ? n : 0
  })

  router.push({
    path: '/result',
    query: {
      scoreType: 'raw',
      scores: JSON.stringify(moduleScores),
      maxMap: JSON.stringify(maxMap),
      counts: JSON.stringify(moduleCounts)
    }
  })
}
</script>
