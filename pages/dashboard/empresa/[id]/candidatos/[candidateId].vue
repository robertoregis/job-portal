<script setup lang="ts">
  import { useShow } from '@/stores/show';
  import { useInfo } from '@/stores/info';
  definePageMeta({
    layout: 'dashboard'
  })
  const router = useRouter()
  const route = useRoute()
  const show = useShow();
  const info: any = useInfo();
  const { notify } = useNotification();
  const candidate = ref<any>({})
  const experiencesList = ref<any[]>([])
  const languagesList = ref<any[]>([])
  const educationsList = ref<any[]>([])
  const softSkillsList = ref<any[]>([])
  const loading = ref<boolean>(true)

  const getFormatDate = (date: string) => {
    if (!date) return ''
    const parts = date.split('-') // ["yyyy", "mm", "dd"]
    if (parts.length !== 3) return date

    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  }

  const navigation = () => {
    router.back()
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
            content: 'Acesse o perfil completo deste candidato e avalie sua experiência.'
        }
      ]
    })
    getDataCandidate(candidate.value.id)
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">{{ candidate.name }}</span>
        <span class="text-caption">Detalhes do candidato selecionado nesta candidatura</span>
      </div>
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-5">
    <v-col cols="12">
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
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Dados</h2>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="d-flex">
                <v-chip
                  color="primary"
                  variant="outlined"
                >
                  <v-icon icon="mdi-account-circle-outline" start></v-icon>
                  {{ candidate.is_employed ? 'Está empregado' : 'Está desempregado' }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="d-flex align-center my-1">
                <span class="text-subtitle-2 font-weight-bold">Nome:</span>
                <span class="text-body-2 ml-2">{{ candidate.name }}</span>
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
                <span class="text-body-2 ml-2">{{ candidate.address }}</span>
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

    <v-col cols="12" class="border mt-4">
      <v-card>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" class="d-flex">
              <a
                v-if="candidate.curriculum_url"
                :href="candidate.curriculum_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-decoration-none text-subtitle-1 d-flex align-center bg-primary py-1 px-4 rounded-xl"
              >
                <Icon name="mdi:file-link" />
                <span class="ml-2">Ver currículo atual</span>
              </a>
              <span v-else class="font-weight-bold">Não tem currículo no momento!</span>
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
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Sobre ele</v-list-item-title>
                <span class="text-body-2">
                  {{ candidate.about }}
                </span>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Áreas de interesse</v-list-item-title>
                <div v-if="candidate.areas_of_interest.length > 0" class="d-flex flex-wrap">
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
                <div v-if="candidate.job_types.length > 0" class="d-flex flex-wrap">
                  <v-chip
                    v-for="(area, idx) in candidate.job_types"
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
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Experiências profissionais</v-list-item-title>
                <div class="d-flex flex-column mt-2">
                  <div v-for="(experience, index) in experiencesList" :key="experience.id" class="border-sm px-2 py-1 rounded d-flex mb-1 flex-column">
                    <span class="text-caption font-weight-bold">{{ experience.position }}</span>
                    <div class="d-flex align-center">
                      <span class="text-body-2 mr-2">{{ experience.company_name }}</span>
                      <span v-if="experience.start_date || experience.end_date" class="text-small-2 bg-grey-darken-2 px-2 rounded-xl">{{ getFormatDate(experience.start_date) }} - {{ getFormatDate(experience.end_date) }}</span>
                    </div>
                    <p v-if="experience.description" class="pa-1 mt-1">{{ experience.description }}</p>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Escolaridade</v-list-item-title>
                <div class="d-flex flex-column mt-2">
                  <div v-for="(education, index) in educationsList" :key="education.id" class="border-sm px-2 py-1 rounded d-flex mb-1 flex-column">
                    <span class="text-caption font-weight-bold">{{ education.course }}</span>
                    <span class="text-body-2">{{ education.level }}</span>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Idiomas</v-list-item-title>
                <div class="d-flex flex-wrap">
                  <v-chip
                    v-for="(candidate, idx) in languagesList"
                    :key="idx"
                    class="mr-2 my-1 d-flex align-center"
                    label
                    color="language"
                    variant="flat"
                  >
                    <span>{{ candidate.name }}</span>
                    <span class="ml-1 text-caption">({{ candidate.level.toLowerCase() }})</span>
                  </v-chip>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Soft Skills</v-list-item-title>
                <div class="d-flex flex-column mt-2">
                  <div v-for="(softSkill, index) in softSkillsList" :key="softSkill.id" class="border-sm px-2 py-1 rounded d-flex mb-1 flex-column">
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
  </v-row>
</template>

<style lang="scss" scoped>
</style>
