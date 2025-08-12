<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  const candidateId = 'e00eef55-050b-4a3f-8732-973bb27a2dc8';
  const router = useRouter();
  const route = useRoute();
  const loading = ref<boolean>(true)
  const job= ref<any>({})
  const info: any = useInfo()
  const dialog = ref<boolean>(false)
  const dialogCreateCandidature = ref<boolean>(false)
  const { notify } = useNotification();

  definePageMeta({
    layout: 'default'
  })

  const apply = () => {
    if (info.user && info.user.id && info.user.type === 'candidate') {
      dialogCreateCandidature.value = true
    } else {
      dialog.value = true
    }
  }

  const candidature = ref<any>({
    candidate_name: 'Nome',
    state: null,
    city: null,
    status: 'Enviada',
    icon_status: 'mdi-send',
    title: null
  })

  const resetCandidature = () => {
    candidature.value = {
      candidate_name: 'Nome',
      state: null,
      city: null,
      status: 'Enviada',
      icon_status: 'mdi-send',
      title: null
    }
  }

  const createCandidature = async () => {
    const { data, error } = await useFetch('/api/candidatures', {
      method: 'POST',
      body: {
        ...candidature.value,
        candidate_id: candidateId,
        job_id: job.value.id,
        title: job.value.position
      }
    })
    if (error.value) {
      notify({ title: '', text: 'Erro ao criar candidatura', type: 'error' })
    } else {
      router.push(`/dashboard/candidato/${info.user.id}/minhas-candidaturas/${data.value.id}`)
      resetCandidature()
    }
  }

  const { data, error, pending } = await useFetch(`/api/jobs/${route.params.id}`, {
    method: 'GET'
  })

  const navigation = (id: number) => {
    dialog.value = false;
    router.push(`/cadastrar/candidato`)
  }

  if (error.value) {
  } else {
    job.value = data.value
    loading.value = false;
  }
</script>

<template>
  <main>
    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row v-if="!loading">
          <v-col cols="12">
            <v-card class="mb-6 bg-gradient-primary" elevation="2">
              <v-card-text>
                <p class="text-h4 font-weight-black">{{ job.position }}</p>
                <p>{{ job.company_name }}</p>
                <div class="d-flex align-center">
                  <span>Salário:</span>
                  <span class="text-subtitle-1 ml-2 font-weight-bold">{{ job.salary }}</span>
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
                        <div class="d-flex align-center">
                          <span class="text-body-2 font-weight-bold">Empresa:</span>
                          <span class="text-body-2 ml-1">{{ job.company_name }}</span>
                        </div>
                      </div>
                    </v-list-item>

                    <v-list-item class="ma-0" style="min-height: unset">
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-map-marker</v-icon>
                        <div class="d-flex align-center">
                          <span class="text-body-2 font-weight-bold">Endereço:</span>
                          <span class="text-body-2 ml-1">{{ job.address }}</span>
                        </div>
                      </div>
                    </v-list-item>

                    <v-list-item class="ma-0" style="min-height: unset">
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-calendar</v-icon>
                        <div class="d-flex align-center">
                          <span class="text-body-2 font-weight-bold">Data de abertura:</span>
                          <span class="text-body-2 ml-1">{{ job.created_at_formatted }}</span>
                        </div>
                      </div>
                    </v-list-item>

                    <v-list-item class="mt-2" style="min-height: unset">
                      <v-list-item-content>
                        <v-list-item-title class="text-h6 font-weight-bold">Descrição da Vaga</v-list-item-title>
                        <span class="text-body-1">
                          {{ job.description }}
                        </span>
                      </v-list-item-content>
                    </v-list-item>

                    <!--<v-list-item class="mt-2" style="min-height: unset">
                      <v-list-item-content>
                        <v-list-item-title class="text-h6 font-weight-bold">Principais Atividades</v-list-item-title>
                        <div class="d-flex flex-column">
                          <span v-for="(atividade, i) in job.mainActivities" :key="i" class="text-body-1">
                            • {{ atividade }}
                          </span>
                        </div>
                      </v-list-item-content>
                    </v-list-item>-->
                  </v-list>
                </v-col>
              </v-row>
            </v-card>

            <v-card class="mb-6 py-2" elevation="1">
              <v-row no-gutters>

                <v-col cols="12" class="px-4 pa-2">
                  <div class="d-flex align-center">
                    <v-icon class="mr-2">mdi-account-check</v-icon>
                    <h2 class="text-h6 font-weight-bold">Informações</h2>
                  </div>
                </v-col>

                <v-col cols="12" class="px-4 pa-2">
                  <div class="d-flex align-center mb-2">
                    <span class="text-subtitle-2 font-weight-bold">Cargo:</span>
                    <span class="text-body-2 ml-2">{{ job.position }}</span>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <span class="text-subtitle-2 font-weight-bold">Tipo de contrato:</span>
                    <span class="text-body-2 ml-2">{{ job.contract_type }}</span>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <span class="text-subtitle-2 font-weight-bold">Formato:</span>
                    <span class="text-body-2 ml-2">{{ job.work_format }}</span>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <span class="text-subtitle-2 font-weight-bold">Faixa salarial:</span>
                    <span class="text-body-2 ml-2">{{ job.salary }}</span>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <span class="text-subtitle-2 font-weight-bold">Carga horária:</span>
                    <span class="text-body-2 ml-2">{{ job.workload }}</span>
                  </div>
                  <div class="d-flex flex-column flex-md-row align-start align-md-center mb-2">
                    <span class="text-subtitle-2 font-weight-bold">Dias da semana:</span>
                    <div class="d-flex flex-wrap mt-1 mt-md-0 ml-md-2">
                      <template v-for="(day, index) in job.weekdays" :key="index">
                        <v-chip color="primary" variant="flat" :ripple="false" class="text-body-2 mr-1">
                          {{day}}
                        </v-chip>
                      </template>
                    </div>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <span class="text-subtitle-2 font-weight-bold">Escolaridade mínima:</span>
                    <span class="text-body-2 ml-2">{{ job.education_level }}</span>
                  </div>
                </v-col>

                <v-col cols="12" class="px-4 pa-2">
                  <v-divider></v-divider>
                </v-col>

                <v-col cols="12" class="px-4 pa-2">
                  <div class="d-flex align-center">
                    <v-icon class="mr-2">mdi-information-outline</v-icon>
                    <h2 class="text-h6 font-weight-bold">Benefícios e Pré-requisitos</h2>
                  </div>
                </v-col>

                <v-col cols="12" class="pa-2">
                  <v-list>
                    <v-list-item class="mt-2" style="min-height: unset">
                      <v-list-item-content>
                        <v-list-item-title class="text-subtitle-1 font-weight-bold">Benefícios</v-list-item-title>
                        <ul>
                          <template v-for="(benefit, index) in job.benefits" :key="index">
                            <li class="text-body-2">- {{ benefit }};</li>
                          </template>
                        </ul>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item class="mt-2" style="min-height: unset">
                      <v-list-item-content>
                        <v-list-item-title class="text-subtitle-1 font-weight-bold">Conhecimentos</v-list-item-title>
                        <ul>
                          <template v-for="(knowledge, index) in job.knowledge" :key="index">
                            <li class="text-body-2">- {{ knowledge }};</li>
                          </template>
                        </ul>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item class="mt-2" style="min-height: unset">
                      <v-list-item-content>
                        <v-list-item-title class="text-subtitle-1 font-weight-bold">Áreas de graduação</v-list-item-title>
                        <ul>
                          <template v-for="(area, index) in job.undergraduate_areas" :key="index">
                            <li class="text-body-2">- {{ area }};</li>
                          </template>
                        </ul>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>

                <v-col v-if="info.user && info.user.id && info.user.type === 'candidate'" cols="12">
                  <div class="d-flex justify-end px-4 py-2">
                    <v-btn
                      @click.prevent="apply"
                      text="Candidatar-me"
                      variant="flat"
                      class="bg-gradient-primary"
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
      v-model="dialogCreateCandidature"
      max-width="400"
      persistent
    >
      <v-card
        text="Se você curtiu a vaga não perca tempo e faça a sua candidatura."
        title="Candidata-se!"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn color="error" variant="flat" @click="dialogCreateCandidature = false">
            Não
          </v-btn>

          <v-btn color="success" variant="flat" @click="createCandidature">
            Sim
          </v-btn>
        </template>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card
        prepend-icon="mdi-briefcase"
        title="Gostou da vaga?"
        text="Para se candidatar a ela é preciso ter um cadastro. É rápido e fácil fazer um!"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn variant="flat" color="success" @click="navigation">
            Faça o cadastro
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </main>
</template>

<style lang="scss" scoped>
</style>
