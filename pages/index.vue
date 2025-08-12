<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  definePageMeta({
    layout: 'default'
  })
  const info: any = useInfo();
  // Dados fictícios para os serviços
  const services = ref([
    {
      icon: 'mdi-briefcase-account',
      title: 'Recrutamento Personalizado',
      subtitle: 'Soluções sob medida',
      description: 'Encontramos candidatos qualificados que atendem exatamente às necessidades da sua empresa, garantindo o match perfeito.'
    },
    {
      icon: 'mdi-account-group',
      title: 'Gestão de Talentos',
      subtitle: 'Desenvolvimento contínuo',
      description: 'Apoiamos no crescimento e retenção dos seus colaboradores com ferramentas modernas de avaliação e treinamento.'
    },
    {
      icon: 'mdi-laptop',
      title: 'Plataforma Integrada',
      subtitle: 'Tudo em um só lugar',
      description: 'Candidatos e empresas interagem na mesma plataforma intuitiva, facilitando processos seletivos e comunicação.'
    },
    {
      icon: 'mdi-chart-line',
      title: 'Análise de Dados',
      subtitle: 'Decisões baseadas em insights',
      description: 'Fornecemos relatórios detalhados para você tomar decisões estratégicas e otimizar sua gestão de pessoas.'
    },
  ])
</script>

<template>
  <main>
    <v-sheet width="100%">
      <HomeImageBackground />
    </v-sheet>

    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row no-gutters>
          <v-col cols="12">
            <div class="d-flex flex-column align-center pa-3 rounded">
              <h1 class="text-h5 font-weight-bold">Conect One RH</h1>
              <v-avatar color="info" size="x-large" class="mt-4">
                <!-- Pode colocar logo ou ícone aqui -->
              </v-avatar>
              <div class="d-flex max-w-500 mt-4">
                <p class="text-subtitle-1 mb-0">
                  A Conect One RH oferece soluções inovadoras para conectar talentos e empresas, facilitando processos seletivos e o desenvolvimento profissional.
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
              <span class="text-h6 font-weight-bold text-white">Descubra novos talentos</span>
              <p class="text-body-2 text-white mt-2 text-center max-w-600">
                Nossa plataforma conecta você a profissionais qualificados que transformarão sua equipe e impulsionarão seus resultados.
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
              <template v-for="(service, index) in services" :key="index">
                <v-col cols="12" sm="6" lg="3" class="px-2 mb-4">
                  <v-card class="mx-auto" elevation="2" hover>
                    <v-card-title class="d-flex align-center">
                      <v-icon class="mr-2" size="28">{{ service.icon }}</v-icon>
                      <span class="text-h6 font-weight-bold">{{ service.title }}</span>
                    </v-card-title>
                    <v-card-subtitle class="mb-2 text--secondary">{{ service.subtitle }}</v-card-subtitle>
                    <v-card-text class="bg-surface-light pt-0">
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
