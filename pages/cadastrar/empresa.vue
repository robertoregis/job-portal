<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'

interface FormSchema {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const { handleSubmit, handleReset, values } = useForm<FormSchema>({
  validationSchema: {
    name(value: string) {
      return value?.length >= 2 || 'O nome precisa ter no mínimo 2 caracteres.'
    },
    email(value: string) {
      return /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value) || 'O e-mail precisa ser válido.'
    },
    password(value: string) {
      return value?.length >= 6 || 'A senha precisa ter no mínimo 6 caracteres.'
    },
    passwordConfirm(value: string) {
      return value === values.password || 'As senhas não conferem.'
    },
  },
})

const name = useField<string>('name')
const email = useField<string>('email')
const password = useField<string>('password')
const passwordConfirm = useField<string>('passwordConfirm')

const submit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2))
})
</script>

<template>
  <div>
    <v-sheet width="100%" class="bg-gradient-primary py-1">
      <div class="d-flex justify-center">
        <h2 class="text-h6 font-weight-bold">Cadastrar</h2>
      </div>
    </v-sheet>

    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row>
          <v-col cols="12">
            <h1 class="text-h5 font-weight-bold">Algum título</h1>
          </v-col>

          <v-col cols="12">
            <p class="text-subtitle-1 mb-0">
              Praesent luctus, justo nec fringilla tincidunt, libero dolor sodales nisi, at suscipit mauris erat eu diam. Morbi a purus dignissim, egestas nunc quis, accumsan urna.
            </p>
          </v-col>

          <v-col cols="12">
            <form @submit.prevent="submit">
              <v-text-field
                v-model="name.value.value"
                :counter="10"
                :error-messages="name.errorMessage.value"
                label="Nome"
                density="comfortable"
              />

              <v-text-field
                v-model="email.value.value"
                :error-messages="email.errorMessage.value"
                label="E-mail"
                density="comfortable"
              />

              <v-text-field
                v-model="password.value.value"
                :error-messages="password.errorMessage.value"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                label="Senha"
                density="comfortable"
              />

              <v-text-field
                v-model="passwordConfirm.value.value"
                :error-messages="passwordConfirm.errorMessage.value"
                :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPasswordConfirm = !showPasswordConfirm"
                :type="showPasswordConfirm ? 'text' : 'password'"
                label="Senha novamente"
                density="comfortable"
              />

              <v-btn class="me-4" type="submit">
                Cadastrar
              </v-btn>

              <v-btn @click="handleReset">
                Limpar
              </v-btn>
            </form>
          </v-col>

          <v-col cols="12">
            <div class="d-flex flex-column">
              <p class="text-caption font-weight-bold">Se já possui cadastro, entre no sistema clicando no botão abaixo:</p>
            </div>
            <v-btn
              color="deep-purple-accent-4"
              text="Entrar"
              variant="flat"
              size="small"
              class="mt-1"
            ></v-btn>
          </v-col>
          
        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>

<style lang="scss" scoped>
</style>
