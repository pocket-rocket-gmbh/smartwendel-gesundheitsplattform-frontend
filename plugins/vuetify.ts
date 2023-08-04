import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
  const defaultTheme: ThemeDefinition = {
    colors: {
      primary: '#8AB61D',
      secondary: '#007344',
      success: '#ABC812',
      error: '#A42258',
      info: '#3CB5E7',
      grey: '#636362'
    }
  }

  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'defaultTheme',
      themes: {
        defaultTheme,
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})