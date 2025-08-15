<script setup lang="ts">
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  const { notify } = useNotification();

  definePageMeta({
    layout: 'dashboard'
  })
  useHead({
    title: `Criar administrador - Conect RH One`,
    meta: [
      {
          name: 'description',
          content: 'Crie novos administradores para te ajudar com a Conect RH One.'
      }
    ]
  })
  const info: any = useInfo();
  const show = useShow();
  const { createNotice, createLog } = useNotice();

  const router = useRouter();
  const admin = ref<any>({
    name: null,
    email: null
  })

  const generatePassword = () => {
      const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      const letters = uppercaseLetters + 'abcdefghijklmnopqrstuvwxyz';
      const specialCharacters = '@#$&*%';
      let password = '';
      // Adiciona uma letra maiúscula
      password += uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
      // Adiciona dois números
      for (let i = 0; i < 2; i++) {
          password += numbers[Math.floor(Math.random() * numbers.length)];
      }
      // Adiciona duas letras
      for (let i = 0; i < 2; i++) {
          password += letters[Math.floor(Math.random() * letters.length)];
      }
      // Adiciona dois caracteres aleatórios (letras ou números)
      for (let i = 0; i < 2; i++) {
          if (Math.random() < 0.5) {
          password += numbers[Math.floor(Math.random() * numbers.length)];
          } else {
          password += letters[Math.floor(Math.random() * letters.length)];
          }
      }
      // Adiciona um caractere especial
      password += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
      return password
  }
  
  const sendMail = async (candidateName: string, candidateEmail: string, password: string) => {
    const { data, error } = await useFetch('/api/emails/send', {
      method: 'POST',
      body: {
        to: [`${candidateName} <${candidateEmail}>`],
        subject: 'O seu cadastro foi feito - Conect RH One',
        template: 'template_create_admin_connect',
        variables: {
          name: candidateName,
          password: password
        }
      }
    })

    if(error.value) {
      notify({ title: 'Erro', text: 'O email não foi enviado', type: 'error' })
    }
  }

  const createAdmin = async () => {
    if (!admin.value.name || !admin.value.email) {
      notify({ title: 'Erro', text: 'Preencha todos os campos', type: 'error' })
      return
    }
    show.setOverlayDashboard(true)
    const password = generatePassword()
    const { data, pending, error } = await useFetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: admin.value.name,
        email: admin.value.email,
        password: password,
        type: 'admin'
      }
    })
    if (error.value) {
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao criar o administrador', type: 'error' })
    } else {
      createNotice({
        title: 'Administrador criado',
        description: `Parabéns, você acabou de criar um novo administrador: ${admin.value.name}`,
        subtitle: 'Administrador',
        profile_id: info.profile.id,
        type: 'info'
      })
      createLog({
        title: `Criou o administrador`,
        profile_id: info.profile.id,
        type: 'create_admin'
      })
      sendMail(admin.value.name, 'roberttoregiss@gmail.com', password)
      show.setOverlayDashboard(false)
      notify({ title: 'Parabéns!', text: 'O administrador foi criado com sucesso e enviado um email', type: 'success' })
      router.push(`/dashboard/admin/administradores`)
      resetAdmin()
    }
  }

  const resetAdmin = () => {
    admin.value = {
      name: null,
      email: null
    }
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Criar administrador</span>
        <span class="text-caption">Crie um administrador para fazer parte da equipe</span>
      </div>
    </v-col>
  </v-row>
  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="border">
      <v-card>
        <v-card-title class="text-h6">
          Criar novo administrador
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="createAdmin">
            <v-text-field
              v-model="admin.name"
              :counter="10"
              label="Nome"
              density="compact"
              hide-details
              class="mb-2"
            />

            <v-text-field
              v-model="admin.email"
              label="E-mail"
              density="compact"
              hide-details
              class="mb-2"
            />

            <v-btn
              type="submit"
              class="mt-2 bg-gradient-primary"
            >
              Salvar
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
// Se quiser customizar algo
</style>
