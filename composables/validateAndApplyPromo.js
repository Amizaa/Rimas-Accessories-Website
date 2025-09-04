export default async function validateAndApplyPromo(code, userId) {
  const url = process.env.API_BASE_URL || 'http://localhost:8000/api/'
  const apiUrl = `${url}promos/apply/` // DRF trailing slash

  try {
    const data = await $fetch(apiUrl, {
      method: 'POST',
      body: { code, user_id: userId }
    })
    return { data, error: null }
  } catch (err) {
    // $fetch wraps non-2xx responses in `err.data`
    return {
      data: null,
      error: err.data || { message: err.message }
    }
  }
}
