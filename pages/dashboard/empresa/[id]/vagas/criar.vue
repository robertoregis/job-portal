<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const vacancy = ref({
  cargo: '',
  type_contract: null,
  work_format: null,
  salary: '',
  workload: '',
  days: [],
  education_required: null,
  benefits: '',
  description: '',
  status: 'Aberta para inscrição',
  icon_status: 'mdi-briefcase-plus'
})

const tiposContrato = ['CLT', 'PJ', 'Freelancer', 'Estágio']
const work_formats = ['Presencial', 'Remoto', 'Híbrido']
const educations = [
  'Fundamental',
  'Médio',
  'Técnico',
  'Tecnólogo',
  'Superior',
  'Pós-graduação',
  'Mestrado',
  'Doutorado',
]
const days_of_week = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

const submit = () => {
  console.log('Vaga cadastrada:', vacancy.value)
  alert('Vaga salva com sucesso! 🎉')
}

const createJob = async () => {
  const newJob = {
    position: 'Developer',
    contract_type: 'Full-time',
    work_format: 'Remote',
    salary_range: '5000-7000',
    workload: '40h',
    weekdays: 'Mon-Fri',
    education_level: 'Bachelor',
    description: 'Vaga para desenvolvedor frontend.',
    is_active: true,
    is_closed: false,
    benefits: ['Health insurance', 'Home office'],
    company_id: 'abc123',
    status: 'Aberta para inscrição',
    icon_status: 'mdi-briefcase-plus'
  }

  const { data: createdJob, error } = await useFetch('/api/jobs', {
    method: 'POST',
    body: newJob
  })

  if (error.value) {
    console.error('Erro ao criar job:', error.value)
  } else {
    console.log('Job criado:', createdJob.value)
  }

}
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span>Olá, Nome do candidato!</span>
        <span class="text-caption font-weight-bold">Seja bem vindo ao seu dashboard</span>
      </div>
    </v-col>
  </v-row>
  <v-row class="mt-5">
    <v-col cols="12" class="border">
      <v-card>
        <v-card-title class="text-h6">
          Criar nova vaga
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="submit">
            <v-text-field
              v-model="vacancy.cargo"
              label="Cargo"
              density="compact"
              hide-details
              class="mb-3"
              required
            />

            <v-select
              v-model="vacancy.type_contract"
              :items="tiposContrato"
              label="Tipo de contrato"
              density="compact"
              hide-details
              class="mb-3"
              required
            />

            <v-select
              v-model="vacancy.work_format"
              :items="work_formats"
              label="Formato"
              density="compact"
              hide-details
              class="mb-3"
              required
            />

            <v-text-field
              v-model="vacancy.salary"
              label="Faixa salarial"
              placeholder="Ex: R$ 3.000 - R$ 5.000"
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-text-field
              v-model="vacancy.workload"
              label="Carga horária semanal"
              placeholder="Ex: 40h"
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-select
              v-model="vacancy.days"
              :items="days_of_week"
              label="Dias da semana"
              multiple
              chips
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-select
              v-model="vacancy.education_required"
              :items="educations"
              label="Escolaridade mínima"
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-textarea
              v-model="vacancy.benefits"
              label="Benefícios"
              placeholder="Ex: Vale transporte, alimentação, plano de saúde..."
              auto-grow
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-textarea
              v-model="vacancy.description"
              label="Descrição da vaga"
              placeholder="Conte mais sobre a oportunidade"
              auto-grow
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-btn
              color="primary"
              type="submit"
              class="mt-2"
              @click="createJob"
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
