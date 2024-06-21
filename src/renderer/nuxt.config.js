/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
  ssr: false,
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - DeltaClass',
    title: 'DeltaClass',
    meta: [{ charset: 'utf-8' }]
  },
  loading: false,
  plugins: [
    { ssr: true, src: '@/plugins/icons.js' },
    { src: '@/plugins/jsonStorage.js' },
    { src: '@/plugins/settings.js' },
    { src: '@/plugins/errorHandler.js' }
  ],
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/global.css'
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify'
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/axios'
  ],
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: '/'
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    theme: {
      themes: {
        dark: {
          primary: '#1867c0',
          secondary: '#b0bec5',
          accent: '#8c9eff',
          error: '#b71c1c'
        }
      },
      dark: true
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
