<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { name_formated } from '@/composables/textFunctions';
  import { useShow } from '@/stores/show';
  const { notify } = useNotification();

  const info: any = useInfo();
  const page = ref(1)
  const pageSize = ref(30)
  const totalPages = ref(1)
  const pagesList = ref<any[]>([])

  const { data: pages, error, refresh, pending } = await useFetch('/api/pages', {
    method: 'GET',
    params: {
      page: page.value.toString(),
      pageSize: pageSize.value.toString(),
      is_active: true
    }
  })

  if (error.value) {
  } else {
    pagesList.value = pages.value?.data || []
    totalPages.value = pages.value?.totalPages || 1
  }
</script>
<template>
  <v-sheet width="100%" class="bg-gradient-primary mt-4 text-white">
    <v-container class="py-5">
      <v-row>
        <v-col cols="12">
          <v-row class="flex-md-row flex-column align-center align-md-start justify-md-space-between">
            <!-- BLOCO DE LINKS - Vai pra cima em telas pequenas -->
            <v-col
              cols="12" md="6"
              class="d-flex justify-center justify-md-end"
              order="1"
              order-md="2"
            >
              <!-- container dos links -->
              <v-row class="max-w-400" no-gutters>
                <v-col v-if="!info.user.id" cols="6" class="d-flex">
                  <NuxtLink to="/cadastrar/candidato" class="text-white no-underline text-subtitle-1 pa-1">Cadastrar candidato</NuxtLink>
                </v-col>
                <v-col v-if="!info.user.id" cols="6" class="d-flex">
                  <NuxtLink to="/cadastrar/empresa" class="text-white no-underline text-subtitle-1 pa-1">Cadastrar empresa</NuxtLink>
                </v-col>
                <template v-for="page in pagesList" :key="page.id">
                  <v-col cols="6" class="d-flex">
                    <NuxtLink :to="`/paginas/${page.id}/${name_formated(page.title)}`" class="text-white no-underline text-subtitle-1 pa-1">{{ page.title }}</NuxtLink>
                  </v-col>
                </template>
              </v-row>
            </v-col>

            <!-- BLOCO DE REDES SOCIAIS - Vai pra baixo em telas pequenas -->
            <v-col
              cols="12" md="6"
              class="d-flex justify-center justify-md-start"
              order="2"
              order-md="1"
            >
              <div>
                <NuxtLink to="/" class="no-underline mr-2">
                  <v-icon color="white" icon="mdi-instagram" size="large" />
                </NuxtLink>
                <NuxtLink to="/" class="no-underline mr-2">
                  <v-icon color="white" icon="mdi-facebook" size="large" />
                </NuxtLink>
                <NuxtLink to="/" class="no-underline mr-2">
                  <v-icon color="white" icon="mdi-linkedin" size="large" />
                </NuxtLink>
              </div>
            </v-col>
          </v-row>

        </v-col>
        <v-col cols="12">
          <div class="d-flex justify-center">
            <span class="text-body-2">Todos os direitos reservados - Copyright © 2025 </span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<style lang="scss" scoped>
</style>