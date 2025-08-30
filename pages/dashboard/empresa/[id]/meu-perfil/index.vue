<script setup lang="ts">
  import { useShow } from '@/stores/show';
  import { useInfo } from '@/stores/info';
  definePageMeta({
    layout: 'dashboard'
  })
  const show = useShow();
  const info: any = useInfo();
  const { notify } = useNotification();
  const router = useRouter();
  const company = ref<any>({})
  const navigation = () => {
    router.push(`/dashboard/empresa/${info.user.id}/meu-perfil/editar`)
  }

  const getFormatDate = (date: string) => {
    if (!date) return ''
    const parts = date.split('-') // ["yyyy", "mm", "dd"]
    if (parts.length !== 3) return date

    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  }

  const { data, error, pending } = await useFetch(`/api/companies/${info.user.id}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    company.value = data.value
    useHead({
      title: `${company.value.name} - Conect One RH`,
      meta: [
        {
            name: 'description',
            content: 'Confira as informações da sua empresa.'
        }
      ]
    })
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Perfil da empresa</span>
        <span class="text-caption">Gerencie os dados da sua empresa</span>
      </div>
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="mt-4">
      <div class="d-flex">
        <v-btn
          @click="navigation"
          color="primary"
          text="Editar perfil"
          variant="flat"
        ></v-btn>
      </div>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-office-building</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Meus dados</h2>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Nome:</span>
                <span class="text-body-2 ml-2">{{ company.name }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Razão social:</span>
                <span class="text-body-2 ml-2">{{ company.legal_name }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">CNPJ:</span>
                <span class="text-body-2 ml-2">{{ company.cnpj }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Nome do representante:</span>
                <span class="text-body-2 ml-2">{{ company.representative_name }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">E-mail do representante:</span>
                <span class="text-body-2 ml-2">{{ company.representative_email }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">CPF do representante:</span>
                <span class="text-body-2 ml-2">{{ company.representative_cpf }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Data da fundação:</span>
                <span class="text-body-2 ml-2">{{ getFormatDate(company.foundation_at) }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Endereço:</span>
                <span class="text-body-2 ml-2">{{ company.address }}</span>
              </div>
              <div v-if="company.site || company.instagram || company.linkedin" class="d-flex align-center my-1" style="gap: 12px;">
                <v-btn v-if="company.site" icon :href="company.site" target="_blank" aria-label="Site" density="comfortable">
                  <v-icon>mdi-web</v-icon>
                </v-btn>

                <v-btn v-if="company.instagram" icon :href="company.instagram" target="_blank" aria-label="Instagram" density="comfortable">
                  <v-icon color="#E1306C">mdi-instagram</v-icon>
                </v-btn>

                <v-btn v-if="company.linkedin" icon :href="company.linkedin" target="_blank" aria-label="LinkedIn" density="comfortable">
                  <v-icon color="#0A66C2">mdi-linkedin</v-icon>
                </v-btn>
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
