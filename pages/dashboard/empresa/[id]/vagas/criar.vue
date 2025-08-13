<script setup lang="ts">
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  const { notify } = useNotification();

  definePageMeta({
    layout: 'dashboard'
  })
  useHead({
    title: `Criar vaga - Conect RH One`,
    meta: [
      {
          name: 'description',
          content: 'Publique uma nova vaga e encontre os candidatos ideais.'
      }
    ]
  })
  const info: any = useInfo();
  const show = useShow();
  const { createNotice, createLog } = useNotice();

  const router = useRouter();
  const job = ref({
    position: null,
    contract_type: null,
    work_format: null,
    salary: null,
    workload: null,
    weekdays: [],
    education_level: null,
    benefits: null,
    benefits_simple: null,
    undergraduate_areas: null,
    undergraduate_areas_simple: null,
    knowledge: null,
    knowledge_simple: null,
    description: null,
    status: 'Aberta para inscrição',
    icon_status: 'mdi-briefcase-plus',
    is_active: false,
    is_closed: false,
    update_fields_at: null
  })

  const contractTypes = ['CLT', 'PJ', 'Freelancer', 'Estágio']
  const work_formats = ['Presencial', 'Remoto', 'Híbrido']
  const educations = [
    'Ensino Fundamental',
    'Ensino Médio',
    'Ensino Técnico',
    'Tecnólogo',
    'Ensino Superior',
    'Pós-graduação',
    'Mestrado',
    'Doutorado',
  ]
  const days_of_week = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

  const createJob = async () => {
    show.setOverlayDashboard(true)
    let benefitsArray: any = job.value.benefits_simple
    if (job.value.benefits_simple) {
      benefitsArray = benefitsArray.split(',').map((b: any) => b.trim()).filter((b: any) => b.length > 0);
    }
    job.value.benefits = benefitsArray
    let undergraduate_areasArray: any = job.value.undergraduate_areas_simple
    if (job.value.undergraduate_areas_simple) {
      undergraduate_areasArray = undergraduate_areasArray.split(',').map((b: any) => b.trim()).filter((b: any) => b.length > 0);
    }
    job.value.undergraduate_areas = undergraduate_areasArray
    let knowledgeArray: any = job.value.knowledge_simple
    if (job.value.knowledge_simple) {
      knowledgeArray = knowledgeArray.split(',').map((b: any) => b.trim()).filter((b: any) => b.length > 0);
    }
    job.value.knowledge = knowledgeArray
    const { data, error } = await useFetch('/api/jobs', {
      method: 'POST',
      body: {
        ...job.value,
        company_id: info.user.id
      }
    })
    if (error.value) {
      console.error('Erro ao criar vaga:', error.value)
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao criar a vaga', type: 'error' })
    } else {
      createLog({
        title: `Criou a vaga`,
        profile_id: info.profile.id,
        type: 'create_job'
      })
      createNotice({
        title: 'Vaga criada',
        description: `Parabéns, você acabou de criar a vaga ${job.value.position}`,
        subtitle: 'Vaga',
        profile_id: info.profile.id,
        type: 'info'
      })
      show.setOverlayDashboard(false)
      notify({ title: 'Parabéns!', text: 'A vaga foi criada com sucesso', type: 'success' })
      router.push(`/dashboard/empresa/${info.user.id}/minhas-vagas/${data.value.id}`)
      resetJob()
    }
  }

  const resetJob = () => {
    job.value = {
      position: null,
      contract_type: null,
      work_format: null,
      salary: null,
      workload: null,
      weekdays: [],
      education_level: null,
      benefits: null,
      benefits_simple: null,
      undergraduate_areas: null,
      undergraduate_areas_simple: null,
      knowledge: null,
      knowledge_simple: null,
      description: null,
      status: 'Aberta para inscrição',
      icon_status: 'mdi-briefcase-plus',
      is_active: false,
      is_closed: false,
      update_fields_at: null
    }
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Criar vaga</span>
        <span class="text-caption">Aumente o seu time criando uma vaga</span>
      </div>
    </v-col>
  </v-row>
  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="border">
      <v-card>
        <v-card-title class="text-h6">
          Criar nova vaga
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="createJob">
            <v-text-field
              v-model="job.position"
              label="Cargo"
              density="compact"
              hide-details
              class="mb-3"
              required
            />

            <v-select
              v-model="job.contract_type"
              :items="contractTypes"
              label="Tipo de contrato"
              density="compact"
              hide-details
              class="mb-3"
              required
            />

            <v-select
              v-model="job.work_format"
              :items="work_formats"
              label="Formato"
              density="compact"
              hide-details
              class="mb-3"
              required
            />

            <v-text-field
              v-model="job.salary"
              label="Faixa salarial"
              placeholder="Ex: R$ 3.000 - R$ 5.000"
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-text-field
              v-model="job.workload"
              label="Carga horária semanal"
              placeholder="Ex: 40h"
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-select
              v-model="job.weekdays"
              :items="days_of_week"
              label="Dias da semana"
              multiple
              chips
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-select
              v-model="job.education_level"
              :items="educations"
              label="Escolaridade mínima"
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-textarea
              v-model="job.description"
              label="Descrição da vaga"
              placeholder="Conte mais sobre a oportunidade"
              auto-grow
              density="compact"
              hide-details
              class="mb-3"
            />

            <span class="text-caption mb-2">Os campos abaixo pode ser separados por vírgula (,)</span>

            <v-textarea
              v-model="job.benefits_simple"
              label="Benefícios"
              placeholder="Ex: Vale transporte, alimentação, plano de saúde..."
              auto-grow
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-textarea
              v-model="job.knowledge_simple"
              label="Conhecimentos"
              placeholder="Ex: Planilhas, Informática, Design..."
              auto-grow
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-textarea
              v-model="job.undergraduate_areas_simple"
              label="Áreas de graduação"
              placeholder="Ex: Engenharia, Robôtica..."
              auto-grow
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-btn
              type="submit"
              class="mt-2 bg-gradient-primary"
            >
              Salvar
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
// Se quiser customizar algo
</style>
