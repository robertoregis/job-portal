<script setup lang="ts">
  import { useInfo } from '#imports';
  const authentication: any = useInfo();

  const value = ref(45);
</script>
<template>
  <v-navigation-drawer class="bg-gradient-primary" style="height: 100vh; overflow: hidden;">
    <v-row v-if="authentication.user.type === 'candidate'" class="pa-3" no-gutters>
      <v-col cols="12" class="mt-2">
        <div class="d-flex flex-column align-center">
          <v-avatar color="surface-variant" size="50"></v-avatar>
          <div class="d-flex flex-column align-center mt-6">
            <v-avatar color="surface-variant" size="70"></v-avatar>
            <span>Nome do candidato</span>
            <span class="text-caption">email@email.com</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="mt-3">
        <v-list nav>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/candidato/${authentication.user.id}`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-view-dashboard</v-icon>
              <span>Dashboard</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/candidato/${authentication.user.id}/meu-perfil`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-account</v-icon>
              <span>Meu perfil</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/candidato/${authentication.user.id}/minhas-candidaturas`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-clipboard-list</v-icon>
              <span>Minhas candidaturas</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/candidato/${authentication.user.id}/avisos`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-bell</v-icon>
              <span>Avisos</span>
            </NuxtLink>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12">
        <div class="d-flex flex-column align-center">
          <v-progress-circular
            :model-value="value"
            :rotate="360"
            :size="40"
            :width="5"
            color="white"
          >
            <span class="text-caption">{{ value }}</span>
          </v-progress-circular>
          <span class="mt-1 text-caption">Seu progresso...</span>
          <v-btn
            color="white"
            text="Sair"
            variant="flat"
            class="mt-4"
          ></v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="authentication.user.type === 'company'" class="pa-3" no-gutters>
      <v-col cols="12" class="mt-2">
        <div class="d-flex flex-column align-center">
          <v-avatar color="surface-variant" size="50"></v-avatar>
          <div class="d-flex flex-column align-center mt-6">
            <v-avatar color="surface-variant" size="70"></v-avatar>
            <span>Nome da empresa</span>
            <span class="text-caption">email@email.com</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="mt-3">
        <v-list nav>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/empresa/${authentication.user.id}`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-view-dashboard</v-icon>
              <span>Dashboard</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/empresa/${authentication.user.id}/meu-perfil`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-account</v-icon>
              <span>Meu perfil</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/empresa/${authentication.user.id}/minhas-vagas`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-clipboard-list</v-icon>
              <span>Minhas vagas</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/empresa/${authentication.user.id}/avisos`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-bell</v-icon>
              <span>Avisos</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/empresa/${authentication.user.id}/ajustes`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-cog</v-icon>
              <span>Ajustes</span>
            </NuxtLink>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12">
        <div class="d-flex flex-column align-center">
          <v-progress-circular
            :model-value="value"
            :rotate="360"
            :size="40"
            :width="5"
            color="white"
          >
            <span class="text-caption">{{ value }}</span>
          </v-progress-circular>
          <span class="mt-1 text-caption">Seu progresso...</span>
          <v-btn
            color="white"
            text="Sair"
            variant="flat"
            class="mt-4"
          ></v-btn>
        </div>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
</style>