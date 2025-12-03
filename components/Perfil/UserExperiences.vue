<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  import { useNotice } from '@/composables/useNotice';
  const { createLog } = useNotice();
  const { notify } = useNotification();
  const info: any = useInfo();
  const show = useShow();
  const props = defineProps({
    candidate: {
      type: Object,
      required: false,
      default: {}
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false
    }
  })
  const candidate = computed(() => {
    if(props.isAdmin) {
      return props.candidate
    } else {
      return info.user
    }
  })
  const pickerVisible = ref(false)
  const typeDate = ref<string>('')
  const order = ref<string>('')
  const experienceGroup = ref<any>({})
  const onDateSelected = (val: string, type: string, order: string) => {
    if (type === 'start_date') {
      if(order === 'one') {
        experienceOne.value.start_date = val
      } else if(order === 'two') {
        experienceTwo.value.start_date = val
      } else if(order === 'three') {
        experienceThree.value.start_date = val
      }
    } else if (type === 'end_date') {
      if(order === 'one') {
        experienceOne.value.end_date = val
      } else if(order === 'two') {
        experienceTwo.value.end_date = val
      } else if(order === 'three') {
        experienceThree.value.end_date = val
      }
    }
    pickerVisible.value = false
  }
  const formattedEndDateOne = computed(() => {
    if (!experienceOne.value.end_date) return ''
    return new Date(experienceOne.value.end_date).toLocaleDateString('pt-BR')
  })
  const formattedStartDateOne = computed(() => {
    if (!experienceOne.value.start_date) return ''
    return new Date(experienceOne.value.start_date).toLocaleDateString('pt-BR')
  })
  const formattedEndDateTwo = computed(() => {
    if (!experienceTwo.value.end_date) return ''
    return new Date(experienceTwo.value.end_date).toLocaleDateString('pt-BR')
  })
  const formattedStartDateTwo = computed(() => {
    if (!experienceTwo.value.start_date) return ''
    return new Date(experienceTwo.value.start_date).toLocaleDateString('pt-BR')
  })
  const formattedEndDateThree = computed(() => {
    if (!experienceThree.value.end_date) return ''
    return new Date(experienceThree.value.end_date).toLocaleDateString('pt-BR')
  })
  const formattedStartDateThree = computed(() => {
    if (!experienceThree.value.start_date) return ''
    return new Date(experienceThree.value.start_date).toLocaleDateString('pt-BR')
  })
  const openDate = (type: string, orderType: string) => {
    typeDate.value =  type;
    pickerVisible.value = true;
    order.value = orderType;
  }
  //// Experiência profissional
  const experienceOne = ref<any>({
    id: null,
    position: null,
    end_date: null,
    start_date: null,
    company_name: null,
    description: null
  })
  const experienceTwo = ref<any>({
    id: null,
    position: null,
    end_date: null,
    start_date: null,
    company_name: null,
    description: null
  })
  const experienceThree = ref<any>({
    id: null,
    position: null,
    end_date: null,
    start_date: null,
    company_name: null,
    description: null
  })
  const dialogExperience = ref(false)
  const experiencesList = ref<any>([])

  const createExperience = async (experience: any, order: number) => {
      const { data, error } = await useFetch('/api/experiences', {
          method: 'POST',
          body: {
            position: experience.position,
            start_date: experience.start_date,
            end_date: experience.end_date,
            description: experience.description,
            company_name: experience.company_name,
            candidate_id: candidate.value.id,
            order: order,
            experience_group_id: experienceGroup.value.id,
            candidate_is_complete_experiences: candidate.value.is_complete_experiences,
            candidate_completion_percentage: candidate.value.completion_percentage
          }
      })
      if (error.value) {
        return
      }
      let title = `Criou a experiência: ${experience.position} - ${experience.company_name}${props.isAdmin ? ` do candidato de ID: ${candidate.value.id}` : ''}`
      createLog({
        title: title,
        profile_id: info.profile.id,
        type: 'create_experience'
      })
  }

  const changeExperiences = () => {
    show.setOverlayDashboard(true)
    let count = 0
    if(experienceOne.value.id) {
      count++
      updateExperience(experienceOne.value.id, experienceOne.value)
    } else {
      if(experienceOne.value.position && experienceOne.value.company_name) {
        count++
        createExperience(experienceOne.value, 1)
      }
    }
    if(experienceTwo.value.id) {
      count++
      updateExperience(experienceTwo.value.id, experienceTwo.value)
    } else {
      if(experienceTwo.value.position && experienceTwo.value.company_name) {
        count++
        createExperience(experienceTwo.value, 2)
      }
    }
    if(experienceThree.value.id) {
      count++
      updateExperience(experienceThree.value.id, experienceThree.value)
    } else {
      if(experienceThree.value.position && experienceThree.value.company_name) {
        count++
        createExperience(experienceThree.value, 3)
      }
    }
    setTimeout(() => {
      show.setOverlayDashboard(false)
      if(count > 0) {
        notify({ title: 'Parabéns!', text: 'Você atualizou as experiências do candidato', type: 'success' })
        dialogExperience.value = false;
        getExperiences()
      }
      if(!candidate.value.is_complete_experiences) {
        window.location.reload()
      }
    }, 500)
    
  }

  const getExperiences = async () => {
      const { data, error } = await useFetch('/api/experiences', {
          method: 'GET',
          params: {
            candidate_id: candidate.value.id,
            experience_group_id: experienceGroup.value.id
          }
      })

      if (error.value) {
          console.error('Erro ao carregar experiences:', error.value)
          return null
      }

      experiencesList.value = data.value
      const experience1 = data.value.find((item: any) => item.order === 1)
      if(experience1) {
        experienceOne.value = experience1
      }
      const experience2 = data.value.find((item: any) => item.order === 2)
      if(experience2) {
        experienceTwo.value = experience2
      }
      const experience3 = data.value.find((item: any) => item.order === 3)
      if(experience3) {
        experienceThree.value = experience3
      }
  }

  const updateExperience = async (id: string, experience: any) => {
      const { data, error } = await useFetch(`/api/experiences/${id}`, {
          method: 'PATCH',
          body: experience
      })

      if (error.value) {
        return
      }
      let title = `Editou a experiência: ${experience.position} - ${experience.company_name}${props.isAdmin ? ` do candidato de ID: ${candidate.value.id}` : ''}`
      createLog({
        title: title,
        profile_id: info.profile.id,
        type: 'update_experience'
      })
  }

  const { data, error, refresh, pending } = await useFetch('/api/experience_group', {
    method: 'GET',
    params: {
        candidate_id: candidate.value.id
    }
  })

  if (error.value) {
      console.error("Erro ao buscar grupo de experiência:", error.value);
  }

  if (data.value) { 
      const experiences: any[] = data.value as any[] 
      
      if (experiences.length) {
          experienceGroup.value = experiences[0]
          getExperiences()
      }
  }
</script>

<template>
  <v-dialog v-model="pickerVisible" width="auto">
    <v-card>
      <v-date-picker
        @update:model-value="(val: any) => onDateSelected(val, typeDate, order)"
      ></v-date-picker>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="pickerVisible = false">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-card>
    <v-card-title>
      <div class="d-flex align-center">
        <v-icon class="mr-2 text-gradient-primary">mdi-account-tie</v-icon>
        <h2 class="text-h6 font-weight-bold text-gradient-primary">Experiência profissional</h2>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-list v-if="experiencesList.length > 0" two-line class="mb-2">
        <v-list-item
          v-for="(item, i) in experiencesList"
          :key="i"
          class="pa-1 border mb-1 rounded"
        >
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">{{ item.position }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.company_name }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-btn class="bg-gradient-primary" @click="dialogExperience = true">
        {{ experiencesList.length > 2 ? 'Editar' : 'Adicionar' }}
      </v-btn>
    </v-card-text>
  </v-card>
  <v-dialog
    v-model="dialogExperience"
    max-width="800"
  >
    <v-card
        prepend-icon="mdi-account-tie"
        title="Adicionar experiência profissional"
      >
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <p class="text-body-2">
                Mencione abaixo suas três últimas experiências profissionais.
              </p>
              <p class="text-body-2 font-weight-bold">
                É preciso preencher o Nome da empresa e o Cargo para atualizar.
              </p>
            </v-col>
            <v-col cols="12" class="border pa-2 mt-2">
              <v-row dense>
                <v-col
                  cols="12" sm="6"
                >
                  <v-text-field
                    v-model="experienceOne.company_name"
                    required
                    :counter="10"
                    label="Nome da empresa"
                    density="compact"
                    hide-details
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12" sm="6"
                >
                  <v-text-field
                    :model-value="formattedStartDateOne"
                    label="Data inicial"
                    readonly
                    @click="openDate(`start_date`, 'one')"
                    density="compact"
                    hide-details
                    class="mb-1"
                    required
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12" sm="6"
                >
                  <v-text-field
                    :model-value="formattedEndDateOne"
                    label="Data final"
                    readonly
                    @click="openDate(`end_date`, 'one')"
                    density="compact"
                    hide-details
                    class="mb-1"
                    required
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12" sm="6"
                >
                  <v-text-field
                    v-model="experienceOne.position"
                    required
                    :counter="10"
                    label="Cargo"
                    density="compact"
                    hide-details
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                >
                  <v-textarea
                    label="Descrição"
                    v-model="experienceOne.description"
                    name="input-7-1"
                    variant="filled"
                    auto-grow
                    hide-details
                    density="compact"
                    class="mb-1"
                    rows="2"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="border pa-2 mt-2">
              <v-row dense>
                <v-col
                  cols="12" sm="6"
                >
                  <v-text-field
                    v-model="experienceTwo.company_name"
                    required
                    :counter="10"
                    label="Nome da empresa"
                    density="compact"
                    hide-details
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12" sm="6"
                >
                  <v-text-field
                    :model-value="formattedStartDateTwo"
                    label="Data inicial"
                    readonly
                    @click="openDate(`start_date`, 'two')"
                    density="compact"
                    hide-details
                    class="mb-1"
                    required
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12" sm="6"
                >
                  <v-text-field
                    :model-value="formattedEndDateTwo"
                    label="Data final"
                    readonly
                    @click="openDate(`end_date`, 'two')"
                    density="compact"
                    hide-details
                    class="mb-1"
                    required
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12" sm="6"
                >
                  <v-text-field
                    v-model="experienceTwo.position"
                    required
                    :counter="10"
                    label="Cargo"
                    density="compact"
                    hide-details
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                >
                  <v-textarea
                    label="Descrição"
                    v-model="experienceTwo.description"
                    name="input-7-1"
                    variant="filled"
                    auto-grow
                    hide-details
                    density="compact"
                    class="mb-1"
                    rows="2"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="border pa-2 mt-2">
              <v-row dense>
                <v-col
                  cols="12" sm="6"
                >
                  <v-text-field
                    v-model="experienceThree.company_name"
                    required
                    :counter="10"
                    label="Nome da empresa"
                    density="compact"
                    hide-details
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12" sm="6"
                >
                  <v-text-field
                    :model-value="formattedStartDateThree"
                    label="Data inicial"
                    readonly
                    @click="openDate(`start_date`, 'three')"
                    density="compact"
                    hide-details
                    class="mb-1"
                    required
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12" sm="6"
                >
                  <v-text-field
                    :model-value="formattedEndDateThree"
                    label="Data final"
                    readonly
                    @click="openDate(`end_date`, 'three')"
                    density="compact"
                    hide-details
                    class="mb-1"
                    required
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12" sm="6"
                >
                  <v-text-field
                    v-model="experienceThree.position"
                    required
                    :counter="10"
                    label="Cargo"
                    density="compact"
                    hide-details
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                >
                  <v-textarea
                    label="Descrição"
                    v-model="experienceThree.description"
                    name="input-7-1"
                    variant="filled"
                    auto-grow
                    hide-details
                    density="compact"
                    class="mb-1"
                    rows="2"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            text="Salvar"
            variant="flat"
            @click="changeExperiences()"
          ></v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
</style>
