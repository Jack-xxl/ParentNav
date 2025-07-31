<template>
  <!-- AI Consultant Page -->
  <ErrorBoundary @error="handleError" @retry="resetForm">
    <div class="aiconsultant-wrapper">
      <!-- Offline notification -->
      <div v-if="showOfflineMessage" class="offline-banner">
        📡 网络连接已断开，请检查网络设置
      </div>
      
      <div class="container">
        <h1>AI成长教育顾问</h1>
        <p class="description">
          有教育难题？直接输入你的问题、年龄和性别，AI顾问为你科学解答。
        </p>
        
        <form @submit.prevent="askAI" class="consultation-form">
          <!-- Question input -->
          <div class="input-group">
            <textarea
              v-model="question"
              class="input question-input"
              placeholder="请输入教育问题（如：孩子不爱写作业怎么办？）"
              rows="3"
              :disabled="loading"
              maxlength="1000"
            ></textarea>
            <div class="char-count">{{ question.length }}/1000</div>
          </div>
          
          <!-- Age and gender inputs -->
          <div class="info-inputs">
            <div class="input-group">
              <label for="age">孩子年龄</label>
              <input
                id="age"
                v-model.number="age"
                type="number"
                min="3"
                max="18"
                placeholder="年龄"
                class="input age-input"
                :disabled="loading"
              />
            </div>
            
            <div class="input-group">
              <label for="gender">性别</label>
              <select id="gender" v-model="gender" class="input gender-input" :disabled="loading">
                <option value="male">男孩</option>
                <option value="female">女孩</option>
              </select>
            </div>
          </div>
          
          <!-- Submit button -->
          <button 
            type="submit" 
            class="btn btn-primary submit-btn" 
            :disabled="loading || !question.trim() || !isOnline"
          >
            <span v-if="loading" class="button-content">
              <div class="button-spinner"></div>
              {{ retryCount > 0 ? `重试中... (${retryCount}/3)` : '分析中...' }}
            </span>
            <span v-else class="button-content">
              获取AI建议
            </span>
          </button>
        </form>
        
        <!-- Loading overlay for better UX -->
        <LoadingSpinner 
          v-if="loading" 
          :overlay="true" 
          :message="loadingMessage" 
        />
        
        <!-- AI Response -->
        <div v-if="answer" class="response-section">
          <div class="response-header">
            <strong>🤖 AI顾问回答：</strong>
          </div>
          <div class="response-content" v-html="formatResponse(answer)"></div>
          <div class="response-actions">
            <button @click="copyResponse" class="btn btn-secondary">
              📋 复制回答
            </button>
            <button @click="resetForm" class="btn btn-secondary">
              ➕ 新问题
            </button>
          </div>
        </div>
        
        <!-- Error display -->
        <div v-if="error" class="error-section">
          <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-text">{{ error }}</span>
          </div>
          <button v-if="!loading" @click="askAI" class="btn btn-secondary retry-btn">
            🔄 重试
          </button>
        </div>
      </div>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import ErrorBoundary from '../components/ErrorBoundary.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { useApiCall, useNetworkStatus } from '../utils/apiUtils.js';

// Reactive data
const question = ref('');
const age = ref(10);
const gender = ref('male');
const answer = ref('');

// API and network utilities
const { loading, error, retryCount, callWithRetry, reset } = useApiCall();
const { isOnline, showOfflineMessage } = useNetworkStatus();

// Error handler from parent (if available)
const errorHandler = inject('errorHandler', null);

// Computed properties
const loadingMessage = computed(() => {
  if (retryCount.value > 0) {
    return `正在重试... (${retryCount.value}/3)`;
  }
  return 'AI正在分析您的问题，请稍候...';
});

// Methods
const askAI = async () => {
  if (!question.value.trim()) {
    error.value = '请输入您的教育问题';
    return;
  }

  if (!isOnline.value) {
    error.value = '网络连接不可用，请检查网络设置';
    return;
  }

  reset();
  answer.value = '';

  try {
    const response = await callWithRetry(
      async ({ signal }) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: generateUserId(), // Generate a simple user ID
            question: question.value.trim(),
            childInfo: {
              age: age.value,
              gender: gender.value,
            },
          }),
          signal
        });

        if (!res.ok) {
          if (res.status === 429) {
            throw new Error('请求太频繁，请稍后再试');
          } else if (res.status === 403) {
            throw new Error('今日查询次数已用完，请明天再试');
          } else if (res.status >= 500) {
            throw new Error('服务器暂时不可用，请稍后重试');
          } else {
            throw new Error(`请求失败 (${res.status})`);
          }
        }

        const data = await res.json();
        
        if (data.answer) {
          return data.answer;
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error('AI未能返回有效答案');
        }
      },
      {
        maxRetries: 3,
        retryDelay: 1500,
        timeout: 45000, // 45 seconds for AI calls
        onRetry: (attempt, maxAttempts) => {
          console.log(`重试第 ${attempt} 次，共 ${maxAttempts} 次`);
        }
      }
    );

    answer.value = response;
  } catch (err) {
    console.error('AI consultation failed:', err);
    
    // Report to error boundary if available
    if (errorHandler) {
      errorHandler.handleError(err, err.message);
    }
  }
};

const formatResponse = (text) => {
  // Simple formatting for better readability
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
};

const copyResponse = async () => {
  try {
    await navigator.clipboard.writeText(answer.value);
    // You could add a toast notification here
    alert('回答已复制到剪贴板');
  } catch (err) {
    console.error('Failed to copy text:', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = answer.value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('回答已复制到剪贴板');
  }
};

const resetForm = () => {
  question.value = '';
  answer.value = '';
  reset();
};

const handleError = (errorInfo) => {
  console.error('Component error:', errorInfo);
  // Handle component-level errors
};

// Simple user ID generation (for rate limiting)
const generateUserId = () => {
  let userId = localStorage.getItem('temp_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('temp_user_id', userId);
  }
  return userId;
};
</script>

<style scoped>
.aiconsultant-wrapper {
  min-height: 100vh;
  padding: 1rem 0;
}

.container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--container-padding);
}

.offline-banner {
  background: #fbbf24;
  color: #92400e;
  padding: 0.75rem 1rem;
  text-align: center;
  font-weight: 600;
  margin-bottom: 1rem;
  border-radius: var(--border-radius);
}

.description {
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.consultation-form {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1rem;
  position: relative;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-text);
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  transition: border-color 0.2s, box-shadow 0.2s;
  background: var(--color-surface);
  color: var(--color-text);
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.question-input {
  resize: vertical;
  min-height: 120px;
}

.char-count {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  background: var(--color-surface);
  padding: 0.25rem;
  border-radius: 4px;
}

.info-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--color-accent);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border: 2px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-accent);
}

.submit-btn {
  width: 100%;
  margin-top: 0.5rem;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.response-section {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
  overflow: hidden;
}

.response-header {
  background: var(--color-bg-secondary);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  font-weight: 600;
  color: var(--color-text);
}

.response-content {
  padding: 1.5rem;
  line-height: 1.7;
  color: var(--color-text);
}

.response-actions {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.error-section {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--border-radius);
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.error-icon {
  font-size: 1.25rem;
}

.error-text {
  color: #dc2626;
  font-weight: 500;
  flex: 1;
}

.retry-btn {
  width: 100%;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Mobile Responsive Styles */
@media (max-width: 767px) {
  .aiconsultant-wrapper {
    padding: 0.5rem 0;
  }

  .consultation-form {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .info-inputs {
    grid-template-columns: 1fr;
  }

  .question-input {
    min-height: 100px;
  }

  .response-header,
  .response-content,
  .response-actions {
    padding: 1rem;
  }

  .response-actions {
    flex-direction: column;
  }

  .response-actions .btn {
    width: 100%;
  }

  .char-count {
    position: static;
    text-align: right;
    margin-top: 0.25rem;
  }
}

/* Tablet styles */
@media (min-width: 768px) and (max-width: 1024px) {
  .container {
    padding: 1.5rem;
  }
  
  .consultation-form {
    padding: 2rem;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .btn,
  .input,
  .button-spinner {
    transition: none;
    animation: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .input {
    border-width: 3px;
  }
  
  .btn {
    border: 2px solid currentColor;
  }
}
</style>
