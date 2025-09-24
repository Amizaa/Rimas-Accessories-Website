
export default defineNuxtRouteMiddleware((to, from) => {
  const access = process.client ? localStorage.getItem("access") : null

  if (to.path.startsWith("/my-account") && !access) {
    return navigateTo("/")
  }
})