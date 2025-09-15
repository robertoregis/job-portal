<script setup lang="ts">
  import { useField, useForm } from 'vee-validate';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show'
  definePageMeta({
    layout: 'clean'
  })
  import { useNotice } from '@/composables/useNotice';
  const { createLog } = useNotice();
  const info: any = useInfo();
  const show = useShow();
  useHead({
    title: `Redefinir Senha - Conect One RH`,
    meta: [
      {
        name: 'description',
        content: 'Redefina sua senha e recupere o acesso à sua conta na Conect One RH.'
      }
    ]
  })
  const { notify } = useNotification();
  interface FormSchema {
    passwordConfirm: string
    password: string
  }
  const router = useRouter();
  const route = useRoute();
  const token = ref<any>(null)

  const { handleSubmit, handleReset, values } = useForm<FormSchema>({
    validationSchema: {
      password(value: string) {
        return value?.length >= 6 || 'A senha precisa ter no mínimo 6 caracteres.'
      },
      passwordConfirm(value: string) {
        if (!value || value.length < 6) {
          return 'A senha precisa ter no mínimo 6 caracteres.'
        }
        if (value !== values.password) {
          return 'As senhas precisam ser iguais.'
        }
        return true
      }
    },
  })

  const passwordConfirm = useField<string>('passwordConfirm')
  const password = useField<string>('password')

  const updateUser = handleSubmit(async (values) => {
    show.setOverlayDashboard(true);
    const supabase = useNuxtApp().$supabase;
    const { error } = await supabase.auth.updateUser({ password: values.password })
    show.setOverlayDashboard(false);
    if (error) {
      notify({ type: 'error', text: 'Erro ao redefinir a senha' })
    } else {
      createLog({
        title: `Redefiniu a senha`,
        profile_id: info.profile.id,
        type: 'reset_password'
      })
      notify({ type: 'success', text: 'Senha redefinida com sucesso! Você já pode entrar.' })
      window.location.href = `/entrar/${route.params.type}`
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  })
 
  onMounted(async () => {
    token.value = route.query.access_token as string || ''

    if (token.value) {
      const supabase = useNuxtApp().$supabase;
      const { error } = await supabase.auth.setSession(token.value)
      if (error) {
        // tratar erro
        console.error('Erro ao setar sessão:', error)
        notify({ title: '', text: 'Erro com o token', type: 'error' });
      }
    } else {
      // token faltando: não pode continuar
    }
  })

</script>
<template>
  <v-sheet class="d-flex justify-center align-center" style="min-height: 100vh; padding: 2rem;">
    <v-card max-width="600" min-width="400" class="pa-6" elevation="8">
      <h2 class="text-h5 font-weight-bold mb-4 text-center">Redefinir Senha</h2>

      <form v-if="token" @submit.prevent="updateUser">
        <v-text-field
          v-model="password.value.value"
          :error-messages="password.errorMessage.value"
          label="Nova senha"
          type="password"
          density="comfortable"
          required
        />

        <v-text-field
          v-model="passwordConfirm.value.value"
          :error-messages="passwordConfirm.errorMessage.value"
          label="Confirme a nova senha"
          type="password"
          density="comfortable"
          required
        />

        <v-btn
          type="submit"
          block
          color="primary"
          class="mt-6"
        >
          Redefinir senha
        </v-btn>
      </form>
      <span v-else>Não é possível sem um token</span>
    </v-card>
  </v-sheet>
</template>

