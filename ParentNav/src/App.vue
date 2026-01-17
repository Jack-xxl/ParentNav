<template>
  <div class="app-bg">
    <ErrorBoundary>
      <router-view />
    </ErrorBoundary>
  </div>
</template>

<script setup>
import ErrorBoundary from './components/ErrorBoundary.vue';
</script>

<style>
.app-bg {
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-family);
  transition: background 0.3s, color 0.3s;
}

/* Global mobile optimizations */
* {
  box-sizing: border-box;
}

html {
  /* Prevent zoom on input focus in iOS */
  -webkit-text-size-adjust: 100%;
}

body {
  /* Prevent rubber band scrolling on iOS */
  overscroll-behavior-y: none;
  /* Better touch scrolling on mobile */
  -webkit-overflow-scrolling: touch;
}

/* Remove tap highlight on mobile */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Improve button touch targets */
button, input, select, textarea, a {
  touch-action: manipulation;
}
</style>