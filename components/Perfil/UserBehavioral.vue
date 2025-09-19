<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  import { useNotice } from '@/composables/useNotice';
  import { questions } from '@/composables/behavioral';
  const { createLog, createNotice } = useNotice();
  const { notify } = useNotification();
  const info: any = useInfo();
  const show = useShow();
  const emit = defineEmits(["submitted"])
  const props = defineProps({
    load: {
      type: Boolean,
      required: true
    },
    behavioral: {
      type: Object,
      required: false,
      default: {}
    }
  })
  const dialog = ref(false);
  const valid = ref(false);
  const result_behavioral = ref<any>({})
  const emailOfficial = useRuntimeConfig().public.EMAIL_OFFICIAL

  const formData = ref<any>({
    number_1: null,
    number_2: null,
    number_3: null,
    number_4: null,
    number_5: null,
    number_6: null,
    number_7: null,
    number_8: null,
    number_9: null,
    number_10: null,
    number_11: null,
    number_12: null,
    number_13: null,
    number_14: null,
    number_15: null,
    number_16: null,
    number_17: null,
    number_18: null,
    number_19: null,
    number_20: null,
    number_21: null,
    number_22: null,
    number_23: null,
    number_24: null,
    number_25: null,
    number_26: null,
  });

  watch(
    () => props.load, // getter
    (newValue, oldValue) => {
      if (newValue === true) {
        formData.value = {
          number_1: null,
          number_2: null,
          number_3: null,
          number_4: null,
          number_5: null,
          number_6: null,
          number_7: null,
          number_8: null,
          number_9: null,
          number_10: null,
          number_11: null,
          number_12: null,
          number_13: null,
          number_14: null,
          number_15: null,
          number_16: null,
          number_17: null,
          number_18: null,
          number_19: null,
          number_20: null,
          number_21: null,
          number_22: null,
          number_23: null,
          number_24: null,
          number_25: null,
          number_26: null,
        }
      }
    }
  )

  const sendMail = async () => {
    const { data, error } = await useFetch('/api/emails/send', {
      method: 'POST',
      body: {
        to: [`Connect One RH <${emailOfficial}>`],
        subject: 'Um novo questionário foi respondido',
        template: 'template_response_behavioral',
        variables: {
          name_candidate: info.user.name,
        }
      }
    })
  }

  // Enviar respostas
  const submitForm = async () => {
    const payload = Object.values(formData.value) // transforma em array
    const unanswered = payload.filter((item: any) => item === null)
    const count = unanswered.length
    if (count > 0) {
      notify({ title: 'Erro', text: `Você ainda não respondeu ${count} pergunta(s).`, type: 'error' })
      return
    }
    try {
      show.setOverlayDashboard(true)
      const { data, error } = await useFetch('/api/behavioral_profiles', {
          method: 'POST',
          body: {
            formdata: formData.value,
            candidate_id: info.user.id,
            candidate_is_complete_behavioral: info.user.is_complete_behavioral,
            candidate_completion_percentage: info.user.completion_percentage
          }
      })
      if (error.value) {
        //console.log(error.value)
        show.setOverlayDashboard(false)
        notify({ title: 'Erro', text: 'Erro ao responder questionário', type: 'error' })
        return
      }
      show.setOverlayDashboard(false)
      createLog({
        title: `Respondeu o questionáro do perfil comportamental`,
        profile_id: info.profile.id,
        type: 'response_behavioral_profiles'
      })
      createNotice({
        title: 'Questionário respondido',
        description: `O candidato ${info.user.name} respondeu o questionário do perfil comportamental`,
        subtitle: 'Perfil comportamental',
        profile_id: info.profile.id,
        type: 'info',
        is_master: true
      })
      sendMail()
      notify({ title: 'Parabéns!', text: 'O questionário foi respondido', type: 'success' })
      close("form")
    } catch(error) {
      console.log(error)
      notify({ title: 'Erro', text: 'Erro ao responder questionário', type: 'error' })
    }
  }

  const getResultBeharioval = async () => {
    if (!props.behavioral?.id) return; // não faz nada se não tiver id

    const params: Record<string, any> = {
      behavioral_profiles_id: props.behavioral.id
    }
    const { data, error } = await useFetch('/api/result_behavioral', {
      method: 'GET',
      params
    })

    if (data.value?.data?.length) {
      const res = data.value.data[0]
      result_behavioral.value = res
    }
  }

  const MAX_WIDTH = 300

  const getWidth = (val: string | number) => {
    let num = typeof val === 'number' ? val : parseInt(val.toString().replace('%', ''), 10)
    return Math.round((num / 100) * MAX_WIDTH)
  }

  const close = (type: string) => {
    dialog.value = false;
    emit("submitted", type)
    //clear()
  }

  watch(
    () => props.behavioral,
    (newVal) => {
      if (newVal && Object.keys(newVal).length > 0) {
        getResultBeharioval()
      }
    },
    { immediate: true } // roda imediatamente caso já tenha valor
  )

</script>

<template>
  <v-card>
    <v-card-title>
      <div class="d-flex align-center">
        <v-icon class="mr-2 text-gradient-primary">mdi-brain</v-icon>
        <h2 class="text-h6 font-weight-bold text-gradient-primary">Perfil Comportamental</h2>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div v-if="result_behavioral && result_behavioral.id" class="chart">
        <div class="chart-item">
          <h2>Dominância</h2>
          <div class="bar-bg">
            <div class="bar-fill bar-fill-1" :style="{ width: getWidth(result_behavioral.dominance) + 'px' }">
              {{ result_behavioral.dominance_formatted }}
            </div>
          </div>
        </div>
        <div class="chart-item">
          <h2>Influência</h2>
          <div class="bar-bg">
            <div class="bar-fill bar-fill-2" :style="{ width: getWidth(result_behavioral.influence) + 'px' }">
              {{ result_behavioral.influence_formatted }}
            </div>
          </div>
        </div>
        <div class="chart-item">
          <h2>Estabilidade</h2>
          <div class="bar-bg">
            <div class="bar-fill bar-fill-3" :style="{ width: getWidth(result_behavioral.steadiness) + 'px' }">
              {{ result_behavioral.steadiness_formatted }}
            </div>
          </div>
        </div>
        <div class="chart-item">
          <h2>Conformidade</h2>
          <div class="bar-bg">
            <div class="bar-fill bar-fill-4" :style="{ width: getWidth(result_behavioral.conscientiousness) + 'px' }">
              {{ result_behavioral.conscientiousness_formatted }}
            </div>
          </div>
        </div>
      </div>
      <template v-else>
        <v-btn v-if="Object.keys(behavioral).length === 0 || behavioral.is_redo" class="bg-gradient-primary" @click="dialog = true">
          Responder
        </v-btn>
        <span v-else>Já foi respondido e aguarda por avaliação</span>
      </template>
    </v-card-text>
  </v-card>

  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    fullscreen
  >
    <v-card>
      <v-toolbar>
        <v-btn icon="mdi-close" @click="close"></v-btn>
        <v-toolbar-title>Questionário comportamental</v-toolbar-title>
        <v-toolbar-items>
          <v-btn text="Enviar" variant="text" @click="submitForm"></v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <div class="d-flex flex-column mb-2">
          <p class="text-body-1 mb-1">
            Este questionário é rápido e tem como objetivo <span style="font-weight: 600;">entender melhor seu perfil comportamental</span>.
          </p>

          <p class="text-body-2 mb-4">
            O tempo estimado é de <strong class="text-success">5 minutos</strong>.  
            <br>
            <span class="text-error font-weight-bold">
              Caso saia antes de concluir, será necessário reiniciar o questionário.
            </span>
          </p>

          <v-divider></v-divider>

          <h2 class="mt-1 mb-1 text-h6 font-weight-bold">Selecione o adjetivo que melhor descreve você!</h2>
        </div>

        <v-form ref="formRef" v-model="valid">
          <div v-for="(question, index) in questions" :key="index" class="mb-1">
            <!--<p class="font-medium mb-2">{{ index + 1 }}. {{ question.text }}</p>-->
            <p class="font-medium mb-1">{{ index + 1 }}. {{ question.title }}</p>

            <!-- Texto 
            <v-text-field
              v-if="question.type === 'text'"
              v-model="answers[question.id]"
              :label="question.placeholder"
              variant="outlined"
              clearable
            />-->

            <!-- Múltipla escolha (checkbox)
            <v-checkbox
              v-else-if="question.type === 'checkbox'"
              v-for="opt in question.options"
              :key="opt"
              v-model="answers[question.id]"
              :label="opt"
              :value="opt"
              hide-details
            /> -->

            <!-- Escolha única (radio) -->
            <v-radio-group
              v-if="question.type === 'radio'"
              v-model="formData[question.id]"
              :inline="true"
            >
              <v-radio
                v-for="opt in question.options"
                :key="opt.id"
                :label="opt.value"
                :value="{ 
                  index: index + 1, 
                  title: 'Selecione o adjetivo que melhor descreve você!', 
                  response: opt   // aqui vai o objeto inteiro
                }"
              />
            </v-radio-group>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chart-item h2 {
  margin: 0 0 5px 0;
  font-size: 13px;
}

.bar-bg {
  width: 300px;
  height: 30px;
  background-color: #d4d2d2;
  border-radius: 15px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 15px 0 0 15px;
  display: flex;
  font-size: 12px;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  transition: width 0.5s ease;
}

.bar-fill-1 {
  background-color: #4caf50;
}
.bar-fill-2 {
  background-color: #2155c4;
}
.bar-fill-3 {
  background-color: #cc2525;
}
.bar-fill-4 {
  background-color: #dbb434;
}
</style>
