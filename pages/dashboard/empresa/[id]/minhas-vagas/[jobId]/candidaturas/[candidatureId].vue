<script setup lang="ts">
  definePageMeta({
    layout: 'dashboard'
  })
  const router = useRouter();

  const candidature = ref<any>({
    status: 'Enviada',
    icon_status: 'mdi-send'
  })

  const candidaturaStatusOptions = [
    { name: 'Enviada', icon: 'mdi-send' },
    { name: 'Em análise', icon: 'mdi-magnify' },
    { name: 'Em entrevista', icon: 'mdi-account-question' },
    { name: 'Avaliação final', icon: 'mdi-progress-clock' },
    { name: 'Aprovado', icon: 'mdi-check-circle' },
    { name: 'Rejeitado', icon: 'mdi-close-circle' },
    { name: 'Arquivada', icon: 'mdi-archive' },
    { name: 'Desistiu', icon: 'mdi-close-box-outline' },
  ]

  const salvarAlteracoes = () => {
    console.log('candidatura atualizada:', candidature.value)
    // Aqui você pode usar useFetch, axios ou algo semelhante para enviar ao backend
  }

  const onStatusSelect = (selected: any) => {
    candidature.value.status = selected.name
    candidature.value.icon_status = selected.icon
  }

  const navigation = (id: number) => {
    router.push(`/dashboard/empresa/123/candidatos/123`)
  }

</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span>Olá, Nome do candidato!</span>
        <span class="text-caption font-weight-bold">Seja bem vindo ao seu dashboard</span>
      </div>
    </v-col>
  </v-row>
  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="border">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-briefcase</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Candidatura</h2>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="d-flex align-center">
                <v-chip
                  class="bg-gradient-status"
                  variant="flat"
                >
                  <v-icon :icon="candidature.icon_status" start></v-icon>
                  Status: <span class="text-subtitle-1 font-weight-bold ml-2">{{ candidature.status }}</span>
                </v-chip>
              </div>
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Candidato:</span>
                <span class="text-body-2 ml-2">--------</span>
              </div>
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Endereço:</span>
                <span class="text-body-2 ml-2">--------</span>
              </div>
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold">Data de criação:</span>
                <span class="text-body-2 ml-2">--------</span>
              </div>
            </v-col>
            <v-col cols="12">
              <v-btn class="mt-2 bg-gradient-primary" @click="navigation">
                Ver candidato
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-title>
          <h2 class="text-h6 font-weight-bold text-gradient-primary">Gerenciar status</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div class="d-flex flex-column align-start">
            <v-select
              :items="candidaturaStatusOptions"
              :value="candidature.status"
              item-title="name"
              return-object
              density="comfortable"
              variant="outlined"
              hide-details
              color="primary"
              @update:modelValue="onStatusSelect"
              width="240"
            />
            <v-btn class="mt-2 bg-gradient-primary" @click="salvarAlteracoes">
              Salvar
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

  </v-row>
</template>

<style scoped lang="scss">
// Estilo opcional
</style>
