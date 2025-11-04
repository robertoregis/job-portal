<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  const { notify } = useNotification();
  definePageMeta({
    layout: 'dashboard'
  })
  const show = useShow();
  const { createNotice, createLog } = useNotice();
  const route = useRoute();
  const candidature = ref<any>({})
  const job = ref<any>({})
  const loading = ref<boolean>(true)
  const info: any = useInfo();
  const config = ref<any>({})
  const message = ref<string>('')
  const emailOfficial = useRuntimeConfig().public.EMAIL_OFFICIAL
  const dialog = ref<boolean>(false)
  const declineReason = ref<string>('')
  const router = useRouter();

  const sendMail = async () => {
    const { data, error } = await useFetch('/api/emails/send', {
      method: 'POST',
      body: {
        to: [`${config.value.company_name} <${config.value.company_email}>`],
        subject: 'Chegou um email de contato',
        template: 'contact_email_candidate_template',
        variables: {
          name: info.user.name,
          job: job.value.title,
          name_company: config.value.company_name,
          message: message.value
        }
      }
    })

    if (error.value) {
      notify({ title: 'Erro', text: 'Falha ao enviar email', type: 'error' })
      return
    } else {
      const { data: dataSend, error: errorSend } = await useFetch('/api/emails/send', {
        method: 'POST',
        body: {
          to: [`${info.user.name} <${info.user.email}>`],
          subject: 'Seu email de contato foi enviado',
          template: 'email_contact_confirmation_template',
          variables: {
            name: info.user.name,
            job: job.value.title,
            name_company: config.value.company_name,
          }
        }
      })
      notify({ title: 'Sucesso', text: 'Email enviado com sucesso!', type: 'success' })
      message.value = ''
    }
  }

  const getConfiguration = async (id: string) => {
    const { data, error, pending }: any = await useFetch(`/api/configurations`, {
      method: 'GET',
      params: {
        company_id: id
      }
    })
    if (error.value) {
    } else {
      config.value = data.value
    }
    loading.value = false
  }

  const getJob = async (jobId: string) => {
    const { data, error } = await useFetch(`/api/jobs/${jobId}`, {
      method: 'GET',
    })

    if (error.value) {
    } else {
      job.value = data.value
      useHead({
        title: `${job.value.title} - Conect One RH`,
        meta: [
          {
            name: 'description',
            content: 'Veja detalhes da sua candidatura e acompanhe seu status.'
          }
        ]
      })
      if(job.value.company_id) {
        getConfiguration(job.value.company_id)
      }
    }
  }

  const { data, error, pending } = await useFetch(`/api/candidatures/${route.params.candidatureId}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    candidature.value = data.value
    getJob(candidature.value.job_id)
  }

  const decline = async () => {
    if(!declineReason.value) {
      notify({ title: 'Erro', text: 'É preciso dizer o motivo', type: 'error' })
      return
    }
    show.setOverlayDashboard(true)
    const { data, error } = await useFetch(`/api/candidatures/${route.params.candidatureId}`, {
      method: 'PATCH',
      body: {
        is_delete: true,
        is_active: false,
        decline_reason: declineReason.value
      }
    })

    if (error.value) {
      //console.error('Erro ao declinar candidatura:', error.value)
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao declinar a candidatura', type: 'error' })
      return
    }
    const { data: dataSend, error: errorSend } = await useFetch('/api/emails/send', {
      method: 'POST',
      body: {
        to: [`Conect One RH <${emailOfficial}>`],
        subject: 'Um candidato declinou da vaga',
        template: 'template_decline_candidature',
        variables: {
          name_candidate: info.user.name,
          name_job: job.value.title,
          name_company: config.value && config.value.company_name ? config.value.company_name : job.value.company_name,
          decline_reason: declineReason.value
        }
      }
    })
    createLog({
      title: `Declinou da vaga ${candidature.value.job_title}`,
      profile_id: info.profile.id,
      type: 'decline_candidature'
    })
    show.setOverlayDashboard(false)
    notify({ title: 'Sucesso', text: 'A sua candidatura foi declinada!', type: 'success' })
    declineReason.value = ''
    router.push(`/dashboard/candidato/${info.user.id}/minhas-candidaturas`)
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Candidatura!</span>
        <span class="text-caption">Veja a sua candidatura</span>
      </div>
    </v-col>
    <LayoutButtonBack />
  </v-row>
  <v-row v-if="!loading" no-gutters class="mt-5">
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
              <div class="d-flex align-center mt-2">
                <span class="text-subtitle-2 font-weight-bold">Data de criação:</span>
                <span class="text-body-2 ml-2">{{ candidature.created_at_formatted }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" class="d-flex">
              <v-btn
                color="error"
                class=""
                @click="dialog = true"
              >
                <v-icon left class="mr-1">mdi-account-cancel-outline</v-icon>
                Declinar do processo seletivo
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-briefcase</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Informações da vaga</h2>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" class="px-4 pa-2">
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Cargo:</span>
                <span class="text-body-2 ml-2">{{ job.title }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Tipo de contrato:</span>
                <span class="text-body-2 ml-2">{{ job.contract_type }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Formato:</span>
                <span class="text-body-2 ml-2">{{ job.work_format }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Faixa salarial:</span>
                <span class="text-body-2 ml-2">{{ job.salary }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Carga horária:</span>
                <span class="text-body-2 ml-2">{{ job.workload }}</span>
              </div>
              <div class="d-flex flex-column flex-md-row align-start align-md-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Dias da semana:</span>
                <div class="d-flex flex-wrap mt-1 mt-md-0 ml-md-2">
                  <template v-for="(day, index) in job.weekdays" :key="index">
                    <v-chip color="primary" variant="flat" :ripple="false" class="text-body-2 mb-1 mb-md-0 mr-1">
                      {{day}}
                    </v-chip>
                  </template>
                </div>
              </div>
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">Escolaridade mínima:</span>
                <span class="text-body-2 ml-2">{{ job.education_level }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-list>
        <v-list-item class="mt-2" style="min-height: unset">
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1 font-weight-bold">Descrição da vaga</v-list-item-title>
            <span class="text-body-2">
              {{ job.description }}
            </span>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="mt-2" style="min-height: unset">
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1 font-weight-bold">Benefícios</v-list-item-title>
            <ul>
              <template v-for="(benefit, index) in job.benefits" :key="index">
                <li class="text-body-2">- {{ benefit }};</li>
              </template>
            </ul>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="mt-2" style="min-height: unset">
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1 font-weight-bold">Conhecimentos</v-list-item-title>
            <ul>
              <template v-for="(knowledge, index) in job.knowledge" :key="index">
                <li class="text-body-2">- {{ knowledge }};</li>
              </template>
            </ul>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="mt-2" style="min-height: unset">
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1 font-weight-bold">Áreas de graduação</v-list-item-title>
            <ul>
              <template v-for="(area, index) in job.undergraduate_areas" :key="index">
                <li class="text-body-2">- {{ area }};</li>
              </template>
            </ul>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>

    <v-col v-if="config && config.allow_candidate_email" cols="12" class="border rounded-lg mt-4" style="background:#fafafa;">
      <v-card flat>
        <v-card-text class="d-flex flex-column">
          <div class="mb-1">
            <span class="font-weight-semibold text-subtitle-2">Envie email para a empresa sobre a vaga</span>
          </div>
          <div class="mb-3">
            <span class="text-caption" style="color: #555;">Somos apenas o canal inicial, a resposta será direta da empresa.</span>
          </div>
          <v-textarea
            label="Mensagem"
            v-model="message"
            name="input-7-1"
            variant="filled"
            auto-grow
            hide-details
            density="compact"
            class="mb-2"
          ></v-textarea>
          <div class="d-flex">
            <v-btn
                  class="mt-2 bg-gradient-primary"
                  @click="sendMail"
                >
                  Enviar mensagem
                </v-btn>
          </div>
        </v-card-text>
        <v-card-actions></v-card-actions>
      </v-card>
    </v-col>

  </v-row>
  
  <v-dialog
    v-model="dialog"
    max-width="460"
  >
      <v-card
        prepend-icon="mdi-account-cancel-outline"
        title="Declinar do processo seletivo"
      >
      <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <p class="text-body-2 mb-1">Você realmente deseja declinar dessa vaga? Se sim, nos diga o seu motivo, pois é muito importante saber a sua opnião.</p>
              <p class="text-body-2">Saiba que depois disso a candidatura irá sumir.</p>
            </v-col>
            <v-col cols="12 mt-1">
                <v-textarea
                v-model="declineReason"
                label="Motivo"
                variant="filled"
                auto-grow
                density="compact"
                hide-details
                class="mb-1"
                />
            </v-col>
          </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
          <v-spacer />
          <v-btn
            text="Declinar"
            color="error"
            variant="flat"
            @click="decline"
          />
      </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
// Estilo opcional
</style>
