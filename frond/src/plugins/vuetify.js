import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#25D366',
          secondary: '#128C7E',
          background: '#111B21',
          surface: '#202C33',
          error: '#FF4C51',
          warning: '#FF9F43',
          success: '#25D366',
        },
      },
    },
  },
})
