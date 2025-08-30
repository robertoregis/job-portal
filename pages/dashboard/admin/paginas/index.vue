<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { formatDate } from '@/composables/formatDate';
  import { useShow } from '@/stores/show';
  import { useNotice } from '@/composables/useNotice';
  definePageMeta({
    layout: 'dashboard',
  })
  useHead({
    title: `Páginas - Conect One RH`,
    meta: [
      {
          name: 'description',
          content: 'Gerencie todas as páginas do site e controle sua exibição.'
      }
    ]
  })
  const { createNotice, createLog } = useNotice();
  const { notify } = useNotification();
  const show = useShow();
  const info: any = useInfo();
  const router = useRouter()
  const page = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(1)
  const pagesList = ref<any[]>([])

  watch(page, () => {
    getPages()
  })

  // Navegação
  const navigation = (id: number) => {
    router.push(`/dashboard/admin/paginas/${id}`)
  }

  const getPages = async () => {
    const params: Record<string, any> = {
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }

    // Filtro por empresa (se houver)
    if (info.user.id) {
      params.page_id = info.user.id
    }

    const { data, error } = await useFetch('/api/pages', {
      method: 'GET',
      params
    })

    if (error.value) {
    } else {
      pagesList.value = data.value?.data || []
      totalPages.value = data.value?.totalPages || 1
    }
  }

  const removePage = async (id: string) => {
      show.setOverlayDashboard(true)
      const { data, error } = await useFetch(`/api/pages/${id}`, {
          method: 'DELETE'
      })
      show.setOverlayDashboard(false)
      if (error.value) {
          notify({ title: 'Erro', text: 'Erro ao remover a página', type: 'error' })
          return
      }
      createLog({
        title: `Removeu a página`,
        profile_id: info.profile.id,
        type: 'delete_page'
      })
      notify({ title: 'Parabéns!', text: 'A página foi removida com sucesso', type: 'success' })
      getPages()
  }

  const { data: pages, error, refresh, pending } = await useFetch('/api/pages', {
    method: 'GET',
    params: {
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }
  })

  if (error.value) {
  } else {
    pagesList.value = pages.value?.data || []
    totalPages.value = pages.value?.totalPages || 1
  }

</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Páginas</span>
        <span class="text-caption">Confira e gerencie todas as páginas.</span>
      </div>
    </v-col>
  </v-row>

  <!-- Botão criar -->
  <v-row no-gutters class="mt-4">
    <v-col cols="12">
      <div class="d-flex">
        <v-btn text="Criar página" variant="flat" class="bg-gradient-primary" @click="$router.push(`/dashboard/admin/paginas/criar`)" />
      </div>
    </v-col>
  </v-row>

  <!-- Lista de páginas -->
  <v-row no-gutters>
    <v-col cols="12" class="mt-4">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Páginas</v-list-subheader>

            <v-list-item v-if="pagesList.length === 0" class="px-4 text-grey">
              Nenhuma página foi encontrada.
            </v-list-item>

            <v-list-item
              v-for="page in pagesList"
              :key="page.id"
              style="min-height: unset"
            >
              <v-card
                class="pa-2 border mb-2"
                :class="`${!page.is_active ? 'opacity-50' : ''}`"
                elevation="2"
                ripple
                hover
                @click="navigation(page.id)"
              >
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">{{ page.title }}</div>
                    <div class="text-caption text-grey">
                      Ativa: {{ page.is_active ? 'Sim' : 'Não' }}
                    </div>
                  </div>

                  <div class="d-flex align-center">
                    <div class="text-caption text-grey-darken-1 mr-3">{{ page.created_at_formatted }}</div>
                    <v-btn
                      icon="mdi-delete"
                      size="x-small"
                      color="error"
                      @click.stop="removePage(page.id)"
                      title="Remover página"
                    />
                  </div>
                </div>
              </v-card>
            </v-list-item>

          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Paginação -->
    <v-col
      v-if="totalPages > 1"
      cols="12"
      class="d-flex justify-center mt-4"
    >
      <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="5"
        color="primary"
        rounded
      />
    </v-col>

  </v-row>
</template>

<style scoped lang="scss">
</style>
