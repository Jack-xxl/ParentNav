<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">付费版测评（三观+育儿观 升级版）</h2>
    <div v-for="(question, index) in paginatedQuestions" :key="index" class="mb-6">
      <p class="font-semibold">
        {{ (currentPage - 1) * pageSize + index + 1 }}. {{ question.question }}
      </p>
      <div v-for="(option, optIndex) in question.options" :key="optIndex" class="ml-4">
        <label>
          <input
            type="radio"
            :name="'q' + ((currentPage - 1) * pageSize + index)"
            :value="option.value"
            v-model="answers[String(question.id)]"
          />
          {{ option.label }}
        </label>
      </div>
    </div>

    <div class="mt-6 space-x-4">
      <button v-if="currentPage > 1" @click="prevPage" class="bg-gray-400 text-white px-4 py-2 rounded">上一页</button>
      <button v-if="currentPage < totalPages" @click="nextPage" class="bg-blue-500 text-white px-4 py-2 rounded">下一页</button>
      <button v-if="currentPage === totalPages" @click="submit" class="bg-green-500 text-white px-4 py-2 rounded">提交</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import questions from '../data/parentnav_paid_19.json'

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
    console.log('提交的答案是：', answers.value) // ✅ 关键调试点
  localStorage.setItem('parentnav_paid_answers', JSON.stringify(answers.value))
  router.push('/paid-result')
}
</script>

<style scoped>
</style>