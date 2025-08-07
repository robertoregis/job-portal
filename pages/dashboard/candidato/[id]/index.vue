<script setup lang="ts">
  definePageMeta({
    layout: 'dashboard'
  })

  const router = useRouter()

  const candidateName = 'Lucas Almeida' // nome fictício do candidato

  // Dados dos avisos
  const avisos = [
    {
      id: 1,
      date: '10h00 05/08/2025',
      title: 'Nova mensagem da empresa XYZ',
      subtitle: 'Sua candidatura está em análise. Aguarde o retorno.'
    },
    {
      id: 2,
      date: '14h20 01/08/2025',
      title: 'Atualização no sistema',
      subtitle: 'O sistema estará em manutenção no próximo domingo.'
    }
  ]

  // Dados das candidaturas recentes
  const candidaturas = [
    {
      id: 1,
      date: '12h30 12/09/2025',
      status: 'Em análise',
      title: 'Desenvolvedor Front-end'
    },
    {
      id: 2,
      date: '2 dias atrás',
      status: 'Aprovado',
      title: 'Designer UI/UX'
    }
  ]

  const navigation = (id: number) => {
    router.push(`/dashboard/candidato/123/minhas-candidaturas/${id}`)
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span>Olá, {{ candidateName }}!</span>
        <span class="text-caption font-weight-bold">Seja bem vindo ao seu dashboard</span>
      </div>
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-5">
    <v-col cols="12">
      <div class="d-flex align-center">
        <v-card
          class="pa-2 text-center d-flex flex-column justify-center align-center mr-3 bg-gradient-primary"
          elevation="2"
          width="220"
          style="min-height: 120px"
        >
          <div class="text-h6" style="line-height: 1.2;">Candidaturas</div>
          <div class="text-h3 font-weight-bold">9</div>
        </v-card>
        <v-card
          class="pa-2 text-center d-flex flex-column justify-center align-center mr-3 border border-secondary"
          elevation="2"
          width="220"
          style="min-height: 120px"
        >
          <div class="text-gradient-primary text-h6" style="line-height: 1.2;">Candidaturas selecionadas</div>
          <div class="text-gradient-primary text-h3 font-weight-bold">3</div>
        </v-card>
        <v-card
          class="pa-2 text-center d-flex flex-column justify-center align-center mr-3 bg-gradient-primary"
          elevation="2"
          width="220"
          style="min-height: 120px"
        >
          <div class="text-h6" style="line-height: 1.2;">Candidaturas aprovadas</div>
          <div class="text-h3 font-weight-bold">1</div>
        </v-card>
      </div>
    </v-col>

    <v-col cols="12" class="mt-4 border">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Últimos avisos</v-list-subheader>

            <v-list-item
              v-for="aviso in avisos"
              :key="aviso.id"
              class="py-3"
            >
              <v-list-item-title class="text-caption font-weight-bold">
                {{ aviso.title }}
              </v-list-item-title>

              <v-list-item-subtitle class="text-body-2">
                {{ aviso.subtitle }}
              </v-list-item-subtitle>

              <template v-slot:append="{ isSelected }">
                <v-list-item-action class="flex-column align-end">
                  <small class="mb-4 opacity-60">{{ aviso.date }}</small>
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
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">
              Candidaturas recentes
            </v-list-subheader>

            <v-list-item
              v-for="candidatura in candidaturas"
              :key="candidatura.id"
              class="py-2"
            >
              <v-card
                class="pa-3 border"
                elevation="2"
                ripple
                hover
                @click="navigation(candidatura.id)"
              >
                <div class="d-flex justify-space-between">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">{{ candidatura.title }}</div>
                    <div class="text-caption">Status: {{ candidatura.status }}</div>
                  </div>
                  <div class="text-caption text-grey-darken-1">{{ candidatura.date }}</div>
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
