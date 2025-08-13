<script setup lang="ts">

  definePageMeta({
    layout: 'default' // ou outro nome, conforme os arquivos em layouts/
  })
  //const content = ref('<p>Conteúdo inicial</p>')
  const loading = ref<boolean>(true)

  onMounted(() => {
    loading.value = false;
  })
</script>

<template>
  <div class="">
    <v-sheet width="100%" class="mt-4 mb-4">
      <v-container>
        <v-row v-if="!loading">
          <v-col cols="12">
            <div class="d-flex justify-center">
              <img src="/logo.png" alt="Logo Conect One RH" style="width: 68px;">
            </div>
          </v-col>
          <v-col cols="12">
            <div class="d-flex flex-column mt-4">
              <h1 class="text-h4 font-weight-bold">Quem somos nós?</h1>
              <p class="text-subtitle-1 mt-3 mb-0">
                Na <strong>Conect RH One</strong>, nossa missão é criar conexões inteligentes entre talentos extraordinários e empresas que desejam crescer. 
                Acreditamos que cada oportunidade é uma chance de transformar carreiras e impulsionar negócios.
              </p>
              <p class="text-subtitle-1 mt-2 mb-0">
                Somos uma equipe cheia de energia, apaixonada por inovação e comprometida com resultados. 
                Com tecnologia de ponta e soluções pensadas para simplificar processos de recrutamento, oferecemos uma experiência única para candidatos e empresas.
              </p>
              <p class="text-subtitle-1 mt-2 mb-0">
                Na Conect RH One, cada conexão importa. Transformamos dados em decisões estratégicas, processos em experiências humanas e oportunidades em sucesso real.
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>

<style lang="scss" scoped>
</style>
