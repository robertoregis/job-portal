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
        <v-row>
          <v-col cols="12" md="6">
            <p class="text-subtitle-1 mb-0">Praesent luctus, justo nec fringilla tincidunt, libero dolor sodales nisi, at suscipit mauris erat eu diam. Morbi a purus dignissim, egestas nunc quis, accumsan urna.</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="text-subtitle-1 mb-0">Praesent luctus, justo nec fringilla tincidunt, libero dolor sodales nisi, at suscipit mauris erat eu diam. Morbi a purus dignissim, egestas nunc quis, accumsan urna.</p>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-sheet width="100%" class="bg-gradient-primary mt-4">
      <v-container>
        <v-row no-gutters>
          <v-col class="">
            <div class="d-flex flex-column align-center rounded">
              <span>Aumente o teu time com as melhores pessoas</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row no-gutters>
          <v-col cols="12">
            <h1 class="text-h5 font-weight-bold">Benefícios:</h1>
          </v-col>
          <v-col cols="12" class="mt-4">
            <v-row no-gutters>
              <template v-for="(service, indice) in services" :key="indice">
              <v-col cols="12" sm="6" lg="3" class="px-2 mb-4">
                <v-card
                  class="mx-auto"
                  prepend-icon="mdi-briefcase"
                  subtitle="Só um cadastro por pessoa"
                >
                  <template v-slot:title>
                    <span class="font-weight-black">Cadastros únicos</span>
                  </template>

                  <v-card-text class="bg-surface-light pt-4">
                    A Connect One RH só permite um cadastro por email, assim evita cadastros duplicados. Isso ajuda a ter mais segurança.
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