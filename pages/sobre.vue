<script setup lang="ts">
  definePageMeta({
    layout: 'default' // ou outro nome, conforme os arquivos em layouts/
  })
  const services = ref<any[]>([1, 2, 3, 4])
</script>

<template>
  <div class="">
    <v-sheet width="100%" class="mt-4 mb-4">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="d-flex justify-center">
              <img src="/logo.png" alt="" srcset="" style="width: 68px;">
            </div>
          </v-col>
          <v-col cols="12">
            <div class="d-flex flex-column">
              <h1 class="text-h5 font-weight-bold">Quem somos nós?</h1>
              <p class="text-subtitle-1 mb-0">Praesent luctus, justo nec fringilla tincidunt, libero dolor sodales nisi, at suscipit mauris erat eu diam. Morbi a purus dignissim, egestas nunc quis, accumsan urna.</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

  </div>
</template>

<style lang="scss" scoped>

</style>