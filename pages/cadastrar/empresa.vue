<script setup lang="ts">
  definePageMeta({
    middleware: ['authenticated'] as unknown as any
  })
  import { useField, useForm } from 'vee-validate';
  import { useInfo } from '#imports';
  import { useShow } from '@/stores/show';
  import { useNotice } from '@/composables/useNotice';
  const { createLog } = useNotice();
  const info: any = useInfo();
  const show = useShow();
  useHead({
    title: `Cadastrar - Empresa - Conect RH One`,
    meta: [
      {
          name: 'description',
          content: 'Cadastre-se gratuitamente na Conect RH One e conecte-se com empresas ou candidatos de forma simples e rápida.'
      }
    ]
  })
  const { notify } = useNotification();
  const loading = ref<boolean>(true)
  interface FormSchema {
    name: string
    email: string
    password: string
    passwordConfirm: string
  }
  const router = useRouter();
  const showPassword = ref(false)
  const showPasswordConfirm = ref(false)
  const token = ref<any>(null)

  const { handleSubmit, handleReset, values } = useForm<FormSchema>({
    validationSchema: {
      name(value: string) {
        return value?.length >= 2 || 'O nome precisa ter no mínimo 2 caracteres.'
      },
      email(value: string) {
        return /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value) || 'O e-mail precisa ser válido.'
      },
      password(value: string) {
        return value?.length >= 6 || 'A senha precisa ter no mínimo 6 caracteres.'
      },
      passwordConfirm(value: string) {
        return value === values.password || 'As senhas não conferem.'
      },
    },
  })

  const name = useField<string>('name')
  const email = useField<string>('email')
  const password = useField<string>('password')
  const passwordConfirm = useField<string>('passwordConfirm')

  const sendMail = async (candidateName: string, candidateEmail: string) => {
    const { data, error } = await useFetch('/api/emails/send', {
      method: 'POST',
      body: {
        to: [`${candidateName} <${candidateEmail}>`],
        subject: 'O seu cadastro foi feito - Conect RH One',
        template: 'email_confirmation_template',
        variables: {
          name: candidateName,
          link: window.location.origin + `/entrar/empresa?token=${token.value}`
        }
      }
    })
  }

  const getProfile = async (id: string) => {
    const { data, error } = await useFetch(`/api/profiles/${id}`, {
      method: 'GET'
    })

    const profile = data.value
    info.setProfile(data.value)

    const { data: dataCompany, error: errorCompany } = await useFetch(`/api/companies`, {
        method: 'GET',
        params: { profile_id: profile.id }
      })

      if (errorCompany.value) {
        console.error('Erro ao carregar empresa:', errorCompany.value)
        return
      }

      setTimeout(() => {
        const company = dataCompany.value.data
        info.setUser({ ...dataCompany.value.data[0], type: 'company' })
        sendMail(values.name, info.user.email)
        createLog({
            title: `Cadastrou a conta`,
            profile_id: info.profile.id,
            type: 'register'
        })
        notify({ title: '', text: 'Cadastro feito com sucesso', type: 'success' })
        show.setOverlayDashboard(false)
        router.push(`/dashboard/empresa/${company.id}/meu-perfil/editar`)
      }, 1000)
  }

  const submit = handleSubmit(async (values) => {
    //alert(JSON.stringify(values, null, 2))
    show.setOverlayDashboard(true)
    const { data, pending, error } = await useFetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: values.name,
        email: values.email,
        password: values.password,
        type: 'company'
      }
    })

    // Tratamento de erros
    if (error.value) {
      if (error.value.statusMessage?.includes('already been registered')) {
        notify({ title: '', text: 'O email já existe', type: 'error' })
      } else {
        notify({ title: '', text: 'Erro ao criar cadastro', type: 'error' })
      }
      show.setOverlayDashboard(false)
    } else {
      getProfile(data.value.id)
    }

  })

  const navigation = (id: number) => {
    router.push(`/entrar/empresa`)
  }

  onBeforeMount(() => {
    if(info.user && info.user.id) {
      router.push('/')
    } else {
      loading.value = false;
    }
  })

</script>

<template>
  <div>
    <!--<v-sheet width="100%" class="bg-gradient-primary py-1">
      <div class="d-flex justify-center">
        <h2 class="text-h6 font-weight-bold">Cadastrar</h2>
      </div>
    </v-sheet>-->

    <v-sheet width="100%" class="mt-4">
      <v-container v-if="!loading">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h5 font-weight-bold">Cadastrar Empresa!</h1>
          </v-col>

          <v-col cols="12">
            <p class="text-subtitle-1 mb-0">
              Preencha os campos.
            </p>
          </v-col>

          <v-col cols="12" class="mt-4" style="max-width: 600px; margin: 0 auto;">
            <form @submit.prevent="submit">
              <v-text-field
                v-model="name.value.value"
                :counter="10"
                :error-messages="name.errorMessage.value"
                label="Nome"
                density="comfortable"
              />

              <v-text-field
                v-model="email.value.value"
                :error-messages="email.errorMessage.value"
                label="E-mail"
                density="comfortable"
              />

              <v-text-field
                v-model="password.value.value"
                :error-messages="password.errorMessage.value"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                label="Senha"
                density="comfortable"
              />

              <v-text-field
                v-model="passwordConfirm.value.value"
                :error-messages="passwordConfirm.errorMessage.value"
                :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPasswordConfirm = !showPasswordConfirm"
                :type="showPasswordConfirm ? 'text' : 'password'"
                label="Senha novamente"
                density="comfortable"
              />

              <v-btn class="me-4" type="submit">
                Cadastrar
              </v-btn>

              <v-btn @click="handleReset">
                Limpar
              </v-btn>
            </form>
          </v-col>

          <v-col cols="12" class="mt-4" style="max-width: 600px; margin: 0 auto;">
            <div class="d-flex flex-column">
              <p class="text-caption font-weight-bold">Se já possui cadastro, entre no sistema clicando no botão abaixo:</p>
            </div>
            <v-btn
              @click="navigation"
              text="Entrar"
              variant="flat"
              size="small"
              class="mt-1 bg-gradient-primary"
            ></v-btn>
          </v-col>
          
        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>

<style lang="scss" scoped>
</style>
