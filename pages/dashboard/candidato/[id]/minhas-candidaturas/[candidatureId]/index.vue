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

  const sendMail = async () => {
    const { data, error } = await useFetch('/api/emails/send', {
      method: 'POST',
      body: {
        to: [`${info.user.name} <${config.value.company_email}>`],
        subject: 'Chegou um email de contato - Conect RH One',
        template: 'contact_email_candidate_template',
        variables: {
          name: info.user.name,
          job: job.value.position,
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
          to: [`${info.user.name} <${config.value.company_email}>`],
          subject: 'Seu email de contato foi enviado - Conect RH One',
          template: 'email_contact_confirmation_template',
          variables: {
            name: info.user.name,
            job: job.value.position,
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
        title: `${job.value.position} - Conect RH One`,
        meta: [
          {
              name: 'description',
              content: 'Veja detalhes da sua candidatura e acompanhe seu status.'
          }
        ]
      })
      getConfiguration(job.value.company_id)
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

  const fetchCandidature = async (id: string) => {
    const { data, error } = await useFetch(`/api/candidatures/${id}`, { method: 'GET' })

    if (error.value) {
      return
    } else {
      candidature.value = data.value
      getJob(candidature.value.job_id)
    }
  }


  const filePDF = ref<File | null>(null)
  const fileInputPDF = ref<HTMLInputElement | null>(null)

  const uploadPDF = async () => {
    if (!filePDF.value) {
      notify({ title: 'Erro', text: 'Selecione um arquivo PDF', type: 'error' })
      return
    }

    // opcional: validar extensão e tipo mime no frontend
    if (filePDF.value.type !== 'application/pdf') {
      notify({ title: 'Erro', text: 'Apenas arquivos PDF são permitidos', type: 'error' })
      return
    }

    show.setOverlayDashboard(true)

    const formData = new FormData()
    formData.append('file', filePDF.value)

    // Aqui você manda o candidate_id e o type correto (candidate ou candidature)
    // Exemplo usando candidate_id para candidato
    const url = `/api/archives?candidature_id=${candidature.value.id}&type=candidature`

    const { data: pdfData, error: pdfError }: any = await useFetch(url, {
      method: 'POST',
      body: formData
    })

    if (pdfError.value) {
      notify({ title: 'Erro', text: 'Erro ao enviar arquivo', type: 'error' })
    } else {
      if(candidature.value.curriculum_id) {
        await deletePDF(false, candidature.value.curriculum_id)
      }
      createLog({
        title: `Currículo enviado`,
        profile_id: info.profile.id,
        type: 'send_curriculum'
      })
      notify({ title: 'Sucesso', text: 'Currículo enviado com sucesso!', type: 'success' })
      // Atualize seu store com o curriculum_url e curriculum_id retornados
      // Exemplo:
      setTimeout(() => {
        filePDF.value = null
        fetchCandidature(candidature.value.id)
      }, 1000)
    }

    setTimeout(() => {
      show.setOverlayDashboard(false)
    })
  }

  const deletePDF = async (isLoading: boolean, curriculumId: string) => {
    if (!candidature.value.curriculum_id) {
      notify({ title: 'Erro', text: 'Nenhum currículo para remover', type: 'error' })
      return
    }
    if(isLoading) {
      show.setOverlayDashboard(true)
    }

    const url = `/api/archives?curriculum_id=${encodeURIComponent(curriculumId)}&type=candidature&candidature_id=${candidature.value.id}`
    const { error }: any = await useFetch(url, {
      method: 'DELETE'
    })
    
    setTimeout(() => {
      if(isLoading) {
        if(error.value) {
          notify({ title: 'Erro', text: 'Erro ao remover currículo', type: 'error' })
        } else {
          createLog({
            title: `Currículo removido`,
            profile_id: info.profile.id,
            type: 'delete_curriculum'
          })
          notify({ title: 'Sucesso', text: 'Currículo removido', type: 'success' })
          fetchCandidature(candidature.value.id)
          filePDF.value = null
        }
        show.setOverlayDashboard(false)
      }
    }, 1000)

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
          <v-card-title>Currículo</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div class="d-flex flex-column">
              <div v-if="candidature.curriculum_id" class="mb-4">
                <a
                  :href="candidature.curriculum_id"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-decoration-none text-subtitle-1"
                >
                  Ver currículo atual
                </a>
                <v-btn
                  color="error"
                  class="ml-4"
                  @click="deletePDF(true, candidature.curriculum_id)"
                  size="small"
                >
                  <v-icon left>mdi-delete</v-icon>
                  Remover currículo
                </v-btn>
              </div>
              <span class="text-caption mb-2">Envie seu currículo (PDF):</span>

              <v-file-input
                ref="fileInputPDF"
                accept="application/pdf"
                v-model="filePDF"
                :label="filePDF ? filePDF.name : (candidature.curriculum_id ? 'Arquivo selecionado' : 'Escolher arquivo PDF')"
                show-size
                prepend-icon="mdi-file-pdf-box"
                clearable
              />

              <div class="d-flex align-start">
                <v-btn
                  class="mt-2 bg-gradient-primary"
                  :disabled="!filePDF"
                  @click="uploadPDF"
                >
                  <v-icon left>mdi-upload</v-icon>
                  Enviar currículo
                </v-btn>
              </div>
            </div>
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
                <span class="text-body-2 ml-2">{{ job.position }}</span>
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

    <v-col v-if="config.allow_candidate_email" cols="12" class="border rounded-lg mt-4" style="background:#fafafa;">
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
</template>

<style scoped lang="scss">
// Estilo opcional
</style>
