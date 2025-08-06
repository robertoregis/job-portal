<script setup lang="ts">
  import { useInfo } from '#imports'

  definePageMeta({
    layout: 'default' // ou outro nome, conforme os arquivos em layouts/
  })

  const info: any = useInfo();
  const vaga = ref<any>({
    id: 1,
    title: 'Engenheiro',
    company: 'Petrobras',
    description: 'Mauris in felis sit amet urna pretium auctor id blandit libero. Vestibulum nec aliquet metus. Ut molestie id purus at ullamcorper.',
    created_date: '18/09/2025',
    location: 'Campinas',
    salary: 1200,
    salary_formatted: 'R$ 1.200,00'
  })
  const dialog = ref<boolean>(false)

  const apply = () => {
    if(info.user && info.user.id) {
      //dialog.value = true;
    } else {
      dialog.value = true;
    }
  }

</script>

<template>
  <main class="">
    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card class="mb-6 bg-gradient-primary" elevation="2">
              <v-card-text>
                <p class="text-h4 font-weight-black">{{ vaga.title }}</p>

                <p>{{vaga.company}}</p>

                <div class="d-flex align-center">
                  <span>Salário:</span>
                  <span class="text-subtitle-1 ml-2 font-weight-bold">{{ vaga.salary_formatted }}</span>
                </div>
              </v-card-text>
            </v-card>

            <v-card class="mb-6 py-2" elevation="1">
              <v-row>
                <v-col cols="12">
                  <v-list>
                    <v-list-item style="min-height: unset">
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-office-building</v-icon>
                        <span>{{ vaga.company }}</span>
                      </div>
                    </v-list-item>

                    <v-list-item class="ma-0" style="min-height: unset">
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-map-marker</v-icon>
                        <span>{{ vaga.location }} / SP</span>
                      </div>
                    </v-list-item>

                    <v-list-item class="ma-0" style="min-height: unset">
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-calendar</v-icon>
                        <span>{{ vaga.created_date }}</span>
                      </div>
                    </v-list-item>
                    <v-list-item class="mt-2" style="min-height: unset">
                      <v-list-item-content>
                        <v-list-item-title class="text-h6 font-weight-bold">Descrição da Vaga</v-list-item-title>
                        <span class="text-body-1">
                          Texto descritivo ou informação adicional aqui.
                        </span>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item class="mt-2" style="min-height: unset">
                      <v-list-item-content>
                        <v-list-item-title class="text-h6 font-weight-bold">Principais atividades</v-list-item-title>
                        <div class="d-flex flex-column">
                          <span class="text-body-1">
                            Texto descritivo ou informação adicional aqui;
                          </span>
                          <span class="text-body-1">
                            Texto descritivo ou informação adicional aqui;
                          </span>
                          <span class="text-body-1">
                            Texto descritivo ou informação adicional aqui;
                          </span>
                          <span class="text-body-1">
                            Texto descritivo ou informação adicional aqui;
                          </span>
                        </div>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card>

            <v-card class="mb-6 py-2" elevation="1">
              <v-row no-gutters>

                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" class="px-4 pa-2">
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-calendar</v-icon>
                        <h2 class="text-h6 font-weight-bold">Pré-requisitos</h2>
                      </div>
                    </v-col>
                    <v-col cols="12" class="px-4 pa-2">
                      <div class="d-flex align-center">
                        <span class="text-subtitle-1 font-weight-bold">Experiência:</span>
                        <span class="text-body-1 ml-2">{{ vaga.company }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <span class="text-subtitle-1 font-weight-bold">Nível de escolaridade:</span>
                        <span class="text-body-1 ml-2">{{ vaga.company }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <span class="text-subtitle-1 font-weight-bold">Áreas de graduação:</span>
                        <span class="text-body-1 ml-2">{{ vaga.company }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <span class="text-subtitle-1 font-weight-bold">Conhecimento específico:</span>
                        <span class="text-body-1 ml-2">{{ vaga.company }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <span class="text-subtitle-1 font-weight-bold">Habilidades interpessoais:</span>
                        <span class="text-body-1 ml-2">{{ vaga.company }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" class="px-4 pa-2">
                  <v-divider></v-divider>
                </v-col>

                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" class="px-4 pa-2">
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-calendar</v-icon>
                        <h2 class="text-h6 font-weight-bold">Informações adicionais</h2>
                      </div>
                    </v-col>
                    <v-col cols="12" class="px-4 pa-2">
                      <div class="d-flex align-center">
                        <span class="text-subtitle-1 font-weight-bold">Experiência:</span>
                        <span class="text-body-1 ml-2">{{ vaga.company }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <span class="text-subtitle-1 font-weight-bold">Nível de escolaridade:</span>
                        <span class="text-body-1 ml-2">{{ vaga.company }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <span class="text-subtitle-1 font-weight-bold">Áreas de graduação:</span>
                        <span class="text-body-1 ml-2">{{ vaga.company }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <span class="text-subtitle-1 font-weight-bold">Conhecimento específico:</span>
                        <span class="text-body-1 ml-2">{{ vaga.company }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <span class="text-subtitle-1 font-weight-bold">Habilidades interpessoais:</span>
                        <span class="text-body-1 ml-2">{{ vaga.company }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12">
                  <div class="d-flex justify-end px-4 py-2">
                    <v-btn
                      @click.prevent="apply"
                      color="deep-purple-accent-4"
                      text="Candidatar-me"
                      variant="flat"
                    ></v-btn>
                  </div>
                </v-col>

              </v-row>
            </v-card>

          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card
        prepend-icon="mdi-briefcase"
        text="Para se candidatar a ela é preciso ter um cadastro. É rápido e fácil fazer um!"
        title="Gostou da vaga?"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn variant="flat" color="success" @click="dialog = false">
            Faça o cadastro
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </main>
</template>

<style lang="scss" scoped>

</style>