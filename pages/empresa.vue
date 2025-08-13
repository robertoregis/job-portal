<script setup lang="ts">
  definePageMeta({
    layout: 'default'
  })

  const benefitsList = ref<any[]>([])
  // Dados fictícios para os serviços
  const { data: benefits, error, refresh, pending } = await useFetch('/api/benefits', {
      method: 'GET',
      params: {}
  })

  if (error.value) {
  } else {
      benefitsList.value = benefits.value
  }
</script>

<template>
  <main>
    <v-sheet width="100%">
      <HomeImageBackground />
    </v-sheet>

    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <p class="text-subtitle-1 mb-0">
              Na Conect RH One, acreditamos que equipes de sucesso começam com as pessoas certas. 
              Por isso, oferecemos uma plataforma completa para conectar talentos às oportunidades ideais.
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="text-subtitle-1 mb-0">
              Nossa ferramenta é intuitiva, segura e eficiente, tornando o processo de recrutamento mais rápido, transparente e estratégico para empresas e candidatos.
            </p>
          </v-col>
        </v-row>

      </v-container>
    </v-sheet>

    <v-sheet width="100%" class="bg-gradient-primary mt-4">
      <v-container>
        <v-row no-gutters>
          <v-col>
            <div class="d-flex flex-column align-center rounded pa-4">
              <span class="text-h5 font-weight-bold text-white">Construa equipes fortes com quem realmente faz a diferença</span>
              <p class="text-body-1 text-white mt-3 text-center max-w-700">
                Com a Conect RH One, você tem acesso a talentos qualificados, ferramentas inovadoras e insights estratégicos que ajudam a sua empresa a crescer mais rápido e de forma sustentável.
              </p>
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
              <template v-for="(benefit, indice) in benefitsList" :key="indice">
                <v-col cols="12" sm="6" lg="3" class="px-2 mb-4">
                  <v-card class="mx-auto" elevation="2" hover>
                    <v-card-title class="d-flex align-center">
                      <v-icon class="mr-2" size="28">{{ benefit.icon }}</v-icon>
                      <span class="text-h6 font-weight-bold">{{ benefit.title }}</span>
                    </v-card-title>
                    <v-card-subtitle class="mb-2 text--secondary">{{ benefit.subtitle }}</v-card-subtitle>
                    <v-card-text class="bg-surface-light pt-0">
                      {{ benefit.description }}
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
.bg-gradient-primary {
  background: linear-gradient(90deg, #5c6bc0 0%, #3949ab 100%);
}
</style>
