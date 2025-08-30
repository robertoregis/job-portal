<script setup lang="ts">
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  const { notify } = useNotification();
  definePageMeta({
    layout: 'dashboard'
  })
  const router = useRouter();
  const route = useRoute();
  const info: any = useInfo();
  const show = useShow();
  const { createNotice, createLog } = useNotice();
  const job= ref<any>({})
  const counts = ref<any>({
    total: 0
  })

  const jobStatusOptions = [
    { name: 'Aberta para inscrição', icon: 'mdi-briefcase-plus' },
    { name: 'Inscrições encerradas', icon: 'mdi-briefcase-remove' },
    { name: 'Em processo seletivo', icon: 'mdi-briefcase-search' },
    { name: 'Encerramento próximo', icon: 'mdi-briefcase-check' },
    { name: 'Encerrada', icon: 'mdi-briefcase-off' },
    { name: 'Pausada', icon: 'mdi-pause-circle' },
    { name: 'Cancelada', icon: 'mdi-cancel' },
  ]

  const selectedStatus = ref(jobStatusOptions.find(o => o.name === job.value.status) || jobStatusOptions[0])

  const onStatusSelect = (selected: any) => {
    job.value.status = selected.name
    job.value.icon_status = selected.icon
    selectedStatus.value = selected
  }

  const getCounts = async () => {
    const { data, error } = await useFetch('/api/candidatures/countsforjob', {
      method: 'GET',
      params: { job_id: job.value.id }
    })
    if (error.value) {
      console.error('Erro ao buscar counts:', error.value)
    } else {
      counts.value.total = data.value?.total || 0
    }
  }

  const updateJobStatus = async () => {
    show.setOverlayDashboard(true)
    const { data, error } = await useFetch(`/api/jobs/${route.params.jobId}`, {
      method: 'PATCH',
      body: {
        status: job.value.status,
        icon_status: job.value.icon_status,
        is_active: job.value.is_active
      }
    })

    if (error.value) {
      console.error('Erro ao atualizar vaga:', error.value)
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao atualizar a vaga', type: 'error' })
      return
    }
    createLog({
      title: `Atualizou a vaga`,
      profile_id: info.profile.id,
      type: 'update_job'
    })
    job.value = data.value
    createNotice({
      title: 'Vaga atualizada',
      description: `A vaga ${job.value.title} teve seu status atualizado`,
      subtitle: 'Vaga',
      profile_id: info.profile.id,
      type: 'info'
    })
    show.setOverlayDashboard(false)
    notify({ title: 'Parabéns!', text: 'A vaga foi atualizada com sucesso', type: 'success' })
    //router.push(`/dashboard/empresa/${info.user.id}/minhas-vagas/${data.value.id}`)
  }

  const navigation = (id: number) => {
    router.push(`/dashboard/empresa/${info.user.id}/minhas-vagas/${route.params.jobId}/candidaturas`)
  }

  const { data, error, pending } = await useFetch(`/api/jobs/${route.params.jobId}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    job.value = data.value
    useHead({
      title: `${job.value.title} - Conect One RH`,
      meta: [
        {
            name: 'description',
            content: 'Veja detalhes e gerencie as candidaturas para esta vaga.'
        }
      ]
    })
    await getCounts()
  }

</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Vagas</span>
        <span class="text-caption">
          Confira todas as informações e gerencie esta vaga
        </span>
      </div>
    </v-col>
  </v-row>

  <v-row v-if="info.user.is_approved" no-gutters class="mt-5">
    <v-col cols="12">
      <div class="d-flex">
        <v-card hover ripple @click="navigation" class="pa-2 text-center d-flex flex-column justify-center align-center mr-3 bg-gradient-primary" elevation="2" width="180" style="min-height: 100px">
            <div class="text-h6" style="line-height: 1.2;">Candidaturas</div>
            <div class="text-h3 font-weight-bold">{{ counts.total }}</div>
          </v-card>
      </div>
    </v-col>
    <v-col cols="12" class="mt-4">
      <div class="d-flex align-center">
        <v-chip
          class="ma-2 bg-gradient-status"
          variant="flat"
        >
          <v-icon :icon="job.icon_status" start></v-icon>
          Status: <span class="text-subtitle-1 font-weight-bold ml-2">{{ job.status }}</span>
        </v-chip>
        <v-chip
            class="ma-2"
            :color="`${job.is_active ? 'success' : 'error'}`"
            variant="flat"
          >
          <v-icon :icon="`${job.is_active ? 'mdi-power' : 'mdi-power-off'}`" start></v-icon>
          {{ job.is_active ? 'Ativada' : 'Desativada' }}
        </v-chip>
      </div>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-row no-gutters>
        <v-col cols="12" class="px-4 pa-2">
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-briefcase</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Informações da vaga</h2>
          </div>
        </v-col>

        <v-col cols="12" class="px-4 pa-2">
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Cargo:</span>
            <span class="text-body-2 ml-2">{{ job.title }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Tipo de contrato:</span>
            <span class="text-body-2 ml-2">{{ job.contract_type }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Formato:</span>
            <span class="text-body-2 ml-2">{{ job.work_format }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Faixa salarial:</span>
            <span class="text-body-2 ml-2">{{ job.salary }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Carga horária:</span>
            <span class="text-body-2 ml-2">{{ job.workload }}</span>
          </div>
          <div class="d-flex flex-column flex-md-row align-start align-md-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Dias da semana:</span>
            <div class="d-flex flex-wrap mt-1 mt-md-0 ml-md-2">
              <template v-for="(day, index) in job.weekdays" :key="index">
                <v-chip color="primary" variant="flat" :ripple="false" class="text-body-2 mb-1 mb-md-0 mr-1">
                  {{day}}
                </v-chip>
              </template>
            </div>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Escolaridade mínima:</span>
            <span class="text-body-2 ml-2">{{ job.education_level }}</span>
          </div>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-list>
        <v-list-item class="mt-2" style="min-height: unset">
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1 font-weight-bold">Descrição da vaga</v-list-item-title>
            <span class="text-body-2">
              {{ job.description }}
            </span>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="mt-2" style="min-height: unset">
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1 font-weight-bold">Benefícios</v-list-item-title>
            <ul>
              <template v-for="(benefit, index) in job.benefits" :key="index">
                <li class="text-body-2">- {{ benefit }};</li>
              </template>
            </ul>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="mt-2" style="min-height: unset">
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1 font-weight-bold">Conhecimentos</v-list-item-title>
            <ul>
              <template v-for="(knowledge, index) in job.knowledge" :key="index">
                <li class="text-body-2">- {{ knowledge }};</li>
              </template>
            </ul>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="mt-2" style="min-height: unset">
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1 font-weight-bold">Áreas de graduação</v-list-item-title>
            <ul>
              <template v-for="(area, index) in job.undergraduate_areas" :key="index">
                <li class="text-body-2">- {{ area }};</li>
              </template>
            </ul>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>

    <!-- NOVA SEÇÃO: Controles de status e ativação -->
    <v-col cols="12" class="border mt-4">
      <v-card flat class="pa-4">
        <div class="d-flex align-center mb-4">
          <v-icon class="mr-2 text-gradient-primary">mdi-tune</v-icon>
          <h3 class="text-subtitle-1 font-weight-bold text-gradient-primary">Gerenciar status da vaga</h3>
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <v-select
              :items="jobStatusOptions"
              v-model="selectedStatus"
              item-title="name"
              return-object
              density="comfortable"
              variant="outlined"
              hide-details
              color="primary"
              @update:modelValue="onStatusSelect"
            />
          </v-col>

          <v-col cols="12" md="6" class="d-flex align-center">
            <v-switch
              v-model="job.is_active"
              :label="`${job.is_active ? 'Ativada' : 'Desativada'}`"
              color="success"
              inset
              hide-details
            />
          </v-col>

          <v-col cols="12">
            <v-btn class="mt-2 bg-gradient-primary" @click="updateJobStatus">
              Salvar alterações
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-col cols="12" class="mt-4">
      <div class="d-flex">
        <v-btn
          text="Editar vaga"
          variant="flat"
          class="bg-gradient-primary"
          @click="$router.push(`/dashboard/empresa/123/minhas-vagas/${route.params.jobId}/editar`)"
        />
      </div>
    </v-col>

  </v-row>
</template>

<style scoped lang="scss">
// Estilo leve para visual
</style>
