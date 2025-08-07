<script setup lang="ts">
  definePageMeta({
    layout: 'dashboard' // ou outro nome, conforme os arquivos em layouts/
  })
  const items = [
  {
    id: 1,
    date: '08:30 01/08/2025',
    headline: 'Nova oportunidade disponível',
    subtitle: `A vaga para Analista de Marketing foi publicada. Confira e candidate-se!`,
    title: 'Sistema'
  },
  {
    id: 2,
    date: '14:15 25/07/2025',
    headline: 'Candidatura recebida',
    subtitle: `Sua candidatura para a vaga de Desenvolvedor Front-end foi recebida com sucesso.`,
    title: 'Sistema'
  },
  {
    id: 3,
    date: '10:00 20/07/2025',
    headline: 'Entrevista agendada',
    subtitle: `Sua entrevista para a vaga de Designer UI/UX está marcada para 03/08 às 15h.`,
    title: 'RH'
  },
  {
    id: 4,
    date: '09:45 15/07/2025',
    headline: 'Atualização do perfil',
    subtitle: `Lembre-se de atualizar seu currículo para aumentar suas chances.`,
    title: 'Sistema'
  },
  {
    id: 5,
    date: '11:30 10/07/2025',
    headline: 'Mensagem do recrutador',
    subtitle: `O recrutador da vaga de Analista de Dados enviou uma mensagem. Verifique seu chat.`,
    title: 'RH'
  },
]

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
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Avisos</v-list-subheader>
            <template
              v-for="(item, index) in items"
              :key="item.id"
            >
              <v-list-item class="py-3">
                <v-list-item-title class="text-caption font-weight-bold">
                  {{ item.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-body-2">
                  {{ item.subtitle }}
                </v-list-item-subtitle>

                <template v-slot:append="{ isSelected }">
                  <v-list-item-action class="flex-column align-end">
                    <small class="mb-4 opacity-60">{{ item.date }}</small>
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-divider v-if="index < items.length - 1"></v-divider>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>

</style>