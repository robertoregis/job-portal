<script setup lang="ts">
  import { useInfo } from '#imports';
  import { useShow } from '@/stores/show';
  import { useField, useForm } from 'vee-validate';
  import { useNotice } from '@/composables/useNotice';
  interface FormSchema {
    email: string
    password: string
  }
  const info: any = useInfo();
  const show = useShow()
  const router = useRouter();
  const dialog = ref<boolean>(false)
  const dialogLoginAdmin = ref<boolean>(false)
  const { notify } = useNotification();
  const { createLog } = useNotice();

  const showPassword = ref(false)
  const showPasswordConfirm = ref(false)

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

  const navigation = (type: string) => {
    dialog.value = false;
    router.push(`/cadastrar/${type}`)
  }

  const navigationDashboard = () => {
    let dashboardType = ''

    switch (info.user.type) {
      case 'candidate':
        dashboardType = 'candidato'
        break
      case 'company':
        dashboardType = 'empresa'
        break
      case 'admin':
        dashboardType = 'admin'
        break
      default:
        dashboardType = '' // ou alguma rota padrão, se quiser
    }

    if (dashboardType && info.user.id) {
      if(dashboardType === 'admin') {
        router.push(`/dashboard/${dashboardType}`)
      } else {
        router.push(`/dashboard/${dashboardType}/${info.user.id}`)
      }
    } else {
      // opcional: lidar com usuário inválido
      console.error('Tipo de usuário desconhecido ou ID não definido')
    }
  }


  const getProfile = async (id: string) => {
    const { data, error } = await useFetch(`/api/profiles/${id}`, {
      method: 'GET'
    })

    const profile = data.value
    info.setProfile(data.value)

    const { data: dataAdmin, error: errorAdmin } = await useFetch(`/api/admins`, {
        method: 'GET',
        params: { profile_id: profile.id }
      })

      if (errorAdmin.value) {
        console.error('Erro ao carregar admin:', errorAdmin.value)
        return
      }

      const admin = dataAdmin.value.data
      info.setUser({ ...dataAdmin.value.data[0], type: 'admin' })
      show.setOverlayDashboard(false)
      createLog({
        title: `Logou`,
        profile_id: info.profile.id,
        type: 'login'
      })
      //localStorage.setItem('user', JSON.stringify(admin))
      notify({ title: '', text: 'Logado com sucesso', type: 'success' })
      dialog.value = false;
      dialogLoginAdmin.value = false;
  }

  const submit = handleSubmit(async (values) => {
    //alert(JSON.stringify(values, null, 2))
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

  const goCandidate = () => {
    if(info.user && info.user.id) {
      router.push(`/dashboard/candidato/${info.user.id}/meu-perfil`)
    } else {
      router.push('/cadastrar/candidato')
    }
  }

  const goLogin = () => {
    if(info.user && info.user.id) {
      if(info.user.type === 'candidate') {
        router.push(`/dashboard/candidato/${info.user.id}/meu-perfil`)
      } else if(info.user.type === 'company') {
        router.push(`/dashboard/empresa/${info.user.id}`)
      } else if(info.user.type === 'admin') {
        router.push(`/dashboard/admin`)
      }
    } else {
      dialog.value = true
    }
  }

  const logout = async () => {
    createLog({
      title: `Deslogou`,
      profile_id: info.profile.id,
      type: 'logout'
    })
    show.setOverlayDashboard(true)
    const supabase = useNuxtApp().$supabase
    await supabase.auth.signOut()
    info.setUser({})
    localStorage.removeItem('user')
    show.setOverlayDashboard(false)
    router.push('/')
  }
  
</script>
<template>
  <v-sheet width="100%" class="border-b-sm border-secondary">
    <v-container class="py-3">
      <div class="d-flex justify-space-between align-center">
        <h1 class="text-h6 font-weight-bold">Conect One RH</h1>


        <v-spacer></v-spacer>

        <div class="d-flex">
          <div class="d-none d-md-flex align-center">
            <ul class="pl-0 d-flex list-style-none">
              <li class="mx-2">
                <NuxtLink to="/" class="no-underline text-title text-subtitle-1">Home</NuxtLink>
              </li>
              <li class="mx-2">
                <NuxtLink to="/sobre" class="no-underline text-title text-subtitle-1">Sobre nós</NuxtLink>
              </li>
              <li class="mx-2">
                <NuxtLink to="/vagas" class="no-underline text-title text-subtitle-1">Vagas</NuxtLink>
              </li>
              <li class="mx-2">
                <NuxtLink to="/empresa" class="no-underline text-title text-subtitle-1">Empresa</NuxtLink>
              </li>
              <li v-if="!info.user.id" class="mx-2">
                <a @click.prevent.stop="goCandidate" role="dialog" tabindex="0" class="pointer text-title text-subtitle-1">Candidato</a>
              </li>
              
            </ul>
          </div>
          <v-btn
            icon="mdi-menu"
            variant="text"
            class="d-md-none"
            @click="show.setMenu(!show.menu)"
          ></v-btn>
          <div class="d-none d-md-flex">
            <v-btn @click="goLogin" rounded="xl" class="bg-gradient-primary ml-5">Login</v-btn>
            <v-btn v-if="info.user && info.user.id" @click="logout" rounded="xl" class="ml-2" color="error">Sair</v-btn>
          </div>
        </div>

      </div>
    </v-container>
  </v-sheet>
  <v-dialog
    v-model="dialog"
    max-width="400"
  >
    <v-card class="pa-5">
    <!-- TÍTULO COM ÍCONE -->
    <template v-slot:title>
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-location-enter</v-icon>
        <span class="text-h6 font-weight-bold">Entrar</span>
      </div>
    </template>

    <!-- SUBTÍTULO -->
    <v-card-subtitle class="pt-1">
      Efetue o login no nosso sistema
    </v-card-subtitle>

    <!-- AÇÕES -->
    <v-card-actions class="d-flex flex-column px-4 pb-4 pt-2">
      <v-btn
        variant="flat"
        color="success"
        class="w-100"
        @click="navigation('candidato')"
      >
        Sou um candidato
      </v-btn>

      <v-btn
        variant="flat"
        color="success"
        class="w-100"
        @click="navigation('empresa')"
      >
        Sou uma empresa
      </v-btn>
      <v-btn
        variant="text"
        size="small"
        color="grey"
        prepend-icon="mdi-shield-key"
        @click="dialogLoginAdmin = true"
      >
        Administrador
      </v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>

  <v-dialog
    v-model="dialogLoginAdmin"
    max-width="400"
  >
    <v-card class="pa-5">
    <!-- TÍTULO COM ÍCONE -->
    <template v-slot:title>
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-location-enter</v-icon>
        <span class="text-h6 font-weight-bold">Entrar como administrador</span>
      </div>
    </template>

    <!-- AÇÕES -->
    <v-card-text class="d-flex flex-column px-4 pb-4 pt-2">
      <form @submit.prevent="submit">

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

              <v-btn class="me-4" type="submit">
                Entrar
              </v-btn>

              <v-btn @click="handleReset">
                Limpar
              </v-btn>
            </form>
    </v-card-text>
  </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
</style>