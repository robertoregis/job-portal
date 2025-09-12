<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  definePageMeta({
    layout: 'dashboard'
  })
  useHead({
    title: `Dashboard - Conect One RH`,
    meta: [
      {
        name: 'description',
        content: 'Acompanhe estatísticas e informações gerais sobre vagas, empresas e candidatos.'
      }
    ]
  })
  const router = useRouter()
  const info: any = useInfo();
  const companiesList = ref<any[]>([])
  const noticesList = ref<any[]>([])
  const counts = ref<any>({
    companies: 0,
    candidates: 0,
    jobs: 0,
    candidatures: 0
  })

  const navigation = (link: any) => {
    router.push(link)
  }

  const getCounts = async () => {
    const { data, error } = await useFetch('/api/dashboard', {
      method: 'GET',
      params: {}
    })
    if (error.value) {
    } else {
      counts.value = data.value || { companies: 0, candidates: 0, jobs: 0, candidatures: 0 }
      getNotices()
    }
  }

  const getNotices = async () => {
    const params: Record<string, any> = {
      page: 1,
      pageSize: 3,
      profile_id: info.profile.id,
      is_master: true
    }

    const { data, error } = await useFetch('/api/notices', {
      method: 'GET',
      params
    })

    if (error.value) {
      //console.error('Erro ao carregar os avisos:', error.value)
    } else {
      noticesList.value = data.value?.data || []
    }
  }

  const { data: companies, error, refresh, pending } = await useFetch('/api/companies', {
    method: 'GET',
    params: {
      page: 1,
      pageSize: 3
    }
  })

  if (error.value) {
  } else {
    companiesList.value = companies.value?.data || []
    await getCounts()
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bol">Olá, {{ info.user.name }}!</span>
        <span class="text-caption">Seja bem vindo ao seu dashboard</span>
      </div>
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-5">
    <v-col cols="12">
      <v-row dense>
        <v-col cols="12" sm="6" lg="3">
          <v-card
            class="pa-4 text-center bg-gradient-primary"
            elevation="2"
            style="min-height: 120px;"
          >
            <div class="text-h6">Empresas</div>
            <div class="text-h3 font-weight-bold">{{ counts.companies }}</div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card
            class="pa-4 text-center border border-secondary"
            elevation="2"
            style="min-height: 120px;"
          >
            <div class="text-h6 text-gradient-primary">Candidatos</div>
            <div class="text-h3 font-weight-bold text-gradient-primary">{{ counts.candidates }}</div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card
            class="pa-4 text-center bg-gradient-primary"
            elevation="2"
            style="min-height: 120px;"
          >
            <div class="text-h6">Vagas</div>
            <div class="text-h3 font-weight-bold">{{ counts.jobs }}</div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card
            class="pa-4 text-center border border-secondary"
            elevation="2"
            style="min-height: 120px;"
          >
            <div class="text-h6 text-gradient-primary">Candidaturas</div>
            <div class="text-h3 font-weight-bold text-gradient-primary">{{ counts.candidatures }}</div>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12 mt-4">
      <div class="d-flex">
        <v-btn
          color="primary"
          text="Ver empresas"
          variant="flat"
          @click="$router.push(`/dashboard/admin/empresas`)"
        />
      </div>
    </v-col>

    <v-col cols="12" class="mt-4 border">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Últimos avisos</v-list-subheader>

            <v-list-item
              v-for="notice in noticesList"
              :key="notice.id"
              class="py-3 bg-orange-accent-1"
            >
              <v-list-item-title class="text-caption font-weight-bold">
                {{ notice.title }}
              </v-list-item-title>

              <v-list-item-subtitle class="text-body-2">
                {{ notice.description }}
              </v-list-item-subtitle>

              <template v-slot:append="{ isSelected }">
                <v-list-item-action class="flex-column align-end">
                  <small class="mb-4 opacity-60">{{ notice.created_at_formatted }}</small>
                </v-list-item-action>
              </template>
            </v-list-item>

          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" class="mt-4 border">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Empresas recentes</v-list-subheader>

            <v-list-item
              v-for="company in companiesList"
              :key="company.id"
              style="min-height: unset"
            >
              <v-card
                class="pa-2 border mb-2"
                elevation="2"
                ripple
                hover
                @click="navigation(`/dashboard/admin/empresas/${company.id}`)"
              >
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">
                      {{ company.name }}
                    </div>
                    <div class="text-caption text-grey">
                      Status: {{ company.status }} | Aprovado: {{ company.is_approved ? 'Sim' : 'Não' }}
                    </div>
                  </div>

                  <div class="text-caption text-grey-darken-1">
                    {{ company.created_at_formatted }}
                  </div>
                </div>
              </v-card>
            </v-list-item>

          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
</style>

