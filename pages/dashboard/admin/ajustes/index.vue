<script setup lang="ts">
  definePageMeta({
    layout: 'dashboard' // ou outro nome, conforme os arquivos em layouts/
  })
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Área de ajustes</span>
        <span class="text-caption">Configure o seu sistema</span>
      </div>
    </v-col>
  </v-row>
  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="border">
      <AdminBenefits />
    </v-col>
    <v-col cols="12" class="border mt-4">
      <AdminServices />
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>

</style>