<script setup lang="ts">
  import { useInfo } from '@/stores/info'
  import { useShow } from '@/stores/show'
  import { useField, useForm } from 'vee-validate';
  interface FormSchema {
    email: string
    password: string
  }
  const info: any = useInfo()
  const router = useRouter()
  const show = useShow()
  const dialog = ref<boolean>(false)
  const dialogLoginAdmin = ref<boolean>(false)
  const { notify } = useNotification();

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
    show.setMenu(false)
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
    show.setMenu(false)
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

      const admin = dataAdmin.value
      info.setUser({ ...dataAdmin.value[0], type: 'admin' })
      show.setOverlayDashboard(false)
      //localStorage.setItem('user', JSON.stringify(admin))
      notify({ title: '', text: 'Logado com sucesso', type: 'success' })
      dialog.value = false;
      dialogLoginAdmin.value = false;
      show.setMenu(false)
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

  const logout = async () => {
    show.setOverlayDashboard(true)
    const supabase = useNuxtApp().$supabase
    await supabase.auth.signOut()
    info.setUser({})
    localStorage.removeItem('user')
    show.setOverlayDashboard(false)
    show.setMenu(false)
    router.push('/')
  }
</script>

<template>
  <v-navigation-drawer
    v-model="show.menu"
    class="bg-gradient-primary"
    :temporary="$vuetify.display.smAndDown"
    :permanent="$vuetify.display.mdAndUp"
    style="height: 100vh; overflow: hidden;"
  >
    <v-row class="pa-3" no-gutters>
      <v-col cols="12">
        <v-list nav>
          <v-list-item class="d-flex justify-center" style="min-height: unset">
            <NuxtLink @click="show.setMenu(false)" :to="`/`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <span>Home</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex justify-center" style="min-height: unset">
            <NuxtLink @click="show.setMenu(false)" :to="`/sobre`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <span>Sobre nós</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex justify-center" style="min-height: unset">
            <NuxtLink @click="show.setMenu(false)" :to="`/vagas`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <span>Vagas</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex justify-center" style="min-height: unset">
            <NuxtLink @click="show.setMenu(false)" :to="`/empresa`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <span>Empresa</span>
            </NuxtLink>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12">
        <div class="d-flex flex-column align-center">
          <v-btn v-if="info.user && info.user.id" @click="navigationDashboard" rounded="xl" class="mt-5">Dashboard</v-btn>
          <v-btn v-if="info.user && info.user.id" @click="logout" rounded="xl" class="mt-2" color="error">Sair</v-btn>
          <v-btn v-else @click="dialog = true" rounded="xl" :class="`${info.user && info.user.id ? 'mt-2' : 'mt-3'}`" class="">Login</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-navigation-drawer>

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