// middleware/admin-auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const access = useCookie('access')?.value
  
  if (to.path.startsWith("/admin") && !access) {
    return navigateTo("/")
  }
  
  const { fetchAuthenticatedUser } = useUser()
  const user = await fetchAuthenticatedUser()
  
  if (to.path.startsWith("/admin") && !user.is_staff && !user.is_superuser) {
    return navigateTo("/")
  }
})
