<script setup lang="ts">
  definePageMeta({
    layout: 'dashboard' // ou outro nome, conforme os arquivos em layouts/
  })
  const router = useRouter();
  const navigation = (link: string) => {
    router.push('/dashboard/empresa/123/meu-perfil/editar')
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
      <v-col cols="12" class="mt-4">
        <div class="d-flex">
          <v-btn
            @click="navigation"
            color="deep-purple-accent-4"
            text="Editar perfil"
            variant="flat"
          ></v-btn>
        </div>
      </v-col>

      <v-col cols="12" class="border mt-4">
        <v-card>
          <v-card-title>
            <div class="d-flex align-center">
              <v-icon class="mr-2 text-gradient-primary">mdi-account-circle</v-icon>
              <h2 class="text-h6 font-weight-bold text-gradient-primary">Meus dados</h2>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12">
                <div class="d-flex align-center">
                  <span class="text-subtitle-2 font-weight-bold">Nome:</span>
                  <span class="text-body-2 ml-2">000000000</span>
                </div>
                <div class="d-flex align-center">
                  <span class="text-subtitle-2 font-weight-bold">Razão social:</span>
                  <span class="text-body-2 ml-2">000000000 (40 anos)</span>
                </div>
                <div class="d-flex align-center">
                  <span class="text-subtitle-2 font-weight-bold">CNPJ:</span>
                  <span class="text-body-2 ml-2">000000000</span>
                </div>
                <div class="d-flex align-center">
                  <span class="text-subtitle-2 font-weight-bold">Nome do representante:</span>
                  <span class="text-body-2 ml-2">000000000</span>
                </div>
                <div class="d-flex align-center">
                  <span class="text-subtitle-2 font-weight-bold">E-mail do representante:</span>
                  <span class="text-body-2 ml-2">000000000</span>
                </div>
                <div class="d-flex align-center">
                  <span class="text-subtitle-2 font-weight-bold">CPF do representante:</span>
                  <span class="text-body-2 ml-2">000000000</span>
                </div>
                <div class="d-flex align-center">
                  <span class="text-subtitle-2 font-weight-bold">Endereço:</span>
                  <span class="text-body-2 ml-2">000000000</span>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!--<v-col cols="12" class="border mt-4">
        <v-card>
          <v-card-text class="pa-0">
            
              
          </v-card-text>
        </v-card>
      </v-col>-->
  </v-row>
</template>

<style lang="scss" scoped>

</style>