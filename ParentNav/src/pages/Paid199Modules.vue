<template>
  <div class="max-w-3xl mx-auto p-6">
    <div class="card">
      <h1>199元完整版测评 · 八大模块介绍</h1>
      <div class="flex flex-col items-center my-8">
        <img
          src="/wechat_qr.png"
          alt="扫码支付199元解锁完整版"
          style="width: 200px; height: 300px; border-radius: 12px; box-shadow: var(--box-shadow);"
        />
        <p class="mt-4 text-base font-semibold" style="color: var(--color-accent);">
          请使用微信扫码支付 <span class="font-bold text-xl">199元</span><br />
          支付完成后点击下方按钮开始完整版测评
        </p>
      </div>
      <p class="mb-4 muted text-sm">
        这份测评帮助你全面了解孩子在 AI 与剧变时代中最核心的成长能力，
        每一个模块都直击一个家庭最容易忽略却最重要的教育盲区。
      </p>
      <div v-for="(mod, index) in modules" :key="index" class="mb-6 card shadow">
        <h2 class="text-lg font-semibold mb-2">
          模块{{ index + 1 }}：{{ mod.title }}（{{ mod.count }}题）
        </h2>
        <p class="text-sm text-secondary leading-relaxed">
          {{ mod.description }}
        </p>
      </div>
      <div class="text-center mt-10">
        <router-link
          to="/paid-199-assessment"
          class="btn font-semibold"
        >
          🔍 开始199元完整版测评
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const modules = [
  {
    title: "恋爱观与理想伴侣选择能力",
    count: 10,
    description: "影响孩子将来婚姻幸福的重要能力，从小建立健康恋爱观，避免情感困扰。"
  },
  {
    title: "亲密关系与家庭幸福力",
    count: 10,
    description: "决定孩子未来是否能经营好亲密关系与家庭氛围，是家庭教育的镜子。"
  },
  {
    title: "财商与财富自由能力",
    count: 16,
    description: "帮助孩子理解金钱逻辑、掌握赚钱路径，是打破阶层固化的重要基石。"
  },
  {
    title: "人际关系与沟通能力",
    count: 10,
    description: "社交能力是未来AI无法替代的重要能力，影响人脉、人缘和事业发展。"
  },
  {
    title: "发现与培养孩子的天赋与兴趣",
    count: 10,
    description: "每个孩子都有独特天赋，找对方向才能激发热情和持久的成长动力。"
  },
  {
    title: "心理韧性与挫折应对能力",
    count: 10,
    description: "人生一定有挑战，情绪管理和挫折复原力，是面对压力不倒下的核心保障。"
  },
  {
    title: "数字时代下的育儿素养",
    count: 10,
    description: "教育观念是否与时俱进？你能否引导孩子与手机、AI 和信息共处？"
  },
  {
    title: "未来领导力与人生战略规划力",
    count: 10,
    description: "从小培养目标感、战略思维和领导力，决定孩子是否能走出不平凡的未来。"
  }
]
</script>

<style scoped>
p {
  line-height: 1.7;
}
</style>
