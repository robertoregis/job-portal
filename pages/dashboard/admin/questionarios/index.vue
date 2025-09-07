<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { formatDate } from '@/composables/formatDate';
  definePageMeta({
    layout: 'dashboard',
  })
  useHead({
    title: `Questionários - Conect One RH`,
    meta: [
      {
          name: 'description',
          content: 'Veja todos os questionários dos candidatos que precisam de avaliação'
      }
    ]
  })
  const info: any = useInfo();
  const router = useRouter()
  const page = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(1)
  const behavioralsList = ref<any[]>([])

  watch(page, () => {
    getBehariovals()
  })

  // Navegação
  const navigation = (id: number) => {
    router.push(`/dashboard/admin/questionarios/${id}`)
  }

  const getBehariovals = async () => {
    const params: Record<string, any> = {
      page: page.value.toString(),
      pageSize: pageSize.value.toString(),
      is_response: false
    }

    const { data, error } = await useFetch('/api/behavioral_profiles', {
      method: 'GET',
      params
    })

    if (error.value) {
    } else {
      behavioralsList.value = data.value?.data || []
      totalPages.value = data.value?.totalPages || 1
    }
  }



  const { data: behaviorals, error, refresh, pending } = await useFetch('/api/behavioral_profiles', {
    method: 'GET',
    params: {
      page: page.value.toString(),
      pageSize: pageSize.value.toString(),
      is_response: false
    }
  })

  if (error.value) {
  } else {
    console.log(behaviorals.value)
    behavioralsList.value = behaviorals.value?.data || []
    totalPages.value = behaviorals.value?.totalPages || 1
  }

</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Questionários</span>
        <span class="text-caption">Confira todas as questionários do perfil comportamental.</span>
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
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Questionários</v-list-subheader>

            <v-list-item v-if="behavioralsList.length === 0" class="px-4 text-grey">
              Nenhum questionário encontrado.
            </v-list-item>

            <v-list-item
              v-for="behavioral in behavioralsList"
              :key="behavioral.id"
              style="min-height: unset"
            >
              <v-card
                class="pa-2 border mb-2"
                elevation="2"
                ripple
                hover
                @click="navigation(behavioral.id)"
              >
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">{{ behavioral.name_candidate }}</div>
                    <div class="text-caption text-grey">
                      Avaliado: {{ behavioral.is_response ? 'Sim' : 'Não' }}
                    </div>
                  </div>
                  <div class="text-caption text-grey-darken-1">{{ formatDate(new Date(behavioral.created_at), 3) }}</div>
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
