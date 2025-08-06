<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

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
})
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
    <v-col cols="12" class="border">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-briefcase</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Candidatura</h2>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Status:</span>
                <v-chip
                  class="ml-2"
                  color="success"
                  variant="flat"
                >
                  <v-icon icon="mdi-server-plus" start></v-icon>
                  Server Status
                </v-chip>
              </div>
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Data de criação:</span>
                <span class="text-body-2 ml-2">--------</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-briefcase</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Informações da vaga</h2>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Cargo:</span>
                <span class="text-body-2 ml-2">{{ vaga.cargo }}</span>
              </div>
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Tipo de contrato:</span>
                <span class="text-body-2 ml-2">{{ vaga.tipo_contrato }}</span>
              </div>
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Formato:</span>
                <span class="text-body-2 ml-2">{{ vaga.formato }}</span>
              </div>
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Faixa salarial:</span>
                <span class="text-body-2 ml-2">{{ vaga.faixa_salarial }}</span>
              </div>
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Carga horária:</span>
                <span class="text-body-2 ml-2">{{ vaga.carga_horaria }}</span>
              </div>
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Dias da semana:</span>
                <span class="text-body-2 ml-2">{{ vaga.dias_da_semana.join(', ') }}</span>
              </div>
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Escolaridade mínima:</span>
                <span class="text-body-2 ml-2">{{ vaga.escolaridade_minima }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Benefícios</v-list-item-title>
                <span class="text-body-2">
                  {{ vaga.beneficios }}
                </span>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Descrição da vaga</v-list-item-title>
                <span class="text-body-2">
                  {{ vaga.descricao }}
                </span>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

  </v-row>
</template>

<style scoped lang="scss">
// Estilo opcional
</style>
