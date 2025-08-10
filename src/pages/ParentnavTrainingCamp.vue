<template>
  <div class="max-w-xl mx-auto pt-10 px-4">
    <h1 class="text-3xl font-bold text-center mb-3">父母罗盘训练营</h1>
    <div class="text-center text-base text-gray-600 mb-10 leading-relaxed">
      在AI新时代的教育变革中，
      <span class="font-semibold text-blue-700">父母必须具备系统性成长观</span>
      <br />
      八大训练营，科学升级思维，助力家庭跃迁！
    </div>
    <div class="flex flex-col gap-5">
      <router-link to="/camp/strategy" class="btn-static">家庭战略规划营</router-link>
      <router-link to="/camp/energy" class="btn-static">身心能量觉醒营</router-link>
      <router-link to="/camp/finance" class="btn-static">财商思维觉醒营</router-link>
      <router-link to="/camp/relationship" class="btn-static">亲密关系训练营</router-link>
      <router-link to="/camp/social" class="btn-static">人际关系社交营</router-link>
      <router-link to="/camp/talent" class="btn-static">天赋与潜能觉醒营</router-link>
      <router-link to="/camp/resilience" class="btn-static">心理韧性构建营</router-link>
      <router-link to="/camp/coach" class="btn-static">父母教练训练营</router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.btn-static {
  display: block;
  width: 100%;
  padding: 18px;
  margin: 0 auto;
  font-size: 1.1em;
  font-weight: 600;
  background: #f5f5fa;
  border-radius: 15px;
  color: #206be5;
  border: 1.5px solid #e6ebf5;
  margin-bottom: 12px;
  text-align: center;
  transition: background 0.2s, border 0.2s, color 0.2s;
  cursor: pointer;
}
.btn-static:hover, .btn-static:active {
  background: #e3f1ff;
  border-color: #aecfff;
  color: #1a4188;
}
</style>