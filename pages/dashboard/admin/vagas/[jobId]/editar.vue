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
    'Departamento Pessoal', 'Fiscal', 'Segurança do Trabalho', 'Mecânica', 'Elétrica'
  ]

  const createRequestJob = async () => {
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
    const { data, error } = await useFetch(`/api/jobs/${job.value.id}`, {
      method: 'PUT',
      body: job.value
    })

    if (error.value) {
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao atualizar a vaga', type: 'error' })
      return
    }
    createLog({
      title: `Atualizou a vaga: ${job.value.title}`,
      profile_id: info.profile.id,
      type: 'update_job'
    })
    notify({ title: 'Parabéns!', text: 'A vaga foi atualiza com sucesso', type: 'success' })
    show.setOverlayDashboard(false)
    router.push(`/dashboard/admin/vagas/${job.value.id}`)
  }

  const { data, error, pending } = await useFetch(`/api/jobs/${route.params.jobId}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    job.value = data.value
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Editar vaga</span>
        <span class="text-caption">Esqueceu algo, edite a vaga</span>
      </div>
    </v-col>
    <LayoutButtonBack />
  </v-row>
  <v-row class="mt-5">
    <v-col cols="12" class="border">
      <v-card>
        <v-card-title class="text-h6">
          Editar vaga
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="createRequestJob">
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

            <div>
              <span class="font-weight-bold text-red-accent-4 text-caption">Campo especial:</span>
              <v-text-field
                v-model="job.company_name"
                label="Nome da empresa"
                placeholder=""
                density="compact"
                hide-details
                class="mb-3"
              />
            </div>

            <v-checkbox
              v-model="job.is_hidden_name_company"
              label="Ocultar dos candidatos o nome da empresa"
              hide-details
            />

            <v-checkbox
              v-model="job.is_hidden_salary"
              label="Ocultar dos candidatos o salário"
              hide-details
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
