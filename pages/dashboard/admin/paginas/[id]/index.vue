<script setup lang="ts">
  import { useShow } from '@/stores/show';
  import { useInfo } from '@/stores/info';
  import { useNotice } from '@/composables/useNotice';
  definePageMeta({
    layout: 'dashboard'
  })
  const router = useRouter()
  const route = useRoute()
  const show = useShow();
  const info: any = useInfo();
  const { notify } = useNotification();
  const { createNotice, createLog } = useNotice();
  const page = ref<any>({})
  const loading = ref<boolean>(true)

  const navigation = () => {
    router.back()
  }

  const updatePageStatus = async () => {
    show.setOverlayDashboard(true)
    const { data, error } = await useFetch(`/api/pages/${route.params.id}`, {
      method: 'PATCH',
      body: {
        is_active: page.value.is_active
      }
    })

    if (error.value) {
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao atualizar a página', type: 'error' })
      return
    }

    page.value = data.value
    createNotice({
      title: 'Página atualizada',
      description: `A página ${page.value.title} teve seu status atualizado`,
      subtitle: 'Página',
      profile_id: info.profile.id,
      type: 'info'
    })
    createLog({
      title: `Atualizou a página`,
      profile_id: info.profile.id,
      type: 'update_page'
    })
    show.setOverlayDashboard(false)
    notify({ title: 'Parabéns!', text: 'A página foi atualizada com sucesso', type: 'success' })
    //router.push(`/dashboard/empresa/${info.user.id}/minhas-vagas/${data.value.id}`)
  }
  
  const { data, error, pending } = await useFetch(`/api/pages/${route.params.id}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    page.value = data.value
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Página</span>
        <span class="text-caption">Confira a pré-visualização</span>
      </div>
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-5">
    <v-col cols="12">
      <div class="d-flex align-center">
        <v-btn
          @click="navigation"
          text="Voltar"
          variant="flat"
          class="bg-gradient-nav"
        ></v-btn>
        <v-btn
          @click="router.push(`/dashboard/admin/paginas/${route.params.id}/editar`)"
          text="Editar"
          variant="flat"
          class="bg-gradient-primary ml-3"
        ></v-btn>
      </div>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-file-document</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Página</h2>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <v-chip
                :color="`${page.is_active ? 'success' : 'error'}`"
                variant="flat"
              >
                <v-icon :icon="`${page.is_active ? 'mdi-power' : 'mdi-power-off'}`" start></v-icon>
                {{ page.is_active ? 'Ativada' : 'Desativada' }}
              </v-chip>
            </v-col>
            <v-col cols="12 mt-1">
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Title:</span>
                <span class="text-body-2 ml-2">{{ page.title }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Descrição:</span>
                <span class="text-body-2 ml-2">{{ page.description }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-title>
          <span>Pré-visualização</span>
        </v-card-title>
        <v-card-text>
          <div v-html="page.body"></div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card flat class="pa-4">
        <div class="d-flex align-center mb-4">
          <h3 class="text-subtitle-1 font-weight-bold text-gradient-primary">Gerenciar status</h3>
        </div>

        <v-row>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-switch
              v-model="page.is_active"
              :label="`${page.is_active ? 'Ativada' : 'Desativada'}`"
              color="success"
              inset
              hide-details
            />
          </v-col>

          <v-col cols="12">
            <v-btn class="mt-2 bg-gradient-primary" @click="updatePageStatus">
              Salvar alterações
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
</style>
