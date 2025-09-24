// composables/useSaveOrder.ts
import { ref } from 'vue'

export function useOrder() {
  const API_URL = process.env.API_BASE_URL || 'http://localhost:8000/api/'

  const loading = ref(false)
  const error = ref(null)
  const orders = ref([])
  const order = ref(null)

  async function fetchOrders() {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem("access")
      if (!token) throw new Error("کاربر وارد سیستم نشده است")

      const response = await $fetch(`${API_URL}orders/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      orders.value = response
    } catch (err) {
      error.value = err?.data?.error || err.message || 'خطا در دریافت سفارش‌ها'
      orders.value = []
    } finally {
      loading.value = false
    }
    return orders.value
  }

  async function fetchOrderById(orderId) {
    loading.value = true
    error.value = null

    try {
      const token = localStorage.getItem("access")
      if (!token) throw new Error("No access token found")

      const response = await $fetch(`${API_URL}orders/${orderId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      order.value = response
    } catch (err) {
      error.value = err?.data?.error || 'خطا در دریافت سفارش'
      order.value = null
    } finally {
      loading.value = false
    }
    return order.value

  }


  async function saveOrder(payload) {
    loading.value = true
    error.value = null

    try {
      const token = localStorage.getItem("access")
      if (!token) throw new Error("کاربر وارد سیستم نشده است")

      const response = await $fetch(`${API_URL}orders/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      })

      return { success: true, data: response }
    } catch (err) {
      error.value = err?.data?.error || err.message || 'خطا در ذخیره سفارش'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    saveOrder,
    fetchOrders,
    fetchOrderById,
    loading,
    error,
  }
}
