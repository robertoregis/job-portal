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
  const result_behavioral = ref<any>({})
  const behavioral = ref<any>({})

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
      let experienceGroup = null
      const { data: experienceGroupData, error: errorExperienceGroup } = await useFetch('/api/experience_group', {
          method: 'GET',
          params: {
              candidate_id: candidateId
          }
      })
      if (error.value) {}
      if(experienceGroupData.value) {
        const experiencesGroup: any[] = experienceGroupData.value as any[]
        if(experiencesGroup.length) {
          experienceGroup = experiencesGroup[0]
          const { data: experiencesData, error: experiencesError } = await useFetch(`/api/experiences?candidate_id=${candidateId}&experience_group_id=${experienceGroup.id}`)
          if (experiencesError.value) throw experiencesError.value
          experiencesList.value = experiencesData.value
        }
      }
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

  watch(page, () => {
    getFeedbacks()
  })

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

  const MAX_WIDTH = 300

  const getWidth = (val: string | number) => {
    let num = typeof val === 'number' ? val : parseInt(val.toString().replace('%', ''), 10)
    return Math.round((num / 100) * MAX_WIDTH)
  }

  const getResultBeharioval = async () => {
    const params: Record<string, any> = {
      behavioral_profiles_id: behavioral.value.id
    }
    const { data, error } = await useFetch('/api/result_behavioral', {
      method: 'GET',
      params
    })
    if (data.value?.data?.length) {
      const res = data.value.data[0]
      result_behavioral.value = res
    }
  }

  const getBeharioval = async () => {
    const params: Record<string, any> = {
      candidate_id: candidate.value.id
    }
    const { data, error } = await useFetch('/api/behavioral_profiles', {
      method: 'GET',
      params
    })
    if (error.value) {
    } else {
      behavioral.value = data.value.data[0]
      if (Object.keys(behavioral.value).length > 0) {
        getResultBeharioval()
      }
    }
  }

  const { data, error, pending } = await useFetch(`/api/candidates/${route.params.candidateId}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    candidate.value = data.value
    useHead({
      title: `${candidate.value.name} - Conect One RH`,
      meta: [
        {
          name: 'description',
          content: 'Acesse o perfil completo deste candidato e confira os detalhes.'
        }
      ]
    })
    loading.value = false;
    getFeedbacks()
    getBeharioval()
    getDataCandidate(candidate.value.id)
  }

  const formatSocialUrl = (value: string, type: string) => {
    if (!value) return null;

    let user = value.trim();

    // Se já for link completo, devolve direto
    if (user.startsWith("http")) {
      return user;
    }

    // Remove @ se tiver
    if (user.startsWith("@")) {
      user = user.slice(1);
    }

    // Define base por tipo
    const bases: any = {
      instagram: "https://instagram.com/",
      linkedin: "https://linkedin.com/in/",
      facebook: "https://facebook.com/",
      tiktok: "https://tiktok.com/@",
      twitter: "https://twitter.com/",
    };

    return bases[type] ? bases[type] + user : user;
  };
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span v-if="candidate" class="text-gradient-primary font-weight-bold">{{ candidate.name }}</span>
        <span class="text-caption">Detalhes do candidato</span>
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
                <v-btn v-if="candidate.instagram" icon :href="formatSocialUrl(candidate.instagram, 'instagram')" target="_blank" aria-label="Instagram" density="comfortable">
                  <v-icon color="#E1306C">mdi-instagram</v-icon>
                </v-btn>

                <v-btn v-if="candidate.linkedin" icon :href="formatSocialUrl(candidate.linkedin, 'linkedin')" target="_blank" aria-label="LinkedIn" density="comfortable">
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
            <v-col cols="12" class="d-flex">
              <div  v-if="candidate.curriculum_url">
                <a
                  :href="candidate.curriculum_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-decoration-none text-subtitle-1 d-flex align-center bg-primary py-1 px-4 rounded-xl"
                >
                  <Icon name="mdi:file-link" />
                  <span class="ml-2">Ver currículo atual</span>
                </a>
              </div>
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
            <template v-if="result_behavioral && result_behavioral.id">
              <v-divider></v-divider>
              <v-list-item class="mt-2" style="min-height: unset">
                <v-list-item-content>
                  <v-list-item-title class="text-subtitle-1 font-weight-bold">Perfil comportamental</v-list-item-title>
                  <div class="chart mb-2">
                    <div class="chart-item">
                      <h2>Dominância</h2>
                      <div class="bar-bg">
                        <div class="bar-fill bar-fill-1" :style="{ width: getWidth(result_behavioral.dominance) + 'px' }">
                          {{ result_behavioral.dominance_formatted }}
                        </div>
                      </div>
                    </div>
                    <div class="chart-item">
                      <h2>Influência</h2>
                      <div class="bar-bg">
                        <div class="bar-fill bar-fill-2" :style="{ width: getWidth(result_behavioral.influence) + 'px' }">
                          {{ result_behavioral.influence_formatted }}
                        </div>
                      </div>
                    </div>
                    <div class="chart-item">
                      <h2>Estabilidade</h2>
                      <div class="bar-bg">
                        <div class="bar-fill bar-fill-3" :style="{ width: getWidth(result_behavioral.steadiness) + 'px' }">
                          {{ result_behavioral.steadiness_formatted }}
                        </div>
                      </div>
                    </div>
                    <div class="chart-item">
                      <h2>Conformidade</h2>
                      <div class="bar-bg">
                        <div class="bar-fill bar-fill-4" :style="{ width: getWidth(result_behavioral.conscientiousness) + 'px' }">
                          {{ result_behavioral.conscientiousness_formatted }}
                        </div>
                      </div>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <div class="d-flex flex-column">
                  <div class="pa-2 bg-grey-lighten-5 mb-3">
                    <h3 class="mb-1 text-subtitle-2 font-weight-bold">{{ result_behavioral.field_one_title }}</h3>
                    <p>{{ result_behavioral.field_one_description }}</p>
                  </div>
                  <div class="pa-2 bg-grey-lighten-5">
                    <h3 class="mb-1 text-subtitle-2 font-weight-bold">{{ result_behavioral.field_two_title }}</h3>
                    <p>{{ result_behavioral.field_two_description }}</p>
                  </div>
                </div>
              </v-list-item>
            </template>
            <template v-else>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="text-subtitle-1 font-weight-bold">Perfil comportamental</v-list-item-title>
                  <div class="d-flex flex-column">
                    <span class="text-body-2">O perfil comportamental não foi respondido</span>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </template>
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
                   <v-tooltip text="Gerar relatório">
                    <template #activator="{ props }">
                      <v-btn v-bind="props" size="md" flat icon color="warning" class="pa-1" @click.stop="downloadPDF(feedback)">
                        <v-icon>mdi-file-document-outline</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </div>
            </v-col>
          </v-row>
          <span v-else>Não há parecer</span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
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
.chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chart-item h2 {
  margin: 0 0 5px 0;
  font-size: 13px;
}

.bar-bg {
  width: 300px;
  height: 30px;
  background-color: #d4d2d2;
  border-radius: 15px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 15px 0 0 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  transition: width 0.5s ease;
  font-size: 12px;
}

.bar-fill-1 {
  background-color: #4caf50;
}
.bar-fill-2 {
  background-color: #2155c4;
}
.bar-fill-3 {
  background-color: #cc2525;
}
.bar-fill-4 {
  background-color: #dbb434;
}
</style>