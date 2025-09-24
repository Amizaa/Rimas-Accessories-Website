// middleware/admin-auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const access = process.client ? localStorage.getItem("access") : null

  if (!access) {
    return navigateTo("/")
  }

  try {
    // Fetch authenticated user info
    const user = await $fetch("http://localhost:8000/api/me/", {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })

    // Only allow staff or superusers
    if (!user.is_staff && !user.is_superuser) {
      return navigateTo("/") // redirect to homepage or 403 page
    }
  } catch (err) {
    console.error("Admin auth check failed:", err)
    return navigateTo("/")
  }
})
