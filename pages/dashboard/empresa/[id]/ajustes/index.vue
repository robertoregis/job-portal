<script setup lang="ts">
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
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
      allow_candidate_email: data.value[0].allow_candidate_email,
    }
    config.value = data.value[0]
  }
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

  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="border">
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
  </v-row>
</template>

<style lang="scss" scoped>
</style>
