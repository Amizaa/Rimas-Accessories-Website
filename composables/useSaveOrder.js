// composables/useSaveOrder.ts
import { ref } from 'vue'

export function useSaveOrder() {
  const API_URL = process.env.API_BASE_URL || 'http://localhost:8000/api/'

  const loading = ref(false)
  const error = ref(null)

  async function saveOrder(payload) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`${API_URL}orders/`,{
          method: 'POST',
          body: payload
        })

      return { success: true, data: response }
    } catch (err) {
      error.value = err?.data?.error || 'خطا در ذخیره سفارش'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    saveOrder,
    loading,
    error,
  }
}
