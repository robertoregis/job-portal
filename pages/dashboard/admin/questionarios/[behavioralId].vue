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
    conscientiousness_formatted: null,
    field_one_title: null,
    field_one_description: null,
    field_two_title: null,
    field_two_description: null
  })

  const labels: Record<string, string> = {
    dominance: "Dominante",
    influence: "Influente",
    steadiness: "Estabilidade",
    conscientiousness: "Cauteloso"
  }

  const parseNumber = (value: any): number | null => {
    if (value == null || value === "") return null

    // Se for string, troca vírgula por ponto e tenta parsear
    if (typeof value === "string") {
      const normalized = value.replace(",", ".")
      const parsed = parseFloat(normalized)
      return isNaN(parsed) ? null : parsed
    }
    // Se já for number
    if (typeof value === "number") return value

    return null
  }

  const sortedValues = computed(() => {
    const { dominance, influence, steadiness, conscientiousness } = formdata.value

    const values = {
      dominance: parseNumber(dominance),
      influence: parseNumber(influence),
      steadiness: parseNumber(steadiness),
      conscientiousness: parseNumber(conscientiousness),
    }
    // Se algum valor ainda for null, retorna array vazio
    if (Object.values(values).some(v => v == null)) {
      return []
    }
    return Object.entries(values)
      .sort((a, b) => (b[1]! - a[1]!)) // garante número
      .map(([key, value]) => ({
        key,
        label: labels[key] || key,
        value,
      }))
  })

  const titleOne = computed(() => {
    return sortedValues.value[0]?.label ?? null
  })

  const titleTwo = computed(() => {
    return sortedValues.value[1]?.label ?? null
  })

  const normalizeNumber = (input: string | number) => {
    // garante string para tratar vírgula/ponto
    let str = String(input).trim()
    // substitui vírgula por ponto para parseFloat
    const value = parseFloat(str.replace(',', '.'))
    if (isNaN(value)) return { dot: null, comma: null }
    // sempre gera duas versões: ponto e vírgula
    const dot = value.toString().replace(',', '.') // versão com ponto
    const comma = dot.replace('.', ',') // versão com vírgula
    return { dot, comma }
  }

  const createResult = async () => {
    if(!formdata.value.dominance || !formdata.value.influence || !formdata.value.steadiness || !formdata.value.conscientiousness) {
      notify({ title: 'Erro', text: 'Precisa preencher os quatros campos', type: 'error' })
      return
    }
    if(!formdata.value.field_one_description || !formdata.value.field_two_description) {
      notify({ title: 'Erro', text: 'Precisar descrever os dois campos', type: 'error' })
      return
    }
    formdata.value.dominance_formatted = `${normalizeNumber(formdata.value.dominance).comma}%`;
    formdata.value.dominance = normalizeNumber(formdata.value.dominance).dot;
    formdata.value.influence_formatted = `${normalizeNumber(formdata.value.influence).comma}%`;
    formdata.value.influence = normalizeNumber(formdata.value.influence).dot;
    formdata.value.steadiness_formatted = `${normalizeNumber(formdata.value.steadiness).comma}%`;
    formdata.value.steadiness = normalizeNumber(formdata.value.steadiness).dot;
    formdata.value.conscientiousness_formatted = `${normalizeNumber(formdata.value.conscientiousness).comma}%`;
    formdata.value.conscientiousness = normalizeNumber(formdata.value.conscientiousness).dot;
    formdata.value.field_one_title = titleOne.value
    formdata.value.field_two_title = titleTwo.value
    show.setOverlayDashboard(true)
    const { data, error } = await useFetch(`/api/result_behavioral`, {
      method: 'POST',
      body: {
        behavioral_profiles_id: route.params.behavioralId,
        candidate_id: behavioral.value.id_candidate,
        formdata: formdata.value,
      }
    })

    if (error.value) {
      //console.error('Erro ao avaliar questionário:', error.value)
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao avaliar questionário', type: 'error' })
      return
    }

    //behavioral.value = data.value
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

  const { data, error, pending } = await useFetch(`/api/behavioral_profiles/${route.params.behavioralId}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    behavioral.value = data.value
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
                <span class="text-h6 ml-2">{{ behavioral.name_candidate }}</span>
              </div>
            </v-col>

            <v-col cols="12" v-for="(question, index) in questions" :key="index" class="mb-3">
              <p class="font-medium mb-1"><span class="font-weight-bold">{{ index + 1 }}</span>.</p>
              <v-radio-group
                v-if="question.type === 'radio'"
                v-model="behavioral.answers[question.id].response.value"
                :inline="true"
                readonly
              >
                <v-radio
                  v-for="(opt, i) in question.options"
                  :key="opt.id"
                  :label="`${String.fromCharCode(97 + i)}. ${opt.value}`"
                  :value="opt.value"
                  class="text-body-2"
                />
              </v-radio-group>

            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    {{ behavioral }}

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
                v-for="(count, letter) in behavioral.counts"
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
          <v-col v-if="titleOne && titleTwo" cols="12">
            <p class="font-weight-bold">{{ titleOne }}</p>
            <v-textarea
              v-model="formdata.field_one_description"
              label="Descreva"
              variant="filled"
              auto-grow
              density="compact"
              hide-details
              class="mb-1 mt-1"
            />
            <p class="font-weight-bold">{{ titleTwo }}</p>
            <v-textarea
              v-model="formdata.field_two_description"
              label="Descreva"
              variant="filled"
              auto-grow
              density="compact"
              hide-details
              class="mb-1 mt-1"
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
