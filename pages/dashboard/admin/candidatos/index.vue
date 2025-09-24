<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { formatDate } from '@/composables/formatDate';
  definePageMeta({
    layout: 'dashboard',
  })
  useHead({
    title: `Candidatos - Conect One RH`,
    meta: [
      {
        name: 'description',
        content: 'Veja todas os candidatos cadastrados na Conect One RH.'
      }
    ]
  })
  const info: any = useInfo();
  const router = useRouter()
  const page = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(1)
  const candidatesList = ref<any[]>([])
  const candidatesTotalCount = ref<number>(0)
  const candidatesFilterTotalCount = ref<number>(0)
  // Filtros
  const completOptions = ['Sim', 'Não']
  const selectedCompleted = ref<string | null>(null)

  // Resetar página ao mudar filtro
  watch([selectedCompleted], () => {
    page.value = 1
    getCandidates()
  })

  watch(page, () => {
    getCandidates()
  })

  // Navegação
  const navigation = (id: number) => {
    router.push(`/dashboard/admin/candidatos/${id}`)
  }

  const getCandidates = async () => {
    const params: Record<string, any> = {
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }

    if (selectedCompleted.value === 'Sim') {
      params.is_complete = true
    } else if (selectedCompleted.value === 'Não') {
      params.is_complete = false
    }

    const { data, error } = await useFetch('/api/candidates', {
      method: 'GET',
      params
    })

    if (error.value) {
    } else {
      candidatesList.value = data.value?.data || []
      totalPages.value = data.value?.totalPages || 1
      candidatesFilterTotalCount.value = data.value?.count
    }
  }

  const { data: companies, error, refresh, pending } = await useFetch('/api/candidates', {
    method: 'GET',
    params: {
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }
  })

  if (error.value) {
  } else {
    candidatesList.value = companies.value?.data || []
    totalPages.value = companies.value?.totalPages || 1
    candidatesTotalCount.value = companies.value?.totalCount
  }

</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Candidatos</span>
        <span class="text-caption">Confira todos os candidatos.</span>
      </div>
    </v-col>
    <LayoutButtonBack />
  </v-row>

  <!-- Filtros -->
  <v-row no-gutters class="mt-4">
    <v-col cols="12" sm="6" md="4">
      <v-select
        v-model="selectedCompleted"
        :items="completOptions"
        label="Filtrar por perfis completo"
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
    <v-col v-if="selectedCompleted" cols="12">
      <div class="d-flex align-center">

        <v-chip v-if="selectedCompleted" class="ma-2" :color="selectedCompleted === 'Sim' ? 'success' : 'error'" variant="flat">
          <v-icon :icon="selectedCompleted === 'Sim' ? 'mdi-power' : 'mdi-power-off'" start></v-icon>
          {{ selectedCompleted === 'Sim' ? 'Perfis completos' : 'Perfis não completos' }}
        </v-chip>
      </div>
    </v-col>
  </v-row>

  <!-- Lista de candidatos -->
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-caption text-weight-bold">Total de candidatos: {{ candidatesTotalCount }}</span>
        <span v-if="selectedCompleted" class="text-caption text-weight-bold">Total com filtro: {{ candidatesFilterTotalCount }}</span>
      </div>
    </v-col>
    <v-col cols="12" class="mt-4">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Candidatos</v-list-subheader>

            <v-list-item v-if="candidatesList.length === 0" class="px-4 text-grey">
              Nenhum candidato encontrado com os filtros selecionados.
            </v-list-item>

            <v-list-item
              v-for="candidate in candidatesList"
              :key="candidate.id"
              style="min-height: unset"
            >
              <v-card
                class="pa-2 border mb-2"
                elevation="2"
                ripple
                hover
                @click="navigation(candidate.id)"
              >
                <div class="d-flex justify-space-between align-center">
                  <div class="d-flex justify-space-between align-center">
                    <v-avatar size="40">
                        <v-img
                          alt=""
                          :src="`${candidate.image_url ? candidate.image_url : 'https://uhwfvrjhlhvxyrrlaqna.supabase.co/storage/v1/object/public/jobportal/default/blank-profile-picture-973460_640.png'}`"
                        ></v-img>
                    </v-avatar>
                    <div class="ml-3">
                      <div class="text-subtitle-1 font-weight-medium">{{ candidate.name }}</div>
                      <div class="text-caption text-grey">
                        Endereço: {{ candidate.address }}
                      </div>
                    </div>
                  </div>
                  <div class="text-caption text-grey-darken-1">{{ candidate.created_at_formatted }}</div>
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
