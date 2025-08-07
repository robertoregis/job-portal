<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const services = ref<any[]>([1, 2, 3, 4])

const getBenefitTitle = (index: number): string => {
  const titles = [
    'Cadastros únicos',
    'Busca inteligente',
    'Suporte dedicado',
    'Atualizações constantes'
  ]
  return titles[index] ?? 'Benefício'
}

const getBenefitDescription = (index: number): string => {
  const descriptions = [
    'Permitimos apenas um cadastro por e-mail para evitar duplicidade e garantir segurança.',
    'Encontre candidatos ideais com filtros avançados e recomendações personalizadas.',
    'Nossa equipe de suporte está sempre pronta para ajudar você em qualquer etapa.',
    'A plataforma é atualizada regularmente para oferecer as melhores ferramentas do mercado.'
  ]
  return descriptions[index] ?? ''
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
              Somos uma empresa dedicada a conectar talentos às melhores oportunidades do mercado.
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="text-subtitle-1 mb-0">
              Nossa plataforma é simples, segura e eficiente, garantindo uma experiência fluida para candidatos e empresas.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-sheet width="100%" class="bg-gradient-primary mt-4">
      <v-container>
        <v-row no-gutters>
          <v-col>
            <div class="d-flex flex-column align-center rounded">
              <span class="text-h6 font-weight-bold text-white">Aumente o seu time com as melhores pessoas</span>
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
                  <v-card class="mx-auto" elevation="2" hover>
                    <v-card-title>
                      <v-icon left color="primary">mdi-briefcase</v-icon>
                      <span class="font-weight-black">{{ getBenefitTitle(indice) }}</span>
                    </v-card-title>
                    <v-card-text class="bg-surface-light pt-4">
                      {{ getBenefitDescription(indice) }}
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
