<template>
  <section class="hero">
    <h1 class="hero-title">AI 时代 · 成长型父母测评</h1>
    <p class="hero-subtitle">
      用科学测评，照亮家长成长之路，助力孩子全面发展。
    </p>
    <div class="hero-cta">
      <router-link
        to="/assessment"
        class="btn font-semibold"
        style="font-size:1.2rem;padding:1em 2.5em;box-shadow:0 6px 24px 0 rgba(37,99,235,0.13);"
      >
        🔍 立即开启免费测评
      </router-link>
    </div>
    <div style="margin-top:2.5em;">
      <div class="card" style="max-width:600px;margin:0 auto;background:var(--color-surface);">
        <h2 style="color:var(--color-accent);font-size:1.4rem;font-weight:700;margin-bottom:0.7em;">为什么要做家长测评？</h2>
        <ul style="text-align:left;color:var(--color-text-secondary);font-size:1.08em;line-height:1.8;">
          <li>✔️ 发现育儿盲区，科学定位成长方向</li>
          <li>✔️ 量化家长六大核心能力，精准提升</li>
          <li>✔️ 获得个性化建议，助力家庭幸福</li>
          <li>✔️ 免费获取精美报告，随时查阅成长轨迹</li>
        </ul>
      </div>
    </div>
  </section>
  <router-link to="/ai-consultant">
  <button class="btn">进入 AI成长教育顾问</button>
</router-link>


  <section class="mt-10 py-8 px-6 rounded-xl shadow bg-white flex">
  <div style="margin-left: 36px; flex: 1;">
    <h2 class="text-2xl font-bold mb-4 text-blue-700">AI时代家长训练营</h2>
    <p class="mb-3 text-lg text-gray-800">
      还在用传统育儿方式？AI时代，你的孩子即使是研究生、博士生，很可能连谋生的能力都没有！<br/>
      ParentNav AI专为AI时代的家长而生——<br/>
      不仅免费为家长提供AI时代下育儿的基本素养测试，<br/>
      还配套实操落地的家长成长训练营，帮助你和孩子真正掌握未来核心竞争力！
    </p>
    <router-link to="/training-camp">
      <button
        class="bg-blue-600 hover:bg-blue-800 text-white rounded-2xl px-8 py-3 font-bold text-lg shadow transition duration-150 mt-4"
        style="letter-spacing: 2px;"
      >
        守护孩子谋生力和精英成长力，立即了解AI时代训练营
      </button>
    </router-link>
  </div>
</section>

</template>

<script setup>
// 无需额外逻辑
</script>

<style scoped>
/* 额外美化首页可在此补充 */
</style>