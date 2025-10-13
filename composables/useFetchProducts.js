export default async (params = {}) => {
  const url = process.env.API_BASE_URL || 'http://localhost:8000/api/';
  let query = new URLSearchParams(params).toString();
  let apiUrl = params.lastAdded
    ? `${url}products/last-added/?limit=${params.limit || 5}`
    : `${url}products/?${query}`;

  try {
    const data = await $fetch(apiUrl); // $fetch returns parsed JSON
    return data || [];
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'API request failed',
    });
  }
};
