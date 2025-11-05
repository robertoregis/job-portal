<script lang="ts">
  import { useInfo } from '@/stores/info';
  import { useNotice } from '@/composables/useNotice';

  export default {
    props: {
			job: {
				type: Object,
				required: true,
			},
		},
    setup(props: any, {emit}) {
      const dialog = ref<boolean>(false)
      const job = toRef(props, 'job')
      const dialogCreateCandidature = ref<boolean>(false)
      const info: any = useInfo()
      const router = useRouter();
      const { notify } = useNotification();
      const { createLog, createNotice } = useNotice();
      const isExists = ref<boolean>(false);
      const loading = ref<boolean>(true);
      const emailOfficial = useRuntimeConfig().public.EMAIL_OFFICIAL
      const apply = () => {
        if (info.user && info.user.id && info.user.type === 'candidate') {
          dialogCreateCandidature.value = true
        } else {
          dialog.value = true
        }
      }

      const candidature = ref<any>({
        candidate_name: 'Nome',
        state: null,
        city: null,
        status: 'Enviada',
        icon_status: 'mdi-send',
        title: null
      })

      const sendMail = async (companyName: string, candidateName: string, jobName: string,) => {
        const { data: dataMaster, error: errorMaster } = await useFetch('/api/emails/send', {
          method: 'POST',
          body: {
            to: [`Conect One RH <${emailOfficial}>`],
            subject: 'Uma nova candidatura foi feita',
            template: 'template_create_candidature',
            variables: {
              name_company: companyName,
              job_name: jobName,
              name_candidate: candidateName,
              date: formatDate(new Date(), 3)
            }
          }
        })
      }

      const checkCandidatureExists = async () => {
        // 1. Chamar o novo endpoint com os parâmetros corretos
        const { data, error, pending }: any = await useFetch(`/api/candidatures/check-exists`, {
          method: 'GET',
          params: {
            candidate_id: info.user.id, // Envia o ID do candidato
            job_id: job.value.id             // Envia o ID da vaga
          }
        })

        // 2. Tratar o resultado
        if (error.value) {
          console.error("Erro ao verificar candidatura:", error.value)
          // Tratar o erro (ex: exibir notificação)
        } else if (data.value && data.value.exists) {
          // Se o backend retornar { exists: true, ... }
          isExists.value = true;
        } else {
          isExists.value = false;
        }

        loading.value = false;
      }

      const resetCandidature = () => {
        candidature.value = {
          candidate_name: 'Nome',
          state: null,
          city: null,
          status: 'Enviada',
          icon_status: 'mdi-send',
          title: null
        }
      }
      //
      const createCandidature = async () => {
        const { data, error } = await useFetch('/api/candidatures', {
          method: 'POST',
          body: {
            ...candidature.value,
            candidate_id: info.user.id,
            job_id: job.value.id,
          }
        })
        if (error.value) {
          const message = error.value.data?.statusMessage || 'Erro ao criar candidatura'
          notify({ title: '', text: message, type: 'error' })
        } else {
          createNotice({
            title: 'Candidatura feita',
            description: `O candidato ${info.user.name} fez uma candidatura para a vaga "${job.value.title}" da empresa: ${job.value.company_name}`,
            subtitle: 'Candidatura',
            profile_id: info.profile.id,
            is_master: true,
            type: 'info',
          })
          createLog({
            title: `Criou o candidatura`,
            profile_id: info.profile.id,
            type: 'create_candidature'
          })
          sendMail(job.value.company_name, info.user.name, job.value.title)
          router.push(`/dashboard/candidato/${info.user.id}/minhas-candidaturas/${data.value.id}`)
          resetCandidature()
        }
      }

      const navigation = (id: number) => {
        dialog.value = false;
        router.push(`/cadastrar/candidato`)
      }

      onMounted(() => {
        checkCandidatureExists()
      })

      return {
        dialog,
        job,
        dialogCreateCandidature,
        navigation,
        apply,
        info,
        createCandidature,
        isExists
      }
    }
  }
</script>
<template>
  <v-col cols="12" md="6" class="">
    <NuxtLink :to="`/vagas/${job.id}`" class="no-underline">
      <v-card class="mx-auto">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-avatar class="mr-2">
              <v-img
                alt="John"
                :src="job.company_image_url"
              ></v-img>
            </v-avatar>
            <span>{{ job.title }}</span>
          </div>
          <span class="text-caption text-titleLight">{{ job.created_at_formatted }}</span>
        </v-card-title>

        <v-card-subtitle v-if="!job.is_hidden_name_company">
          <span class="text-subtitle-1">{{ job.company_name }}</span>
        </v-card-subtitle>

        <v-card-text>
          <div class="d-flex flex-column">
            <span>{{ job.description }}</span>
            <div class="d-flex flex-wrap gap-3 mt-1">
              <v-chip
                small
                color="primary"
                text-color="white"
                variant="tonal"
                class="mb-1 mr-1"
              >
                <v-icon left size="16">mdi-clock-outline</v-icon>
                {{ job.workload || 'Carga horária não informada' }}
              </v-chip>

              <v-chip
                v-if="!job.is_hidden_salary"
                small
                color="green"
                text-color="white"
                variant="tonal"
                class="mb-1 mr-1"
              >
                <v-icon left size="16">mdi-cash-multiple</v-icon>
                {{ job.salary || 'Faixa salarial não informada' }}
              </v-chip>

              <v-chip
                small
                color="indigo"
                text-color="white"
                variant="tonal"
                class="mb-1 mr-1"
              >
                <v-icon left size="16">mdi-school-outline</v-icon>
                {{ job.education_level || 'Escolaridade não informada' }}
              </v-chip>

              <v-chip
                small
                color="deep-purple"
                text-color="white"
                variant="tonal"
                class="mb-1 mr-1"
              >
                <v-icon left size="16">mdi-laptop</v-icon>
                {{ job.work_format || 'Formato de trabalho não informado' }}
              </v-chip>

              <v-chip
                small
                color="orange"
                text-color="white"
                variant="tonal"
                class="mb-1 mr-1"
              >
                <v-icon left size="16">mdi-file-document-outline</v-icon>
                {{ job.contract_type || 'Tipo de contrato não informado' }}
              </v-chip>
            </div>
          </div>
        </v-card-text>

        <v-card-actions v-if="info.user && (!info.user.id || info.user.id && info.user.type === 'candidate')">
          <v-btn
            v-if="!isExists"
            @click.prevent="apply"
            class="bg-gradient-primary"
            text="Candidatar-me"
            variant="flat"
          ></v-btn>
          <span v-else class="font-weight-bold text-caption text-red-darken-3">Você já se candidatou</span>
        </v-card-actions>
      </v-card>
    </NuxtLink>
  </v-col>

  <v-dialog
    v-model="dialogCreateCandidature"
    max-width="400"
    persistent
  >
    <v-card
      text="Se você curtiu a vaga não perca tempo e faça a sua candidatura."
      title="Candidata-se!"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn color="error" variant="flat" @click="dialogCreateCandidature = false">
          Não
        </v-btn>

        <v-btn color="success" variant="flat" @click="createCandidature">
          Sim
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

  <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card
        prepend-icon="mdi-briefcase"
        text="Para se candidatar a ela é preciso ter um cadastro. É rápido e fácil fazer um!"
        title="Gostou da vaga?"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn variant="flat" color="success" @click="navigation">
            Faça o cadastro
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>

<style lang="scss" scoped>
</style>