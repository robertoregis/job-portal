<script setup lang="ts">
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  const { notify } = useNotification();

  definePageMeta({
    layout: 'dashboard'
  })
  const info: any = useInfo();
  const show = useShow();
  const { createNotice, createLog } = useNotice();

  const router = useRouter();
  const page = ref({
    title: null,
    body: '',
    description: null
  })

  const createPage = async () => {
    show.setOverlayDashboard(true)
    const { data, error } = await useFetch('/api/pages', {
      method: 'POST',
      body: {
        ...page.value,
      }
    })
    if (error.value) {
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao criar a página', type: 'error' })
    } else {
      createNotice({
        title: 'Página criada',
        description: `Parabéns, você acabou de criar a página: ${page.value.title}`,
        subtitle: 'Página',
        profile_id: info.profile.id,
        type: 'info'
      })
      createLog({
        title: `Criou a página`,
        profile_id: info.profile.id,
        type: 'create_page'
      })
      show.setOverlayDashboard(false)
      notify({ title: 'Parabéns!', text: 'A página foi criada com sucesso', type: 'success' })
      router.push(`/dashboard/admin/paginas/${data.value.id}`)
      resetPage()
    }
  }

  const resetPage = () => {
    page.value = {
      title: null,
      body: '',
      description: null
    }
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Criar página</span>
        <span class="text-caption">Crie uma página para aparecer no site</span>
      </div>
    </v-col>
  </v-row>
  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="border">
      <v-card>
        <v-card-title class="text-h6">
          Criar nova página
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="createPage">
            <v-text-field
              v-model="page.title"
              label="Título"
              density="compact"
              hide-details
              class="mb-3"
              required
            />

            <v-textarea
              v-model="page.description"
              label="Descrição"
              placeholder=""
              density="compact"
              hide-details
              class="mb-3"
              rows="3"
            />

            <RichTextEditor v-model="page.body" />

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
