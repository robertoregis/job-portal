import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// 1. IMPORTAÇÃO DO LOCALE (PT-BR)
// Note: O Vuetify usa 'pt' para Português, que serve para o Brasil (pt-BR).
import { pt } from 'vuetify/locale' 

// 🔥 Adicione isso:
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    
    // 2. ADIÇÃO DA CONFIGURAÇÃO DE LOCALE
    locale: {
      locale: 'pt', // Define o idioma padrão como Português
      messages: { pt }, // Inclui as mensagens de tradução em Português
      fallback: 'en', // Idioma de fallback (caso o Português não tenha alguma tradução)
    },
    
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
            primary: '#391a4f',
            secondary: '#391a4f',
            off: '#a895b6ff',
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
            card: '#f0f0f0ff',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})

