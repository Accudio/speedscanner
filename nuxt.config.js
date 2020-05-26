
export default {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: 'Speed Tracker',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Average+Sans:400,500,700&display=swap' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#f0882b' },

  /*
  ** Global CSS
  */
  css: [
    'normalize.css/normalize.css',
    '@/assets/style/global/style.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/vue-feather-icons.js' },
    { src: '~/plugins/apexcharts.js', mode: 'client' },
    { src: '~/plugins/vue-good-table.js', mode: 'client' }
  ],

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources'
  ],

  styleResources: {
    scss: [
      '@/assets/style/_all-vars.scss'
    ]
  },

  /**
   * Environment variables
   */
  env: {
    dev: (process.env.NODE_ENV !== 'production')
  },

  /*
  ** Build configuration
  */
  generate: {
    fallback: true
  }
}
