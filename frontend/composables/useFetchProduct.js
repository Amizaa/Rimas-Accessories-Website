export default async (id = '') => {
  const url = process.env.API_BASE_URL || 'http://localhost:8000/api/'

  let apiUrl = `${url}products/${id}`

  const { data, error } = await useFetch(apiUrl)

  if (error.value) {
    throw createError({
      statusCode: error.value.statusCode || 500,
      statusMessage: error.value.statusMessage || 'API request failed',
    })
  }

  return data.value ? data.value : []
}