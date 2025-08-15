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
  const admin = ref<any>({})
  const loading = ref<boolean>(true)

  const getFormatDate = (date: string) => {
    if (!date) return ''
    const parts = date.split('-') // ["yyyy", "mm", "dd"]
    if (parts.length !== 3) return date

    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  }
  
  const { data, error, pending } = await useFetch(`/api/admins/${route.params.id}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    admin.value = data.value
    useHead({
      title: `${admin.value.name} - Conect RH One`,
      meta: [
        {
            name: 'description',
            content: 'Confira os dados do administrador do seu sistema.'
        }
      ]
    })
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Administrador</span>
        <span class="text-caption">Confira alguns dados dele</span>
      </div>
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-5">

    <v-col cols="12" class="border">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-account-circle</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Dados</h2>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Nome:</span>
                <span class="text-body-2 ml-2">{{ admin.name }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Data de nascimento:</span>
                <span class="text-body-2 ml-2">{{ getFormatDate(admin.birth_date) }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Endereço:</span>
                <span class="text-body-2 ml-2">{{ admin.address }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">E-mail:</span>
                <span class="text-body-2 ml-2">{{ admin.email }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Telefone:</span>
                <span class="text-body-2 ml-2">{{ admin.phone }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

  </v-row>
</template>

<style lang="scss" scoped>
</style>
