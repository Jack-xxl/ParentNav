<template>
  <div class="w-full min-h-screen bg-white py-10 px-4">
    <div class="max-w-4xl mx-auto rounded-lg shadow-sm p-6">
      <h2 class="text-3xl font-bold mb-8 text-center">家长测评问卷</h2><div
    v-for="(question, index) in paginatedQuestions"
    :key="question.id"
    class="mb-8"
  >
    <p class="font-semibold mb-3">
      {{ (currentPage - 1) * pageSize + index + 1 }}. {{ question.text }}
    </p>

    <div
      v-for="(option, optIndex) in question.options"
      :key="optIndex"
      class="ml-4 mb-3"
    >
      <label class="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="radio"
          :name="'q' + question.id"
          :value="Number(option.score)"
          v-model.number="answers[question.id]"
          class="w-5 h-5 rounded-full border-2 border-gray-400 checked:border-blue-600 checked:bg-blue-600 checked:appearance-none checked:ring-2 checked:ring-offset-1 checked:ring-blue-600"
        />
        <span class="text-gray-900">{{ option.label }}</span>
      </label>
    </div>

    <p
      v-if="showErrors && !isAnswered(question.id)"
      class="text-red-500 text-sm mt-1"
    >
      请先选择一个选项
    </p>
  </div>

  <div class="flex gap-4 mt-10 justify-center">
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

  </div>
</template><script setup>
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

  questions.forEach(q => {
    const dimension = q.dimension || '未分类'
    moduleScores[dimension] ??= 0
    maxMap[dimension] ??= 0
    moduleCounts[dimension] ??= 0

    const optionScores = (q.options || [])
      .map(o => Number(o.score))
      .filter(n => Number.isFinite(n))
    const qMax = optionScores.length ? Math.max(...optionScores) : 0
    maxMap[dimension] += qMax
    moduleCounts[dimension] += 1

    const selected = Number(answers.value[q.id])
    moduleScores[dimension] += Number.isFinite(selected) ? selected : 0
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
</script><style scoped>
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
}
input[type='radio'] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #cbd5e0;
  position: relative;
  background-color: white;
  transition: all 0.2s;
}
input[type='radio']:checked {
  border-color: #2563eb;
  background-color: white;
}
input[type='radio']:checked::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: #2563eb;
  border-radius: 50%;
}
</style>
