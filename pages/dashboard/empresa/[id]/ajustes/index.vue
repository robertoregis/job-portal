<script setup lang="ts">
  definePageMeta({
    layout: 'dashboard' // ou outro nome, conforme os arquivos em layouts/
  })
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
        <v-card-text>
          <span class="text-caption">Página em construção...</span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>

</style>