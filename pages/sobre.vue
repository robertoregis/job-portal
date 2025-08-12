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
            <div class="d-flex flex-column">
              <h1 class="text-h5 font-weight-bold">Quem somos nós?</h1>
              <p class="text-subtitle-1 mb-0">
                Na Conect One RH, conectamos talentos e empresas com eficiência e transparência. 
                Somos apaixonados por transformar processos de recrutamento, oferecendo soluções inovadoras 
                que facilitam a jornada profissional de candidatos e a busca por profissionais qualificados pelas empresas.
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
