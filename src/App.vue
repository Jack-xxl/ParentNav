<template>
  <div class="app-bg">
    <router-view />
  </div>
</template>

<style>
.app-bg {
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-family);
  transition: background 0.3s, color 0.3s;
}
</style>