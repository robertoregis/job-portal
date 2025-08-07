<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const items = [
  { id: 1, date: '08:30 01/08/2025', headline: 'Nova vaga publicada', subtitle: `A vaga para Desenvolvedor Front-end foi publicada com sucesso.`, title: 'Sistema' },
  { id: 2, date: '14:15 25/07/2025', headline: 'Candidatura recebida', subtitle: `Você recebeu uma nova candidatura para a vaga de Designer UI/UX.`, title: 'Sistema' },
  { id: 3, date: '10:00 20/07/2025', headline: 'Atualização do perfil', subtitle: `Carlos Alberto atualizou seus dados no perfil da empresa.`, title: 'Sistema' },
  { id: 4, date: '09:45 15/07/2025', headline: 'Aviso de manutenção', subtitle: `O sistema passará por manutenção na próxima sexta-feira.`, title: 'Administração' },
  { id: 5, date: '11:30 10/07/2025', headline: 'Relatório mensal disponível', subtitle: `O relatório de desempenho de julho está disponível para download.`, title: 'Sistema' },
]

const selected = shallowRef([2])
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="">Avisos do dashboard</span>
        <span class="text-caption font-weight-bold">Confira as últimas atualizações da sua empresa</span>
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

                <template v-slot:append>
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
