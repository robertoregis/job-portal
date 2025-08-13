<script setup lang="ts">
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  const { notify } = useNotification();
  definePageMeta({
    layout: 'dashboard'
  })
  useHead({
    title: `Candidaturas - Conect RH One`,
    meta: [
      {
        name: 'description',
        content: 'Confira todos os candidatos que se inscreveram nesta vaga.'
      }
    ]
  })
  const info: any = useInfo();
  const show = useShow();
  const { createNotice } = useNotice();
  const route = useRoute();
  const router = useRouter()

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
  const page = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(1)
  const selectedStatus = ref<string | null>(null)
  const selectedIconStatus = ref<string>('')
  const candidaturesList = ref<any[]>([])
  const counts = ref<any>({
    total: 0,
    approved: 0,
    rejected: 0
  })

  const getFormatDate = (date: string) => {
    if (!date) return ''
    const parts = date.split('-') // ["yyyy", "mm", "dd"]
    if (parts.length !== 3) return date

    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  }

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
      params.job_id = route.params.jobId
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

  const getCounts = async () => {
    const { data, error } = await useFetch('/api/candidatures/countsforjob', {
      method: 'GET',
      params: { job_id: route.params.jobId }
    })
    if (error.value) {
      console.error('Erro ao buscar counts:', error.value)
    } else {
      counts.value = data.value || { total: 0, approved: 0, rejected: 0 }
    }
  }

  const navigation = (id: number) => {
    router.push(`/dashboard/empresa/${info.user.id}/minhas-vagas/${route.params.jobId}/candidaturas/${id}`)
  }

  const { data: candidatures, error, refresh, pending } = await useFetch('/api/candidatures', {
    method: 'GET',
    params: {
      job_id: route.params.jobId,
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }
  })
          
  if (error.value) {
  } else {
    candidaturesList.value = candidatures.value?.data || []
    totalPages.value = candidatures.value?.totalPages || 1
    await getCounts()
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Candidaturas da vaga</span>
        <span class="text-caption">Confira os candidatos inscritos nesta vaga</span>
      </div>
    </v-col>
  </v-row>

  <!-- Filtros -->
  <v-row no-gutters class="mt-5">
    <v-col cols="12">
      <div class="d-flex flex-wrap">
        <v-card class="pa-2 text-center d-flex flex-column justify-center align-center mr-3 bg-gradient-primary" elevation="2" width="160" style="min-height: 80px">
          <div class="text-subtitle-1" style="line-height: 1.2;">Candidaturas</div>
          <div class="text-h4 font-weight-bold">{{ counts.total }}</div>
        </v-card>
        <v-card class="pa-2 text-center d-flex flex-column justify-center align-center mr-3 bg-gradient-primary" elevation="2" width="160" style="min-height: 80px">
          <div class="text-subtitle-1" style="line-height: 1.2;">Candidaturas aprovadas</div>
          <div class="text-h4 font-weight-bold">{{ counts.approved }}</div>
        </v-card>
        <v-card class="pa-2 text-center d-flex flex-column justify-center align-center mr-3 bg-gradient-primary" elevation="2" width="160" style="min-height: 80px">
          <div class="text-subtitle-1" style="line-height: 1.2;">Candidaturas rejeitadas</div>
          <div class="text-h4 font-weight-bold">{{ counts.rejected }}</div>
        </v-card>
      </div>
    </v-col>
    <v-col cols="12" md="4" class="mt-4">
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
  <v-row no-gutters class="mt-4">
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
                <div class="d-flex justify-space-between align-start mb-2">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">{{ item.title }}</div>
                    <div class="text-caption  text-grey">Status: {{ item.status }}</div>
                  </div>

                  <div class="text-caption text-grey-darken-1">{{ item.created_at_formatted }}</div>
                </div>
                <div class="d-flex flex-wrap gap-3 mb-2">
                  <v-chip
                    small
                    color="orange"
                    text-color="white"
                    variant="tonal"
                    class="mb-1 mr-1"
                  >
                    <v-icon left size="16">mdi-account-heart</v-icon>
                    {{ item.candidate_marital_status || 'Estado civil não informado' }}
                  </v-chip>

                  <v-chip
                    small
                    color="teal"
                    text-color="white"
                    variant="tonal"
                    class="mb-1 mr-1"
                  >
                    <v-icon left size="16">mdi-cake</v-icon>
                    {{ item.candidate_birth_date ? getFormatDate(item.candidate_birth_date) : 'Data de nascimento não informada' }}
                  </v-chip>
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
.cd {
  background: #b2670c;
}
</style>
