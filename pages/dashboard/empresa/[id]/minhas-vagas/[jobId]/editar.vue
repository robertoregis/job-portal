<script setup lang="ts">
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  const { notify } = useNotification();
  definePageMeta({
    layout: 'dashboard'
  })
  useHead({
    title: `Conect One RH`,
    meta: [
      {
        name: 'description',
        content: 'A Conect One RH conecta empresas e candidatos de forma prática e eficiente. Encontre oportunidades ou talentos sem sair de casa.'
      }
    ]
  })
  const info: any = useInfo();
  const show = useShow();
  const { createNotice, createLog } = useNotice();
  const route = useRoute();
  const router = useRouter();
  const job = ref<any>({})
  const motive_edit = ref<string>('')
  const dialogRequest = ref<boolean>(false)
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
  const undergraduateAreasList = [
    'Administrativa', 'Corporativa', 'Financeira', 'Comercial',
    'Marketing', 'Recursos Humanos', 'Operacional', 'Logística',
    'Tecnologia da Informação', 'Jurídica', 'Compras', 'Suprimentos',
    'Departamento Pessoal', 'Fiscal'
  ]

  const jobsEditList = ref<any[]>([])
  const getJobsEdit = async () => {
    const params: Record<string, any> = {
      page: 1,
      pageSize: 3,
      jobs_edit: job.value.id
    }

    const { data, error } = await useFetch('/api/jobs_edit', {
      method: 'GET',
      params
    })
    if (error.value) {
      //console.error('Erro ao carregar os pedidos de edição:', error.value)
    } else {
      jobsEditList.value = data.value?.data || []
    }
  }

  const createRequestJob = async () => {
    if(!motive_edit.value) {
      notify({ title: 'Erro', text: 'É preciso dizer o motivo', type: 'error' })
      return
    }
    show.setOverlayDashboard(true)
    let benefitsArray: any = job.value.benefits_simple
    if (job.value.benefits_simple) {
      benefitsArray = benefitsArray.split(',').map((b: any) => b.trim()).filter((b: any) => b.length > 0);
      job.value.benefits = benefitsArray
    } else {
      job.value.benefits = []
    }
    let knowledgeArray: any = job.value.knowledge_simple
    if (job.value.knowledge_simple) {
      knowledgeArray = knowledgeArray.split(',').map((b: any) => b.trim()).filter((b: any) => b.length > 0);
      job.value.knowledge = knowledgeArray
    } else {
      job.value.knowledge = []
    }
    const { data, error } = await useFetch(`/api/jobs_edit`, {
      method: 'POST',
      body: {
        job_data: job.value,
        profile_id: info.profile.id,
        job_id: job.value.id,
        company_id: job.value.company_id,
        motive_edit: motive_edit
      }
    })

    if (error.value) {
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao atualizar a vaga', type: 'error' })
      return
    }
    createLog({
      title: `Criou uma atualização para a vaga: ${job.value.title}`,
      profile_id: info.profile.id,
      type: 'create_job_edit'
    })
    notify({ title: 'Parabéns!', text: 'O pedido para atualizar a vaga foi criado', type: 'success' })
    show.setOverlayDashboard(false)
    router.push(`/dashboard/empresa/${info.user.id}/minhas-vagas/${job.value.id}`)
  }

  const { data, error, pending } = await useFetch(`/api/jobs/${route.params.jobId}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    job.value = data.value
    getJobsEdit()
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Editar vaga</span>
        <span class="text-caption">Esqueceu algo, edite a sua vaga</span>
      </div>
    </v-col>
    <LayoutButtonBack />
  </v-row>
  <v-row v-if="jobsEditList.length > 0">
    <v-col cols="12">
      <div class="d-flex align-center mb-2">
        <span class="bg-warning py-1 px-2 mt-1">Existe pedido de edição pendente</span>
      </div>
    </v-col>
  </v-row>
  <v-row v-if="info.user.is_approved" class="mt-5">
    <v-col cols="12" class="border">
      <v-card>
        <v-card-title class="text-h6">
          Editar vaga
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="dialogRequest = true">
            <v-text-field
              v-model="job.title"
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

            <v-select
              v-model="job.undergraduate_areas"
              :items="undergraduateAreasList"
              label="Áreas de graduação"
              multiple
              chips
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
  <v-dialog
    v-model="dialogRequest"
    max-width="400"
    persistent
  >
    <v-card
      title="Criar pedido de edição"
    >
      <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <p class="text-body-2 mb-1">Para editar uma vaga ela precisa ser aprovada pela nossa equipe para evitar problemas futuros.</p>
              <p class="text-body-2">Nos informe o motivo e o que foi editado.</p>
            </v-col>
            <v-col cols="12 mt-1">
                <v-textarea
                v-model="motive_edit"
                label="Motivo"
                variant="filled"
                auto-grow
                density="compact"
                hide-details
                class="mb-1"
                />
            </v-col>
          </v-row>
      </v-card-text>

      <v-divider />
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn color="error" variant="flat" @click="dialogRequest = false">
          Cancelar
        </v-btn>

        <v-btn color="success" variant="flat" @click="createRequestJob">
          Criar
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
// Se quiser customizar algo
</style>
