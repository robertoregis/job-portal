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

  const updateJob = async () => {
    show.setOverlayDashboard(true)
    let benefitsArray: any = job.value.benefits_simple
    if (job.value.benefits) {
      benefitsArray = benefitsArray.split(',').map((b: any) => b.trim()).filter((b: any) => b.length > 0);
    }
    job.value.benefits = benefitsArray
    const { data, error } = await useFetch(`/api/jobs/${route.params.jobId}`, {
      method: 'PUT',
      body: job.value
    })

    if (error.value) {
      console.error('Erro ao atualizar vaga:', error.value)
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao atualizar a vaga', type: 'error' })
      return
    }
    createLog({
      title: `Atualizou o perfil`,
      profile_id: info.profile.id,
      type: 'update_perfil'
    })
    show.setOverlayDashboard(false)
    notify({ title: 'Parabéns!', text: 'A vaga foi atualizada com sucesso', type: 'success' })
    router.push(`/dashboard/empresa/${info.user.id}/minhas-vagas/${data.value.id}`)
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
        <span class="text-caption">Esqueceu algo, edite a sua vaga</span>
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
          <v-form @submit.prevent="updateJob">
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
