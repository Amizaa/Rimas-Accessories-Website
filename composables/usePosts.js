// composables/useAdmin.ts
import { ref } from "vue"

export function usePosts() {
  const API_URL = process.env.API_BASE_URL || "http://localhost:8000/api/"

  const loading = ref(false)
  const error = ref(null)


  const fetchPosts = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`${API_URL}blog-posts/`, {})
      return data
    } catch (err) {
      error.value = err
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchPostBySlug = async (slug) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`${API_URL}blog-posts/by-slug/${slug}/`, {})
      return data
    } catch (err) {
      error.value = err
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    fetchPosts,
    fetchPostBySlug,
    loading,
    error,
  }
}