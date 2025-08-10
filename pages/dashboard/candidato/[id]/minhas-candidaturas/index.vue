<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  definePageMeta({
    layout: 'dashboard'
  })
  const info: any = useInfo();
  const router = useRouter()
  const page = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(1)
  const candidaturesList = ref<any[]>([])
  const candidaturaStatusOptions = [
    { name: 'Enviada', icon: 'mdi-send' },
    { name: 'Em análise', icon: 'mdi-magnify' },
    { name: 'Em entrevista', icon: 'mdi-account-question' },
    { name: 'Avaliação final', icon: 'mdi-progress-clock' },
    { name: 'Aprovado', icon: 'mdi-check-circle' },
    { name: 'Rejeitado', icon: 'mdi-close-circle' },
    { name: 'Arquivada', icon: 'mdi-archive' },
    { name: 'Desistiu', icon: 'mdi-close-box-outline' },
  ]

  const selectedStatus = ref<string | null>(null)
  const selectedIconStatus = ref<string>('')

  const onStatusSelect = (selected: string | null) => {
    if (!selected) {
      selectedIconStatus.value = ''
      return
    }
    const result = candidaturaStatusOptions.find(option => option.name === selected)
    selectedIconStatus.value = result ? result.icon : ''
  }

  const getCandidatures = async () => {
    const params: Record<string, any> = {
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }

    if (selectedStatus.value) params.status = selectedStatus.value

    // Filtro por empresa (se houver)
    if (info.user.id) {
      params.candidate_id = info.user.id
    }

    const { data, error } = await useFetch('/api/candidatures', {
      method: 'GET',
      params
    })

    if (error.value) {
    } else {
      candidaturesList.value = data.value?.data || []
      totalPages.value = data.value?.totalPages || 1
    }
  }

  watch(selectedStatus, () => {
    getCandidatures()
  })

  watch(page, () => {
    getCandidatures()
  })

  const navigation = (id: number) => {
    router.push(`/dashboard/candidato/${info.user.inválido}/minhas-candidaturas/${id}`)
  }

  const { data: candidatures, error, refresh, pending } = await useFetch('/api/candidatures', {
    method: 'GET',
    params: {
      candidate_id: info.user.id,
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }
  })

  if (error.value) {
  } else {
    candidaturesList.value = candidatures.value?.data || []
    totalPages.value = candidatures.value?.totalPages || 1
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">As suas candidaturas!</span>
        <span class="text-caption">Confira todas em um mesmo lugar</span>
      </div>
    </v-col>
  </v-row>

  <!-- Filtros -->
  <v-row no-gutters class="mt-5">
    <v-col cols="12" md="4" class="pr-md-2 mb-4 mb-md-0">
      <v-select
        v-model="selectedStatus"
        :items="candidaturaStatusOptions"
        item-title="name"
        item-value="name"
        label="Filtrar por status"
        clearable
        variant="outlined"
        hide-details
        class="mb-2"
        dense
        @update:modelValue="onStatusSelect"
      />
    </v-col>
  </v-row>

  <!-- Lista de candidaturas -->
  <v-row no-gutters class="mt-2">
    <v-col v-if="selectedStatus" cols="12" class="mb-2">
      <div class="d-flex align-center">
        <v-chip
          v-if="selectedStatus"
          class="bg-gradient-status"
          variant="flat"
        >
          <v-icon :icon="selectedIconStatus" start></v-icon>
          Status: <span class="text-subtitle-1 font-weight-bold ml-2">{{ selectedStatus }}</span>
        </v-chip>
      </div>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Candidaturas</v-list-subheader>

            <v-list-item
              v-for="item in candidaturesList"
              :key="item.id"
              style="min-height: unset"
            >
              <v-card class="pa-2 border" elevation="2" ripple hover @click="navigation(item.id)">
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">{{ item.title }}</div>
                    <div class="text-caption">{{ item.status }}</div>
                  </div>

                  <div class="text-caption text-grey-darken-1">{{ item.created_at_formatted }}</div>
                </div>
              </v-card>
            </v-list-item>

            <v-list-item v-if="candidaturesList.length === 0">
              <v-list-item-title class="text-body-2">Nenhuma candidatura encontrada.</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col>
      <v-pagination
        v-if="totalPages > 1"
        v-model="page"
        :length="totalPages"
        :total-visible="5"
        color="primary"
        class="my-4"
        rounded
      />
    </v-col>

  </v-row>
</template>

<style lang="scss" scoped>
</style>

