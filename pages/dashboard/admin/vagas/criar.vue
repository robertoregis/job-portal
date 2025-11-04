<script setup lang="ts">
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  const { notify } = useNotification();

  definePageMeta({
    layout: 'dashboard'
  })
  useHead({
    title: `Criar vaga - Conect One RH`,
    meta: [
      {
        name: 'description',
        content: 'Publique uma nova vaga e encontre os candidatos ideais.'
      }
    ]
  })
  const info: any = useInfo();
  const show = useShow();
  const { createNotice, createLog } = useNotice();

  const router = useRouter();
  const job = ref<any>({
    title: null,
    contract_type: null,
    work_format: null,
    salary: null,
    workload: null,
    weekdays: [],
    education_level: null,
    benefits: null,
    benefits_simple: null,
    undergraduate_areas: [],
    knowledge: null,
    knowledge_simple: null,
    description: null,
    status: 'Aberta',
    icon_status: 'mdi-briefcase-plus',
    is_active: false,
    is_closed: false,
    update_fields_at: null,
    company_name: null
  })
  const emailOfficial = useRuntimeConfig().public.EMAIL_OFFICIAL
  const contractTypes = ['CLT', 'PJ', 'Freelancer', 'Estágio']
  const work_formats = ['Presencial', 'Remoto', 'Híbrido']
  const educations = [
    'Ensino Fundamental',
    'Ensino Médio',
    'Ensino Técnico',
    'Tecnólogo',
    'Ensino Superior',
    'Pós-graduação',
    'Mestrado',
    'Doutorado',
  ]
  const days_of_week = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  const undergraduateAreasList = [
    'Administrativa', 'Corporativa', 'Financeira', 'Comercial',
    'Marketing', 'Recursos Humanos', 'Operacional', 'Logística',
    'Tecnologia da Informação', 'Jurídica', 'Compras', 'Suprimentos',
    'Departamento Pessoal', 'Fiscal'
  ]

  const sendMail = async (companyName: string, jobName: string, jobDescription: string) => {
    const { data: dataMaster, error: errorMaster } = await useFetch('/api/emails/send', {
      method: 'POST',
      body: {
        to: [`Conect One RH <${emailOfficial}>`],
        subject: 'Uma nova vaga foi criada',
        template: 'template_create_job',
        variables: {
          name_company: companyName,
          job_name: jobName,
          job_description: jobDescription,
          date: formatDate(new Date(), 3)
        }
      }
    })
  }

  const createJob = async () => {
    if(!job.value.company_name) {
      notify({ title: 'Erro', text: 'É preciso falar o nome da empresa', type: 'error' })
      return
    }
    show.setOverlayDashboard(true)
    let benefitsArray: any = job.value.benefits_simple
    if (job.value.benefits_simple) {
      benefitsArray = benefitsArray.split(',').map((b: any) => b.trim()).filter((b: any) => b.length > 0);
      job.value.benefits = benefitsArray
    } else {
      job.value.benefits = []
    }
    let knowledgeArray: any = job.value.knowledge_simple
    if (job.value.knowledge_simple) {
      knowledgeArray = knowledgeArray.split(',').map((b: any) => b.trim()).filter((b: any) => b.length > 0);
      job.value.knowledge = knowledgeArray
    } else {
      job.value.knowledge = []
    }
    const { data, error } = await useFetch('/api/jobs', {
      method: 'POST',
      body: {
        ...job.value,
        company_id: null
      }
    })
    if (error.value) {
      //console.error('Erro ao criar vaga:', error.value)
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao criar a vaga', type: 'error' })
    } else {
      createLog({
        title: `Criou a vaga`,
        profile_id: info.profile.id,
        type: 'create_job'
      })
      createNotice({
        title: 'Vaga criada',
        description: `Parabéns, você acabou de criar a vaga ${job.value.title} para a empresa ${job.value.company_name}, mas não esqueça de fazer uma ligação mais tarde`,
        subtitle: 'Vaga',
        profile_id: info.profile.id,
        type: 'info',
        is_master: false
      })
      show.setOverlayDashboard(false)
      notify({ title: 'Parabéns!', text: 'A vaga foi criada com sucesso', type: 'success' })
      router.push(`/dashboard/admin/vagas/${data.value.id}`)
      resetJob()
    }
  }

  const resetJob = () => {
    job.value = {
      title: null,
      contract_type: null,
      work_format: null,
      salary: null,
      workload: null,
      weekdays: [],
      education_level: null,
      benefits: null,
      benefits_simple: null,
      undergraduate_areas: null,
      //undergraduate_areas_simple: null,
      knowledge: null,
      knowledge_simple: null,
      description: null,
      status: 'Aberta para inscrição',
      icon_status: 'mdi-briefcase-plus',
      is_active: false,
      is_closed: false,
      update_fields_at: null,
      company_name: null
    }
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Criar vaga</span>
        <span class="text-caption">Crie você mesmo uma vaga para alguma empresa</span>
      </div>
    </v-col>
    <LayoutButtonBack />
  </v-row>
  <v-row no-gutters class="mt-5">
    <v-col cols="12">
      <div class="d-flex flex-column bg-deep-orange-lighten-5 pa-2">
        <span class="text-red-darken-4 font-weight-bold">Aviso</span>
        <span class="text-caption">Ao criar uma empresa aqui, ela não terá ligação com nenhuma empresa. Logo, ela não pode ser encontrada pela mesma. Mas, terá uma página onde você poderá encontrar vagas
          sem ligações e a qualquer momento você poderá fazer ligação com alguma empresa existente.
        </span>
        <span class="text-caption">
          Para não esquecer de qual empresa será, tem um campo especial para informar e você se lembrar depois.
        </span>
      </div>
    </v-col>
    <v-col cols="12" class="border mt-3">
      <v-card>
        <v-card-title class="text-h6">
          Criar nova vaga
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="createJob">
            <v-text-field
              v-model="job.title"
              label="Cargo"
              density="compact"
              hide-details
              class="mb-3"
              required
            />

            <v-select
              v-model="job.contract_type"
              :items="contractTypes"
              label="Tipo de contrato"
              density="compact"
              hide-details
              class="mb-3"
              required
            />

            <v-select
              v-model="job.work_format"
              :items="work_formats"
              label="Formato"
              density="compact"
              hide-details
              class="mb-3"
              required
            />

            <v-text-field
              v-model="job.salary"
              label="Faixa salarial"
              placeholder="Ex: R$ 3.000 - R$ 5.000"
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-text-field
              v-model="job.workload"
              label="Carga horária semanal"
              placeholder="Ex: 40h"
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-select
              v-model="job.weekdays"
              :items="days_of_week"
              label="Dias da semana"
              multiple
              chips
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-select
              v-model="job.education_level"
              :items="educations"
              label="Escolaridade mínima"
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-select
              v-model="job.undergraduate_areas"
              :items="undergraduateAreasList"
              label="Áreas de graduação"
              density="compact"
              multiple
              chips
              hide-details
              class="mb-3"
            />

            <v-textarea
              v-model="job.description"
              label="Descrição da vaga"
              placeholder="Conte mais sobre a oportunidade"
              auto-grow
              density="compact"
              hide-details
              class="mb-3"
            />

            <span class="text-caption mb-2">Os campos abaixo pode ser separados por vírgula (,)</span>

            <v-textarea
              v-model="job.benefits_simple"
              label="Benefícios"
              placeholder="Ex: Vale transporte, alimentação, plano de saúde..."
              auto-grow
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-textarea
              v-model="job.knowledge_simple"
              label="Conhecimentos"
              placeholder="Ex: Planilhas, Informática, Design..."
              auto-grow
              density="compact"
              hide-details
              class="mb-3"
            />

            <div>
              <span class="font-weight-bold text-red-accent-4 text-caption">Campo especial:</span>
              <v-text-field
                v-model="job.company_name"
                label="Nome da empresa"
                placeholder=""
                density="compact"
                hide-details
                class="mb-3"
              />
            </div>

            <v-btn
              type="submit"
              class="mt-2 bg-gradient-primary"
            >
              Salvar
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
// Se quiser customizar algo
</style>
