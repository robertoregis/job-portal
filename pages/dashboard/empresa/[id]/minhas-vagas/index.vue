<script setup lang="ts">

  definePageMeta({
    layout: 'dashboard',
  })

  const router = useRouter()

  // Simulando vagas (mock)
  const items = ref([
    {
      id: 1,
      title: 'Analista de Marketing',
      status: 'Aberta para inscrição',
      ativa: true,
      dataCriacao: '12h30 12/09/2025',
    },
    {
      id: 2,
      title: 'Programador de Servidor',
      status: 'Encerrada',
      ativa: false,
      dataCriacao: '14h20 01/08/2025',
    },
    {
      id: 3,
      title: 'Designer de Experiência e Interface',
      status: 'Aberta para inscrição',
      ativa: false,
      dataCriacao: '09h45 30/07/2025',
    },
    {
      id: 4,
      title: 'Auxiliar Administrativo',
      status: 'Pausada',
      ativa: false,
      dataCriacao: '10h00 22/06/2025',
    },
    {
      id: 5,
      title: 'Coordenador de Projetos',
      status: 'Em processo seletivo',
      ativa: true,
      dataCriacao: '11h15 18/07/2025',
    },
    {
      id: 6,
      title: 'Técnico em Informática',
      status: 'Encerramento próximo',
      ativa: true,
      dataCriacao: '08h30 05/08/2025',
    },
    {
      id: 7,
      title: 'Especialista em Atendimento ao Cliente',
      status: 'Aberta para inscrição',
      ativa: true,
      dataCriacao: '15h00 25/07/2025',
    },
    {
      id: 8,
      title: 'Analista Financeiro',
      status: 'Cancelada',
      ativa: false,
      dataCriacao: '13h20 10/06/2025',
    },
  ])

  // Filtros
  const jobStatusOptions = [
    { name: 'Aberta para inscrição', icon: 'mdi-briefcase-plus' },
    { name: 'Inscrições encerradas', icon: 'mdi-briefcase-remove' },
    { name: 'Em processo seletivo', icon: 'mdi-briefcase-search' },
    { name: 'Encerramento próximo', icon: 'mdi-briefcase-check' },
    { name: 'Encerrada', icon: 'mdi-briefcase-off' },
    { name: 'Pausada', icon: 'mdi-pause-circle' },
    { name: 'Cancelada', icon: 'mdi-cancel' },
  ]
  const selectedStatus = ref<string | null>(null)
  const selectedIconStatus = ref<string>('')
  const onStatusSelect = (selected: any) => {
    const result: any = jobStatusOptions.find(option => option.name === selected)
    selectedIconStatus.value = result?.icon || ''
  }
  const ativaOptions = ['Sim', 'Não']
  const selectedActive = ref<string | null>(null)

  // Computed com filtro aplicado
  const vagasFiltradas = computed(() => {
    return items.value.filter((vaga) => {
      const statusMatch =
        !selectedStatus.value || vaga.status === selectedStatus.value

      const ativaMatch =
        selectedActive.value === null ||
        (selectedActive.value === 'Sim' && vaga.ativa) ||
        (selectedActive.value === 'Não' && !vaga.ativa)

      return statusMatch && ativaMatch
    })
  })

  const navigation = (id: number) => {
    router.push(`/dashboard/empresa/123/minhas-vagas/${id}`)
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span>Aqui estão as tuas vagas!</span>
        <span class="text-caption font-weight-bold">
          Se quiser, também crie uma nova.
        </span>
      </div>
    </v-col>
  </v-row>

  <!-- Filtros -->
  <v-row no-gutters class="mt-4">
    <v-col cols="12" md="4" class="pr-md-2">
      <v-select
        v-model="selectedStatus"
        :items="jobStatusOptions"
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

    <v-col cols="12" md="4">
      <v-select
        v-model="selectedActive"
        :items="ativaOptions"
        label="Filtrar por ativa?"
        clearable
        variant="outlined"
        hide-details
        class="mb-2"
        dense
      />
    </v-col>
  </v-row>

  <!-- Lista de vagas -->
  <v-row no-gutters class="mt-4">
    <v-col v-if="selectedStatus || selectedActive" cols="12">
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
        <v-chip
          v-if="selectedActive"
          class="ma-2"
          :color="selectedActive === 'Sim' ? 'success' : 'error'"
          variant="flat"
        >
          <v-icon :icon="selectedActive === 'Sim' ? 'mdi-power' : 'mdi-power-off'" start></v-icon>
          {{ selectedActive === 'Sim' ? 'Só ativas' : 'Só desativadas' }}
        </v-chip>
      </div>
    </v-col>

    <v-col cols="12" :class="selectedStatus || selectedActive ? 'mt-4' : ''">
      <div class="d-flex">
        <v-btn
          text="Criar vaga"
          variant="flat"
          class="bg-gradient-primary"
          @click="$router.push('/dashboard/empresa/123/vagas/criar')"
        />
      </div>
    </v-col>

    <v-col cols="12" class="mt-4">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader
              class="text-h6 font-weight-bold text-gradient-primary"
            >
              Vagas
            </v-list-subheader>

            <v-list-item
              v-if="vagasFiltradas.length === 0"
              class="px-4 text-grey"
            >
              Nenhuma vaga encontrada com os filtros selecionados.
            </v-list-item>

            <v-list-item
              v-for="vaga in vagasFiltradas"
              :key="vaga.id"
              style="min-height: unset"
            >
              <v-card
                class="pa-2 border mb-2"
                elevation="2"
                ripple
                hover
                @click="navigation(vaga.id)"
              >
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">
                      {{ vaga.title }}
                    </div>
                    <div class="text-caption text-grey">
                      Status: {{ vaga.status }} |
                      Ativa: {{ vaga.ativa ? 'Sim' : 'Não' }}
                    </div>
                  </div>

                  <div class="text-caption text-grey-darken-1">
                    {{ vaga.dataCriacao }}
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

<style scoped lang="scss">
</style>

