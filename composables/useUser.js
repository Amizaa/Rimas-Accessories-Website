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

  const requestOtp = async (phone) => {
    loading.value = true
    error.value = null

    try {
      const { data: response, error: fetchError } = await useFetch(`${url}request-otp/`, {
        method: "POST",
        body: { phone },
      })

      if (fetchError.value) throw fetchError.value
      return response.value
    } catch (err) {
      error.value = err
      return null
    } finally {
      loading.value = false
    }
  }

  // ✅ Step 2: Verify OTP and login (get tokens)
  const verifyOtp = async (phone, code) => {
    loading.value = true
    error.value = null

    try {
      const { data: response, error: fetchError } = await useFetch(`${url}verify-otp/`, {
        method: "POST",
        body: { phone, code },
      })

      if (fetchError.value) throw fetchError.value

      // Save tokens in localStorage
      localStorage.setItem("access", response.value.access)
      localStorage.setItem("refresh", response.value.refresh)

      data.value = response.value.user
      return data.value
    } catch (err) {
      error.value = err
      data.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchAuthenticatedUser = async () => {
    loading.value = true
    error.value = null

    try {
      let token = localStorage.getItem("access")
      if (!token) throw new Error("No access token found")

      const { data: userData, error: fetchError } = await useFetch(`${url}me/`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (fetchError.value) {
        // If access token is expired, try refresh
        if (fetchError.value.statusCode === 401) {
          const newToken = await refreshToken()
          if (!newToken) throw new Error("Session expired. Please login again.")

          // Retry fetching user with new access token
          const { data: retryData, error: retryError } = await useFetch(`${url}me/`, {
            headers: { Authorization: `Bearer ${newToken}` },
          })
          if (retryError.value) throw retryError.value

          data.value = retryData.value
        } else {
          throw fetchError.value
        }
      } else {
        data.value = userData.value
      }
    } catch (err) {
      error.value = err
      data.value = null
    } finally {
      loading.value = false
    }

    return data.value
  }

  // Refresh access token using refresh token
  const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh")
    if (!refresh) return null

    try {
      const { data, error: refreshError } = await $fetch(`${url}token/refresh/`, {
        method: "POST",
        body: { refresh },
      })

      if (refreshError) throw refreshError

      if (data?.access) {
        localStorage.setItem("access", data.access)
        return data.access
      }
      return null
    } catch (err) {
      console.error("Refresh token failed:", err)
      return null
    }
  }


  return {
    data,
    error,
    loading,
    fetchUser,
    updateUser,
    requestOtp,
    verifyOtp,
    fetchAuthenticatedUser
  }
}
