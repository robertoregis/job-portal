<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  definePageMeta({
    layout: 'dashboard'
  })

  const router = useRouter()
  const info: any = useInfo();
  const jobsList = ref<any[]>([])
  const noticesList = ref<any[]>([])
  const counts = ref<any>({
    total: 0,
    open: 0,
    closedSignup: 0,
    ended: 0
  })

  const navigation = (link: any) => {
    router.push(link)
  }

  const getCounts = async () => {
    const { data, error } = await useFetch('/api/jobs/counts', {
      method: 'GET',
      params: { company_id: info.user.id }
    })
    if (error.value) {
      console.error('Erro ao buscar counts:', error.value)
    } else {
      counts.value = data.value || { total: 0, open: 0, closedSignup: 0, ended: 0 }
      getNotices()
    }
  }

  const getNotices = async () => {
    const params: Record<string, any> = {
      page: 1,
      pageSize: 3
    }

    // Filtro por empresa (se houver)
    if (info.profile.id) {
      params.profile_id = info.profile.id
    }

    const { data, error } = await useFetch('/api/notices', {
      method: 'GET',
      params
    })

    if (error.value) {
      console.error('Erro ao carregar candidaturas:', error.value)
    } else {
      noticesList.value = data.value?.data || []
    }
  }

  const { data: jobs, error, refresh, pending } = await useFetch('/api/jobs', {
    method: 'GET',
    params: {
      candidate_id: info.user.id,
      page: 1,
      pageSize: 3
    }
  })

  if (error.value) {
  } else {
    jobsList.value = jobs.value?.data || []
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
        <v-col cols="12" sm="6" md="4">
          <v-card
            hover
            ripple
            @click="navigation('/dashboard/empresa/123/minhas-vagas')"
            class="pa-2 text-center d-flex flex-column justify-center align-center bg-gradient-primary"
            elevation="2"
            style="min-height: 120px;"
          >
            <div class="text-h6" style="line-height: 1.2;">Vagas abertas para inscrição</div>
            <div class="text-h3 font-weight-bold">{{ counts.open }}</div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-card
            class="pa-2 text-center d-flex flex-column justify-center align-center border border-secondary"
            elevation="2"
            style="min-height: 120px;"
          >
            <div class="text-gradient-primary text-h6" style="line-height: 1.2;">Vagas inscrições encerradas</div>
            <div class="text-gradient-primary text-h3 font-weight-bold">{{ counts.closedSignup }}</div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-card
            class="pa-2 text-center d-flex flex-column justify-center align-center bg-gradient-primary"
            elevation="2"
            style="min-height: 120px;"
          >
            <div class="text-h6" style="line-height: 1.2;">Vagas encerradas</div>
            <div class="text-h3 font-weight-bold">{{ counts.ended }}</div>
          </v-card>
        </v-col>
      </v-row>

    </v-col>

    <v-col cols="12 mt-4">
      <div class="d-flex">
        <v-btn
          color="primary"
          text="Criar vaga"
          variant="flat"
          @click="$router.push(`/dashboard/empresa/${info.user.name}/vagas/criar`)"
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
              class="py-3"
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
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Vagas recentes</v-list-subheader>

            <v-list-item
              v-for="job in jobsList"
              :key="job.id"
              style="min-height: unset"
            >
              <v-card
                class="pa-2 border mb-2"
                elevation="2"
                ripple
                hover
                @click="navigation(`/dashboard/empresa/${info.user.id}/minhas-vagas/${job.id}`)"
              >
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">
                      {{ job.position }}
                    </div>
                    <div class="text-caption text-grey">
                      Status: {{ job.status }} | Ativa: {{ job.is_active ? 'Sim' : 'Não' }}
                    </div>
                  </div>

                  <div class="text-caption text-grey-darken-1">
                    {{ job.created_at_formatted }}
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

