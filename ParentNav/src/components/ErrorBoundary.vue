<template>
  <div class="error-boundary">
    <div v-if="hasError" class="error-display">
      <div class="error-icon">⚠️</div>
      <h3>出现了一些问题</h3>
      <p class="error-message">{{ errorMessage }}</p>
      <div class="error-actions">
        <button @click="retry" class="btn btn-primary">
          重试
        </button>
        <button @click="reload" class="btn btn-secondary">
          刷新页面
        </button>
      </div>
    </div>
    <slot v-else />
  </div>
</template>

<script setup>
import { ref, provide, onErrorCaptured } from 'vue';

const props = defineProps({
  fallbackMessage: {
    type: String,
    default: '应用遇到了未知错误，请刷新页面重试'
  }
});

const emit = defineEmits(['error', 'retry']);

const hasError = ref(false);
const errorMessage = ref('');

// Capture Vue errors
onErrorCaptured((error, instance, info) => {
  console.error('Error caught by boundary:', error, info);
  hasError.value = true;
  errorMessage.value = props.fallbackMessage;
  emit('error', { error, instance, info });
  return false; // Stop error propagation
});

// Handle global JavaScript errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    hasError.value = true;
    errorMessage.value = props.fallbackMessage;
    emit('error', { error: event.error });
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    hasError.value = true;
    errorMessage.value = '网络请求失败，请检查网络连接后重试';
    emit('error', { error: event.reason });
  });
}

const retry = () => {
  hasError.value = false;
  errorMessage.value = '';
  emit('retry');
};

const reload = () => {
  window.location.reload();
};

// Provide error handler to child components
provide('errorHandler', {
  handleError: (error, message = props.fallbackMessage) => {
    console.error('Manual error report:', error);
    hasError.value = true;
    errorMessage.value = message;
    emit('error', { error });
  }
});
</script>

<style scoped>
.error-boundary {
  min-height: 200px;
}

.error-display {
  text-align: center;
  padding: 2rem;
  background: #fff;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin: 1rem;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-display h3 {
  color: #dc2626;
  margin-bottom: 1rem;
}

.error-message {
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-height: var(--button-min-height);
  font-size: var(--font-size-base);
}

.btn-primary {
  background: var(--color-accent);
  color: white;
}

.btn-primary:hover {
  background: var(--color-accent-hover);
}

.btn-secondary {
  background: #f3f4f6;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Mobile optimization */
@media (max-width: 767px) {
  .error-display {
    margin: 0.5rem;
    padding: 1.5rem;
  }
  
  .error-icon {
    font-size: 2.5rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
