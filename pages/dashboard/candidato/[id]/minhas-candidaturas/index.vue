<script setup lang="ts">
  definePageMeta({
    layout: 'dashboard'
  })

  const router = useRouter()

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

  const selectedStatus = ref<string | null>(null)
  const selectedIconStatus = ref<string>('')

  const onStatusSelect = (selected: string | null) => {
    if (!selected) {
      selectedIconStatus.value = ''
      return
    }
    const result = candidaturaStatusOptions.find(option => option.name === selected)
    selectedIconStatus.value = result ? result.icon : ''
  }

  const allItems = ref([
    { id: 1, date: '12:30 12/09/2025', title: 'Desenvolvedor Front-end', status: 'Em análise' },
    { id: 2, date: '14:10 15/10/2025', title: 'Designer UI/UX', status: 'Aprovado' },
    { id: 3, date: '09:20 01/08/2025', title: 'QA Tester', status: 'Rejeitado' },
    { id: 4, date: '11:00 22/09/2025', title: 'Analista de Dados', status: 'Em entrevista' },
    { id: 5, date: '16:45 30/07/2025', title: 'Gerente de Projetos', status: 'Arquivada' },
  ])

  const itemsPerPage = 3
  const currentPage = ref(1)

  const filteredItems = computed(() => {
    if (!selectedStatus.value) return allItems.value
    return allItems.value.filter(item => item.status === selectedStatus.value)
  })

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredItems.value.slice(start, end)
  })

  watch(selectedStatus, () => {
    currentPage.value = 1
  })

  const navigation = (id: number) => {
    router.push(`/dashboard/candidato/123/minhas-candidaturas/${id}`)
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span>Olá, Nome do candidato!</span>
        <span class="text-caption font-weight-bold">Seja bem-vindo ao seu dashboard</span>
      </div>
    </v-col>
  </v-row>

  <!-- Filtros -->
  <v-row no-gutters class="mt-5">
    <v-col cols="12" md="4" class="pr-md-2 mb-4 mb-md-0">
      <v-select
        v-model="selectedStatus"
        :items="candidaturaStatusOptions"
        item-title="name"
        item-value="name"
        label="Filtrar por status"
        clearable
        variant="outlined"
        hide-details
        class="mb-2"
        dense
        @update:modelValue="onStatusSelect"
      />
    </v-col>
  </v-row>

  <!-- Lista de candidaturas -->
  <v-row no-gutters class="mt-2">
    <v-col v-if="selectedStatus" cols="12" class="mb-2">
      <div class="d-flex align-center">
        <v-chip
          v-if="selectedStatus"
          class="bg-gradient-status"
          variant="flat"
        >
          <v-icon :icon="selectedIconStatus" start></v-icon>
          Status: <span class="text-subtitle-1 font-weight-bold ml-2">{{ selectedStatus }}</span>
        </v-chip>
      </div>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Candidaturas</v-list-subheader>

            <v-list-item
              v-for="item in paginatedItems"
              :key="item.id"
              style="min-height: unset"
            >
              <v-card class="pa-2 border" elevation="2" ripple hover @click="navigation(item.id)">
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">{{ item.title }}</div>
                    <div class="text-caption">{{ item.status }}</div>
                  </div>

                  <div class="text-caption text-grey-darken-1">{{ item.date }}</div>
                </div>
              </v-card>
            </v-list-item>

            <v-list-item v-if="paginatedItems.length === 0">
              <v-list-item-title class="text-body-2">Nenhuma candidatura encontrada.</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col v-if="currentPage < Math.ceil(filteredItems.length / itemsPerPage)">
      <v-pagination
        v-model="currentPage"
        :length="Math.ceil(filteredItems.length / itemsPerPage)"
        :total-visible="5"
        color="primary"
        class="my-4"
        rounded
      />
    </v-col>

  </v-row>
</template>

<style lang="scss" scoped>
</style>

