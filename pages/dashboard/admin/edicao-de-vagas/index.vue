<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { formatDate } from '@/composables/formatDate';
  definePageMeta({
    layout: 'dashboard',
  })
  useHead({
    title: `Edição de vagas - Conect One RH`,
    meta: [
      {
        name: 'description',
        content: 'Veja todos os pedidos para edição das vagas e aprove ou recuse.'
      }
    ]
  })
  const info: any = useInfo();
  const router = useRouter()
  const page = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(1)
  const jobsEditList = ref<any[]>([])

  watch(page, () => {
    getJobs()
  })

  // Navegação
  const navigation = (id: number) => {
    router.push(`/dashboard/admin/edicao-de-vagas/${id}/visualizar`)
  }

  const getJobs = async () => {
    const params: Record<string, any> = {
      page: page.value.toString(),
      pageSize: pageSize.value.toString(),
    }

    const { data, error } = await useFetch('/api/jobs_edit', {
      method: 'GET',
      params
    })

    if (error.value) {
    } else {
      jobsEditList.value = data.value?.data || []
      totalPages.value = data.value?.totalPages || 1
    }
  }

  const { data: companies, error, refresh, pending } = await useFetch('/api/jobs_edit', {
    method: 'GET',
    params: {
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }
  })

  if (error.value) {
  } else {
    jobsEditList.value = companies.value?.data || []
    totalPages.value = companies.value?.totalPages || 1
  }

</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Edição de vagas</span>
        <span class="text-caption">Confira todos os pedidos para editar vagas.</span>
      </div>
    </v-col>
    <LayoutButtonBack />
  </v-row>

  <!-- Lista de empresas -->
  <v-row no-gutters>
    <v-col cols="12" class="mt-4">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Edição de vagas
            </v-list-subheader>

            <v-list-item v-if="jobsEditList.length === 0" class="px-4 text-grey">
              Nenhum pedido de edição para vagas encontrado.
            </v-list-item>

            <v-list-item
              v-for="jobEdit in jobsEditList"
              :key="jobEdit.id"
              style="min-height: unset"
            >
              <v-card
                class="pa-2 border mb-2"
                elevation="2"
                ripple
                hover
                @click="navigation(jobEdit.id)"
              >
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">{{ jobEdit.job_data.title }}</div>
                    <div class="text-caption text-grey">
                      {{ jobEdit.job_data.company_name }}
                    </div>
                  </div>
                  <div class="text-caption text-grey-darken-1">{{ jobEdit.created_at_formatted }}</div>
                </div>
              </v-card>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
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
</template>

<style scoped lang="scss">
</style>
