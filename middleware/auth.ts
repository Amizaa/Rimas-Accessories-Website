export default defineNuxtRouteMiddleware((to, from) => {
  const access = useCookie('access')?.value
  const toast = process.client ? useToast() : null

  if ((to.path.startsWith("/my-account") || to.path.includes("checkout")) && !access) {
      return navigateTo({ path: "/", query: { authError: "login-required" } })
  }
})
