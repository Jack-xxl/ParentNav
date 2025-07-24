<template>
  <div class="result-page max-w-3xl mx-auto">
    <h1>测评结果概览</h1>

    <!-- 测评说明区域 -->
    <div class="card-accent text-sm mt-6">
      <p class="mb-2 font-medium">🧮 测评说明：</p>
      <ul class="list-disc pl-5 space-y-1 text-secondary">
        <li>本测评共包含 <strong>5 个核心模块</strong>：成人、成才、成为自己、幸福力、家庭责任</li>
        <li>每个模块 <strong>满分 50 分</strong>，总分为 <strong>250 分</strong></li>
        <li>每个模块的得分将换算为百分制（0~100 分），划分为以下 5 个等级：</li>
      </ul>
      <table class="mt-3 text-sm border-collapse border w-full max-w-md">
        <thead>
          <tr style="background: var(--color-bg-secondary);">
            <th class="border p-1">等级</th>
            <th class="border p-1">百分制分数</th>
            <th class="border p-1">含义</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="border p-1">初步探索</td><td class="border p-1">0~49 分</td><td class="border p-1">处于认知起步期，尚在探索</td></tr>
          <tr><td class="border p-1">基础阶段</td><td class="border p-1">50~69 分</td><td class="border p-1">已有意识，但实践尚浅</td></tr>
          <tr><td class="border p-1">进阶阶段</td><td class="border p-1">70~84 分</td><td class="border p-1">已有系统理念，开始深入实践</td></tr>
          <tr><td class="border p-1">高级阶段</td><td class="border p-1">85~94 分</td><td class="border p-1">理念+方法兼具，实践成熟</td></tr>
          <tr><td class="border p-1">优秀阶段</td><td class="border p-1">95~100 分</td><td class="border p-1">全面引导力突出，是榜样家长</td></tr>
        </tbody>
      </table>
    </div>

    <!-- 雷达图 -->
    <div ref="radarChart" style="width: 100%; height: 400px;" class="my-8"></div>

    <!-- 每个模块结果卡片 -->
    <div
      v-for="result in results"
      :key="result.module"
      class="card"
    >
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">{{ moduleIcons[result.module] || '📘' }}</span>
        <h2 class="text-xl font-semibold">{{ result.module }}</h2>
        <span :class="['text-xs px-2 py-1 rounded-full', levelColors[result.level]]">
          {{ result.level }}
        </span>
      </div>
      <p class="muted">得分：{{ result.score }} 分</p>
      <p class="mt-2">{{ result.suggestion }}</p>
    </div>

    <!-- 升级提示区域 -->
    <div class="mt-10 card shadow-sm" style="background: var(--color-bg-secondary);">
      <h2 class="text-lg font-bold" style="color: var(--color-accent);">🎁 解锁 19 元升级服务</h2>
      <ul class="list-disc pl-6 mb-4 leading-relaxed text-secondary">
        <li>✅ 获取完整报告：每个维度详细解读 + 个性建议</li>
        <li>✅ 可下载 PDF 精美报告，便于保存与分享</li>
        <li>✅ 免费加入家长成长社区，交流育儿经验</li>
        <li>✅ 免费咨询 3 个专属育儿问题（AI 或人工）</li>
        <li>✅ 参与后续成长任务与系列训练活动</li>
      </ul>
      <button @click="goToPaidInfo" class="btn" style="background: var(--color-accent); color: #fff;">🔓 立即支付 19 元，解锁超值成长礼包</button>
      <div class="mt-4 text-center">
        <router-link
          to="/paid199modules"
          class="btn" style="background: var(--color-accent-hover); color: #fff;"
        >
          还想深度全面测评？试试【199元家长最硬核的教育深度测评】→
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const route = useRoute()

function goToPaidInfo() {
  router.push('/upgrade-info')
}

let rawScores = {
  "成人": 41,
  "成才": 36,
  "成为自己": 46,
  "幸福力": 43,
  "家庭责任": 39
}

if (route.query.scores) {
  try {
    const parsed = JSON.parse(route.query.scores)
    if (typeof parsed === 'object') rawScores = parsed
  } catch (e) {
    console.warn('得分数据格式错误')
  }
}

const moduleIcons = {
  "成人": "🌱",
  "成才": "🎓",
  "成为自己": "💡",
  "幸福力": "😊",
  "家庭责任": "🏡"
}

const levelColors = {
  "初步探索": "bg-gray-200 text-gray-800",
  "基础阶段": "bg-yellow-100 text-yellow-800",
  "进阶阶段": "bg-blue-100 text-blue-800",
  "高级阶段": "bg-purple-100 text-purple-800",
  "优秀阶段": "bg-green-100 text-green-800"
}

const adviceMap = {
  "成人": {
    "初步探索": "您可能过于关注成绩或外在表现……",
    "基础阶段": "您意识到品格的重要性……",
    "进阶阶段": "您已经开始重视孩子的品格发展……",
    "高级阶段": "您已经建立起较系统的品格教育机制……",
    "优秀阶段": "您已具备成熟的品格教育理念……"
  },
  "成才": {
    "初步探索": "您可能过于关注考试分数，而忽视了孩子实际能力的培养……",
    "基础阶段": "您意识到学习能力的重要性，但在职业启蒙方面有所欠缺……",
    "进阶阶段": "您已在能力培养上取得一定成效，建议加强个性化引导……",
    "高级阶段": "您已建立较成熟的学习与启蒙体系，建议持续优化……",
    "优秀阶段": "您已具备卓越的学习能力支持理念，孩子未来潜力巨大！"
  },
  "成为自己": {
    "初步探索": "您可能还在摸索如何平衡控制与放手之间的关系……",
    "基础阶段": "您已开始关注孩子的兴趣和表达，但系统支持仍不足……",
    "进阶阶段": "您在个性引导上已有初步成效，建议强化自主性发展……",
    "高级阶段": "您已具备个性化引导理念，建议制定专属成长路径……",
    "优秀阶段": "您能激发孩子创造力与表达力，是个性发展的引导榜样！"
  },
  "幸福力": {
    "初步探索": "您尚未深入意识情绪教育的重要性，建议从识别感受做起……",
    "基础阶段": "您已关注情绪状态，可增加系统工具如“情绪日记”等……",
    "进阶阶段": "您能识别情绪反应，建议引入呼吸法等技巧加强调节能力……",
    "高级阶段": "您能引导孩子积极面对压力，建议提升其冲突沟通能力……",
    "优秀阶段": "您已具备情绪智慧，引导孩子成为影响他人的温暖存在！"
  },
  "家庭责任": {
    "初步探索": "您可能仍采用传统命令式育儿，建议先从倾听和共情开始……",
    "基础阶段": "您已反思育儿方式，建议练习非暴力沟通并改善情绪示范……",
    "进阶阶段": "您具备成长型育儿意识，建议安排高质量陪伴与交流时间……",
    "高级阶段": "您已构建积极亲子关系，建议持续学习心理育儿方法……",
    "优秀阶段": "您是育儿理念的引领者，欢迎带动更多家庭一起成长！"
  }
}

function convertToPercentage(raw, max = 50) {
  return Math.round((raw / max) * 100)
}

function getLevel(score) {
  if (score < 50) return '初步探索'
  if (score < 70) return '基础阶段'
  if (score < 85) return '进阶阶段'
  if (score < 95) return '高级阶段'
  return '优秀阶段'
}

function renderModuleResult(module, score) {
  const pct = convertToPercentage(score)
  const level = getLevel(pct)
  const suggestion = (adviceMap[module] && adviceMap[module][level]) || '暂无建议'
  return {
    module,
    score: pct,
    level,
    suggestion
  }
}

const results = Object.entries(rawScores).map(([mod, val]) => renderModuleResult(mod, val))

const radarChart = ref(null)

onMounted(() => {
  const chart = echarts.init(radarChart.value)
  chart.setOption({
    tooltip: {},
    radar: {
      indicator: results.map(r => ({ name: r.module, max: 100 }))
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: results.map(r => r.score),
          name: '综合测评'
        }
      ]
    }]
  })
})
</script>

<style scoped>
.result-page {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
}
</style>
