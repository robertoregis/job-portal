<script setup lang="ts">
  import { useInfo } from '#imports';
  const authentication: any = useInfo();
  const router = useRouter();
  const dialog = ref<boolean>(false)

  const navigation = (type: string) => {
    dialog.value = false;
    router.push(`/cadastrar/${type}`)
  }

  const navigationDashboard = () => {
    router.push(`/dashboard/${authentication.user.type === 'candidate' ? 'candidato' : 'empresa'}/${authentication.user.id}`)
  }
  
</script>
<template>
  <v-sheet width="100%" class="border-b-sm border-secondary">
    <v-container class="py-3">
      <div class="d-flex justify-space-between align-center">
        <v-toolbar-title class="text-title text-h5 font-weight-bold">Connect One RH</v-toolbar-title>

        <v-spacer></v-spacer>

        <div class="d-flex">
          <div class="d-flex align-center">
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
              
            </ul>
          </div>
          <v-btn v-if="authentication.user && authentication.user.id" @click="navigationDashboard" rounded="xl" class="ml-5 bg-gradient-status">Dashboard</v-btn>
          <v-btn @click="dialog = true" rounded="xl" :class="`${authentication.user && authentication.user.id ? 'ml-2' : 'ml-5'}`" class="bg-gradient-primary">Login</v-btn>
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
        class="mb-1 w-100"
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
</style>