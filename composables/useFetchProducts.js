export default async (params = {}) => {
  const url = process.env.API_BASE_URL || 'http://localhost:8000/api/'
  let query = new URLSearchParams(params).toString()
  let apiUrl = params.lastAdded 
    ? `${url}products/last-added/?limit=${params.limit || 5}`
    : `${url}products/?${query}`

  const { data, error } = await useFetch(apiUrl, {
  // If your API returns JSON directly:
  transform: (res) => res // returns raw JSON
})

  if (error.value) {
    throw createError({
      statusCode: error.value.statusCode || 500,
      statusMessage: error.value.statusMessage || 'API request failed',
    })
  }

  return data.value ? data.value : []
}
