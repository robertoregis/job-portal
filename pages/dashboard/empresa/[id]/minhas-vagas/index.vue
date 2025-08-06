<script setup lang="ts">
  definePageMeta({
    layout: 'dashboard' // ou outro nome, conforme os arquivos em layouts/
  })

  const router = useRouter();
  const items = [
    { id: 1, date: '12h30 12/09/2025', headline: 'Brunch this weekend?', subtitle: `I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`, title: 'Ali Connors' },
    { id: 2, date: '2 hr', headline: 'Summer BBQ', subtitle: `Wish I could come, but I'm out of town this weekend.`, title: 'me, Scrott, Jennifer' },
  ]

  const navigation = (link: string) => {
    router.push('/dashboard/empresa/123/minhas-vagas/123')
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
    <v-col cols="12" class="border">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
          <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Vagas</v-list-subheader>
          <v-list-item
            v-for="item in items"
            :key="item.id"
            style="min-height: unset"
          >
            <v-card class="pa-2 border" elevation="2" ripple hover @click="navigation">
              <div class="d-flex justify-space-between align-start">
                <!-- Título + Subtítulo -->
                <div>
                  <div class="text-subtitle-1 font-weight-medium">Título aqui</div>
                </div>

                <!-- Data no canto superior direito -->
                <div class="text-caption text-grey-darken-1">eeee</div>
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