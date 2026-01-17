import { ref } from 'vue';

/**
 * Composable for handling API calls with retry logic
 */
export function useApiCall() {
  const loading = ref(false);
  const error = ref('');
  const retryCount = ref(0);

  const callWithRetry = async (apiCall, options = {}) => {
    const {
      maxRetries = 3,
      retryDelay = 1000,
      timeout = 30000,
      onRetry = null,
      errorMessages = {
        network: '网络连接失败，请检查网络后重试',
        timeout: '请求超时，请重试',
        server: '服务器暂时不可用，请稍后重试',
        default: '请求失败，请稍后重试'
      }
    } = options;

    loading.value = true;
    error.value = '';
    retryCount.value = 0;

    const attemptCall = async (attempt) => {
      try {
        // Add timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const result = await apiCall({
          signal: controller.signal,
          attempt: attempt + 1,
          isRetry: attempt > 0
        });

        clearTimeout(timeoutId);
        return result;

      } catch (err) {
        console.error(`API call attempt ${attempt + 1} failed:`, err);

        // Don't retry on certain errors
        if (err.name === 'AbortError') {
          throw new Error(errorMessages.timeout);
        }

        if (err.status === 400 || err.status === 401 || err.status === 403) {
          throw err; // Don't retry client errors
        }

        if (attempt < maxRetries) {
          retryCount.value = attempt + 1;
          
          if (onRetry) {
            onRetry(attempt + 1, maxRetries);
          }

          // Exponential backoff delay
          const delay = retryDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return attemptCall(attempt + 1);
        }

        // Final failure
        if (err.message.includes('fetch')) {
          throw new Error(errorMessages.network);
        } else if (err.status >= 500) {
          throw new Error(errorMessages.server);
        } else {
          throw new Error(err.message || errorMessages.default);
        }
      }
    };

    try {
      const result = await attemptCall(0);
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    loading.value = false;
    error.value = '';
    retryCount.value = 0;
  };

  return {
    loading,
    error,
    retryCount,
    callWithRetry,
    reset
  };
}

/**
 * Network status detection
 */
export function useNetworkStatus() {
  const isOnline = ref(navigator.onLine);
  const showOfflineMessage = ref(false);

  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine;
    
    if (!navigator.onLine) {
      showOfflineMessage.value = true;
    } else {
      // Hide offline message after reconnection
      setTimeout(() => {
        showOfflineMessage.value = false;
      }, 2000);
    }
  };

  // Listen for network status changes
  if (typeof window !== 'undefined') {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  }

  return {
    isOnline,
    showOfflineMessage
  };
}
