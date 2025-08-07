<script setup lang="ts">
  definePageMeta({
    layout: 'dashboard'
  })
  const router = useRouter();

  const vaga = ref({
    cargo: 'Desenvolvedor Full Stack',
    tipo_contrato: 'CLT',
    formato: 'Remoto',
    faixa_salarial: 'R$ 5.000 - R$ 7.000',
    carga_horaria: '40h semanais',
    dias_da_semana: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
    escolaridade_minima: 'Superior completo',
    beneficios: 'Plano de saúde, VR, VT, Gympass',
    descricao: 'Buscamos alguém com experiência em Vue, Node.js, e bancos de dados relacionais.',
    status: 'Aberta para inscrição', // novo campo
    ativa: true,
    icon: 'mdi-briefcase-plus'     // novo campo
  })

  const salvarAlteracoes = () => {
    console.log('Vaga atualizada:', vaga.value)
    // Aqui você pode usar useFetch, axios ou algo semelhante para enviar ao backend
  }

  const jobStatusOptions = [
    { name: 'Aberta para inscrição', icon: 'mdi-briefcase-plus' },
    { name: 'Inscrições encerradas', icon: 'mdi-briefcase-remove' },
    { name: 'Em processo seletivo', icon: 'mdi-briefcase-search' },
    { name: 'Encerramento próximo', icon: 'mdi-briefcase-check' },
    { name: 'Encerrada', icon: 'mdi-briefcase-off' },
    { name: 'Pausada', icon: 'mdi-pause-circle' },
    { name: 'Cancelada', icon: 'mdi-cancel' },
  ]


  const onStatusSelect = (selected: any) => {
    vaga.value.status = selected.name
    vaga.value.icon = selected.icon
  }

  const navigation = (id: number) => {
    router.push(`/dashboard/empresa/123/minhas-vagas/123/candidaturas`)
  }

</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span>Olá, Nome do candidato!</span>
        <span class="text-caption font-weight-bold">Seja bem vindo ao seu dashboard</span>
      </div>
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-5">
    <v-col cols="12">
      <div class="d-flex">
        <v-card hover ripple @click="navigation" class="pa-2 text-center d-flex flex-column justify-center align-center mr-3 bg-gradient-primary" elevation="2" width="180" style="min-height: 100px">
            <div class="text-h6" style="line-height: 1.2;">Candidaturas</div>
            <div class="text-h3 font-weight-bold">9</div>
          </v-card>
      </div>
    </v-col>
    <v-col cols="12" class="mt-4">
      <div class="d-flex align-center">
        <v-chip
          class="ma-2 bg-gradient-primary"
          variant="flat"
        >
          <v-icon :icon="vaga.icon" start></v-icon>
          Status: <span class="text-subtitle-1 font-weight-bold ml-2">{{ vaga.status }}</span>
        </v-chip>
        <v-chip
            class="ma-2"
            :color="`${vaga.ativa ? 'success' : 'error'}`"
            variant="flat"
          >
          <v-icon :icon="`${vaga.ativa ? 'mdi-power' : 'mdi-power-off	'}`" start></v-icon>
          {{ vaga.ativa ? 'Ativada' : 'Desativada' }}
        </v-chip>
      </div>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-row no-gutters>
        <v-col cols="12" class="px-4 pa-2">
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-briefcase</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Informações da vaga</h2>
          </div>
        </v-col>

        <v-col cols="12" class="px-4 pa-2">
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Cargo:</span>
            <span class="text-body-2 ml-2">{{ vaga.cargo }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Tipo de contrato:</span>
            <span class="text-body-2 ml-2">{{ vaga.tipo_contrato }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Formato:</span>
            <span class="text-body-2 ml-2">{{ vaga.formato }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Faixa salarial:</span>
            <span class="text-body-2 ml-2">{{ vaga.faixa_salarial }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Carga horária:</span>
            <span class="text-body-2 ml-2">{{ vaga.carga_horaria }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Dias da semana:</span>
            <span class="text-body-2 ml-2">{{ vaga.dias_da_semana.join(', ') }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Escolaridade mínima:</span>
            <span class="text-body-2 ml-2">{{ vaga.escolaridade_minima }}</span>
          </div>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-list>
        <v-list-item class="mt-2" style="min-height: unset">
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1 font-weight-bold">Benefícios</v-list-item-title>
            <span class="text-body-2">
              {{ vaga.beneficios }}
            </span>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="mt-2" style="min-height: unset">
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1 font-weight-bold">Descrição da vaga</v-list-item-title>
            <span class="text-body-2">
              {{ vaga.descricao }}
            </span>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>

    <!-- NOVA SEÇÃO: Controles de status e ativação -->
    <v-col cols="12" class="border mt-4">
      <v-card flat class="pa-4">
        <div class="d-flex align-center mb-4">
          <v-icon class="mr-2 text-gradient-primary">mdi-tune</v-icon>
          <h3 class="text-subtitle-1 font-weight-bold text-gradient-primary">Gerenciar status da vaga</h3>
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <v-select
              :items="jobStatusOptions"
              :value="vaga.status"
              item-title="name"
              return-object
              density="comfortable"
              variant="outlined"
              hide-details
              color="primary"
              @update:modelValue="onStatusSelect"
            />
          </v-col>

          <v-col cols="12" md="6" class="d-flex align-center">
            <v-switch
              v-model="vaga.ativa"
              :label="`${vaga.ativa ? 'Ativada' : 'Desativada'}`"
              color="success"
              inset
              hide-details
            />
          </v-col>

          <v-col cols="12">
            <v-btn color="primary" class="mt-2" @click="salvarAlteracoes">
              Salvar alterações
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-col cols="12" class="mt-4">
      <div class="d-flex">
        <v-btn
          color="deep-purple-accent-4"
          text="Editar vaga"
          variant="flat"
          @click="$router.push('/dashboard/empresa/123/minhas-vagas/123/editar')"
        />
      </div>
    </v-col>

  </v-row>
</template>

<style scoped lang="scss">
// Estilo leve para visual
</style>
