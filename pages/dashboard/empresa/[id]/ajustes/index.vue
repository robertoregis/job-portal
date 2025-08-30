<script setup lang="ts">
  import { useField, useForm } from 'vee-validate';
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  const { createLog } = useNotice();
  interface FormSchema {
    password: string
    passwordConfirm: string
  }
  useHead({
    title: `Ajustes - Conect One RH`,
    meta: [
      {
          name: 'description',
          content: 'Configure preferências e altere sua senha.'
      }
    ]
  })
  const { notify } = useNotification();
  const info: any = useInfo();
  const show = useShow();
  const config = ref<any>({})
  const formdata = ref<any>({
    allow_candidate_email: null
  })

  definePageMeta({
    layout: 'dashboard' // ou outro nome, conforme os arquivos em layouts/
  })

  // Aqui você pode adicionar uma função para salvar a configuração, se quiser
  const saveSettings = async () => {
    show.setOverlayDashboard(true)
    try {
      const { data, error } = await useFetch(`/api/configurations/${config.value.id}`, {
        method: 'PATCH',
        body: formdata.value
      })

      if (error.value) {
        console.error('Erro ao atualizar a configuração da empresa:', error.value)
        return
      }
      show.setOverlayDashboard(false)
      createLog({
        title: `Atualizou as configurações`,
        profile_id: info.profile.id,
        type: 'update_configuration'
      })
      notify({ title: 'Parabéns!', text: 'Os teus dados da configuração foram atualizados', type: 'success' })
    } catch (err) {
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao atualizar', type: 'error' })
    }
  }

  const { data, error, pending }: any = await useFetch(`/api/configurations`, {
    method: 'GET',
    params: {
      company_id: info.user.id
    }
  })

  if (error.value) {
  } else {
    formdata.value = {
      allow_candidate_email: data.value.allow_candidate_email,
    }
    config.value = data.value
  }

  const showPassword = ref(false)
  const showPasswordConfirm = ref(false)

  const { handleSubmit, handleReset, values } = useForm<FormSchema>({
    validationSchema: {
      password(value: string) {
        return value?.length >= 6 || 'A senha precisa ter no mínimo 6 caracteres.'
      },
      passwordConfirm(value: string) {
        return value === values.password || 'As senhas não conferem.'
      },
    },
  })

  const password = useField<string>('password')
  const passwordConfirm = useField<string>('passwordConfirm')

  const updatePassword = handleSubmit(async (values) => {
    show.setOverlayDashboard(true)
    const supabase = useNuxtApp().$supabase;
    const { error } = await supabase.auth.updateUser({ password: values.password })
    show.setOverlayDashboard(false);
    if (error) {
      notify({ type: 'error', text: 'Erro ao redefinir a senha' })
    } else {
      createLog({
        title: `Mudou a senha`,
        profile_id: info.profile.id,
        type: 'update_password'
      })
      handleReset()
      notify({ type: 'success', text: 'Senha atualizada com sucesso!' })
    }
  })
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Área de ajustes</span>
        <span class="text-caption">Configure o seu sistema</span>
      </div>
    </v-col>
  </v-row>

  <v-row  no-gutters class="mt-5">
    <v-col v-if="!info.user.is_approved" cols="12" class="border">
      <v-card>
        <v-card-title>
          <span class="text-subtitle-1">A sua conta não está aprovada</span>
        </v-card-title>
      </v-card>
    </v-col>
    <v-col v-if="info.user.is_approved" cols="12" class="border">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-cog</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Configuração</h2>
          </div>
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text>
          <v-checkbox
            v-model="formdata.allow_candidate_email"
            label="Permitir que o candidato envie email na página da vaga"
            color="primary"
            hide-details
          ></v-checkbox>

          <v-btn class="mt-3 bg-gradient-primary" @click="saveSettings">
            Salvar
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col v-if="info.user.is_approved" cols="12" class="border mt-4">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-account-key</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Mudar a senha</h2>
          </div>
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" lg="6">
              <div class="d-flex mb-2">
                <span class="text-caption text-warning font-weight-bold">O seu email de cadastro precisa ser válido.</span>
              </div>
              <form @submit.prevent="updatePassword">
                <v-text-field
                  v-model="password.value.value"
                  :error-messages="password.errorMessage.value"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  :type="showPassword ? 'text' : 'password'"
                  label="Nova senha"
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

                <v-btn class="me-4 bg-gradient-primary" type="submit">
                  Salvar
                </v-btn>

              </form>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
</style>
