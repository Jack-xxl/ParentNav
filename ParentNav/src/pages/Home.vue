<template>
  <section class="hero">
    <h1 class="hero-title">在 AI 时代，孩子的命运，取决于父母的「导航能力」</h1>

    <p class="hero-subtitle">
      继续沿用工业时代的育儿方式，尤其在<strong>成才</strong>与<strong>谋生</strong>路径上，
      只会培养出「高努力、低出路」的孩子。<br />
      不是孩子不努力，而是父母的育儿系统，已经出现了严重的「时代版本落后」。
    </p>

    <div class="hero-cta">
      <router-link
        to="/assessment"
        class="btn font-semibold"
        style="font-size:1.2rem;padding:1em 2.5em;box-shadow:0 6px 24px 0 rgba(37,99,235,0.13);"
      >
        👉 立即测评：我的父母导航力在什么段位？
      </router-link>

      <div
        style="margin-top:10px;font-size:12px;opacity:0.78;letter-spacing:0.2px;"
      >
        ✓ 8 分钟完成　✓ 报告即时生成　✓ 不测孩子，只测父母
      </div>
    </div>

    <div style="margin-top:2.5em;">
      <div class="card" style="max-width:600px;margin:0 auto;background:var(--color-surface);">
        <h2 style="color:var(--color-accent);font-size:1.4rem;font-weight:700;margin-bottom:0.7em;">
          这份测评能帮你做什么？
        </h2>
        <ul style="text-align:left;color:var(--color-text-secondary);font-size:1.08em;line-height:1.8;">
          <li>✔️ 一眼找出你最关键的“育儿短板维度”（不是泛泛而谈）</li>
          <li>✔️ 量化六大核心能力：家庭责任 / 成人 / 成才 / 谋生手段 / 成为自己 / 幸福力</li>
          <li>✔️ 给出客观评价：低分指出不足，高分给出保持与进阶方向</li>
          <li>✔️ 生成可落地的 3 个月行动计划（本周 / 本月 / 3 个月验收）</li>
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
</script>

<style scoped>
</style>
