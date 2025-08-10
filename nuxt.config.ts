import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', 'nuxt-charts', '@nuxt/content', '@pinia/nuxt'],
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
      require('vite-svg-loader')()
    ],
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
        htmlAttrs: { dir: 'rtl', lang: 'fa' },
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]

    },
  },

})