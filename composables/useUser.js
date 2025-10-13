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

  try {
    const updatedData = await $fetch(`${url}users/${id}/`, {
      method: 'PATCH',
      body: payload,
    })

    data.value = updatedData
    return data.value
  } catch (err) {
    error.value = err
    return null
  } finally {
    loading.value = false
  }
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
    const token = localStorage.getItem("access")
    if (!token) throw new Error("No access token found")

    let userData = await $fetch(`${url}me/`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    data.value = userData
    return data.value

  } catch (err) {
    // If token expired, try refresh
    if (err?.response?.status === 401) {
      const newToken = await refreshToken()
      if (!newToken) return {error: true}

      try {
        let retryData = await $fetch(`${url}me/`, {
          headers: { Authorization: `Bearer ${newToken}` },
        })
        data.value = retryData
        return data.value
      } catch (retryErr) {
        error.value = retryErr
        data.value = null
        return null
      }
    } else {
      error.value = err
      data.value = null
      return null
    }
  } finally {
    loading.value = false
  }
}


  // Refresh access token using refresh token
  const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh")
    if (!refresh) return null

    try {

      const { data, error: refreshError } = await useFetch(`${url}token/refresh/`, {
        method: "POST",
        body: { refresh },
      })

      if (refreshError.value) throw refreshError

      if (data?.value.access) {
        localStorage.setItem("access", data.value.access)
        return data.value.access
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
