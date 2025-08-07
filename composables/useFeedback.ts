import { reactive } from 'vue'

export const feedbackState = reactive({
  snackbar: {
    show: false,
    message: '',
    color: 'success',
    timeout: 3000,
  },
  loading: {
    show: false,
  },
})

export function useFeedback() {
  function showSnackbar(message: string, color = 'success', timeout = 3000) {
    feedbackState.snackbar.message = message
    feedbackState.snackbar.color = color
    feedbackState.snackbar.timeout = timeout
    feedbackState.snackbar.show = true
  }

  function showLoading() {
    feedbackState.loading.show = true
  }

  function hideLoading() {
    feedbackState.loading.show = false
  }

  return {
    feedbackState,
    showSnackbar,
    showLoading,
    hideLoading,
  }
}
