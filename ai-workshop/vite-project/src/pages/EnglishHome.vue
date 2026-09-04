<template>
  <div class="english-home">
    <section class="hero">
      <div class="hero-inner">
        <div class="eyebrow">AI创变营 · 英语项目</div>

        <h1>GoGlobal English</h1>

        <h2>AI 实境英语</h2>

        <p class="slogan">
          不要只学英语，开始用英语生活。
        </p >

        <p class="intro">
          用 AI 把单词、故事、听说训练和创造力连接起来，
          让英语真正进入孩子的生活、兴趣和未来。
        </p >
      </div>
    </section>

    <section class="projects">
      <div class="section-title">
        <span>ENGLISH PROJECTS</span>
        <h3>选择你的学习方式</h3>
      </div>

      <div class="project-grid">

        <article class="project-card">
          <div class="icon">📖</div>
          <h4>My Life in English</h4>
          <p class="cn-title">我的英语人生</p >

          <p>
            跟随真实生活情景和连续故事，
            学习真正能够在生活中使用的英语。
          </p >

          <button class="disabled-btn" disabled>
            即将开放
          </button>
        </article>

        <article class="project-card highlight">
          <div class="icon">🧠</div>
          <h4>AI Word Machine</h4>
          <p class="cn-title">AI 单词机</p >

          <p>
            建立自己的单词库，让 AI 帮你理解、
            记忆、复习，并把困难单词变成故事。
          </p >

          <router-link
            to="/word-trainer"
            class="action-btn"
          >
            进入 AI 单词机
          </router-link>
        </article>

        <article class="project-card">
          <div class="icon">🧪</div>
          <h4>AI English Lab</h4>
          <p class="cn-title">AI 英语创造实验室</p >

          <p>
            不只是使用软件。
            亲手修改 AI 单词机，
            让代码真正改变网页和功能。
          </p >

          <router-link
            to="/playground"
            class="action-btn"
          >
            进入 AI Lab
          </router-link>
        </article>

      </div>
    </section>

    <section class="bottom-area">
      <router-link to="/" class="back-btn">
        ← 返回 AI创变营首页
      </router-link>
    </section>
  </div>
</template>

<script>
export default {
  name: "EnglishHome",
};
</script>

<style scoped>
.english-home {
  min-height: 100vh;
  background:
    linear-gradient(
      180deg,
      #f7fbff 0%,
      #ffffff 45%,
      #f8fafc 100%
    );
  color: #172033;
}

.hero {
  padding: 90px 24px 70px;
  text-align: center;
  background:
    radial-gradient(
      circle at top,
      #e8f3ff 0%,
      #f7fbff 55%,
      #ffffff 100%
    );
}

.hero-inner {
  max-width: 900px;
  margin: 0 auto;
}

.eyebrow {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 999px;
  background: #e9f2ff;
  color: #2563eb;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 22px;
}

h1 {
  font-size: 56px;
  margin: 0;
  font-weight: 800;
  letter-spacing: -1px;
}

h2 {
  margin-top: 12px;
  font-size: 28px;
  color: #2563eb;
}

.slogan {
  margin-top: 26px;
  font-size: 24px;
  font-weight: 700;
}

.intro {
  max-width: 680px;
  margin: 18px auto 0;
  line-height: 1.8;
  font-size: 17px;
  color: #667085;
}

.projects {
  max-width: 1180px;
  margin: 0 auto;
  padding: 70px 24px;
}

.section-title {
  text-align: center;
  margin-bottom: 42px;
}

.section-title span {
  color: #2563eb;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 1.5px;
}

.section-title h3 {
  margin: 10px 0 0;
  font-size: 34px;
}

.project-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.project-card {
  background: white;
  border: 1px solid #e7eaf0;
  border-radius: 22px;
  padding: 34px 28px;
  box-shadow:
    0 10px 32px rgba(15, 23, 42, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 16px 42px rgba(15, 23, 42, 0.10);
}

.highlight {
  border: 2px solid #bfdbfe;
}

.icon {
  font-size: 40px;
}

.project-card h4 {
  font-size: 24px;
  margin: 18px 0 4px;
}

.cn-title {
  color: #2563eb;
  font-weight: 700;
  margin: 0 0 18px;
}

.project-card p {
  line-height: 1.8;
  color: #667085;
}

.action-btn,
.disabled-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  border: none;
}

.action-btn {
  background: #2563eb;
  color: white;
}

.disabled-btn {
  background: #eef2f6;
  color: #98a2b3;
}

.bottom-area {
  text-align: center;
  padding: 0 24px 60px;
}

.back-btn {
  color: #475467;
  text-decoration: none;
  font-weight: 600;
}

@media (max-width: 850px) {
  h1 {
    font-size: 40px;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>