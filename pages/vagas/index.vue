<script setup lang="ts">
  import { useInfo } from '#imports';

  definePageMeta({
    layout: 'default' // ou outro nome, conforme os arquivos em layouts/
  })

  const info: any = useInfo();
  const vagas = ref<any[]>([
    {
      id: 1,
      title: 'Engenheiro',
      company: 'Petrobras',
      description: 'Mauris in felis sit amet urna pretium auctor id blandit libero. Vestibulum nec aliquet metus. Ut molestie id purus at ullamcorper.',
      created_date: '18/09/2025'
    },
    {
      id: 2,
      title: 'Programador',
      company: 'Petrobras',
      description: 'Mauris in felis sit amet urna pretium auctor id blandit libero. Vestibulum nec aliquet metus. Ut molestie id purus at ullamcorper.',
      created_date: '18/09/2025'
    },
    {
      id: 3,
      title: 'Profesor',
      company: 'Petrobras',
      description: 'Mauris in felis sit amet urna pretium auctor id blandit libero. Vestibulum nec aliquet metus. Ut molestie id purus at ullamcorper.',
      created_date: '18/09/2025'
    }
  ])

</script>

<template>
  <main class="">
    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12">
                <h2 class="mb-0">Filtros</h2>
              </v-col>
              <v-col cols="12" class="">
                <div class="d-flex flex-wrap gap-3">
                  <v-select
                    label="Data de criação"
                    :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                    style="max-width: 200px"
                    class="w-100 my-1 mr-2"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-select>

                  <v-select
                    label="Estado"
                    :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                    style="max-width: 200px"
                    class="w-100 my-1 mr-2"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-select>

                  <v-select
                    label="Cidade"
                    :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                    style="max-width: 200px"
                    class="w-100 my-1 mr-2"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-select>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="!Object.keys(info.user || {}).length || info.user.type === 'company'" cols="12">
            <div class="d-flex align-center">
              <v-btn
                class="bg-gradient-primary"
                text="Cadastre uma vaga"
                variant="flat"
              ></v-btn>
            </div>
          </v-col>

          <v-col cols="12">
            <v-row>
              <template v-for="(vaga, indice) in vagas" :key="indice">
              <JobsJob :job="vaga" />
              </template>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </main>
</template>

<style lang="scss" scoped>

</style>