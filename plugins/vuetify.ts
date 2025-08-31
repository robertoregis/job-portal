import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// 🔥 Adicione isso:
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'connect',
      themes: {
        connect: {
          dark: false,
          colors: {
            primary: '#C724F2',
            secondary: '#C724F2',
            titleDark: '#0f0f0fff',
            titleLight: '#464343ff',
            title: '#201f1fff',
            language: '#1146a9',
            status: '#b2670c',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FB8C00',
            warningLight: '#f0a346ff',
            white: '#FFFFFF',
            navigation: '#546E7A',
            edit: '#cecac5ff',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})

