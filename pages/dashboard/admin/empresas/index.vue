<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { formatDate } from '@/composables/formatDate';
  definePageMeta({
    layout: 'dashboard',
  })
  useHead({
    title: `Empresas - Conect One RH`,
    meta: [
      {
          name: 'description',
          content: 'Veja todas as empresas cadastradas e gerencie aprovações.'
      }
    ]
  })
  const info: any = useInfo();
  const router = useRouter()
  const page = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(1)
  const companiesList = ref<any[]>([])

  // Filtros

  const approveOptions = ['Sim', 'Não']
  const selectedApproved = ref<string | null>(null)

  // Resetar página ao mudar filtro
  watch([selectedApproved], () => {
    page.value = 1
    getJobs()
  })

  watch(page, () => {
    getJobs()
  })

  // Navegação
  const navigation = (id: number) => {
    router.push(`/dashboard/admin/empresas/${id}`)
  }

  const getJobs = async () => {
    const params: Record<string, any> = {
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }

    if (selectedApproved.value === 'Sim') {
      params.is_approved = true
    } else if (selectedApproved.value === 'Não') {
      params.is_approved = false
    }

    // Filtro por empresa (se houver)
    if (info.user.id) {
      params.company_id = info.user.id
    }

    const { data, error } = await useFetch('/api/companies', {
      method: 'GET',
      params
    })

    if (error.value) {
    } else {
      companiesList.value = data.value?.data || []
      totalPages.value = data.value?.totalPages || 1
    }
  }



  const { data: companies, error, refresh, pending } = await useFetch('/api/companies', {
    method: 'GET',
    params: {
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }
  })

  if (error.value) {
  } else {
    companiesList.value = companies.value?.data || []
    totalPages.value = companies.value?.totalPages || 1
  }

</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Empresas</span>
        <span class="text-caption">Confira todas as empresas.</span>
      </div>
    </v-col>
    <LayoutButtonBack />
  </v-row>

  <!-- Filtros -->
  <v-row no-gutters class="mt-4">
    <v-col cols="12" sm="6" md="4">
      <v-select
        v-model="selectedApproved"
        :items="approveOptions"
        label="Filtrar por aprovada?"
        clearable
        variant="outlined"
        hide-details
        class="mb-2"
        dense
      />
    </v-col>
  </v-row>

  <!-- Chips com filtros selecionados -->
  <v-row no-gutters>
    <v-col v-if="selectedApproved" cols="12">
      <div class="d-flex align-center">

        <v-chip v-if="selectedApproved" class="ma-2" :color="selectedApproved === 'Sim' ? 'success' : 'error'" variant="flat">
          <v-icon :icon="selectedApproved === 'Sim' ? 'mdi-power' : 'mdi-power-off'" start></v-icon>
          {{ selectedApproved === 'Sim' ? 'Só aprovadas' : 'Só não aprovadas' }}
        </v-chip>
      </div>
    </v-col>
  </v-row>

  <!-- Lista de empresas -->
  <v-row no-gutters>
    <v-col cols="12" class="mt-4">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Empresas</v-list-subheader>

            <v-list-item v-if="companiesList.length === 0" class="px-4 text-grey">
              Nenhuma empresa encontrada com os filtros selecionados.
            </v-list-item>

            <v-list-item
              v-for="company in companiesList"
              :key="company.id"
              style="min-height: unset"
            >
              <v-card
                class="pa-2 border mb-2"
                :class="`${!company.is_approved ? 'opacity-50' : ''}`"
                elevation="2"
                ripple
                hover
                @click="navigation(company.id)"
              >
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">{{ company.name }}</div>
                    <div class="text-caption text-grey">
                      Status: {{ company.status }} |
                      Aprovado: {{ company.is_approved ? 'Sim' : 'Não' }}
                    </div>
                  </div>
                  <div class="text-caption text-grey-darken-1">{{ formatDate(new Date(company.created_at), 3) }}</div>
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
