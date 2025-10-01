// middleware/admin-auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return

  const access = localStorage.getItem("access")

  if (!access) {
    return navigateTo("/")
  }

  type User = {
  is_staff: boolean
  is_superuser: boolean
}


  try {
    // Fetch authenticated user info
    const user = await $fetch<User>("http://localhost:8000/api/me/", {
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
  }
})
