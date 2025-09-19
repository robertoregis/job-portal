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
  const { notify } = useNotification();
  const { createLog } = useNotice();

  const navigation = (type: string) => {
    dialog.value = false;
    router.push(`/cadastrar/${type}`)
  }

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
        <div class="img-logo">
          <img src="/logo-text-3.png" alt="logo com símbolo da Conect One RH" style="max-width: 100%;"></img>
        </div>

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
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
  @media(min-width: 250px) {
    .img-logo {
      width: 120px;
    }
  }
  @media(min-width: 600px) {
    .img-logo {
      width: 180px;
    }
  }
</style>