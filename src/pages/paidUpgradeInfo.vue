<template>
  <div class="max-w-xl mx-auto p-6 text-center">
    <div class="card">
      <!-- 未支付状态 -->
      <div v-if="!paid">
        <h1>🔒 解锁完整报告服务</h1>
        <p class="mb-4 muted">
          请扫描下方二维码支付 <strong style="color: var(--color-accent);">19 元</strong> 解锁完整版育儿测评报告：
        </p>
        <img
          src="/wechat_qr.png"
          alt="扫码支付"
          class="mx-auto mb-4 rounded border shadow"
          style="width: 150px; height: auto;"
        />
        <p class="text-sm muted mb-2">请上传支付截图：</p>
        <input
          type="file"
          accept="image/*"
          @change="handleUpload"
          class="mb-2"
        />
        <p class="text-xs muted mb-4">
          ⚠️ 此截图仅用于前端确认，无需系统识别验证
        </p>
        <div class="mt-8 card-accent">
          <h2 class="text-lg font-semibold" style="color: var(--color-accent);">报告内容示例</h2>
          <div class="text-secondary">
            <p>
              <strong>测评题示例：</strong> <br>
              在AI时代，您认为“成人”最重要的核心素质是什么？为什么？
            </p>
            <ul class="ml-6 my-2">
              <li>
                <span class="font-semibold">1分</span> <span style="color:#e11d48;">(弱项)</span>：成绩优异、听话懂事最重要
              </li>
              <li>
                <span class="font-semibold">2分</span> <span style="color:#e11d48;">(弱项)</span>：能考上好大学、找到稳定工作
              </li>
              <li>
                <span class="font-semibold">3分</span> <span style="color:#eab308;">(中项)</span>：基本能遵守社会规则和道德规范
              </li>
              <li>
                <span class="font-semibold">4分</span> <span style="color:#16a34a;">(强项)</span>：具备情绪管理能力和基本责任感
              </li>
              <li>
                <span class="font-semibold">5分</span> <span style="color:#16a34a;">(强项)</span>：拥有独立思考、自我认知与社会责任感
              </li>
            </ul>
            <p class="mt-2">
              <strong>智能分析示例：</strong><br>
              <span style="color:#e11d48;">弱项（1-2分）：</span> 只关注成绩或外在表现<br>
              <span style="color:#eab308;">中项（3分）：</span> 开始重视行为规范和社会适应<br>
              <span style="color:#16a34a;">强项（4-5分）：</span> 强调内在成长与人格完整性
            </p>
          </div>
        </div>
        <button
          @click="confirmPaid"
          :disabled="!uploaded"
          class="btn mt-6"
        >
          ✅ 我已完成支付，提交截图解锁
        </button>
      </div>

      <!-- 已支付状态 -->
      <div v-else>
        <h2 class="text-xl font-bold" style="color: #16a34a;">✅ 支付成功，已解锁完整报告</h2>
        <p class="text-left text-sm muted mb-2">此处可展示完整报告内容（如 PDF 下载、模块汇总等）</p>
        <div class="mt-6 text-center">
          <button
            @click="handleDownload"
            class="btn"
            style="background: #16a34a; color: #fff;"
          >
            📄 下载 PDF 报告
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { generatePdfFromElement } from '../utils/generatePdfReport'
import allQuestions from '../data/parentnav_paid_19.json'
import adviceMap from '../data/paid_result_advice.json'

const paid = ref(false)
const answers = ref({})
const results = ref([])
const uploaded = ref(false)

onMounted(() => {
  paid.value = localStorage.getItem('parentnav_paid') === 'true'
  if (paid.value) {
    loadResults()
  }
})

function confirmPaid() {
  localStorage.setItem('parentnav_paid', 'true')
  paid.value = true
  loadResults()
}

function handleUpload(e) {
  const file = e.target.files[0]
  if (file) {
    uploaded.value = true
  }
}

function loadResults() {
  const raw = JSON.parse(localStorage.getItem('parentnav_paid_answers') || '{}')
  answers.value = raw

  const dimSum = {}, dimCnt = {}
  allQuestions.forEach(q => {
    const v = raw[q.id]
    if (v != null) {
      dimSum[q.dimension] = (dimSum[q.dimension] || 0) + v
      dimCnt[q.dimension] = (dimCnt[q.dimension] || 0) + 1
    }
  })

  results.value = Object.keys(dimSum).map(dim => {
    const avg = dimSum[dim] / dimCnt[dim]
    const score = Math.round(avg)
    const level = score >= 5 ? '强项' : score >= 3 ? '中等' : '弱项'
    const suggestion = adviceMap[dim] || '暂无建议'
    return { dimension: dim, score, level, suggestion }
  })
}

function handleDownload() {
  generatePdfFromElement('#pdf-report-container', results.value, allQuestions)
}
</script>

<style scoped>
th, td {
  text-align: center;
}
</style>
