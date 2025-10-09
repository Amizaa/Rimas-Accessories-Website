// composables/useAdmin.ts
import { ref } from "vue"

export function useAdmin() {
  const API_URL = process.env.API_BASE_URL || "http://localhost:8000/api/"

  const loading = ref(false)
  const error = ref(null)

  // ✅ Helper: always include token
  const authHeaders = () => {
    const token = process.client ? localStorage.getItem("access") : null
    if (!token) throw new Error("No access token found")
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  // ------------------------
  // 📌 Fetch generic resource
  // ------------------------
  const fetchAll = async (resource) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`${API_URL}${resource}/`, {
        headers: authHeaders(),
      })
      return data
    } catch (err) {
      error.value = err
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (resource,id) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`${API_URL}${resource}/${id}/`, {
        headers: authHeaders(),
      })
      return data
    } catch (err) {
      error.value = err
      return []
    } finally {
      loading.value = false
    }
  }
  
  // ------------------------
  // 📌 Create record
  // ------------------------
  const createItem = async (resource, payload) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`${API_URL}${resource}/`, {
        method: "POST",
        headers: authHeaders(),
        body: payload,
      })
      return { success: true, data }
    } catch (err) {
      error.value = err
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }
  
  // ------------------------
  // 📌 Update record
  // ------------------------
  const updateItem = async (resource, id, payload) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`${API_URL}${resource}/${id}/`, {
        method: "PATCH",
        headers: authHeaders(),
        body: payload,
      })
      return { success: true, data }
    } catch (err) {
      error.value = err
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  // ------------------------
// 📌 Delete record
// ------------------------
const deleteItem = async (resource, id) => {
  loading.value = true
  error.value = null
  try {
    await $fetch(`${API_URL}${resource}/${id}/`, {
      method: "DELETE",
      headers: authHeaders(),
    })
    return { success: true }
  } catch (err) {
    error.value = err
    return { success: false, error: err }
  } finally {
    loading.value = false
  }
}


   // ------------------------
  // 📌 Other record
  // ------------------------

  
  const fetchUserOrders = async (id) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`${API_URL}orders/?user_id=${id}`, {
        headers: authHeaders(),
      })
      return data
    } catch (err) {
      error.value = err
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderById(orderId) {
    loading.value = true
    error.value = null
    const order = ref(null)

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

    // ------------------------
  // 📌 Upload images
  // ------------------------
  const uploadImages = async (resource, id, files) => {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      files.forEach(file => formData.append("images", file))

      const headers = authHeaders()

      const data = await $fetch(`${API_URL}${resource}/${id}/upload-images/`, {
        method: "POST",
        headers,
        body: formData,
      })
      return { success: true, data }
    } catch (err) {
      error.value = err
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function fetchUserPromos(userId) {
    loading.value = true
    error.value = null
    const promos = ref(null)

    try {
      const token = localStorage.getItem("access")
      if (!token) throw new Error("No access token found")

      const response = await $fetch(`${API_URL}promo-users/?user_id=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      promos.value = response
    } catch (err) {
      error.value = err?.data?.error || 'خطا در دریافت کد های تخفیف'
      promos.value = null
    } finally {
      loading.value = false
    }
    return promos.value

  }




  return {
    loading,
    error,
    fetchAll,
    createItem,
    updateItem,
    fetchById,
    fetchUserOrders,
    fetchOrderById,
    uploadImages,
    deleteItem,
    fetchUserPromos
  }
}
