<script setup lang="ts">
  import { useInfo } from '@/stores/info';
    import { useShow } from '@/stores/show';
    const { notify } = useNotification();
    const info: any = useInfo();
    const show = useShow();
  const pickerVisible = ref(false)
  const typeDate = ref<string>('')
  const editingExperienceIndex = ref<any>(null)
  const experienceId = ref<string>('')
  const onDateSelected = (val: string, type: string) => {
    if (type === 'start_date') {
      experience.value.start_date = val  // ISO direto
    } else if (type === 'end_date') {
      experience.value.end_date = val    // ISO direto
    }
    pickerVisible.value = false
  }
  const formattedEndDate = computed(() => {
    if (!experience.value.end_date) return ''
    return new Date(experience.value.end_date).toLocaleDateString('pt-BR')
  })
  const formattedStartDate = computed(() => {
    if (!experience.value.start_date) return ''
    return new Date(experience.value.start_date).toLocaleDateString('pt-BR')
  })
  const openDate = (type: string) => {
    typeDate.value =  type;
    pickerVisible.value = true;
  }
  //// Experiência profissional
  const periods = [
    'Menos de 6 meses',
    'Entre 6 meses e 1 ano',
    'Entre 1 a 3 anos',
    'Entre 3 a 5 anos',
    'Mais de 5 anos',
  ]
  const experience = ref<any>({
    period: null,
    end_date: null,
    start_date: null,
    company_name: null,
    description: null
  })
  const dialogExperience = ref(false)
  const experiencesList = ref<any>([])
  
  const editExperience = (index: any, id: string) => {
    const item = experiencesList.value[index]
    experience.value = { ...item }
    experienceId.value = id
    editingExperienceIndex.value = index
    dialogExperience.value = true
  }
  const clearExperience = () => {
    experience.value = {
      period: null,
      end_date: null,
      start_date: null,
      company_name: null,
      description: null
    }
    dialogExperience.value = false;
    editingExperienceIndex.value = null
    experienceId.value = ''
  }
  ///

  const changeExperience = () => {
      if (!experience.value.period || !experience.value.company_name) {
        notify({ title: 'Erro', text: 'Selecione o nome da empresa e o período', type: 'error' })
        return
      }
      // Opção 1: verificar se não é null nem undefined
      if (editingExperienceIndex.value !== null && editingExperienceIndex.value !== undefined) {
          updateExperience(experienceId.value)
      } else {
          createExperience()
      }
  }

  const createExperience = async () => {
    show.setOverlayDashboard(true)
      const { data, error } = await useFetch('/api/experiences', {
          method: 'POST',
          body: {
              period: experience.value.period,
              start_date: experience.value.start_date,
              end_date: experience.value.end_date,
              description: experience.value.description,
              company_name: experience.value.company_name,
              candidate_id: info.user.id
          }
      })

      show.setOverlayDashboard(false)
      if (error.value) {
        notify({ title: 'Erro', text: 'Erro ao criar a exeriência', type: 'error' })
        return
      }

      notify({ title: 'Parabéns!', text: 'A exeriência foi criada com sucesso', type: 'success' })
      getExperiences()
      clearExperience()

  }

  const getExperiences = async () => {
      const { data, error } = await useFetch('/api/experiences', {
          method: 'GET',
          params: {
              candidate_id: info.user.id
          }
      })

      if (error.value) {
          console.error('Erro ao carregar experiences:', error.value)
          return null
      }

      experiencesList.value = data.value
  }

  const updateExperience = async (id: string) => {
    show.setOverlayDashboard(true)
      const { data, error } = await useFetch(`/api/experiences/${id}`, {
          method: 'PATCH',
          body: experience.value
      })

      show.setOverlayDashboard(false)
      if (error.value) {
        notify({ title: 'Erro', text: 'Erro ao editar a exeriência', type: 'error' })
        return
      }

      notify({ title: 'Parabéns!', text: 'A exeriência foi editada com sucesso', type: 'success' })
      getExperiences()
      clearExperience()
  }

  const removeExperience = async (id: string) => {
    show.setOverlayDashboard(true)
      const { data, error } = await useFetch(`/api/experiences/${id}`, {
          method: 'DELETE'
      })
      show.setOverlayDashboard(false)
      if (error.value) {
        notify({ title: 'Erro', text: 'Erro ao remover a exeriência', type: 'error' })
        return
      }

      notify({ title: 'Parabéns!', text: 'A exeriência foi removida com sucesso', type: 'success' })
      getExperiences()
  }

  const { data: experiences, error, refresh, pending } = await useFetch('/api/experiences', {
      method: 'GET',
      params: {
          candidate_id: info.user.id
      }
  })

  if (error.value) {
  } else {
      experiencesList.value = experiences.value
  }
</script>

<template>
  <v-dialog v-model="pickerVisible" width="auto">
    <v-card>
      <v-date-picker
        @update:model-value="(val: any) => onDateSelected(val, typeDate)"
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
        <v-icon class="mr-2 text-gradient-primary">mdi-account-circle</v-icon>
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
            <v-list-item-title class="font-weight-bold">{{ item.company_name }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.period }}</v-list-item-subtitle>
          </v-list-item-content>
          <!-- Botões de ação no canto superior direito -->
          <template #append>
          <div class="d-flex align-center justify-end ga-1">
              <v-btn
              icon="mdi-pencil"
              size="x-small"
              @click="editExperience(i, item.id)"
              ></v-btn>

              <v-btn
              icon="mdi-delete"
              size="x-small"
              color="error"
              @click="removeExperience(item.id)"
              ></v-btn>
          </div>
          </template>
        </v-list-item>
      </v-list>

      <v-btn class="bg-gradient-primary" @click="dialogExperience = true">
        Adicionar
      </v-btn>
    </v-card-text>
  </v-card>
  <v-dialog
    v-model="dialogExperience"
    max-width="400"
  >
    <v-card
        prepend-icon="mdi-account"
        title="Criar experiência profissional"
      >
        <v-card-text>
          <v-row dense>
            <v-col
              cols="12"
            >
              <v-text-field
                v-model="experience.company_name"
                required
                :counter="10"
                label="Nome da empresa"
                density="compact"
                hide-details
                class="mb-1"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
            >
              <v-text-field
                :model-value="formattedStartDate"
                label="Data inicial"
                readonly
                @click="openDate(`start_date`)"
                density="compact"
                hide-details
                class="mb-1"
                required
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
            >
              <v-text-field
                :model-value="formattedEndDate"
                label="Data final"
                readonly
                @click="openDate(`end_date`)"
                density="compact"
                hide-details
                class="mb-1"
                required
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
            >
            <v-select
              v-model="experience.period"
              :items="periods"
              label="Périodo"
              hide-details
              density="compact"
              class="mb-1"
            />
            </v-col>

            <v-col
              cols="12"
            >
              <v-textarea
                label="Descrição"
                v-model="experience.description"
                name="input-7-1"
                variant="filled"
                auto-grow
                hide-details
                density="compact"
                class="mb-1"
              ></v-textarea>
            </v-col>
          </v-row>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Fechar"
            color="error"
            variant="flat"
            @click="clearExperience"
          ></v-btn>

          <v-btn
            color="success"
            :text="`${editingExperienceIndex !== null ? 'Salvar' : 'Adicionar'}`"
            variant="flat"
            @click="changeExperience"
          ></v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
</style>
