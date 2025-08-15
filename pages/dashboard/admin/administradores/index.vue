<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { formatDate } from '@/composables/formatDate';
  import { useShow } from '@/stores/show';
  import { useNotice } from '@/composables/useNotice';
  definePageMeta({
    layout: 'dashboard',
  })
  useHead({
    title: `Administradores - Conect RH One`,
    meta: [
      {
          name: 'description',
          content: 'Conheça todos os administradores do sistema.'
      }
    ]
  })
  const { createNotice, createLog } = useNotice();
  const { notify } = useNotification();
  const show = useShow();
  const info: any = useInfo();
  const router = useRouter()
  const page = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(1)
  const adminsList = ref<any[]>([])

  watch(page, () => {
    getAdmins()
  })

  // Navegação
  const navigation = (id: number) => {
    router.push(`/dashboard/admin/administradores/${id}`)
  }

  const getAdmins = async () => {
    const params: Record<string, any> = {
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }

    const { data, error } = await useFetch('/api/admins', {
      method: 'GET',
      params
    })

    if (error.value) {
    } else {
      adminsList.value = data.value?.data || []
      totalPages.value = data.value?.totalPages || 1
    }
  }

  const removeAdmin = async (id: string) => {
      show.setOverlayDashboard(true)
      const { data, error } = await useFetch(`/api/admins/${id}`, {
          method: 'DELETE'
      })
      show.setOverlayDashboard(false)
      if (error.value) {
          notify({ title: 'Erro', text: 'Erro ao remover o administrador', type: 'error' })
          return
      }
      createLog({
        title: `Removeu o administrador`,
        profile_id: info.profile.id,
        type: 'delete_admin'
      })
      notify({ title: 'Parabéns!', text: 'O administrador foi removido com sucesso', type: 'success' })
      getAdmins()
  }

  const { data: admins, error, refresh, pending } = await useFetch('/api/admins', {
    method: 'GET',
    params: {
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }
  })

  if (error.value) {
  } else {
    adminsList.value = admins.value?.data || []
    totalPages.value = admins.value?.totalPages || 1
  }

</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Administradores</span>
        <span class="text-caption">Confira todos os administradores.</span>
      </div>
    </v-col>
  </v-row>

  <!-- Botão criar -->
  <v-row no-gutters class="mt-4">
    <v-col cols="12">
      <div class="d-flex">
        <v-btn text="Criar administrador" variant="flat" class="bg-gradient-primary" @click="$router.push(`/dashboard/admin/administradores/criar`)" />
      </div>
    </v-col>
  </v-row>

  <!-- Lista de administradores -->
  <v-row no-gutters>
    <v-col cols="12" class="mt-4">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Administradores</v-list-subheader>

            <v-list-item v-if="adminsList.length === 0" class="px-4 text-grey">
              Nenhum administrador foi encontrado.
            </v-list-item>

            <v-list-item
              v-for="admin in adminsList"
              :key="admin.id"
              style="min-height: unset"
            >
              <v-card
                class="pa-2 border mb-2"
                elevation="2"
                ripple
                hover
                @click="navigation(admin.id)"
              >
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="d-flex align-center relative">
                      <v-avatar>
                        <v-img
                          :alt="admin.name"
                          :src="admin.image_url"
                        ></v-img>
                      </v-avatar>
                      <v-icon
                        v-if="admin.is_master"
                        icon="mdi-crown"
                        color="yellow-darken-3"
                        size="20"
                        style="
                          position: absolute;
                          top: 0;
                          left: 0;
                          background: white;
                          border-radius: 50%;
                        "
                      />
                      <div class="text-subtitle-1 font-weight-medium ml-2">{{ admin.name }}</div>
                    </div>
                    <div class="text-caption">
                      {{ admin.address }}
                    </div>
                  </div>

                  <div class="d-flex align-center">
                    <div class="text-caption text-grey-darken-1 mr-3">{{ admin.created_at_formatted }}</div>
                    <v-btn
                      v-if="info.user.is_master"
                      icon="mdi-delete"
                      size="x-small"
                      color="error"
                      @click.stop="removeAdmin(admin.id)"
                      title="Remover página"
                    />
                  </div>
                </div>
              </v-card>
            </v-list-item>

          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Paginação -->
    <v-col
      v-if="totalPages > 1"
      cols="12"
      class="d-flex justify-center mt-4"
    >
      <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="5"
        color="primary"
        rounded
      />
    </v-col>

  </v-row>
</template>

<style scoped lang="scss">
</style>
