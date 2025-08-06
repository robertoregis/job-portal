<script setup lang="ts">
  definePageMeta({
    layout: 'default' // ou outro nome, conforme os arquivos em layouts/
  })
  const services = ref<any[]>([1, 2, 3, 4])
</script>

<template>
  <main class="">
    <v-sheet width="100%">
      <HomeImageBackground />
    </v-sheet>
    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row no-gutters>
          <v-col class="12">
            <div class="d-flex flex-column align-center pa-3 rounded">
              <h1 class="text-h5 font-weight-bold">Connect One RH</h1>
              <v-avatar color="info" size="x-large" class="mt-4">
              </v-avatar>
              <div class="d-flex max-w-500 mt-4">
                <p class="text-subtitle-1 mb-0">Praesent luctus, justo nec fringilla tincidunt, libero dolor sodales nisi, at suscipit mauris erat eu diam. Morbi a purus dignissim, egestas nunc quis, accumsan urna.</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-sheet width="100%" class="bg-gradient-primary mt-4">
      <v-container>
        <v-row no-gutters>
          <v-col class="">
            <div class="d-flex flex-column align-center rounded">
              <span>Descubra novos talentos</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row no-gutters>
          <v-col cols="12">
            <h1 class="text-h5 font-weight-bold">Serviços:</h1>
          </v-col>
          <v-col cols="12" class="mt-4">
            <v-row no-gutters>
              <template v-for="(service, indice) in services" :key="indice">
              <v-col cols="12" sm="6" lg="3" class="px-2 mb-4">
                <v-card
                  class="mx-auto"
                  prepend-icon="mdi-briefcase"
                  subtitle="Tudo em um só lugar"
                >
                  <template v-slot:title>
                    <span class="text-h6 font-weight-bold">Ecossistema único</span>
                  </template>

                  <v-card-text class="bg-surface-light pt-4">
                    O nosso ecossistema não é separado, assim tanto o candidato e tanto a empresa acessam de um mesmo local. Isso torna tudo mais prático, simples e rápido.
                  </v-card-text>
                </v-card>
              </v-col>
              </template>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

  </main>
</template>

<style lang="scss" scoped>

</style>