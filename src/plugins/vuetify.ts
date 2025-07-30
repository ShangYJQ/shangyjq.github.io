/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'

import { mdi } from 'vuetify/iconsets/mdi-svg'

// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  // 改为服务端渲染
  ssr: true,
  theme: {
    defaultTheme: 'system',
  },
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
    },
  },
})
