<script setup lang="ts">
  import { useInfo } from '#imports';

  definePageMeta({
    layout: 'default' // ou outro nome, conforme os arquivos em layouts/
  })

  const info: any = useInfo();
  const vagas = ref<any[]>([
  {
    id: 1,
    title: 'Engenheiro de Software',
    company: 'Tech Solutions',
    description: 'Desenvolvimento de sistemas web utilizando JavaScript, TypeScript e Node.js. Conhecimento em arquitetura de software e metodologias ágeis.',
    created_date: '15/07/2025'
  },
  {
    id: 2,
    title: 'Analista de Marketing Digital',
    company: 'Agência Criativa',
    description: 'Planejamento e execução de campanhas digitais, análise de métricas e otimização de resultados em plataformas como Google Ads e Facebook Ads.',
    created_date: '20/08/2025'
  },
  {
    id: 3,
    title: 'Designer Gráfico',
    company: 'Studio Arte Viva',
    description: 'Criação de peças gráficas para mídias sociais, materiais impressos e branding. Domínio do pacote Adobe (Photoshop, Illustrator e InDesign).',
    created_date: '05/09/2025'
  },
  {
    id: 4,
    title: 'Coordenador de RH',
    company: 'Empresa ABC',
    description: 'Responsável pelo recrutamento, seleção, treinamento e desenvolvimento de colaboradores. Experiência com legislação trabalhista e sistemas de RH.',
    created_date: '10/09/2025'
  },
  {
    id: 5,
    title: 'Técnico de Suporte',
    company: 'HelpDesk Solutions',
    description: 'Atendimento a clientes, resolução de problemas técnicos, manutenção de hardware e software, suporte remoto e presencial.',
    created_date: '12/09/2025'
  },
])


  const estados = [
    'São Paulo',
    'Rio de Janeiro',
    'Minas Gerais',
    'Bahia',
    'Paraná',
    'Santa Catarina',
    'Rio Grande do Sul'
  ]

  const datasCriacao = [
    'Últimos 7 dias',
    'Últimos 30 dias',
    'Últimos 90 dias',
    'Mais de 90 dias'
  ]

  const selectedEstado = ref<string | null>(null)
  const selectedData = ref<string | null>(null)
</script>

<template>
  <main>
    <v-sheet width="100%" class="mt-4">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12">
                <h2 class="mb-0">Filtros</h2>
              </v-col>
              <v-col cols="12" class="">
                <div class="d-flex flex-wrap gap-3">
                  <v-select
                    v-model="selectedData"
                    :items="datasCriacao"
                    label="Data de criação"
                    clearable
                    dense
                    variant="outlined"
                    hide-details
                    style="max-width: 200px"
                    class="w-100 my-1 mr-2"
                  />
                  <v-select
                    v-model="selectedEstado"
                    :items="estados"
                    label="Estado"
                    clearable
                    dense
                    variant="outlined"
                    hide-details
                    style="max-width: 200px"
                    class="w-100 my-1 mr-2"
                  />
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-col v-if="!Object.keys(info.user || {}).length || info.user.type === 'company'" cols="12">
            <div class="d-flex align-center">
              <v-btn
                class="bg-gradient-primary"
                text="Cadastre uma vaga"
                variant="flat"
              ></v-btn>
            </div>
          </v-col>

          <v-col cols="12">
            <v-row>
              <template v-for="(vaga, indice) in vagas" :key="indice">
                <JobsJob :job="vaga" />
              </template>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </main>
</template>

<style lang="scss" scoped>
</style>
