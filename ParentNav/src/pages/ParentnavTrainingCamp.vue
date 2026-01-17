<template>
  <div class="page">
    <div class="container">
      <h1 class="title">父母罗盘训练营</h1>

      <div class="subtitle">
        在 AI 时代的高度不确定环境中，
        <span class="subtitle-strong">父母必须成为家庭系统的导航者</span>
        <br />
        五大核心能力，重塑家庭长期竞争力
      </div>

      <div class="list">
        <router-link to="/camp/creation" class="card">
          <div class="card-title">创生力｜AI 时代的底层生存</div>
          <div class="card-desc">持续创造价值，才不会被时代淘汰</div>
        </router-link>

        <router-link to="/camp/wellbeing" class="card">
          <div class="card-title">悦活力｜高压时代的幸福系统</div>
          <div class="card-desc">在不确定中，依然保持生命的稳定与热情</div>
        </router-link>

        <router-link to="/camp/ai-leverage" class="card">
          <div class="card-title">放大器力｜人机协作的超级掌控</div>
          <div class="card-desc">借 AI 之力，让个体能力被无限放大</div>
        </router-link>

        <router-link to="/camp/navigation" class="card">
          <div class="card-title">探路力｜趋势判断与路径选择</div>
          <div class="card-desc">避开沉没赛道，提前占位未来</div>
        </router-link>

        <router-link to="/camp/parental-agency" class="card">
          <div class="card-title">共进力｜父母系统的认知领航</div>
          <div class="card-desc">
            父母是孩子人生系统的第一责任人，必须持续进化，确保长期方向不偏航
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* 页面整体：让内容更“居中一点”（类似你图二的视觉） */
.page {
  min-height: 85vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 16px;
}

/* 内容容器：限制宽度并居中 */
.container {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  text-align: center; /* ⭐整体文字居中 */
}

/* 标题与副标题 */
.title {
  font-size: 34px;
  font-weight: 800;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 15px;
  color: #5f6b7a;
  line-height: 1.8;
  margin-bottom: 22px;
}

.subtitle-strong {
  font-weight: 700;
  color: #1f5fd6;
}

/* 列表区域 */
.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 每条卡片：居中显示、标题居中 */
.card {
  display: block;
  width: 100%;
  padding: 20px 18px;
  border-radius: 18px;
  background: #f5f5fa;
  border: 1.5px solid #e6ebf5;
  text-decoration: none;
  text-align: center; /* ⭐卡片内部居中 */
  transition: background 0.2s, border 0.2s, color 0.2s, transform 0.15s;
}

/* 标题 */
.card-title {
  font-size: 17px;
  font-weight: 800;
  color: #206be5;
}

/* 描述 */
.card-desc {
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #5f6b7a;
}

/* hover 效果（更像“按钮”但依然克制） */
.card:hover,
.card:active {
  background: #e3f1ff;
  border-color: #aecfff;
  transform: translateY(-1px);
}

.card:hover .card-title,
.card:active .card-title {
  color: #1a4188;
}

/* 手机端适配 */
@media (max-width: 480px) {
  .title {
    font-size: 30px;
  }
  .card-title {
    font-size: 16px;
  }
}
</style>
