<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  import { useNotice } from '@/composables/useNotice';
  const { createLog } = useNotice();
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
    try {
      show.setOverlayDashboard(true)
      const { data, error } = await useFetch('/api/behavioral_profiles', {
          method: 'POST',
          body: {
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
      uploadImage(data.value.id)
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

  const imagePreview = ref<any>(null)

  const file = ref<File | null>(null)
  const fileInput: any = ref(null)
  const triggerFileInput = () => {
    fileInput.value?.click()
  }

  const previewImage = () => {
    if (!file.value) {
      imagePreview.value = null
      return
    }
    const selectedFile = file.value

    if (selectedFile instanceof File) {
      imagePreview.value = URL.createObjectURL(selectedFile)
    } else if (Array.isArray(selectedFile)) {
      imagePreview.value = selectedFile.length > 0 ? URL.createObjectURL(selectedFile[0]) : null
    }
  }

  const uploadImage = async (behavioralId: string) => {
    if (!file.value) {
      notify({ title: 'Erro', text: 'Selecione uma imagem', type: 'error' })
      show.setOverlayDashboard(false)
      return
    }

    const formDataTy = new FormData()
    formDataTy.append('file', file.value)
    const url = `/api/images/behavioral?behavioral_profiles_id=${behavioralId}`

    const { data: imageData, error: imageError }: any = await useFetch(url, {
      method: 'POST',
      body: formDataTy
    })

    if (imageError.value) {
      //console.log(imageError.value)
      notify({ title: 'Erro', text: 'Erro ao enviar imagem', type: 'error' })
    } else {
      createLog({
        title: `Respondeu o questionáro do perfil comportamental`,
        profile_id: info.profile.id,
        type: 'response_behavioral_profiles'
      })
      sendMail()
      setTimeout(() => {
        createLog({
          title: `Anexou o print do resultado do perfil comportamental`,
          profile_id: info.profile.id,
          type: 'register_photo_behavioral'
        })
        notify({ title: 'Parabéns!', text: 'O questionário foi respondido', type: 'success' })
        close("form")
      }, 1000)
    }
    setTimeout(() => {
      show.setOverlayDashboard(false)
    }, 1000)
  }

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
            Visite este link <a href="https://www.mrcoach.com.br/teste-perfil-comportamental-disc.php">https://www.mrcoach.com.br/teste-perfil-comportamental-disc.php</a> e faça o teste. É simples de fazer.
          </p>
          <p class="text-body-2 mb-4">
            Depois que fizer, tire print do resultado (exemplo do print na imagem a seguir) e o anexe aqui em baixo.
          </p>
          <div class="mb-4">
            <img src="https://uhwfvrjhlhvxyrrlaqna.supabase.co/storage/v1/object/public/jobportal/default/resultado.png" alt="" style="max-width: 400px">
          </div>

          <v-divider></v-divider>

          <div class="d-flex flex-column mt-4">
            <div v-if="file" class="d-flex align-center mb-2">
              <div class="pa-1 shadow border-md">
                <img :src="imagePreview" alt="" style="max-width: 100px; max-height: 50px;">
              </div>
              <span class="ml-2 text-caption">{{ file.name }}</span>
            </div>
            <v-file-input
              ref="fileInput"
              accept="image/*"
              v-model="file"
              style="display: none"
              @change="previewImage"
            ></v-file-input>
            <div class="d-flex">
              <v-btn @click="triggerFileInput" class="bg-orange-darken-3">{{ file ? 'Trocar resultado' : 'Anexar resultado' }}</v-btn>
            </div>
            <span class="mt-4 text-caption font-weight-bold">Depois de enviado, se o print estiver válido, mandaremos o resultado.</span>
            <div class="d-flex mt-1">
              <v-btn @click="submitForm" class="bg-gradient-primary">Enviar</v-btn>
            </div>
          </div>
        </div>
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
