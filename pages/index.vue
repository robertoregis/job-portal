<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  definePageMeta({
    layout: 'default'
  })
  useHead({
    title: `Conect One RH`,
    meta: [
      {
          name: 'description',
          content: 'A Conect One RH conecta empresas e candidatos de forma prática e eficiente. Encontre oportunidades ou talentos sem sair de casa.'
      }
    ]
  })
  const info: any = useInfo();
  const servicesList = ref<any[]>([])
  // Dados fictícios para os serviços
  const { data: services, error, refresh, pending } = await useFetch('/api/services', {
      method: 'GET',
      params: {}
  })

  if (error.value) {
    console.log(error.value)
  } else {
      servicesList.value = services.value
  }
</script>

<template>
  <main>
    <v-sheet width="100%">
      <HomeVideoBackground video="https://uhwfvrjhlhvxyrrlaqna.supabase.co/storage/v1/object/public/jobportal/videos/RH%20ANIMACAO%203D%2004.mp4" />
    </v-sheet>

    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row no-gutters>
          <v-col cols="12">
            <div class="d-flex flex-column align-center pa-3 rounded">
              <h1 class="text-h4 font-weight-bold">Conect One RH</h1>
              <v-avatar size="80" class="mt-2">
                <v-img
                  alt="logo com símbolo da Conect One RH"
                  src="/logo-simbolo.png"
                ></v-img>
              </v-avatar>
              <div class="d-flex max-w-600 mt-4">
                <p class="text-subtitle-1 mb-0">
                  Somos a ponte entre talentos extraordinários e empresas que desejam crescer. 
                  Na Conect One RH, nossa missão é facilitar conexões humanas inteligentes, simplificar processos seletivos e potencializar carreiras e negócios.
                  Com tecnologia de ponta e um time apaixonado pelo que faz, transformamos cada oportunidade em sucesso real.
                </p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-sheet width="100%" class="bg-gradient-primary mt-4">
      <v-container>
        <v-row no-gutters>
          <v-col>
            <div class="d-flex flex-column align-center rounded pa-4">
              <h1 class="text-h4 font-weight-bold">O que fazemos de melhor</h1>
              <p class="text-body-1 mt-2 max-w-700">
                Na Conect One RH, oferecemos soluções completas que unem empresas e candidatos em um ecossistema moderno, ágil e transparente. 
                Descubra como podemos transformar a maneira de atrair, selecionar e reter talentos.
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
            <h1 class="text-h5 font-weight-bold">Nossos Serviços</h1>
          </v-col>

          <v-col cols="12" class="mt-4">
            <v-row no-gutters>
              <template v-for="(service, index) in servicesList" :key="index">
                <v-col cols="12" sm="6" lg="3" class="px-2 mb-4">
                  <v-card class="mx-auto" elevation="2" hover>
                    <v-card-title class="d-flex align-center">
                      <v-icon class="mr-2" size="28">{{ service.icon }}</v-icon>
                      <span class="text-subtitle-1 font-weight-bold custom-subtitle-and-title">{{ service.title }}</span>
                    </v-card-title>
                    <v-card-subtitle v-if="service.subtitle" class="mb-2 custom-subtitle-and-title">{{ service.subtitle }}</v-card-subtitle>
                    <v-card-text class="bg-surface-light pt-2">
                      {{ service.description }}
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
.max-w-500 {
  max-width: 500px;
  margin: 0 auto;
}

.max-w-600 {
  max-width: 600px;
  margin: 0 auto;
}
</style>
