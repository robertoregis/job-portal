<script setup lang="ts">
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  const { notify } = useNotification();
  definePageMeta({
    layout: 'dashboard'
  })
  useHead({
    title: `Candidaturas - Conect One RH`,
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
  const job = ref<any>({})
  const statuses = [
    { code: 1, title: 'Desclassificado', icon: 'mdi-close-circle', count: 1 },
    { code: 2, title: 'Análise de Currículo', icon: 'mdi-magnify', count: 9 },
    { code: 3, title: 'Análise Comportamental', icon: 'mdi-account-search', count: 6 },
    { code: 4, title: 'Entrevita de Expectativa', icon: 'mdi-account-question', count: 3 },
    { code: 5, title: 'Pré-Selecionados', icon: 'mdi-progress-clock', count: 0 },
    { code: 6, title: 'Contratados', icon: 'mdi-check-circle', count: 8 }
  ]

  let idCounter = 1
  const candidaturesForTest: any[] = []

  statuses.forEach(status => {
    for (let i = 0; i < status.count; i++) {
      candidaturesForTest.push({
        id: idCounter++,
        candidate_name: `Candidato ${idCounter}`,
        title: `Vaga ${Math.ceil(Math.random() * 5)}`,
        code_status: status.code,
        status: status.title,
        icon_status: status.icon
      })
    }
  })

  const page = ref(1)
  const pageSize = ref(500)
  const totalPages = ref(1)
  const selectedStatus = ref<string | null>(null)
  const selectedIconStatus = ref<string>('')
  const candidaturesList = ref<any[]>([])
  const counts = ref<any>({
    total: 0,
    approved: 0,
    rejected: 0
  })

  const getJob = async () => {
    const { data, error } = await useFetch(`/api/jobs/${route.params.jobId}`, {
      method: 'GET',
    })
    if (error.value) {
      console.error('Erro ao buscar vaga:', error.value)
    } else {
      job.value = data.value
    }
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
      getJob()
    }
  }

  const navigation = (candidatureId: number, candidateId: string) => {
    router.push(`/dashboard/empresa/${info.user.id}/candidaturas/${candidatureId}/candidatos/${candidateId}`)
  }

  const { data: candidatures, error, refresh, pending } = await useFetch('/api/candidatures', {
    method: 'GET',
    params: {
      job_id: route.params.jobId,
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
    <LayoutButtonBack />
  </v-row>

  <v-row no-gutters class="mt-4">
    <v-col cols="12">
      <div class="d-flex">
        <h2 class="text-subtitle-1 font-weight-bold">{{ job.title }}</h2>
      </div>
    </v-col>
    <v-col cols="12 mt-2">
      <div class="d-flex flex-wrap">
        <v-card class="pa-2 text-center d-flex justify-center align-center mr-3 bg-gradient-primary" elevation="2" width="160" style="min-height: 40px">
          <div class="text-subtitle-1" style="line-height: 1.2;">Candidaturas</div>
          <div class="text-h4 font-weight-bold ml-3">{{ counts.total }}</div>
        </v-card>
      </div>
    </v-col>
  </v-row>

  <!-- Lista de candidaturas -->
  <v-row v-if="info.user.is_approved" no-gutters class="mt-4">
    <v-col cols="12">
      <v-row>
        <v-col
          v-for="status in statuses"
          :key="status.code"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-card>
            <v-card-title class="text-subtitle-1 font-weight-bold text-gradient-primary custom-subtitle-and-title">
              {{ status.title }}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-list style="min-height: 100px; max-height: 300px; overflow-y: auto;">
                <v-list-item
                  v-for="item in candidaturesList.filter((c: any) => c.code_status === status.code)"
                  :key="item.id"
                  style="min-height: unset"
                >
                  <v-card class="pa-2 border bg-card" elevation="2" ripple hover @click="navigation(item.id, item.candidate_id)">
                    <div class="d-flex justify-space-between align-start mb-1">
                      <div class="text-subtitle-1 font-weight-medium">{{ item.candidate_name }}</div>
                      <v-avatar size="30">
                        <v-img
                          alt=""
                          :src="`${item.candidate_image_url ? item.candidate_image_url : 'https://uhwfvrjhlhvxyrrlaqna.supabase.co/storage/v1/object/public/jobportal/default/blank-profile-picture-973460_640.png'}`"
                        ></v-img>
                      </v-avatar>
                    </div>
                    <div class="d-flex flex-column">
                      <div class="d-flex align-center">
                        <span class="text-caption">Pretensão:</span>
                        <span class="text-caption ml-2">{{ item.candidate_salary_expectations }}</span>
                      </div>
                      <div class="d-flex align-center mt-1">
                        <span class="text-caption">Endereço:</span>
                        <span class="text-caption ml-2">{{ item.candidate_address }}</span>
                      </div>
                    </div>
                  </v-card>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
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
