<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
const router = useRouter()

const navigation = () => {
  router.back()
}
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="">Dados do candidato</span>
        <span class="text-caption font-weight-bold">Detalhes do candidato selecionado nesta candidatura</span>
      </div>
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="mt-4">
      <div class="d-flex">
        <v-btn
          @click="navigation"
          text="Voltar"
          variant="flat"
          class="bg-gradient-nav"
        ></v-btn>
      </div>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-account-circle</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Editar dados</h2>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Nome:</span>
                <span class="text-body-2 ml-2">João da Silva</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Data de nascimento:</span>
                <span class="text-body-2 ml-2">10/05/1985 (40 anos)</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Estado civil:</span>
                <span class="text-body-2 ml-2">Casado</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Endereço:</span>
                <span class="text-body-2 ml-2">Rua das Flores, 123 - São Paulo, SP</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">E-mail:</span>
                <span class="text-body-2 ml-2">joao.silva@email.com</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Telefone:</span>
                <span class="text-body-2 ml-2">(11) 91234-5678</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Sobre mim</v-list-item-title>
                <span class="text-body-2">
                  Profissional com mais de 10 anos de experiência em desenvolvimento de software, focado em soluções web e mobile.
                </span>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Experiências profissionais</v-list-item-title>
                <div class="d-flex flex-column">
                  <span class="text-body-2 mb-1">
                    Desenvolvedor Full Stack na Empresa XYZ (2015 - 2023)
                  </span>
                  <span class="text-body-2">
                    Engenheiro de Software na Empresa ABC (2010 - 2015)
                  </span>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Idiomas</v-list-item-title>
                <div class="d-flex flex-wrap">
                  <v-chip
                    class="mr-2 my-1 d-flex align-center"
                    label
                    color="accent"
                    variant="flat"
                  >
                    <span>Inglês</span>
                    <span class="ml-1 text-caption">(Avançado)</span>
                  </v-chip>
                  <v-chip
                    class="mr-2 my-1 d-flex align-center"
                    label
                    color="accent"
                    variant="flat"
                  >
                    <span>Espanhol</span>
                    <span class="ml-1 text-caption">(Intermediário)</span>
                  </v-chip>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
</style>
