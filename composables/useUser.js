import { ref } from 'vue'

export default function useUser(userId) {
  const url = process.env.API_BASE_URL || 'http://localhost:8000/api/'

  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const fetchUser = async (id = userId) => {
    loading.value = true
    error.value = null
    const { data: userData, error: fetchError } = await useFetch(`${url}users/${id}`)
    if (fetchError.value) {
      error.value = fetchError.value
      data.value = null
    } else {
      data.value = userData.value
    }
    loading.value = false
    return data.value
  }

  const updateUser = async (payload, id = userId) => {
    loading.value = true
    error.value = null
    const { data: updatedData, error: updateError } = await useFetch(`${url}users/${id}/`, {
      method: 'PATCH',
      body: payload
    })
    if (updateError.value) {
      error.value = updateError.value
      loading.value = false
      return null
    }
    data.value = updatedData.value
    loading.value = false
    return data.value
  }

  return {
    data,
    error,
    loading,
    fetchUser,
    updateUser
  }
}
