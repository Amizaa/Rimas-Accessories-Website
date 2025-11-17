export default async function useFetchProducts(params = {}) {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:8000/api/';


  let apiUrl;
  if (params.lastAdded) {
    // special endpoint for last-added products
    const limit = params.limit || 5;
    apiUrl = `${baseUrl}products/last-added/?limit=${limit}`;
  } else {
    // normal products endpoint with query params
    const query = new URLSearchParams(params).toString();
    apiUrl = `${baseUrl}products/?${query}`;
  }

  try {
    const data = await $fetch(apiUrl);
    
    // If paginated response, return normalized object
    if (data && typeof data === "object" && "results" in data) {
      return {
        results: data.results || [],
        count: data.count || 0,
        next: data.next || null,
        previous: data.previous || null,
      };
    }

    // If non-paginated (like last-added), wrap in results
    return {
      results: Array.isArray(data) ? data : [],
      count: Array.isArray(data) ? data.length : 0,
      next: null,
      previous: null,
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "API request failed",
    });
  }
}
