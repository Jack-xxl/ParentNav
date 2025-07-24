<template>
  <div class="aiconsultant-wrapper" style="max-width: 600px; margin: 48px auto;">
    <h1 style="font-size:2rem; font-weight:700; margin-bottom:24px;">AI成长教育顾问</h1>
    <p style="color:#666; margin-bottom:20px;">
      有教育难题？直接输入你的问题、年龄和性别，AI顾问为你科学解答。
    </p>
    <div style="display:flex; gap:8px; margin-bottom:20px; align-items:center;">
      <input
        v-model="question"
        class="input"
        placeholder="请输入教育问题（如：孩子不爱写作业怎么办？）"
        style="flex:1; padding:8px 12px;"
        @keyup.enter="askAI"
      />
      <input
        v-model.number="age"
        type="number"
        min="3"
        max="18"
        placeholder="年龄"
        style="width:60px; padding:8px 6px;"
      />
      <select v-model="gender" style="width:80px; padding:8px 6px;">
        <option value="male">男</option>
        <option value="female">女</option>
      </select>
      <button class="btn" @click="askAI" :disabled="loading || !question">
        {{ loading ? "发送中..." : "提交" }}
      </button>
    </div>
    <div v-if="answer" style="background:#f7f7f7; padding:18px 16px; border-radius:8px; margin-top:20px; white-space:pre-line;">
      <strong>AI顾问回答：</strong><br />{{ answer }}
    </div>
    <div v-if="error" style="color:#e63946; margin-top:16px;">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const question = ref('');
const age = ref(10);
const gender = ref('male');
const answer = ref('');
const error = ref('');
const loading = ref(false);

const askAI = async () => {
  if (!question.value.trim()) {
    error.value = '请输入你的教育问题';
    return;
  }
  error.value = '';
  answer.value = '';
  loading.value = true;
  try {
    const res = await fetch('http://localhost:8888/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: question.value,
        childInfo: {
          age: age.value,
          gender: gender.value,
        },
      }),
    });
    const data = await res.json();
    if (data.answer) answer.value = data.answer;
    else if (data.error) error.value = data.error;
    else error.value = 'AI未能返回有效答案';
  } catch (err) {
    error.value = '请求出错，请稍后重试';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.input {
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  font-size: 1rem;
}
.btn {
  background: #3479f7;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  padding: 8px 18px;
  transition: background 0.2s;
}
.btn:disabled {
  background: #bbb;
  cursor: not-allowed;
}
</style>
