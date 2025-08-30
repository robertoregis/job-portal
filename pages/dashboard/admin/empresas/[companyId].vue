<script setup lang="ts">
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  const { notify } = useNotification();
  definePageMeta({
    layout: 'dashboard'
  })
  const { createNotice, createLog } = useNotice();
  const show = useShow();
  const info: any = useInfo();
  const router = useRouter();
  const route = useRoute();
  const company = ref<any>({})

  const approvedCompany = async () => {
    show.setOverlayDashboard(true)
    const { data, error } = await useFetch(`/api/companies/${route.params.companyId}/change`, {
      method: 'PATCH',
      body: {
        is_approved: company.value.is_approved
      }
    })

    if (error.value) {
      console.error('Erro ao atualizar empresa:', error.value)
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao atualizar a empresa', type: 'error' })
      return
    }

    company.value = data.value
    createNotice({
      title: `Empresa ${company.value.is_approved ? 'aprovada' : 'não aprovada'}`,
      description: `A empresa ${company.value.name} foi ${company.value.is_approved ? 'aprovada' : 'desprovada'}`,
      subtitle: 'Empresa',
      profile_id: info.profile.id,
      is_master: true,
      type: 'info'
    })
    createLog({
      title: `${company.value.is_approved ? 'Aprovou' : 'Reprovou'} a empresa`,
      profile_id: info.profile.id,
      type: 'approved_company'
    })
    show.setOverlayDashboard(false)
    notify({ title: 'Parabéns!', text: `A empresa foi ${company.value.is_approved ? 'aprovada' : 'desprovada'} com sucesso`, type: 'success' })
    //router.push(`/dashboard/empresa/${info.user.id}/minhas-vagas/${data.value.id}`)
  }

  const { data, error, pending } = await useFetch(`/api/companies/${route.params.companyId}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    company.value = data.value
    useHead({
      title: `${company.value.name} - Conect One RH`,
      meta: [
        {
            name: 'description',
            content: 'Analise e aprove ou recuse o cadastro desta empresa.'
        }
      ]
    })
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Empresa</span>
        <span class="text-caption">Gerencia a sua aprovação</span>
      </div>
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="border">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-office-building</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Dados da empresa</h2>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <v-chip :color="company.is_approved === true ? 'success' : 'error'" variant="flat">
                <v-icon :icon="company.is_approved === true ? 'mdi-power' : 'mdi-power-off'" start></v-icon>
                {{ company.is_approved === true ? 'Aprovada' : 'Não aprovada' }}
              </v-chip>
            </v-col>
            <v-col cols="12 mt-2">
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Nome:</span>
                <span class="text-body-2 ml-2">{{ company.name }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Razão social:</span>
                <span class="text-body-2 ml-2">{{ company.legal_name }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">CNPJ:</span>
                <span class="text-body-2 ml-2">{{ company.cnpj }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Nome do representante:</span>
                <span class="text-body-2 ml-2">{{ company.representative_name }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">E-mail do representante:</span>
                <span class="text-body-2 ml-2">{{ company.representative_email }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">CPF do representante:</span>
                <span class="text-body-2 ml-2">{{ company.representative_cpf }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Endereço:</span>
                <span class="text-body-2 ml-2">{{ company.address }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card flat class="pa-4">
        <div class="d-flex align-center mb-4">
          <v-icon class="mr-2 text-gradient-primary">mdi-tune</v-icon>
          <h3 class="text-subtitle-1 font-weight-bold text-gradient-primary">Gerenciar a aprovação</h3>
        </div>

        <v-row>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-switch
              v-model="company.is_approved"
              :label="`${company.is_approved ? 'Aprovada' : 'Não aprovada'}`"
              color="success"
              inset
              hide-details
            />
          </v-col>

          <v-col cols="12">
            <v-btn class="mt-2 bg-gradient-primary" @click="approvedCompany">
              Salvar alterações
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
</style>
