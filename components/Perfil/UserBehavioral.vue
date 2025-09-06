<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  import { useNotice } from '@/composables/useNotice';
  const { createLog } = useNotice();
  const { notify } = useNotification();
  const info: any = useInfo();
  const show = useShow();
  const pickerVisible = ref(false)
  const typeDate = ref<string>('')
  const editingExperienceIndex = ref<any>(null)
  const experienceId = ref<string>('')

  const dialog = ref(false);
  const valid = ref(false);
  const formRef = ref(null);

  // Estrutura de perguntas
  const questions = [
    {
      id: "strengths",
      text: "Quais são seus principais pontos fortes?",
      type: "text",
      placeholder: "Digite sua resposta...",
      bind: "strengths" // <-- referência dentro de answers
    },
    {
      id: "teamwork",
      text: "Você prefere trabalhar sozinho ou em equipe?",
      type: "radio",
      options: ["CONTROLADO", "ENERGÉTICO", "ATENCIOSO", "SOCIÁVEL"],
      bind: "teamwork"
    },
    {
      id: "values",
      text: "Quais valores você considera mais importantes em um ambiente de trabalho?",
      type: "checkbox",
      options: ["Respeito", "Inovação", "Colaboração", "Autonomia"],
      bind: "values"
    }
  ];

  // Objeto para armazenar respostas
  const answers = ref<any>({
    strengths: "",   // texto
    teamwork: "",    // radio
    values: []       // checkbox (array!)
  });

  // Enviar respostas
  const submitForm = () => {
    console.log("Respostas do candidato:", answers.value);
    dialog.value = false;
  }

  const close = () => {
    dialog.value = false;
    answers.value = {
      strengths: "",
      teamwork: "",
      values: []
    }
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
      <v-btn class="bg-gradient-primary" @click="dialog = true">
        Responder
      </v-btn>
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
        <div class="d-flex flex-column mb-4">

          <p class="text-body-1 mb-1">
            Este questionário é rápido e tem como objetivo <span class="font-weight-bold">entender melhor seu perfil comportamental</span>.
          </p>

          <p class="text-body-2 mb-4">
            O tempo estimado é de <strong class="text-success">5 minutos</strong>.  
            <br>
            <span class="text-error font-weight-bold">
              Caso saia antes de concluir, será necessário reiniciar o questionário.
            </span>
          </p>

          <v-divider></v-divider>
        </div>

        <v-form ref="formRef" v-model="valid">
          <div v-for="(question, index) in questions" :key="index" class="mb-4">
            <p class="font-medium mb-2">{{ index + 1 }}. {{ question.text }}</p>

            <!-- Texto -->
            <v-text-field
              v-if="question.type === 'text'"
              v-model="answers[question.bind]"
              :label="question.placeholder"
              variant="outlined"
              clearable
            />

            <!-- Múltipla escolha (checkbox) -->
            <v-checkbox
              v-else-if="question.type === 'checkbox'"
              v-for="opt in question.options"
              :key="opt"
              v-model="answers[question.bind]"
              :label="opt"
              :value="opt"
              hide-details
            />

            <!-- Escolha única (radio) -->
            <v-radio-group
              v-else-if="question.type === 'radio'"
              v-model="answers[question.bind]"
              :inline="false"
            >
              <v-radio
                v-for="opt in question.options"
                :key="opt"
                :label="opt"
                :value="opt"
              />
            </v-radio-group>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
</style>
