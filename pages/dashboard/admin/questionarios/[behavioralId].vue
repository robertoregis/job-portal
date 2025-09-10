<script setup lang="ts">
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  import { questions } from '@/composables/behavioral';
  const { notify } = useNotification();
  definePageMeta({
    layout: 'dashboard'
  })
  const { createNotice, createLog } = useNotice();
  const show = useShow();
  const info: any = useInfo();
  const router = useRouter();
  const route = useRoute();
  const behavioral = ref<any>({})
  const result = ref<any>({})
  const formdata = ref<any>({
    dominance: null,
    influence: null,
    steadiness: null,
    conscientiousness: null,
    dominance_formatted: null,
    influence_formatted: null,
    steadiness_formatted: null,
    conscientiousness_formatted: null
  })

  const createResult = async () => {
    if(!formdata.value.dominance || !formdata.value.influence || !formdata.value.steadiness || !formdata.value.conscientiousness) {
      notify({ title: 'Erro', text: 'Precisa preencher os quatros campos', type: 'error' })
      return
    }
    formdata.value.dominance_formatted = `${formdata.value.dominance}%`,
    formdata.value.influence_formatted = `${formdata.value.influence}%`,
    formdata.value.steadiness_formatted = `${formdata.value.steadiness}%`,
    formdata.value.conscientiousness_formatted = `${formdata.value.conscientiousness}%`
    show.setOverlayDashboard(true)
    const { data, error } = await useFetch(`/api/result_behavioral`, {
      method: 'POST',
      body: {
        behavioral_profiles_id: route.params.behavioralId,
        formdata: formdata.value
      }
    })

    if (error.value) {
      //console.error('Erro ao avaliar questionário:', error.value)
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao avaliar questionário', type: 'error' })
      return
    }

    behavioral.value = data.value
    createNotice({
      title: `O seu questionário foi avaliado`,
      description: `O seu questionário acabou de ser avaliado. Confira no seu perfil`,
      subtitle: 'Candidato',
      profile_id: behavioral.value.id_profile_candidate,
      is_master: false,
      type: 'info'
    })
    createLog({
      title: `Avaliou o questionário do candidato: ${behavioral.value.name_candidate}`,
      profile_id: info.profile.id,
      type: 'evaluated_behavioral'
    })
    show.setOverlayDashboard(false)
    notify({ title: 'Parabéns!', text: `Avaliação feita com sucesso`, type: 'success' })
    router.push(`/dashboard/admin/questionarios`)
  }

  // Supondo que você tenha a lista de perguntas
  const countLetters = () => {
    const letters: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 }

    questions.forEach((question, index) => {
      if (question.type === 'radio') {
        const value = behavioral.value.form_data[question.id]
        const optIndex = question.options.findIndex(opt => opt.value === value)
        if (optIndex >= 0) {
          const letter = String.fromCharCode(97 + optIndex) // 97 = 'a'
          letters[letter] = (letters[letter] || 0) + 1
        }
      }
    })

    return letters
  }

  const { data, error, pending } = await useFetch(`/api/behavioral_profiles/${route.params.behavioralId}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    behavioral.value = data.value
    result.value = countLetters()
    useHead({
      title: `Questionário - ${behavioral.value.name_candidate} - Conect One RH`,
      meta: [
        {
            name: 'description',
            content: 'Analise e dê uma nota para o questionário do candidato.'
        }
      ]
    })
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Questionário</span>
        <span class="text-caption">Faça a sua avaliação</span>
      </div>
    </v-col>
    <LayoutButtonBack />
  </v-row>

  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="border">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-clipboard-text</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Questionário</h2>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" class="mt-2">
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Nome:</span>
                <span class="text-body-2 ml-2">{{ behavioral.name_candidate }}</span>
              </div>
            </v-col>

            <v-col cols="12" v-for="(question, index) in questions" :key="index" class="mb-3">
              <p class="font-medium mb-1"><span class="font-weight-bold">{{ index + 1 }}</span>.</p>
              <v-radio-group
                v-if="question.type === 'radio'"
                v-model="behavioral.form_data[question.id]"
                :inline="true"
                readonly
              >
                <v-radio
                  v-for="(opt, i) in question.options"
                  :key="opt.id"
                  :label="`${String.fromCharCode(97 + i)}. ${opt.value}`"
                  :value="opt.value"
                />
              </v-radio-group>

            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card flat class="pa-4">
        <div class="d-flex align-center mb-4">
          <v-icon class="mr-2 text-gradient-primary">mdi-tune</v-icon>
          <h3 class="text-subtitle-1 font-weight-bold text-gradient-primary">Fazer avaliação</h3>
        </div>
        <v-row>
          <v-col cols="12">
            <div class="d-flex flex-column">
              <h2 class="mb-2">Resultado</h2>
              <div class="d-flex flex-row flex-wrap">
              <div
                v-for="(count, letter) in result"
                :key="letter"
                class="pa-2 mr-2 text-center border rounded"
                style="min-width: 50px;"
              >
                <div class="font-weight-bold text-h6">{{ letter }}</div>
                <div>{{ count }}</div>
              </div>
            </div>

            </div>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="formdata.dominance"
              :counter="10"
              label="Dominância"
              density="compact"
              hide-details
              class="mb-2"
            />
            <v-text-field
              v-model="formdata.influence"
              :counter="10"
              label="Influência"
              density="compact"
              hide-details
              class="mb-2"
            />
            <v-text-field
              v-model="formdata.steadiness"
              :counter="10"
              label="Estabilidade"
              density="compact"
              hide-details
              class="mb-2"
            />
            <v-text-field
              v-model="formdata.conscientiousness"
              :counter="10"
              label="Conformidade"
              density="compact"
              hide-details
              class="mb-2"
            />
          </v-col>
          <v-col cols="12">
            <v-btn class="mt-2 bg-gradient-primary" @click="createResult">
              Avaliar
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
</style>
