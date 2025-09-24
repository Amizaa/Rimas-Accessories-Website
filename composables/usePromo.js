import { ref } from "vue"

export default function usePromo() {
  const url = process.env.API_BASE_URL || "http://localhost:8000/api/"

  const promos = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchPromoCodes = async () => {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem("access")
      if (!token) throw new Error("No access token found")

      // $fetch returns the response body directly (no .value wrapper like useFetch)
      const data = await $fetch(`${url}promo-users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      promos.value = data
    } catch (err) {
      console.error("Failed to fetch promos:", err)
      error.value = err
      promos.value = []
    } finally {
      loading.value = false
    }
    return promos.value
  }

  return {
    promos,
    loading,
    error,
    fetchPromoCodes,
  }
}
