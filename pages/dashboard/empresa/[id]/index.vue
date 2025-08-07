<script setup lang="ts">
  definePageMeta({
    layout: 'dashboard' // ou outro nome, conforme os arquivos em layouts/
  })

  const router = useRouter();
  const items = [
    {
      id: 1,
      date: '12h30 12/09/2025',
      status: 'Ativa',
      ativa: 'Sim',
      title: 'Desenvolvedor Front-end'
    },
    {
      id: 2,
      date: '2 hr',
      status: 'Encerrada',
      ativa: 'Não',
      title: 'Designer UX'
    }
  ]


  const navigation = (link: any) => {
    router.push('/dashboard/empresa/123/minhas-vagas/123')
  }

  /*const { data, pending, error } = await useFetch('/api/educations')
  //const { data, pending, error } = await useFetch('/api/educations?candidate_id=abc123')
  

  // Se quiser acessar os dados fora do template, use:
  watchEffect(() => {
    if (data.value) {
      console.log('Educações carregadas:', data.value)
    }
  })*/

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
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-card class="pa-2 text-center d-flex flex-column justify-center align-center mr-3 bg-gradient-primary" elevation="2" width="220" style="min-height: 120px">
            <div class="text-h6" style="line-height: 1.2;">Vagas</div>
            <div class="text-h3 font-weight-bold">9</div>
          </v-card>
          <v-card class="pa-2 text-center d-flex flex-column justify-center align-center mr-3 border border-secondary" elevation="2" width="220" style="min-height: 120px">
            <div class="text-gradient-primary text-h6" style="line-height: 1.2;">Vagas selecionadas</div>
            <div class="text-gradient-primary text-h3 font-weight-bold">3</div>
          </v-card>
          <v-card class="pa-2 text-center d-flex flex-column justify-center align-center mr-3 bg-gradient-primary" elevation="2" width="220" style="min-height: 120px">
            <div class="text-h6" style="line-height: 1.2;">Vagas aprovadas</div>
            <div class="text-h3 font-weight-bold">1</div>
          </v-card>
        </div>
      </v-col>

      <v-col cols="12 mt-4">
        <div class="d-flex">
          <v-btn
            color="deep-purple-accent-4"
            text="Criar vaga"
            variant="flat"
            @click="$router.push('/dashboard/empresa/123/vagas/criar')"
          />
        </div>
      </v-col>

      <v-col cols="12" class="mt-4 border">
        <v-card>
          <v-card-text class="pa-0">
            <v-list>
              <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Últimos avisos</v-list-subheader>
              <v-list-item
                v-for="item in items"
                :key="item.id"
                class="py-3"
              >
                <v-list-item-title class="text-caption font-weight-bold">
                  {{ item.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-body-2">
                  item.subtitle
                </v-list-item-subtitle>

                <template v-slot:append="{ isSelected }">
                  <v-list-item-action class="flex-column align-end">
                    <small class="mb-4 opacity-60">{{ item.date }}</small>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" class="mt-4 border">
        <v-card>
          <v-card-text class="pa-0">
            <v-list>
              <v-list-subheader class="text-h6 font-weight-bold text-gradient-primary">Vagas recentes</v-list-subheader>
              <v-list-item
                v-for="item in items"
                :key="item.id"
                style="min-height: unset"
              >
                <v-card
                  class="pa-2 border mb-2"
                  elevation="2"
                  ripple
                  hover
                  @click="navigation(item.id)"
                >
                  <div class="d-flex justify-space-between align-start">
                    <div>
                      <div class="text-subtitle-1 font-weight-medium">
                        {{ item.title }}
                      </div>
                      <div class="text-caption text-grey">
                        Status: {{ item.status }} |
                        Ativa: {{ item.ativa ? 'Sim' : 'Não' }}
                      </div>
                    </div>

                    <div class="text-caption text-grey-darken-1">
                      {{ item.date }}
                    </div>
                  </div>
                </v-card>

              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
  </v-row>
</template>

<style lang="scss" scoped>

</style>