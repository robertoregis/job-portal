<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { formatDate } from '@/composables/formatDate';
  definePageMeta({
    layout: 'dashboard',
  })
  useHead({
    title: `Vagas abertas - Conect One RH`,
    meta: [
      {
        name: 'description',
        content: 'Encontre as vagas aberta e publicadas na Conect One RH.'
      }
    ]
  })
  const info: any = useInfo();
  const router = useRouter()
  const page = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(1)
  const jobsList = ref<any[]>([])

  watch(page, () => {
    getJobs()
  })

  // Navegação
  const navigation = (id: number) => {
    window.open(`/vagas/${id}`, '_blank');
  }

  const getJobs = async () => {
    const params: Record<string, any> = {
      page: page.value.toString(),
      pageSize: pageSize.value.toString(),
      is_active: true,
      is_closed: false
    }

    const { data, error } = await useFetch('/api/jobs', {
      method: 'GET',
      params
    })

    if (error.value) {
      //console.error('Erro ao carregar vagas:', error.value)
    } else {
      jobsList.value = data.value?.data || []
      totalPages.value = data.value?.totalPages || 1
    }
  }

  const { data: jobs, error, refresh, pending } = await useFetch('/api/jobs', {
    method: 'GET',
    params: {
      page: page.value.toString(),
      pageSize: pageSize.value.toString(),
      is_active: true,
      is_closed: false
    }
  })

  if (error.value) {
    //console.error('Erro ao carregar jobs:', error.value)
  } else {
    console.log(jobs.value)
    jobsList.value = jobs.value?.data || []
    totalPages.value = jobs.value?.totalPages || 1
  }

</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Vagas abertas!</span>
        <span class="text-caption">Confira todas as vagas abertas que foram publicadas.</span>
      </div>
    </v-col>
    <LayoutButtonBack />
  </v-row>

  <!-- Lista de vagas -->
  <v-row no-gutters>
    <v-col cols="12" class="mt-4">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Vagas</v-list-subheader>

            <v-list-item v-if="jobsList.length === 0" class="px-4 text-grey">
              Nenhuma vaga aberta encontrada.
            </v-list-item>

            <v-list-item
              v-for="job in jobsList"
              :key="job.id"
              style="min-height: unset"
            >
              <v-card
                class="pa-3 border mb-3"
                :class="!job.is_active ? 'opacity-50' : ''"
                elevation="2"
                ripple
                hover
                @click="navigation(job.id)"
              >
                <div class="d-flex justify-space-between align-start mb-1">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">{{ job.title }}</div>
                    <div class="d-flex align-center text-caption text-grey-darken-1">
                        <span class="mr-2">
                            {{ job.company_name || 'Empresa não informada' }}
                        </span>
                        
                        <v-chip
                            v-if="!job.company_id" 
                            color="red-lighten-1"
                            density="compact"
                            class="ml-2 font-weight-bold"
                            size="x-small"
                        >
                            <v-icon start size="14">mdi-alert-circle-outline</v-icon>
                            SEM VÍNCULO
                        </v-chip>
                    </div>
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    {{ formatDate(new Date(job.created_at), 3) }}
                  </div>
                </div>

                <div class="d-flex flex-wrap gap-3 mb-2">
                  <v-chip
                    small
                    color="primary"
                    text-color="white"
                    variant="tonal"
                    class="mb-1 mr-1"
                  >
                    <v-icon left size="16">mdi-clock-outline</v-icon>
                    {{ job.workload || 'Carga horária não informada' }}
                  </v-chip>

                  <v-chip
                    small
                    color="green"
                    text-color="white"
                    variant="tonal"
                    class="mb-1 mr-1"
                  >
                    <v-icon left size="16">mdi-cash-multiple</v-icon>
                    {{ job.salary || 'Faixa salarial não informada' }}
                  </v-chip>

                  <v-chip
                    small
                    color="indigo"
                    text-color="white"
                    variant="tonal"
                    class="mb-1 mr-1"
                  >
                    <v-icon left size="16">mdi-school-outline</v-icon>
                    {{ job.education_level || 'Escolaridade não informada' }}
                  </v-chip>

                  <v-chip
                    small
                    color="deep-purple"
                    text-color="white"
                    variant="tonal"
                    class="mb-1 mr-1"
                  >
                    <v-icon left size="16">mdi-laptop</v-icon>
                    {{ job.work_format || 'Formato de trabalho não informado' }}
                  </v-chip>

                  <v-chip
                    small
                    color="orange"
                    text-color="white"
                    variant="tonal"
                    class="mb-1 mr-1"
                  >
                    <v-icon left size="16">mdi-file-document-outline</v-icon>
                    {{ job.contract_type || 'Tipo de contrato não informado' }}
                  </v-chip>
                </div>

                <div class="text-caption text-grey">
                  Status: {{ job.status }} | Ativa: {{ job.is_active ? 'Sim' : 'Não' }}
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
