<script setup lang="ts">
  import { useShow } from '@/stores/show';
  import { useInfo } from '@/stores/info';
  import { useNotice } from '@/composables/useNotice';
  import { name_formated } from '@/composables/textFunctions';
  definePageMeta({
    layout: 'dashboard'
  })
  const router = useRouter()
  const route = useRoute()
  const show = useShow();
  const { createNotice, createLog } = useNotice();
  const info: any = useInfo();
  const { notify } = useNotification();
  const candidate = ref<any>({})
  const candidature = ref<any>({})
  const experiencesList = ref<any[]>([])
  const languagesList = ref<any[]>([])
  const educationsList = ref<any[]>([])
  const softSkillsList = ref<any[]>([])
  const feedbacksList = ref<any[]>([])
  const dialogFeedback = ref<boolean>(false)
  const content = ref<any>('')
  const dialogFeedbackShow = ref<boolean>(false)
  const feedbackSelected = ref<any>({})
  const page = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(1)
  const loading = ref<boolean>(true)
  const candidaturaStatusOptions = [
    { code: 1, name: 'Desclassificado', icon: 'mdi-close-circle' },
    { code: 2, name: 'Análise de Currículo', icon: 'mdi-magnify' },
    { code: 3, name: 'Análise Comportamental', icon: 'mdi-account-search' },
    { code: 4, name: 'Entrevita de Expectativa', icon: 'mdi-account-question' },
    { code: 5, name: 'Pré-Selecionados', icon: 'mdi-progress-clock' },
    { code: 6, name: 'Contratados', icon: 'mdi-check-circle' }
  ]

  const onStatusSelect = (selected: any) => {
    candidature.value.status = selected.name
    candidature.value.icon_status = selected.icon
    candidature.value.code_status = selected.code
  }

  const getFormatDate = (date: string) => {
    if (!date) return ''
    const parts = date.split('-') // ["yyyy", "mm", "dd"]
    if (parts.length !== 3) return date

    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  }

  const getDataCandidate = async (candidateId: string) => {
    try {
      // Busca educations
      const { data: educationsData, error: educationsError } = await useFetch(`/api/educations?candidate_id=${candidateId}`)
      if (educationsError.value) throw educationsError.value
      educationsList.value = educationsData.value
      // Busca experiences
      const { data: experiencesData, error: experiencesError } = await useFetch(`/api/experiences?candidate_id=${candidateId}`)
      if (experiencesError.value) throw experiencesError.value
      experiencesList.value = experiencesData.value
      // Busca languages
      const { data: languagesData, error: languagesError } = await useFetch(`/api/languages?candidate_id=${candidateId}`)
      if (languagesError.value) throw languagesError.value
      languagesList.value = languagesData.value
      // Busca soft_skills
      const { data: softSkillsData, error: softSkillsError } = await useFetch(`/api/soft_skills?candidate_id=${candidateId}`)
      if (softSkillsError.value) throw softSkillsError.value
      softSkillsList.value = softSkillsData.value
      loading.value = false;
    } catch (e) {
      notify({ title: 'Erro', text: 'Falha ao carregar dados do candidato', type: 'error' })
    }
  }

  const getFeedbacks = async () => {
    const params: Record<string, any> = {
      page: page.value.toString(),
      pageSize: pageSize.value.toString(),
      candidate_id: route.params.candidateId
    }

    const { data, error } = await useFetch('/api/feedbacks', {
      method: 'GET',
      params
    })

    if (error.value) {
    } else {
      feedbacksList.value = data.value?.data || []
      totalPages.value = data.value?.totalPages || 1
    }
  }

  const getCandidate = async () => {
    const { data, error } = await useFetch(`/api/candidates/${route.params.candidateId}`, {
      method: 'GET',
    })
    if (error.value) {
      console.error('Erro ao buscar candidato:', error.value)
    } else {
      candidate.value = data.value
      useHead({
        title: `${candidate.value.name} - Conect One RH`,
        meta: [
          {
              name: 'description',
              content: 'Acesse o perfil completo deste candidato e avalie sua experiência.'
          }
        ]
      })
      loading.value = false;
      getFeedbacks()
      getDataCandidate(candidate.value.id)
    }
  }

  const updateCandidaturesStatus = async () => {
    show.setOverlayDashboard(true)
    const { data, error } = await useFetch(`/api/candidatures/${route.params.candidatureId}`, {
      method: 'PATCH',
      body: {
        status: candidature.value.status,
        icon_status: candidature.value.icon_status,
        code_status: candidature.value.code_status
      }
    })

    if (error.value) {
      console.error('Erro ao atualizar candidatura:', error.value)
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao atualizar a candidatura', type: 'error' })
      return
    }
    createLog({
      title: `Atualizou a candidatura`,
      profile_id: info.profile.id,
      type: 'update_candidature'
    })
    show.setOverlayDashboard(false)
    notify({ title: 'Parabéns!', text: 'A candidatura foi atualizada com sucesso', type: 'success' })
    //router.push(`/dashboard/empresa/${info.user.id}/minhas-vagas/${data.value.id}`)
  }

  watch(page, () => {
    getFeedbacks()
  })

  const createFeedback = async () => {
    show.setOverlayDashboard(true)
    const { data, error } = await useFetch('/api/feedbacks', {
        method: 'POST',
        body: {
          content: content.value,
          candidature_id: candidature.value.id
        }
    })
    show.setOverlayDashboard(false)
    if (error.value) {
      console.log(error.value)
      const message = error.value.data?.statusMessage || 'Erro ao criar parecer'
      notify({ title: '', text: message, type: 'error' })
      return
    }
    createLog({
      title: `Criou a parecer`,
      profile_id: info.profile.id,
      type: 'create_feedback'
    })
    notify({ title: 'Parabéns!', text: 'O parecer foi criado', type: 'success' })
    getFeedbacks()
    setTimeout(() => {
      dialogFeedback.value = false;
    }, 1000)
  }

  const openFeedback = (feedback: any) => {
    feedbackSelected.value = feedback;
    dialogFeedbackShow.value = true;
  }

  const downloadPDF = async (feedback: any) => {
    show.setOverlayDashboard(true)
    try {
      const res = await fetch(`/api/generate/pdf/${feedback.id}`);
      if (!res.ok) {
        show.setOverlayDashboard(false)
        notify({ title: 'Erro', text: 'Ocorreu um erro ao gerar relatório', type: 'error' })
        return
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-${name_formated(candidate.value.name)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      createLog({
        title: `Gerou relatório do candidato: ${candidate.value.name}`,
        profile_id: info.profile.id,
        type: 'report_candidate'
      })
      window.URL.revokeObjectURL(url);
      show.setOverlayDashboard(false)
      notify({ title: 'Parabéns!', text: 'Relatório gerado com sucesso', type: 'success' })
    } catch (error) {
      console.error(error);
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Ocorreu um erro ao gerar relatório', type: 'error' })
    }
  };

  const { data, error, pending } = await useFetch(`/api/candidatures/${route.params.candidatureId}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    candidature.value = data.value
    getCandidate()
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span v-if="candidate" class="text-gradient-primary font-weight-bold">{{ candidate.name }}</span>
        <span class="text-caption">Detalhes do candidato selecionado nesta candidatura</span>
      </div>
    </v-col>
    <LayoutButtonBack />
  </v-row>

  <v-row v-if="candidate" no-gutters class="mt-5">
    <!-- Dados do Candidato -->
    <v-col cols="12" class="border">
      <v-card>
        <v-card-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-account-circle</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Dados</h2>
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
            </v-col>

            <v-col cols="12" class="mt-2">
              <v-chip color="primary" variant="outlined">
                <v-icon icon="mdi-account-circle-outline" start></v-icon>
                {{ candidate.is_employed ? 'Está empregado' : 'Está desempregado' }}
              </v-chip>
            </v-col>

            <v-col cols="12">
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Nome:</span>
                <span class="text-body-2 ml-2">{{ candidate.name }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">CPF:</span>
                <span class="text-body-2 ml-2">{{ candidate.cpf }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Data de nascimento:</span>
                <span class="text-body-2 ml-2">{{ getFormatDate(candidate.birth_date) }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Estado civil:</span>
                <span class="text-body-2 ml-2">{{ candidate.marital_status }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Endereço:</span>
                <span class="text-body-2 ml-2">{{ candidate.address || `${candidate.city || ''} - ${candidate.state || ''}` }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">E-mail:</span>
                <span class="text-body-2 ml-2">{{ candidate.email }}</span>
              </div>
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Telefone:</span>
                <span class="text-body-2 ml-2">{{ candidate.phone }}</span>
              </div>

              <div v-if="candidate.site || candidate.instagram || candidate.linkedin" class="d-flex align-center my-1" style="gap: 12px;">
                <v-btn v-if="candidate.site" icon :href="candidate.site" target="_blank" aria-label="Site" density="comfortable">
                  <v-icon>mdi-web</v-icon>
                </v-btn>
                <v-btn v-if="candidate.instagram" icon :href="candidate.instagram" target="_blank" aria-label="Instagram" density="comfortable">
                  <v-icon color="#E1306C">mdi-instagram</v-icon>
                </v-btn>
                <v-btn v-if="candidate.linkedin" icon :href="candidate.linkedin" target="_blank" aria-label="LinkedIn" density="comfortable">
                  <v-icon color="#0A66C2">mdi-linkedin</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Currículo -->
    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <a
                v-if="candidate.curriculum_url"
                :href="candidate.curriculum_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-decoration-none text-subtitle-1 d-flex align-center bg-primary py-1 px-4 rounded-xl"
              >
                <v-icon>mdi-file-link</v-icon>
                <span class="ml-2">Ver currículo atual</span>
              </a>
              <span v-else class="font-weight-bold">Não tem currículo no momento!</span>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Sobre o candidato e informações adicionais -->
    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-text class="pa-0">
          <v-list>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Sobre ele</v-list-item-title>
                <span class="text-body-2">{{ candidate.about || 'Não informado' }}</span>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Pretensão salarial</v-list-item-title>
                <span class="text-body-2">{{ candidate.salary_expectations || 'Não informado' }}</span>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Áreas de interesse</v-list-item-title>
                <div v-if="candidate.areas_of_interest?.length" class="d-flex flex-wrap">
                  <v-chip
                    v-for="(area, idx) in candidate.areas_of_interest"
                    :key="idx"
                    class="mr-2 my-1 d-flex align-center"
                    label
                    color="language"
                    variant="flat"
                  >
                    <span>{{ area }}</span>
                  </v-chip>
                </div>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Tipos de vagas que procuro</v-list-item-title>
                <div v-if="candidate.job_types?.length" class="d-flex flex-wrap">
                  <v-chip
                    v-for="(type, idx) in candidate.job_types"
                    :key="idx"
                    class="mr-2 my-1 d-flex align-center"
                    label
                    color="language"
                    variant="flat"
                  >
                    <span>{{ type }}</span>
                  </v-chip>
                </div>
              </v-list-item-content>
            </v-list-item>

            <!-- Experiências -->
            <v-divider></v-divider>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Experiências profissionais</v-list-item-title>
                <div class="d-flex flex-column mt-2">
                  <div v-for="(experience, index) in experiencesList" :key="experience.id || index" class="border-sm px-2 py-1 rounded d-flex mb-1 flex-column">
                    <span class="text-caption font-weight-bold">{{ experience.position }}</span>
                    <div class="d-flex align-center">
                      <span class="text-body-2 mr-2">{{ experience.company_name }}</span>
                      <span v-if="experience.start_date || experience.end_date" class="text-small-2 bg-grey-darken-2 px-2 rounded-xl">
                        {{ getFormatDate(experience.start_date) }} - {{ getFormatDate(experience.end_date) }}
                      </span>
                    </div>
                    <p v-if="experience.description" class="pa-1 mt-1">{{ experience.description }}</p>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>

            <!-- Escolaridade -->
            <v-divider></v-divider>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Escolaridade</v-list-item-title>
                <div class="d-flex flex-column mt-2">
                  <div v-for="(education, index) in educationsList" :key="education.id || index" class="border-sm px-2 py-1 rounded d-flex mb-1 flex-column">
                    <span class="text-caption font-weight-bold">{{ education.course }}</span>
                    <span class="text-body-2">{{ education.level }}</span>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>

            <!-- Idiomas -->
            <v-divider></v-divider>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Idiomas</v-list-item-title>
                <div class="d-flex flex-wrap">
                  <v-chip
                    v-for="(language, idx) in languagesList"
                    :key="language.id || idx"
                    class="mr-2 my-1 d-flex align-center"
                    label
                    color="language"
                    variant="flat"
                  >
                    <span>{{ language.name }}</span>
                    <span class="ml-1 text-caption">({{ language.level?.toLowerCase() }})</span>
                  </v-chip>
                </div>
              </v-list-item-content>
            </v-list-item>

            <!-- Soft Skills -->
            <v-divider></v-divider>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Soft Skills</v-list-item-title>
                <div class="d-flex flex-column mt-2">
                  <div v-for="(softSkill, index) in softSkillsList" :key="softSkill.id || index" class="border-sm px-2 py-1 rounded d-flex mb-1 flex-column">
                    <span class="text-caption font-weight-bold">{{ softSkill.name }}</span>
                    <span class="text-body-2">{{ softSkill.level }}</span>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
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
            <v-btn class="mt-2 bg-gradient-primary" @click="updateCandidaturesStatus">
              Salvar
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-title>
          <h2 class="text-h6 font-weight-bold text-gradient-primary">Pareceres</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row v-if="feedbacksList.length > 0" no-gutters>
            <v-col
              v-for="(feedback, index) in feedbacksList"
              :key="feedback.id || index"
              cols="12"
              md="6"
              class="pa-1"
            >
              <div
                role="dialog"
                tabindex="0"
                @click="openFeedback(feedback)"
                class="cursor-pointer w-100 border-sm px-2 py-1 rounded d-flex flex-column bg-card"
              >
                <div class="d-flex justify-space-between align-center">
                  <!-- job_title à esquerda -->
                  <span class="text-caption font-weight-bold">{{ feedback.job_title }}</span>
                  
                  <!-- botão à direita -->
                  <v-btn size="md" flat icon color="warning" class="pa-1" @click.stop="downloadPDF(feedback)">
                    <v-icon>mdi-file-document-outline</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
          <span v-else>Não há parecer</span>
        </v-card-text>
        <v-card-actions>
            <v-btn
              text="Adicionar"
              class="bg-gradient-primary"
              variant="flat"
              @click="dialogFeedback = true"
            />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <v-dialog
        v-model="dialogFeedback"
        max-width="600"
    >
        <v-card
            prepend-icon="mdi-file-document"
            title="Adicionar Parecer"
        >
        <v-card-text>
            <v-row dense>
              <v-col cols="12">
                  <RichTextEditor v-model="content" />
              </v-col>
            </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions>
            <v-spacer />
            <v-btn
              text="Fechar"
              color="error"
              variant="flat"
              @click="dialogFeedback = false"
            />
            <v-btn
              text="Adicionar"
              color="success"
              variant="flat"
              @click="createFeedback()"
            />
        </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog
        v-model="dialogFeedbackShow"
        max-width="600"
    >
        <v-card
            prepend-icon="mdi-file-document"
            :title="feedbackSelected.job_title"
        >
        <v-card-text>
            <v-row>
              <v-col cols="12">
                  <div v-html="feedbackSelected.content" class="pa-2"></div>
              </v-col>
            </v-row>
        </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style lang="scss" scoped>
</style>
