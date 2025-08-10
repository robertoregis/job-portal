<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  definePageMeta({
    layout: 'dashboard' // ou outro nome, conforme os arquivos em layouts/
  })
  const info: any = useInfo();
  const page = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(1)
  const noticesList = ref<any[]>([])

  watch(page, () => {
    getNotices()
  })

  const getNotices = async () => {
    const params: Record<string, any> = {
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }

    // Filtro por empresa (se houver)
    if (info.profile.id) {
      params.candidate_id = info.profile.id
    }

    const { data, error } = await useFetch('/api/notices', {
      method: 'GET',
      params
    })

    if (error.value) {
      console.error('Erro ao carregar avisos:', error.value)
    } else {
      noticesList.value = data.value?.data || []
      totalPages.value = data.value?.totalPages || 1
    }
  }

  const { data: notices, error, refresh, pending } = await useFetch('/api/notices', {
    method: 'GET',
    params: {
      profile_id: info.profile.id,
      page: page.value.toString(),
      pageSize: pageSize.value.toString()
    }
  })

  if (error.value) {
    console.error('Erro ao carregar avisos:', error.value)
  } else {
    noticesList.value = notices.value?.data || []
    totalPages.value = notices.value?.totalPages || 1
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Avisos!</span>
        <span class="text-caption">Confira todos os teus avisos.</span>
      </div>
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="border">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Avisos</v-list-subheader>
            <template
              v-for="(notice, index) in noticesList"
              :key="notice.id"
            >
              <v-list-item class="py-3">
                <v-list-item-title class="text-caption font-weight-bold">
                  {{ notice.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-body-2">
                  {{ notice.description }}
                </v-list-item-subtitle>

                <template v-slot:append="{ isSelected }">
                  <v-list-item-action class="flex-column align-end">
                    <small class="mb-4 opacity-60">{{ notice.created_at_formatted }}</small>
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-divider v-if="index < noticesList.length - 1"></v-divider>
            </template>
            <v-list-item v-if="noticesList.length === 0">
              <v-list-item-title class="text-body-2">Nenhum aviso encontrado.</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col>
      <v-pagination
        v-if="totalPages > 1"
        v-model="page"
        :length="totalPages"
        :total-visible="5"
        color="primary"
        class="my-4"
        rounded
      />
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
</style>
