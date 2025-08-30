<script setup lang="ts">

  definePageMeta({
    layout: 'default' // ou outro nome, conforme os arquivos em layouts/
  })
  //const content = ref('<p>Conteúdo inicial</p>')
  const route = useRoute();
  const loading = ref<boolean>(true)
  const page = ref<any>({})


  const { data, error, pending } = await useFetch(`/api/pages/${route.params.id}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    page.value = data.value
    useHead({
    title: `${page.value.title} - Conect One RH`,
      meta: [
        {
            name: 'description',
            content: page.value.description
        }
      ]
    })
    loading.value = false;
  }
</script>

<template>
  <div class="">
    <v-sheet width="100%" class="mt-4 mb-4">
      <v-container>
        <v-row v-if="!loading">
          <v-col cols="12">
            <div class="d-flex flex-column">
              <h1 class="text-h5 font-weight-bold">{{ page.title }}</h1>
            </div>
          </v-col>
          <v-col cols="12">
            <div class="d-flex flex-column">
              <div v-html="page.body"></div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>

<style lang="scss" scoped>
</style>
