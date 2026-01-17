<template>
  <div class="card max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-center">
      家长测评问卷
    </h2>

    <div
      v-for="(question, index) in paginatedQuestions"
      :key="question.id"
      class="mb-6"
    >
      <p class="font-semibold mb-2">
        {{ (currentPage - 1) * pageSize + index + 1 }}.
        {{ question.text }}
      </p>

      <div
        v-for="(option, optIndex) in question.options"
        :key="optIndex"
        class="ml-4 mb-2"
      >
        <label
          class="flex items-center gap-3 cursor-pointer select-none"
        >
          <!-- ✅ 蓝色 + 放大的单选框 -->
          <input
            type="radio"
            :name="'q' + question.id"
            :value="Number(option.score)"
            v-model.number="answers[question.id]"
            class="w-5 h-5 accent-blue-600 cursor-pointer"
          />
          <span class="text-gray-800">
            {{ option.label }}
          </span>
        </label>
      </div>

      <p
        v-if="showErrors && !isAnswered(question.id)"
        class="text-red-500 text-sm mt-1"
      >
        请先选择一个选项
      </p>
    </div>

    <!-- 分页按钮 -->
    <div class="flex gap-4 mt-8 justify-center">
      <button
        v-if="currentPage > 1"
        @click="prevPage"
        class="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
      >
        上一页
      </button>

      <button
        v-if="currentPage < totalPages"
        @click="nextPage"
        class="btn bg-blue-600 text-white hover:bg-blue-700"
      >
        下一页
      </button>

      <button
        v-if="currentPage === totalPages"
        @click="submit"
        class="btn bg-blue-700 text-white hover:bg-blue-800"
      >
        提交
      </button>
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
const showErrors = ref(false)

const totalPages = Math.ceil(questions.length / pageSize)

const paginatedQuestions = computed(() =>
  questions.slice(
    (currentPage.value - 1) * pageSize,
    currentPage.value * pageSize
  )
)

function isAnswered(qid) {
  const v = answers.value[qid]
  return v !== undefined && v !== null && v !== ''
}

function nextPage() {
  showErrors.value = true
  const allAnswered = paginatedQuestions.value.every(q =>
    isAnswered(q.id)
  )
  if (!allAnswered) return

  if (currentPage.value < totalPages) {
    currentPage.value++
  }
  showErrors.value = false
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
  showErrors.value = false
}

function submit() {
  showErrors.value = true
  const allAnswered = questions.every(q =>
    isAnswered(q.id)
  )
  if (!allAnswered) return

  const moduleScores = {}
  const maxMap = {}
  const moduleCounts = {}

  questions.forEach(q => {
    const dimension = q.dimension || '未分类'

    moduleScores[dimension] ??= 0
    maxMap[dimension] ??= 0
    moduleCounts[dimension] ??= 0

    const optionScores = (q.options || [])
      .map(o => Number(o.score))
      .filter(n => Number.isFinite(n))

    const qMax = optionScores.length
      ? Math.max(...optionScores)
      : 0

    maxMap[dimension] += qMax
    moduleCounts[dimension] += 1

    const selected = Number(answers.value[q.id])
    moduleScores[dimension] += Number.isFinite(selected)
      ? selected
      : 0
  })

  router.push({
    path: '/result',
    query: {
      scoreType: 'raw',
      scores: JSON.stringify(moduleScores),
      maxMap: JSON.stringify(maxMap),
      counts: JSON.stringify(moduleCounts),
    },
  })
}
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
}
</style>
