<script setup lang="ts">
  import { useField, useForm } from 'vee-validate';
  import { useInfo } from '#imports';
  import { useShow } from '@/stores/show';
  import { useNotice } from '@/composables/useNotice';
  const { createLog } = useNotice();
  const info: any = useInfo();
  const show = useShow()
  const { notify } = useNotification();
  const loading = ref<boolean>(true)
  interface FormSchema {
    email: string
    password: string
  }
  useHead({
    title: `Entrar - Candidato - Conect One RH`,
    meta: [
      {
        name: 'description',
        content: 'Cadastre-se gratuitamente na Conect One RH e conecte-se com empresas ou candidatos de forma simples e rápida.'
      }
    ]
  })
  const route = useRoute();
  const router = useRouter();
  const showPassword = ref(false)
  const emailResetPassword = ref<any>(null)
  const dialogResetPassword = ref<boolean>(false)
  const token = ref<any>(null)

  const { handleSubmit, handleReset, values } = useForm<FormSchema>({
    validationSchema: {
      email(value: string) {
        return /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value) || 'O e-mail precisa ser válido.'
      },
      password(value: string) {
        return value?.length >= 6 || 'A senha precisa ter no mínimo 6 caracteres.'
      },
    },
  })

  const email = useField<string>('email')
  const password = useField<string>('password')
  const goCandidate = async (profile: any) => {
    const { data: dataCandidate, error: errorCandidate } = await useFetch(`/api/candidates`, {
        method: 'GET',
        params: { profile_id: profile.id }
      })

      if (errorCandidate.value) {
        console.error('Erro ao carregar candidato:', errorCandidate.value)
        return
      }

      const candidate = dataCandidate.value.data[0]
      info.setUser({ ...dataCandidate.value.data[0], type: 'candidate' })
      show.setOverlayDashboard(false)
      createLog({
        title: `Logou`,
        profile_id: info.profile.id,
        type: 'login'
      })
      notify({ title: '', text: 'Logado com sucesso', type: 'success' })
      if(token.value && token.value === info.user.code_confirmation) {
        updateConfirmation(info.user.id)
      } else {
        router.push(`/`)
      }
  }

  const goAdmin = async (profile: any) => {
    const { data: dataAdmin, error: errorAdmin } = await useFetch(`/api/admins`, {
        method: 'GET',
        params: { profile_id: profile.id }
      })

      if (errorAdmin.value) {
        console.error('Erro ao carregar candidato:', errorAdmin.value)
        return
      }

      const admin = dataAdmin.value.data[0]
      info.setUser({ ...dataAdmin.value.data[0], type: 'admin' })
      show.setOverlayDashboard(false)
      createLog({
        title: `Logou`,
        profile_id: info.profile.id,
        type: 'login'
      })
      notify({ title: '', text: 'Logado com sucesso', type: 'success' })
      router.push(`/dashboard/admin`)
  }

  const getProfile = async (id: string) => {
    const { data, error } = await useFetch(`/api/profiles/${id}`, {
      method: 'GET'
    })

    const profile = data.value
    info.setProfile(data.value)
    if(data.value.type === 'admin') {
      goAdmin(data.value)
    } else if(data.value.type === 'candidate') {
      goCandidate(data.value)
    }
  }

  const submit = handleSubmit(async (values) => {
    show.setOverlayDashboard(true)
    const supabase = useNuxtApp().$supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    })

    if (error) {
      notify({ title: '', text: 'Seu email ou a sua senha estão errados', type: 'error' })
      show.setOverlayDashboard(false)
    } else {
      getProfile(data.session.user.id)
    }
  })

  const navigation = (id: number) => {
    router.push(`/cadastrar/candidato`)
  }

  const updateConfirmation = async (id: string) => {
    try {
      const { data, error } = await useFetch(`/api/candidates/${id}`, {
        method: 'PATCH',
        body: {
          is_confirmation: true,
          code_confirmation: null
        }
      })
      createLog({
        title: `Confirmou o cadastro`,
        profile_id: info.profile.id,
        type: 'register_confirmation'
      })
      router.push(`/`)
    } catch (err) {
      console.log(err)
    }
  }

  onBeforeMount(() => {
    token.value = route.query.token as string | undefined

    if(info.user && info.user.id) {
      if(token.value && token.value === info.user.code_confirmation) {
        updateConfirmation(info.user.id)
      } else {
        router.push('/')
      }
    } else {
      loading.value = false;
    }
  })

  const resetPassword = async () => {
    if (!emailResetPassword.value) {
      notify({ title: '', text: 'Por favor, informe o email para redefinir a senha.', type: 'warning' });
      return;
    }
    
    show.setOverlayDashboard(true);
    const supabase = useNuxtApp().$supabase;

    const { data, error } = await supabase.auth.resetPasswordForEmail(emailResetPassword.value, {
      redirectTo: window.location.origin + '/entrar/candidato/redefinir-senha' // pode ajustar para a rota da sua app
    });

    show.setOverlayDashboard(false);
    if (error) {
      notify({ title: '', text: 'Erro ao enviar o email de redefinição.', type: 'error' });
    } else {
      emailResetPassword.value = null
      dialogResetPassword.value = false;
      notify({ title: '', text: 'Email de redefinição enviado! Verifique sua caixa de entrada.', type: 'success' });
    }
  };

</script>

<template>
  <div>
    <v-sheet width="100%" class="mt-4">
      <v-container v-if="!loading">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h5 font-weight-bold">Entrar como Candidato!</h1>
          </v-col>

          <v-col cols="12">
            <p class="text-subtitle-1 mb-0">
              Preencha os campos e entre no sistema.
            </p>
          </v-col>

          <v-col cols="12" class="mt-4" style="max-width: 600px; margin: 0 auto;">
            <div v-if="token" class="d-flex mb-2"><span class="text-warning text-caption font-weight-bold">Faça o login para confirmar o cadastro</span></div>
            <form @submit.prevent="submit">

              <v-text-field
                v-model="email.value.value"
                :error-messages="email.errorMessage.value"
                label="E-mail"
                type="email"
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

              <div class="d-flex flex-column flex-sm-row align-start">
                <div class="d-flex me-sm-4">
                  <v-btn class="me-4" type="submit">
                    Entrar
                  </v-btn>
                  <v-btn @click="handleReset">
                    Limpar
                  </v-btn>
                </div>
                <v-btn
                  text
                  class="mt-2 mt-sm-0"
                  @click="dialogResetPassword = true"
                >
                  Esqueci a senha
                </v-btn>
              </div>
            </form>
          </v-col>

          <v-col cols="12" class="mt-4" style="max-width: 600px; margin: 0 auto;">
            <div class="d-flex flex-column">
              <p class="text-caption font-weight-bold">Se ainda não possui cadastro, faça clicando no botão abaixo:</p>
            </div>
            <v-btn
              @click="navigation"
              text="Cadastrar"
              variant="flat"
              size="small"
              class="mt-1 bg-gradient-primary"
            ></v-btn>
          </v-col>

        </v-row>
      </v-container>
    </v-sheet>
  </div>
  <v-dialog
    v-model="dialogResetPassword"
    max-width="400"
  >
    <v-card class="pa-5">
    <!-- TÍTULO COM ÍCONE -->
    <template v-slot:title>
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-account-key</v-icon>
        <span class="text-h6 font-weight-bold">Redefinir a senha</span>
      </div>
    </template>

    <!-- AÇÕES -->
    <v-card-text class="d-flex flex-column px-4 pb-4 pt-2">
      <form @submit.prevent="resetPassword">
        <v-text-field
          v-model="emailResetPassword"
          label="E-mail"
          type="email"
          density="comfortable"
        />

        <v-btn class="me-4" type="submit">
          Redefinir
        </v-btn>
      </form>
    </v-card-text>
  </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
</style>
