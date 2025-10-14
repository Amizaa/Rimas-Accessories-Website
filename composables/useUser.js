import { ref } from 'vue'
import { useCookie } from '#app'

export default function useUser(userId) {
  const url = process.env.API_BASE_URL || 'http://localhost:8000/api/'
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  // ✅ Get user by ID
  const fetchUser = async (id = userId) => {
    loading.value = true
    error.value = null
    try {
      const userData = await $fetch(`${url}users/${id}/`)
      data.value = userData
      return data.value
    } catch (err) {
      error.value = err
      data.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  // ✅ Update user
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

  // ✅ Request OTP
  const requestOtp = async (phone) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch(`${url}request-otp/`, {
        method: 'POST',
        body: { phone },
      })
      return response
    } catch (err) {
      error.value = err
      return null
    } finally {
      loading.value = false
    }
  }

  // ✅ Verify OTP → login user & save tokens in cookies
  const verifyOtp = async (phone, code) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`${url}verify-otp/`, {
        method: 'POST',
        body: { phone, code },
      })

      const access = useCookie('access', { maxAge: 60 * 60 * 24 * 7 }) // 7 روز
      const refresh = useCookie('refresh', { maxAge: 60 * 60 * 24 * 30 }) // 30 روز
      access.value = response.access
      refresh.value = response.refresh

      data.value = response.user
      return data.value
    } catch (err) {
      error.value = err
      data.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  // ✅ Refresh token using cookie
  const refreshToken = async () => {
    const refresh = useCookie('refresh')
    if (!refresh.value) return null

    try {
      const response = await $fetch(`${url}token/refresh/`, {
        method: 'POST',
        body: { refresh: refresh.value },
      })

      if (response?.access) {
        const access = useCookie('access')
        access.value = response.access
        return response.access
      }

      return null
    } catch (err) {
      console.error('Refresh token failed:', err)
      const access = useCookie('access')
      const refresh = useCookie('refresh')
      access.value = null
      refresh.value = null
      return null
    }
  }

  // ✅ Fetch logged-in user (with auto refresh)
  const fetchAuthenticatedUser = async () => {
    loading.value = true
    error.value = null

    try {
      const access = useCookie('access')
      if (!access.value) throw new Error('No access token found')

      const userData = await $fetch(`${url}me/`, {
        headers: { Authorization: `Bearer ${access.value}` },
      })
      data.value = userData
      return data.value
    } catch (err) {
      // try refresh token
      if (err?.response?.status === 401) {
        const newToken = await refreshToken()
        if (!newToken) return null

        try {
          const retryData = await $fetch(`${url}me/`, {
            headers: { Authorization: `Bearer ${newToken}` },
          })
          data.value = retryData
          return data.value
        } catch (retryErr) {
          error.value = retryErr
          return null
        }
      }
      error.value = err
      return null
    } finally {
      loading.value = false
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
    fetchAuthenticatedUser,
    refreshToken,
  }
}
