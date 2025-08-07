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
  { id: 1, date: '12h30 12/09/2025', title: 'Desenvolvedor Front-end', status: 'Em análise' },
  { id: 2, date: '14h10 15/10/2025', title: 'Designer UI/UX', status: 'Aprovado' },
  { id: 3, date: '09h20 01/08/2025', title: 'QA Tester', status: 'Rejeitado' },
])

const filteredItems = computed(() => {
  if (!selectedStatus.value) return allItems.value
  return allItems.value.filter(item => item.status === selectedStatus.value)
})

const navigation = (id: number) => {
  router.push(`/dashboard/empresa/123/minhas-vagas/123/candidaturas/${id}`)
}
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span>Candidaturas da vaga</span>
        <span class="text-caption font-weight-bold">Confira os candidatos inscritos nesta vaga</span>
      </div>
    </v-col>
  </v-row>

  <!-- Filtros -->
  <v-row no-gutters class="mt-5">
    <v-col cols="12">
      <div class="d-flex flex-wrap">
        <v-card class="pa-2 text-center d-flex flex-column justify-center align-center mr-3 bg-gradient-primary" elevation="2" width="160" style="min-height: 80px">
          <div class="text-subtitle-1" style="line-height: 1.2;">Candidaturas</div>
          <div class="text-h4 font-weight-bold">9</div>
        </v-card>
        <v-card class="pa-2 text-center d-flex flex-column justify-center align-center mr-3 bg-gradient-primary" elevation="2" width="160" style="min-height: 80px">
          <div class="text-subtitle-1" style="line-height: 1.2;">Candidaturas enviadas</div>
          <div class="text-h4 font-weight-bold">3</div>
        </v-card>
        <v-card class="pa-2 text-center d-flex flex-column justify-center align-center mr-3 bg-gradient-primary" elevation="2" width="160" style="min-height: 80px">
          <div class="text-subtitle-1" style="line-height: 1.2;">Candidaturas em análise</div>
          <div class="text-h4 font-weight-bold">1</div>
        </v-card>
      </div>
    </v-col>
    <v-col cols="12" md="4" class="mt-4">
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
  <v-row no-gutters class="mt-4">
    <v-col v-if="selectedStatus" cols="12" class="mb-2">
      <div class="d-flex align-center">
        <v-chip
          v-if="selectedStatus"
          class="ma-2"
          color="success"
          variant="flat"
        >
          <v-icon :icon="selectedIconStatus" start></v-icon>
          Status: <span class="text-subtitle-1 font-weight-bold ml-2">{{ selectedStatus }}</span>
        </v-chip>
      </div>
    </v-col>
    <v-col cols="12" class="border">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Candidaturas</v-list-subheader>

            <v-list-item
              v-for="item in filteredItems"
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

            <v-list-item v-if="filteredItems.length === 0">
              <v-list-item-title class="text-body-2">Nenhuma candidatura encontrada.</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
</style>

