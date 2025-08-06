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
</script>

<template>
  <v-row class="mt-5">
    <v-col cols="12" class="border">
      <v-card>
        <v-card-title class="text-h6">
          Cadastrar nova vaga
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
