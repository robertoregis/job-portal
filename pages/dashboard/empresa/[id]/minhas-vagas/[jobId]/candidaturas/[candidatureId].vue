<script setup lang="ts">
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  const { notify } = useNotification();
  definePageMeta({
    layout: 'dashboard'
  })
  const info: any = useInfo();
  const show = useShow();
  const { createNotice, createLog } = useNotice();
  const route = useRoute();
  const router = useRouter();
  const candidature = ref<any>({})
  const candidate = ref<any>({})

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

  const sendMail = async (candidateName: string, status: string, candidateEmail: string) => {
    const { data, error } = await useFetch('/api/emails/send', {
      method: 'POST',
      body: {
        to: [`${candidateName} <${candidateEmail}>`],
        subject: 'O status da sua candidatura mudou - Conect RH One',
        template: 'contact_email_candidate_template',
        variables: {
          name: candidateName,
          status: status
        }
      }
    })
  }

  const getCandidate = async (candidateId: string) => {
    const { data, error } = await useFetch(`/api/candidates/${candidateId}`, {
      method: 'GET',
    })

    if (error.value) {
    } else {
      candidate.value = data.value
    }
  }

  const updateCandidaturesStatus = async () => {
    show.setOverlayDashboard(true)
    const { data, error } = await useFetch(`/api/candidatures/${route.params.candidatureId}`, {
      method: 'PATCH',
      body: {
        status: candidature.value.status,
        icon_status: candidature.value.icon_status,
      }
    })

    if (error.value) {
      console.error('Erro ao atualizar candidatura:', error.value)
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao atualizar a candidatura', type: 'error' })
      return
    }
    sendMail(candidature.value.candidate_name, candidature.value.status, candidature.value.candidate_email)
    createLog({
      title: `Atualizou a candidatura`,
      profile_id: info.profile.id,
      type: 'update_candidature'
    })
    createNotice({
      title: 'Candidatura atualizada',
      description: `A candidatura do candidato ${candidature.value.candidate_name} teve seu status atualizado`,
      subtitle: 'Candidatura',
      profile_id: info.profile.id,
      type: 'info'
    })
    createNotice({
      title: 'Candidatura atualizada',
      description: `A sua candidatura da vaga ${candidature.value.title} teve o status atualizado para ${candidature.value.status}`,
      subtitle: 'Candidatura',
      profile_id: candidate.value.profile_id,
      type: 'info'
    })
    show.setOverlayDashboard(false)
    notify({ title: 'Parabéns!', text: 'A candidatura foi atualizada com sucesso', type: 'success' })
    //router.push(`/dashboard/empresa/${info.user.id}/minhas-vagas/${data.value.id}`)
  }

  const onStatusSelect = (selected: any) => {
    candidature.value.status = selected.name
    candidature.value.icon_status = selected.icon
  }

  const navigation = (id: number) => {
    router.push(`/dashboard/empresa/${info.user.id}/candidatos/${candidate.value.id}`)
  }

  const { data, error, pending } = await useFetch(`/api/candidatures/${route.params.candidatureId}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    candidature.value = data.value
    useHead({
      title: `${candidature.value.title} - Conect RH One`,
      meta: [
        {
            name: 'description',
            content: 'Veja as informações completas do candidato para esta vaga.'
        }
      ]
    })
    getCandidate(candidature.value.candidate_id)
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">{{ candidate.name }}</span>
        <span class="text-caption">Seja bem vindo ao seu dashboard</span>
      </div>
    </v-col>
  </v-row>
  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="border">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-briefcase</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Candidatura</h2>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="d-flex align-center">
                <v-chip
                  class="bg-gradient-status"
                  variant="flat"
                >
                  <v-icon :icon="candidature.icon_status" start></v-icon>
                  Status: <span class="text-subtitle-1 font-weight-bold ml-2">{{ candidature.status }}</span>
                </v-chip>
              </div>
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Candidato:</span>
                <span class="text-body-2 ml-2">{{ candidature.candidate_name }}</span>
              </div>
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Endereço:</span>
                <span class="text-body-2 ml-2">{{ candidature.address }}</span>
              </div>
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Data de criação:</span>
                <span class="text-body-2 ml-2">{{ candidature.created_at_formatted }}</span>
              </div>
            </v-col>
            <v-col cols="12">
              <v-btn class="mt-2 bg-gradient-primary" @click="navigation">
                Ver candidato
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-title>
          <h2 class="text-h6 font-weight-bold text-gradient-primary">Gerenciar status</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div class="d-flex flex-column align-start">
            <v-select
              :items="candidaturaStatusOptions"
              :value="candidature.status"
              item-title="name"
              return-object
              density="comfortable"
              variant="outlined"
              hide-details
              color="primary"
              @update:modelValue="onStatusSelect"
              width="240"
            />
            <v-btn class="mt-2 bg-gradient-primary" @click="updateCandidaturesStatus">
              Salvar
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

  </v-row>
</template>

<style scoped lang="scss">
// Estilo opcional
</style>
