<script setup lang="ts">
  definePageMeta({
    layout: 'default'
  })
  import { useShow } from '@/stores/show';
  import { useNotice } from '@/composables/useNotice';
  import IMask from 'imask';
  import { formatPhone } from '@/composables/textFunctions';
  const { createLog } = useNotice();
  const info: any = useInfo();
  const show = useShow();
  const emailOfficial = useRuntimeConfig().public.EMAIL_OFFICIAL
  useHead({
    title: `Empresa - Conect One RH`,
    meta: [
      {
          name: 'description',
          content: 'Descubra as vantagens para empresas na Conect One RH: divulgue vagas, encontre talentos qualificados e contrate com rapidez.'
      }
    ]
  })
  const { notify } = useNotification();
  const dialog = ref<boolean>(false)
  const benefitsList = ref<any[]>([])
  const phoneInputRef: any = ref(null)
  let phoneMaskInstance: any = null
  const opportunitiesInputRef: any = ref(null)
  let opportunitiesMaskInstance: any = null
  const router = useRouter();
  const formdata = ref<any>({
    name: '',
    email: '',
    phone: null,
    company: '',
    opportunities: null
  })

  const clear = () => {
    formdata.value = {
      name: '',
      email: '',
      phone: null,
      company: '',
      opportunities: null
    }
  }

  watch(dialog, (newVal) => {
    if(newVal === true) {
      setTimeout(() => {
        if (phoneInputRef.value) {
          const nativePhoneInput = phoneInputRef.value.$el.querySelector('input')
          if (nativePhoneInput) {
            phoneMaskInstance = IMask(nativePhoneInput, {
              mask: '(00) 00000-0000'
            })
            phoneMaskInstance.on('accept', () => {
              formdata.value.phone = phoneMaskInstance.value || ''
            })
          }
        }
        if (opportunitiesInputRef.value) {
          const nativeOpportunitiesInput = opportunitiesInputRef.value.$el.querySelector('input')
          if (nativeOpportunitiesInput) {
            opportunitiesMaskInstance = IMask(nativeOpportunitiesInput, {
              mask: '000000'
            })
            opportunitiesMaskInstance.on('accept', () => {
              formdata.value.opportunities = opportunitiesMaskInstance.value || ''
            })
          }
        }
      }, 1500)
    }
  })

  const sendMail = async (formdata: any) => {
    const { data, error } = await useFetch('/api/emails/send', {
      method: 'POST',
      body: {
        to: [`Conect One RH <${emailOfficial}>`],
        subject: 'Chegou um email de contato',
        template: 'template_contact_company',
        variables: {
          name: formdata.name,
          email: formdata.email,
          phone: formdata.phone,
          company: formdata.company,
          opportunities: formdata.opportunities,
        }
      }
    })

    if(error.value) {
      notify({ title: '', text: 'Erro ao enviar contato', type: 'error' })
    } else {
      notify({ title: '', text: 'Contato enviado com sucesso', type: 'success' })
      clear()
      dialog.value = false
    }
  }
  
  const submit = () => {
    if(!/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(formdata.value.email)) {
      notify({ title: '', text: 'O e-mail precisa ser válido', type: 'error' })
      return
    }
    if(!formdata.value.name) {
      notify({ title: '', text: 'Precisa preencher o nome', type: 'error' })
      return
    }
    if(!formdata.value.phone) {
      notify({ title: '', text: 'Precisa preencher o telefone', type: 'error' })
      return
    }
    if(!formdata.value.company) {
      notify({ title: '', text: 'Precisa preencher a empresa', type: 'error' })
      return
    }
    if(!formdata.value.opportunities) {
      notify({ title: '', text: 'Precisa preencher as oportunidades', type: 'error' })
      return
    }
    formdata.value.phone = formatPhone(formdata.value.phone)
    show.setOverlayDashboard(true)
    sendMail(formdata.value)
    show.setOverlayDashboard(false)
  }

  onBeforeUnmount(() => {
    phoneMaskInstance?.destroy()
    opportunitiesMaskInstance?.destroy()
  })

  // Dados fictícios para os serviços
  const { data: benefits, error, refresh, pending } = await useFetch('/api/benefits', {
      method: 'GET',
      params: {}
  })

  if (error.value) {
  } else {
      benefitsList.value = benefits.value
  }
</script>

<template>
  <main>
    <v-sheet width="100%">
      <HomeImageBackground image="/background-company.jpeg" />
    </v-sheet>

    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <p class="text-subtitle-1 mb-0">
              Na Conect One RH, acreditamos que equipes de sucesso começam com as pessoas certas. 
              Por isso, oferecemos uma plataforma completa para conectar talentos às oportunidades ideais.
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="text-subtitle-1 mb-0">
              Nossa ferramenta é intuitiva, segura e eficiente, tornando o processo de recrutamento mais rápido, transparente e estratégico para empresas e candidatos.
            </p>
          </v-col>
        </v-row>

      </v-container>
    </v-sheet>

    <v-sheet width="100%" class="bg-gradient-primary mt-4">
      <v-container>
        <v-row no-gutters>
          <v-col>
            <div class="d-flex flex-column align-center rounded pa-4">
              <span class="text-h5 font-weight-bold text-white">Construa equipes fortes com quem realmente faz a diferença</span>
              <p class="text-body-1 text-white mt-3 text-center max-w-700 mb-4">
                Com a Conect One RH, você tem acesso a talentos qualificados, ferramentas inovadoras e insights estratégicos que ajudam a sua empresa a crescer mais rápido e de forma sustentável.
              </p>
              <v-btn append-icon="mdi-comment-account" @click="dialog = true" flat color="white" rounded="xl" size="x-large">Quero saber mais!</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row no-gutters>
          <v-col cols="12">
            <h1 class="text-h5 font-weight-bold">Benefícios:</h1>
          </v-col>

          <v-col cols="12" class="mt-4">
            <v-row no-gutters>
              <template v-for="(benefit, indice) in benefitsList" :key="indice">
                <v-col cols="12" sm="6" lg="3" class="px-2 mb-4">
                  <v-card class="mx-auto" elevation="2" hover>
                    <v-card-title class="d-flex align-center">
                      <v-icon class="mr-2" size="28">{{ benefit.icon }}</v-icon>
                      <span class="text-subtitle-1 font-weight-bold custom-subtitle-and-title">{{ benefit.title }}</span>
                    </v-card-title>
                    <v-card-subtitle v-if="benefit.subtitle" class="mb-2 custom-subtitle-and-title">{{ benefit.subtitle }}</v-card-subtitle>
                    <v-card-text class="bg-surface-light pt-2">
                      {{ benefit.description }}
                    </v-card-text>
                  </v-card>
                </v-col>
              </template>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-dialog
      v-model="dialog"
      :max-width="600"
    >
      <v-card
        max-width="w-100"
        class="pa-5"
      >
        <v-card-text>
          <h2 class="text-h5 text-center font-weight-bold mb-2 text-gradient-primary">Faça o contato conosco</h2>
          <p class="text-body-2 mb-4">Preencha o formulário abaixo para entrar em contato com um especialista:</p>
          <form @submit.prevent="submit">
            <v-text-field
              v-model="formdata.name"
              label="Nome"
              density="comfortable"
              hide-details
              color="primary"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              v-model="formdata.email"
              label="E-mail"
              density="comfortable"
              hide-details
              color="primary"
              variant="outlined"
              class="mb-2"
              type="email"
            />

            <v-text-field
              ref="phoneInputRef"
              v-model="formdata.phone"
              label="Telefone"
              density="comfortable"
              hide-details
              color="primary"
              variant="outlined"
              class="mb-2"
              type="tel"
            />

            <v-text-field
              v-model="formdata.company"
              label="Empresa"
              density="comfortable"
              hide-details
              color="primary"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              ref="opportunitiesInputRef"
              v-model="formdata.opportunities"
              label="Quantas oportunidades você possui em aberto?"
              density="comfortable"
              hide-details
              color="primary"
              variant="outlined"
              class="mb-2"
              type="tel"
            />

            <v-btn class="w-100 mt-4 bg-gradient-primary" type="submit">
                Enviar
            </v-btn>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </main>
</template>

<style lang="scss" scoped>
.bg-gradient-primary {
  background: linear-gradient(90deg, #5c6bc0 0%, #3949ab 100%);
}
</style>
