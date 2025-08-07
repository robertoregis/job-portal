<script setup lang="ts">
  import { useField, useForm } from 'vee-validate';
  const authentication: any = useInfo();

  interface FormSchema {
    email: string
    password: string
  }
  const router = useRouter();
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

  const submit = handleSubmit(async (values) => {
    //alert(JSON.stringify(values, null, 2))
    const supabase = useNuxtApp().$supabase

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    })

    if (error) {
      console.error('Erro ao logar:', error)
    } else {
      alert('Candidato logado')
      const user = {
        id: data.session.user.id,
        email: values.email,
        type: 'candidate'
      }
      localStorage.setItem('user', JSON.stringify(user))
      authentication.setUser(user)
      router.push(`/dashboard/candidato/${data.session.user.id}`)
      console.log('Usuário logado:', data.session.user)
    }
    /*const { data, error, pending } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: values.email,
        password: values.password,
        type: 'company'
      }
    })

    if (error.value) {
      console.error('Erro no login:', error.value)
    } else {
      alert('Usuário logado:')
      console.log('Usuário logado:', data.value)
    }*/

  })

  const navigation = (id: number) => {
    router.push(`/cadastrar/candidato`)
  }
</script>

<template>
  <div>

    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row>
          <v-col cols="12">
            <h1 class="text-h5 font-weight-bold">Entrar!</h1>
          </v-col>

          <v-col cols="12">
            <p class="text-subtitle-1 mb-0">
              Preencha os campos e entre no sistema.
            </p>
          </v-col>

          <v-col cols="12" class="mt-4" style="max-width: 600px; margin: 0 auto;">
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

          <v-col cols="12" class="mt-4" style="max-width: 600px; margin: 0 auto;">
            <div class="d-flex flex-column">
              <p class="text-caption font-weight-bold">Se ainda não possui cadastro, faça clicando no botão abaixo:</p>
            </div>
            <v-btn
              @click="navigation"
              text="Cadastrar"
              variant="flat"
              size="small"
              class="mt-1 bg-gradient-primary"
            ></v-btn>
          </v-col>

        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>

<style lang="scss" scoped>
</style>
