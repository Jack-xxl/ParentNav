<template>
  <div
    style="
      max-width: 700px;
      margin: 2em auto;
      padding: 2em 1em;
      background: #fff;
      border-radius: 1.5em;
      box-shadow: 0 2px 16px rgba(0,0,0,0.07);
    "
  >
    <!-- 顶部标题 -->
    <h1
      style="
        text-align: center;
        color: #2d3748;
        font-size: 2.3em;
        font-weight: 800;
        margin-bottom: 0.5em;
      "
    >
      AI创变营 · 青少年AI创新孵化平台
    </h1>

    <p
      style="
        text-align: center;
        color: #1a202c;
        font-size: 1.2em;
        margin-bottom: 2em;
      "
    >
      让孩子动手用AI做项目，解决真实问题，
      拒绝内卷和焦虑，孩子用能力赢未来！
    </p >

    <!-- ========================= -->
    <!-- 首页导航 -->
    <!-- ========================= -->

    <div
      style="
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1em;
        margin-bottom: 2em;
      "
    >
      <router-link class="main-nav-btn" to="/faq">
        核心优势
      </router-link>

      <router-link class="main-nav-btn" to="/courses">
        成长路线&课程体系
      </router-link>

      <router-link class="main-nav-btn" to="/showcase">
        成果与展示
      </router-link>

      <router-link class="main-nav-btn" to="/incubation">
        企业孵化与合作
      </router-link>

      <router-link class="main-nav-btn" to="/signup">
        立即报名
      </router-link>

      <router-link class="main-nav-btn" to="/trial">
        预约免费试听
      </router-link>

      <router-link class="main-nav-btn special" to="/ai-ask">
        AI智能答疑
      </router-link>

      <router-link class="main-nav-btn highlight" to="/creator">
        AI智能体创造中心
      </router-link>

      <router-link class="main-nav-btn" to="/gallery">
        AI作品展示墙
      </router-link>
    </div>

    <!-- ========================= -->
    <!-- GoGlobal English -->
    <!-- 新增英语项目主入口 -->
    <!-- ========================= -->

    <section class="english-section">

      <div class="english-tag">
        AI创变营 · 英语项目
      </div>

      <h2 class="english-title">
        🌍 GoGlobal English
      </h2>

      <div class="english-subtitle">
        AI 实境英语
      </div>

      <p class="english-slogan">
        不要只学英语，开始用英语生活。
      </p >

      <p class="english-description">
        用 AI 把单词、故事、听说训练和创造连接起来，
        让孩子在真实情景和自己的故事中学习英语。
      </p >

      <router-link
        class="english-main-btn"
        to="/english"
      >
        进入 GoGlobal English →
      </router-link>

    </section>

    <!-- ========================= -->
    <!-- AI学习快捷入口 -->
    <!-- ========================= -->

    <div class="learning-area">

      <div class="learning-title">
        AI 学习工具
      </div>

      <div class="learning-buttons">

        <router-link
          class="learning-btn"
          to="/study-agent"
        >
          🎧 英语AI学习伙伴
        </router-link>

        <router-link
          class="learning-btn"
          to="/word-trainer"
        >
          🧠 AI单词机
        </router-link>

        <router-link
          class="learning-btn"
          to="/playground"
        >
          🧪 AI English Lab
        </router-link>

      </div>

    </div>

    <!-- ========================= -->
    <!-- 品牌优势 -->
    <!-- ========================= -->

    <ul
      style="
        background: #f7fafc;
        padding: 1.2em 1em;
        border-radius: 1em;
        margin-bottom: 2em;
        font-size: 1.08em;
      "
    >
      <li>
        🌟 从零基础到创新项目，AI能力和作品双收
      </li>

      <li>
        🌟 导师 + AI 全程陪伴，学习不孤单
      </li>

      <li>
        🌟 优秀者直通企业实习、孵化、融资与合作平台
      </li>
    </ul>

    <!-- ========================= -->
    <!-- Footer -->
    <!-- ========================= -->

    <footer
      style="
        text-align: center;
        margin-top: 2em;
        color: #718096;
      "
    >
      <div>
        AI创变营 · 青少年AI创新孵化平台 © 2026
      </div>

      <div style="margin-top: 0.5em;">
        官方公众号｜联系我们
      </div>
    </footer>

  </div>
</template>


<script>
export default {
  name: "Home",
};
</script>


<style scoped>

/* ========================= */
/* 原首页导航按钮 */
/* ========================= */

.main-nav-btn {
  display: inline-block;
  padding: 0.8em 1.2em;
  background: #edf2f7;
  color: #2d3748;
  text-decoration: none;
  border-radius: 0.8em;
  font-weight: 600;
  transition: all 0.2s ease;
}

.main-nav-btn:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.main-nav-btn.special {
  background: #ebf8ff;
  color: #2b6cb0;
}

.main-nav-btn.highlight {
  background: #2563eb;
  color: white;
}


/* ========================= */
/* GoGlobal English 主入口 */
/* ========================= */

.english-section {
  margin: 2em 0;
  padding: 2em 1.5em;
  text-align: center;

  background:
    linear-gradient(
      135deg,
      #eff6ff 0%,
      #ffffff 55%,
      #eefbf7 100%
    );

  border: 1px solid #dbeafe;
  border-radius: 1.4em;

  box-shadow:
    0 8px 25px rgba(37, 99, 235, 0.08);
}

.english-tag {
  display: inline-block;

  padding: 0.45em 0.9em;

  background: #dbeafe;
  color: #2563eb;

  border-radius: 999px;

  font-size: 0.85em;
  font-weight: 700;

  margin-bottom: 1em;
}

.english-title {
  margin: 0;

  color: #172033;

  font-size: 2em;
  font-weight: 800;
}

.english-subtitle {
  margin-top: 0.4em;

  color: #2563eb;

  font-size: 1.15em;
  font-weight: 700;
}

.english-slogan {
  margin-top: 1em;

  color: #1a202c;

  font-size: 1.2em;
  font-weight: 700;
}

.english-description {
  max-width: 520px;

  margin:
    0.8em auto
    1.5em;

  color: #64748b;

  line-height: 1.8;
}

.english-main-btn {
  display: inline-block;

  padding:
    0.9em
    1.6em;

  background: #2563eb;

  color: white;

  border-radius: 0.9em;

  text-decoration: none;

  font-weight: 700;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.english-main-btn:hover {
  transform: translateY(-2px);

  box-shadow:
    0 8px 20px
    rgba(37, 99, 235, 0.25);
}


/* ========================= */
/* AI学习工具 */
/* ========================= */

.learning-area {
  margin-bottom: 2em;
}

.learning-title {
  text-align: center;

  margin-bottom: 1em;

  color: #475569;

  font-weight: 700;
}

.learning-buttons {
  display: flex;

  flex-wrap: wrap;

  justify-content: center;

  gap: 0.8em;
}

.learning-btn {
  padding:
    0.7em
    1em;

  background: #f8fafc;

  color: #334155;

  border:
    1px solid
    #e2e8f0;

  border-radius: 0.8em;

  text-decoration: none;

  font-weight: 600;
}

.learning-btn:hover {
  background: #f1f5f9;
}


/* ========================= */
/* 手机适配 */
/* ========================= */

@media (max-width: 600px) {

  .english-title {
    font-size: 1.65em;
  }

  .english-section {
    padding: 1.6em 1em;
  }

  .learning-buttons {
    flex-direction: column;
  }

  .learning-btn {
    text-align: center;
  }
}

</style>