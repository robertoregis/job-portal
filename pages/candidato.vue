<script setup lang="ts">
import { useField, useForm } from 'vee-validate'

interface FormSchema {
  email: string
  password: string
}

const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const { handleSubmit, handleReset, values } = useForm<FormSchema>({
  validationSchema: {
    email(value: string) {
      return /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value) || 'O e-mail precisa ser válido.'
    },
    password(value: string) {
      return value?.length >= 6 || 'A senha precisa ter no mínimo 6 caracteres.'
    },
  },
})

const email = useField<string>('email')
const password = useField<string>('password')

const submit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2))
})
</script>

<template>
  <div>
    <v-sheet width="100%" class="bg-gradient-primary py-1">
      <div class="d-flex justify-center">
        <h2 class="text-h6 font-weight-bold">Entrar</h2>
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

              <v-btn class="me-4" type="submit">
                Entrar
              </v-btn>

              <v-btn @click="handleReset">
                Limpar
              </v-btn>
            </form>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>

<style lang="scss" scoped>
</style>
