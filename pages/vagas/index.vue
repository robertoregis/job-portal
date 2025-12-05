<script setup lang="ts">
  import { useInfo } from '#imports';
  const page = ref(1)
  const pageSize = ref(12)
  const totalPages = ref(1)
  const jobsList = ref<any[]>([])

  definePageMeta({
    layout: 'default' // ou outro nome, conforme os arquivos em layouts/
  })
  useHead({
    title: `Vagas - Conect One RH`,
    meta: [
      {
          name: 'description',
          content: 'Confira todas as oportunidades disponíveis na Conect One RH e encontre a vaga ideal para o seu perfil.'
      }
    ]
  })
  const info: any = useInfo();

  const dateCreated = [
    'Últimos 7 dias',
    'Últimos 30 dias',
    'Últimos 90 dias',
    'Mais de 90 dias'
  ]

  const selectedState = ref<string | null>(null)
  const selectedData = ref<string | null>(null)

  watch([selectedState, selectedData], () => {
    page.value = 1
    getJobs()
  })

  watch(page, () => {
    getJobs()
  })

  const getJobs = async () => {
    const params: Record<string, any> = {
      is_active: true,
      is_closed: false,
      page: page.value.toString(),
      pageSize: pageSize.value.toString(),
    }

    if (selectedState.value) {
      params.state = selectedState.value
    }

    if (selectedData.value) {
      // Passar um código para o backend saber o filtro de tempo:
      // Pode enviar algo simples como:
      // "7", "30", "90", "90+" para os períodos.
      switch (selectedData.value) {
        case 'Últimos 7 dias':
          params.createdWithinDays = 7
          break
        case 'Últimos 30 dias':
          params.createdWithinDays = 30
          break
        case 'Últimos 90 dias':
          params.createdWithinDays = 90
          break
        case 'Mais de 90 dias':
          params.createdMoreThanDays = 90
          break
      }
    }

    const { data, error } = await useFetch('/api/jobs', {
      method: 'GET',
      params
    })

    if (error.value) {
    } else {
      jobsList.value = data.value?.data || []
      totalPages.value = data.value?.totalPages || 1
    }
  }

  const { data: jobs, error, refresh, pending } = await useFetch('/api/jobs', {
    method: 'GET',
    params: {
      is_active: true,
      is_closed: false,
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }
  })

  if (error.value) {
  } else {
    jobsList.value = jobs.value?.data || []
    totalPages.value = jobs.value?.totalPages || 1
  }
</script>

<template>
  <main>
    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12">
                <h2 class="mb-0">Filtros</h2>
              </v-col>
              <v-col cols="12" class="">
                <div class="d-flex flex-wrap gap-3">
                  <v-select
                    v-model="selectedData"
                    :items="dateCreated"
                    label="Data de publicação"
                    clearable
                    dense
                    variant="outlined"
                    hide-details
                    style="max-width: 220px"
                    class="w-100 my-1 mr-2"
                  />
                  <!--<v-select
                    v-model="selectedState"
                    :items="states"
                    label="Estado"
                    clearable
                    dense
                    variant="outlined"
                    hide-details
                    style="max-width: 200px"
                    class="w-100 my-1 mr-2"
                  />-->
                </div>
              </v-col>
            </v-row>
          </v-col>

          <!--<v-col v-if="!Object.keys(info.user || {}).length || info.user.type === 'company'" cols="12">
            <div class="d-flex align-center">
              <v-btn
                class="bg-gradient-primary"
                text="Cadastre uma vaga"
                variant="flat"
              ></v-btn>
            </div>
          </v-col>-->

          <v-col v-if="jobsList.length > 0" cols="12">
            <v-row>
              <template v-for="(job, indice) in jobsList" :key="indice">
                <JobsJob :job="job" />
              </template>
            </v-row>
          </v-col>
          <v-col v-else cols="12" class="text-center">
            <v-sheet
              class="d-flex flex-column align-center justify-center pa-8"
              rounded
              style="min-height: 250px;"
            >
              <v-icon size="64" color="grey darken-1" class="mb-4">mdi-briefcase-off</v-icon>
              <h3 class="text-subtitle-1 mb-2" style="color: #555;">
                Nenhuma vaga encontrada
              </h3>
            </v-sheet>
          </v-col>

          <!-- Paginação -->
          <v-col
            v-if="totalPages > 1"
            cols="12"
            class="d-flex justify-center mt-4"
          >
            <v-pagination
              v-model="page"
              :length="totalPages"
              :total-visible="5"
              color="primary"
              rounded
            />
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </main>
</template>

<style lang="scss" scoped>
</style>
