<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { useNotice } from '@/composables/useNotice';
  import { useShow } from '@/stores/show';
  const { notify } = useNotification();
  definePageMeta({
    layout: 'dashboard',
  })
  useHead({
    title: `Visualizar a edição - Conect One RH`,
    meta: [
      {
          name: 'description',
          content: 'Veja todos os pedidos para edição das vagas e aprove ou recuse.'
      }
    ]
  })
  const info: any = useInfo();
  const show = useShow();
  const { createNotice, createLog } = useNotice();
  const route = useRoute();
  const router = useRouter();
  const jobEdit = ref<any>({})
  const jobEditId = ref<string>('');
  const job = ref<any>({})
  const dialogEdit = ref<boolean>(false);
  const motive_recusation = ref<string>('');
  const motive_edit = ref<string>('');

  const sendMail = async (companyName: string, companyEmail: string, jobName: string, result: string) => {
    const { data: dataMaster, error: errorMaster } = await useFetch('/api/emails/send', {
      method: 'POST',
      body: {
        to: [`${companyName} <${companyEmail}>`],
        subject: 'Parabéns, a sua vaga foi editada',
        template: 'template_edit_job_success',
        variables: {
          name_company: companyName,
          job_name: jobName,
          result: result,
        }
      }
    })
  }

  const approveEdit = async () => {
    show.setOverlayDashboard(true)
    const { data, error } = await useFetch(`/api/jobs/${job.value.id}`, {
      method: 'PUT',
      body: jobEdit.value
    })

    if (error.value) {
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao atualizar a vaga', type: 'error' })
      return
    }
    const { data: dataEdit, error: errorEdit } = await useFetch(`/api/jobs_edit/${jobEditId.value}`, {
      method: 'PATCH',
      body: {
        is_closed: true,
        status: 'approved'
      }
    })
    createNotice({
      title: 'Edição da vaga foi aprovada',
      description: `A vaga ${job.value.title} foi aprovada e editada com sucesso.`,
      subtitle: 'Edição de vaga',
      profile_id: data.value.profile_id,
      type: 'info',
    })
    sendMail(jobEdit.value.name_company, jobEdit.value.email, jobEdit.value.title, "aprovado")
    createLog({
      title: `Aprovou a edição da vaga: ${job.value.title}`,
      profile_id: info.profile.id,
      type: 'approved_job_edit'
    })
    show.setOverlayDashboard(false)
    router.push(`/dashboard/admin/edicao-de-vagas`)
    notify({ title: 'Parabéns!', text: 'A edição foi aprovada e editada', type: 'success' })
  }

  const recusationEdit = async () => {
    if(!motive_recusation.value) {
      notify({ title: 'Erro', text: 'É preciso dizer o motivo', type: 'error' })
      return
    }

    show.setOverlayDashboard(true)

    try {
      const { data, error } = await useFetch(`/api/jobs_edit/${jobEditId.value}`, {
        method: 'PATCH',
        body: {
          motive_recusation: motive_recusation.value,
          is_closed: true,
          status: 'rejected'
        }
      })

      if (error.value) {
        //console.error('Erro ao recusar a edição:', error.value)
        notify({ title: 'Erro', text: 'Aconteceu um erro ao recusar a edição', type: 'error' })
        return
      }

      createNotice({
        title: 'Edição da vaga foi recusada',
        description: `A edição para a vaga ${job.value.title} foi recusada. Motivo da recusa: ${motive_recusation.value}`,
        subtitle: 'Edição de vaga',
        profile_id: data.value.profile_id,
        type: 'info',
      })
      createLog({
        title: `Recusou a edição da vaga: ${job.value.title}`,
        profile_id: info.profile.id,
        type: 'rejected_job_edit'
      })

      router.push(`/dashboard/admin/edicao-de-vagas`)
      notify({ title: 'Parabéns!', text: 'A edição foi recusada', type: 'success' })

    } catch (err) {
      console.error('Erro inesperado:', err)
      notify({ title: 'Erro', text: 'Aconteceu um erro inesperado', type: 'error' })
    } finally {
      show.setOverlayDashboard(false)
    }
  }

  const getJobs = async () => {
    const { data, error } = await useFetch('/api/jobs_edit', {
      method: 'GET',
    })

    if (error.value) {
    } else {
    }
  }

  const { data, error, refresh, pending } = await useFetch(`/api/jobs_edit/${route.params.jobEditId}`, {
    method: 'GET',
  })

  if (error.value) {
    //console.log(error.value)
  } else {
    jobEditId.value = data.value.id
    jobEdit.value = data.value.job_data;
    job.value = data.value.job;
    motive_edit.value = data.value.motive_edit;
  }

</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Edição de vagas</span>
        <span class="text-caption">Confira todos os pedidos para editar vagas.</span>
      </div>
    </v-col>
    <LayoutButtonBack />
  </v-row>

  <!-- Lista de empresas -->
  <v-row no-gutters>
    <v-col cols="12" class="border mt-4">
      <v-row no-gutters>
        <v-col cols="12" class="px-4 pa-2">
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-briefcase</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Versão a ser editada</h2>
          </div>
        </v-col>

        <v-col cols="12" class="px-4 pa-2">
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Cargo:</span>
            <span class="text-body-2 ml-2">{{ jobEdit.title }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Tipo de contrato:</span>
            <span class="text-body-2 ml-2">{{ jobEdit.contract_type }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Formato:</span>
            <span class="text-body-2 ml-2">{{ jobEdit.work_format }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Faixa salarial:</span>
            <span class="text-body-2 ml-2">{{ jobEdit.salary }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Carga horária:</span>
            <span class="text-body-2 ml-2">{{ jobEdit.workload }}</span>
          </div>
          <div class="d-flex flex-column flex-md-row align-start align-md-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Dias da semana:</span>
            <div class="d-flex flex-wrap mt-1 mt-md-0 ml-md-2">
              <template v-for="(day, index) in jobEdit.weekdays" :key="index">
                <v-chip color="primary" variant="flat" :ripple="false" class="text-body-2 mb-1 mb-md-0 mr-1">
                  {{day}}
                </v-chip>
              </template>
            </div>
          </div>
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-bold">Escolaridade mínima:</span>
            <span class="text-body-2 ml-2">{{ jobEdit.education_level }}</span>
          </div>
        </v-col>
        <v-col cols="12">
          <v-list>
            <v-list-item style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Descrição da vaga</v-list-item-title>
                <span class="text-body-2">
                  {{ jobEdit.description }}
                </span>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Benefícios</v-list-item-title>
                <ul>
                  <template v-for="(benefit, index) in jobEdit.benefits" :key="index">
                    <li class="text-body-2">- {{ benefit }};</li>
                  </template>
                </ul>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Conhecimentos</v-list-item-title>
                <ul>
                  <template v-for="(knowledge, index) in jobEdit.knowledge" :key="index">
                    <li class="text-body-2">- {{ knowledge }};</li>
                  </template>
                </ul>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="mt-2" style="min-height: unset">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold">Áreas de graduação</v-list-item-title>
                <ul>
                  <template v-for="(area, index) in jobEdit.undergraduate_areas" :key="index">
                    <li class="text-body-2">- {{ area }};</li>
                  </template>
                </ul>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" class="mt-6">
      <v-row no-gutters>
        <v-col cols="12">
          <div class="d-flex flex-column">
            <span class="font-weight-bold text-body-2">Motivo da edição:</span>
            <p class="mt-1 bg-warningLight pa-2">{{ motive_edit }}</p>
          </div>
        </v-col>
        <v-col cols="12" class="mt-3">
          <div class="d-flex align-center">
            <v-btn color="error" variant="flat" prepend-icon="mdi-thumb-down" @click="dialogEdit = true">
              Recusar
            </v-btn>

            <v-btn class="ml-3" color="success" prepend-icon="mdi-thumb-up" variant="flat" @click="approveEdit">
              Aprovar
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" class="border mt-6 bg-edit">
      <v-row no-gutters>
        <v-col cols="12" class="px-4 pa-2">
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-briefcase</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Versão antiga da vaga</h2>
          </div>
        </v-col>

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
        <v-col cols="12">
          <v-list class="bg-edit">
            <v-list-item style="min-height: unset">
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
      </v-row>
    </v-col>
  </v-row>

  <v-dialog
    v-model="dialogEdit"
    max-width="400"
  >
    <v-card
      title="Recusar edição"
    >
      <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <p class="text-body-2">Informe um motivo para recusar.</p>
            </v-col>
            <v-col cols="12 mt-1">
                <v-textarea
                v-model="motive_recusation"
                label="Motivo"
                variant="filled"
                auto-grow
                density="compact"
                rows="3"
                hide-details
                class="mb-1"
                />
            </v-col>
          </v-row>
      </v-card-text>

      <v-divider />
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="flat" @click="recusationEdit">
          Recusar
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
</style>
