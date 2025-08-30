<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  definePageMeta({
    layout: 'dashboard'
  })
  const info: any = useInfo();
  const { notify } = useNotification();
  const router = useRouter();
  const navigation = (link: string) => {
    router.push(`/dashboard/admin/meu-perfil/editar`)
  }
  const admin = ref<any>({})
  const loading = ref<boolean>(true)

  const getFormatDate = (date: string) => {
    if (!date) return ''
    const parts = date.split('-') // ["yyyy", "mm", "dd"]
    if (parts.length !== 3) return date

    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  }

  const { data, error, pending } = await useFetch(`/api/admins/${info.user.id}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    admin.value = data.value
    useHead({
      title: `${admin.value.name} - Conect One RH`,
      meta: [
        {
            name: 'description',
            content: 'Confira suas informações de administrador.'
        }
      ]
    })
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Meu perfil</span>
        <span class="text-caption">Confira e atualize seus dados pessoais</span>
      </div>
    </v-col>
  </v-row>
  
  <v-row no-gutters class="mt-5">
    <v-col cols="12">
      <div class="d-flex">
        <v-btn
          @click="navigation('editar')"
          color="primary"
          text="Editar perfil"
          variant="flat"
        />
      </div>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-account-circle</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Dados pessoais</h2>
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
/* Seu estilo opcional aqui */
</style>
