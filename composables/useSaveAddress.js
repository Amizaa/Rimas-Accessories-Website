import { ref } from 'vue'

export default async () => {
  const address = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const API_URL = process.env.API_BASE_URL || 'http://localhost:8000/api/'

  // Fetch address for user
  async function fetchAddress(userId) {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`${API_URL}addresses/?user=${userId}`)
      // Assuming backend returns a list, take the first one
      address.value = data.length ? data[0] : null
    } catch (err) {
      error.value = err?.data?.error || 'خطا در دریافت آدرس'
    } finally {
      loading.value = false
    }
  }

  // Save or update address
  async function saveAddress(payload) {
    loading.value = true
    error.value = null
    try {
      if (address.value?.id) {
        // Update existing
        address.value = await $fetch(`${API_URL}addresses/${address.value.id}/`, {
          method: 'PUT',
          body: payload
        })
      } else {
        // Create new
        address.value = await $fetch(`${API_URL}addresses/`, {
          method: 'POST',
          body: payload
        })
      }
      return { success: true, address: address.value }
    } catch (err) {
      error.value = err?.data?.error || 'خطا در ذخیره آدرس'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

const updateAddress = async (id, payload) => {
  loading.value = true
  error.value = null

  try {
    const token = localStorage.getItem("access")
    if (!token) throw new Error("No access token found")

    const { data: updatedData, error: updateError } = await useFetch(`${API_URL}addresses/${id}/`, {
      method: "PATCH",
      body: payload,
    })

    if (updateError.value) {
      error.value = updateError.value
      return { success: false, error: updateError.value }
    }

    return { success: true, data: updatedData.value }
  } catch (err) {
    error.value = err
    return { success: false, error: err }
  } finally {
    loading.value = false
  }
}



  return {
    address,
    loading,
    error,
    fetchAddress,
    updateAddress,
    saveAddress
  }
}
