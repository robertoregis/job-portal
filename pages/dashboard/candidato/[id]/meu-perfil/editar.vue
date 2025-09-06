<script setup lang="ts">
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  import IMask from 'imask'
  const { notify } = useNotification();
  useHead({
    title: `Editar perfil - Conect One RH`,
    meta: [
      {
          name: 'description',
          content: 'Atualize e personalize seu perfil para destacar suas habilidades.'
      }
    ]
  })
  definePageMeta({
    layout: 'dashboard' // ou outro nome, conforme os arquivos em layouts/
  })
  const info: any = useInfo();
  const show = useShow();
  const { createNotice, createLog } = useNotice();
  const route = useRoute();
  const states = ref<any[]>([])
  const stateSelected = ref<any>('')
  const citySelected = ref<any>('')
  const cities = ref<any[]>([])
  const loading = ref<boolean>(true)
  const items = ref<any>([])
  const phoneInputRef: any = ref(null)
  const cpfInputRef: any = ref(null)
  let phoneMaskInstance: any = null
  let cpfMaskInstance: any = null

  const formdata = ref<any>({
    name: null,
    phone: null,
    birth_date: null,
    cpf: null,
    state: null,
    city: null,
    about: null,
    marital_status: null,
    salary_expectations: null,
    areas_of_interest: [],
    job_types: [],
  })
  const imagePreview = ref<any>(null)
  const typeDate = ref<string>('')
  const areasOfInterestList = [
    'Administrativa', 'Corporativa', 'Financeira', 'Comercial',
    'Marketing', 'Recursos Humanos', 'Operacional', 'Logística',
    'Tecnologia da Informação', 'Jurídica', 'Compras', 'Suprimentos',
    'Departamento Pessoal', 'Fiscal'
  ]
  const jobTypesList = [
    'Gerente', 'Sub Gerente', 'Coordenador', 'Supervisor',
    'Especialista', 'Analista', 'Assistente', 'Auxiliar',
    'Diretor', 'CO', 'COO', 'CFO'
  ]
  
  watch(stateSelected, async (newState, oldState) => {
    if (newState) {
      formdata.value.state = newState
      await getCities(newState)
      
      if (newState !== oldState && (oldState !== null && oldState !== '')) {
        citySelected.value = null
      }
    } else {
      cities.value = []
      citySelected.value = null
    }
  })

  watch(citySelected, async (newCity) => {
    if (newCity) {
      formdata.value.city = newCity;
    }
  })

  const profilePoints = {
    name: 10,
    phone: 10,
    birth_date: 5,
    cpf: 10,
    state: 5,
    city: 5,
    about: 10,
    marital_status: 10,
    salary_expectations: 15,
    areas_of_interest: 10,
    job_types: 10,
  }

  const calculateProfileScore = (profile: any, profilePoints: any) => {
    let total = 0
    let achieved = 0

    for (const key in profilePoints) {
      const points = profilePoints[key]
      total += points

      const fieldValue = profile[key]
      const isFilled =
        fieldValue !== null &&
        fieldValue !== '' &&
        !(Array.isArray(fieldValue) && fieldValue.length === 0)

      if (isFilled) {
        achieved += points
      }
    }

    const percentage = Math.round((achieved / total) * 100)
    const isComplete = percentage === 100

    return { percentage, isComplete }
  }

  const getStates = async () => {
      loading.value = true; // marca que está carregando
      try {
          const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
          if (!res.ok) {
          throw new Error(`Erro na requisição: ${res.status} ${res.statusText}`);
          }

          const data = await res.json();

          states.value = data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
      } catch (err) {
          console.error('Erro ao buscar estados:', err);
      } finally {
          loading.value = false; // termina o loading
      }
  };
  const getCities = async (state: any) => {
      // Buscar o estado selecionado
      const selectedState = states.value.find((s: any) => s.nome === state);
      if (!selectedState) {
          console.warn('Estado não encontrado:', state);
          return;
      }
      try {
          const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState.sigla}/distritos`);

          if (!res.ok) {
          throw new Error(`Erro na requisição: ${res.status} ${res.statusText}`);
          }

          const data = await res.json();
          cities.value = data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
      } catch (err) {
        console.error('Erro inesperado ao buscar cidades:', err);
      }
  };

  const pickerVisible = ref(false)

  const onDateSelected = (val: any) => {
    formdata.value.birth_date = new Date(val).toLocaleDateString('pt-BR')
    pickerVisible.value = false
  }
  const formattedBirthDate = computed(() => {
    if (!formdata.value.birth_date) return ''
    const parts = formdata.value.birth_date.split('-') // ["yyyy", "mm", "dd"]
    if (parts.length !== 3) return formdata.value.birth_date

    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  })
  const openDate = (type: string) => {
    //typeDate.value =  type;
    pickerVisible.value = true;
  }

  const validatePhone = (value: any) => {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/
    return phoneRegex.test(value) || 'Telefone inválido'
  }

  const updateCandidate = async () => {
    show.setOverlayDashboard(true)
    try {
      const resultCalculate = calculateProfileScore(formdata.value, profilePoints)
      formdata.value.is_complete = resultCalculate.isComplete;
      formdata.value.completion_percentage = `${resultCalculate.percentage}%`;
      if(citySelected.value) {
        formdata.value.city = citySelected.value
      }
      if(stateSelected.value) {
        formdata.value.state = stateSelected.value
      }
      const { data, error } = await useFetch(`/api/candidates/${info.user.id}`, {
        method: 'PATCH',
        body: formdata.value
      })

      if (error.value) {
        console.error('Erro ao atualizar candidato:', error.value)
        return
      }
      /*createNotice({
        title: 'Novo Aviso',
        description: 'Descrição do aviso',
        subtitle: 'Destaque',
        profile_id: info.profile.id,
        type: 'Info'
      })*/
      createLog({
        title: `Atualizou o perfil`,
        profile_id: info.profile.id,
        type: 'update_perfil'
      })
      show.setOverlayDashboard(false)
      notify({ title: 'Parabéns!', text: 'Os teus dados foram atualizados', type: 'success' })
    } catch (err) {
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao atualizar', type: 'error' })
    }
  }

  const { data, error, pending } = await useFetch(`/api/candidates/${info.user.id}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    formdata.value = {
      name: data.value.name,
      phone: data.value.phone,
      birth_date: data.value.birth_date,
      cpf: data.value.cpf,
      state: data.value.state,
      city: data.value.city,
      about: data.value.about,
      marital_status: data.value.marital_status,
      areas_of_interest: data.value.areas_of_interest,
      job_types: data.value.job_types,
      salary_expectations: data.value.salary_expectations
    }
    if(info.user.image_url) {
      imagePreview.value = info.user.image_url
    }
    await getStates()
    if(data.value.state) {
      stateSelected.value = data.value.state
      await getCities(data.value.state)
      citySelected.value = data.value.city
    }
  }

  const file = ref<File | null>(null)
  const fileInput: any = ref(null)
  const triggerFileInput = () => {
    fileInput.value?.click()
  }

  const previewImage = () => {
    if (!file.value) {
      imagePreview.value = null
      return
    }
    const selectedFile = file.value

    if (selectedFile instanceof File) {
      imagePreview.value = URL.createObjectURL(selectedFile)
    } else if (Array.isArray(selectedFile)) {
      imagePreview.value = selectedFile.length > 0 ? URL.createObjectURL(selectedFile[0]) : null
    }
  }

  const uploadImage = async () => {
    show.setOverlayDashboard(true)
    if (!file.value) {
      notify({ title: 'Erro', text: 'Selecione uma imagem', type: 'error' })
      show.setOverlayDashboard(false)
      return
    }

    const formDataTy = new FormData()
    formDataTy.append('file', file.value)
    const url = `/api/images?profile_id=${info.profile.id}&type=candidate`

    const { data: imageData, error: imageError }: any = await useFetch(url, {
      method: 'POST',
      body: formDataTy
    })

    if (imageError.value) {
      notify({ title: 'Erro', text: 'Erro ao enviar imagem', type: 'error' })
    } else {
      if(info.user.image_id) {
        await deleteImage(false)
      }
      const candidate = info.user
      setTimeout(() => {
        info.setUser({
          ...candidate,
          image_url: imageData.value.image_url,
          image_id: imageData.value.image_id
        })
        imagePreview.value = imageData.value.image_url
        createLog({
          title: `Atualizou a foto de perfil`,
          profile_id: info.profile.id,
          type: 'update_photo_perfil'
        })
        notify({ title: 'Parabéns!', text: 'A imagem foi enviada', type: 'success' })
      }, 1500)
    }
    setTimeout(() => {
      show.setOverlayDashboard(false)
    }, 1000)
  }

  const deleteImage = async (isLoading: boolean) => {
    if(isLoading) {
      show.setOverlayDashboard(true)
    }
    const url = `/api/images?image_id=${encodeURIComponent(info.user.image_id)}&type=${info.user.type}&profile_id=${info.profile.id}`
    const { data, error } = await useFetch(url, {
      method: 'DELETE'
    })

    setTimeout(() => {
      if(isLoading) {
        if(error.value) {
          notify({ title: 'Erro', text: 'Erro ao remover imagem', type: 'error' })
        } else {
          createLog({
            title: `Removeu a foto de perfil`,
            profile_id: info.profile.id,
            type: 'delete_photo_perfil'
          })
          notify({ title: 'Parabéns!', text: 'A imagem foi removida', type: 'success' })
        }
        const candidate = info.user
        info.setUser({
          ...candidate,
          image_url: null,
          image_id: null
        })
        imagePreview.value = null
        file.value = null
        show.setOverlayDashboard(false)
      }
    }, 1000)
  }

  const cancelChange = () => {
    imagePreview.value = info.user.image_url
    file.value = null
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
    const url = `/api/archives?candidate_id=${info.user.id}&type=candidate`

    const { data: pdfData, error: pdfError }: any = await useFetch(url, {
      method: 'POST',
      body: formData
    })

    if (pdfError.value) {
      notify({ title: 'Erro', text: 'Erro ao enviar arquivo', type: 'error' })
    } else {
      if(info.user.curriculum_id) {
        await deletePDF(false, info.user.curriculum_id)
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
        info.setUser({
          ...info.user,
          curriculum_url: pdfData.value.curriculum_url,
          curriculum_id: pdfData.value.curriculum_id
        })
        filePDF.value = null
      }, 1000)
    }

    setTimeout(() => {
      show.setOverlayDashboard(false)
    })
  }

  const deletePDF = async (isLoading: boolean, curriculumId: string) => {
    if (!info.user.curriculum_id) {
      notify({ title: 'Erro', text: 'Nenhum currículo para remover', type: 'error' })
      return
    }
    if(isLoading) {
      show.setOverlayDashboard(true)
    }

    const url = `/api/archives?curriculum_id=${encodeURIComponent(curriculumId)}&type=candidate&candidate_id=${info.user.id}`
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
          const candidate = info.user
          info.setUser({
            ...candidate,
            curriculum_url: null,
            curriculum_id: null
          })
          filePDF.value = null
        }
        show.setOverlayDashboard(false)
      }
    }, 1000)

  }

  onMounted(() => {
    if (phoneInputRef.value) {
      const nativePhoneInput = phoneInputRef.value.$el.querySelector('input')
      if (nativePhoneInput) {
        phoneMaskInstance = IMask(nativePhoneInput, {
          mask: '(00) 00000-0000'
        })
        phoneMaskInstance.on('accept', () => {
          formdata.value.phone = phoneMaskInstance.value || ''
        })
      }
    }

    if (cpfInputRef.value) {
      const nativeCpfInput = cpfInputRef.value.$el.querySelector('input')
      if (nativeCpfInput) {
        cpfMaskInstance = IMask(nativeCpfInput, {
          mask: '000.000.000-00'
        })
        cpfMaskInstance.on('accept', () => {
          formdata.value.cpf = cpfMaskInstance.value || ''
        })
      }
    }
  })

  onBeforeUnmount(() => {
    phoneMaskInstance?.destroy()
    cpfMaskInstance?.destroy()
  })
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Editar perfil</span>
        <span class="text-caption">Aqui você edita os teus dados</span>
      </div>
    </v-col>
    <LayoutButtonBack />
    <v-col v-if="!info.user.is_complete" cols="12" class="bg-error mt-4 pa-2">
      <p class="text-center">Conclua o seu perfil para candidatar-se as vagas!</p>
    </v-col>
  </v-row>

  <v-row no-gutters class="mt-5">
    <v-col cols="12" class="border pa-2">
      <div class="d-flex flex-column">
        <span class="text-caption mb-2">Clique na foto para trocar:</span>
        <div class="d-flex align-center">
          <v-avatar v-if="imagePreview" size="70" @click="triggerFileInput" class="cursor-pointer">
            <v-img alt="Foto" :src="imagePreview"></v-img>
          </v-avatar>
          <v-avatar v-else size="70" @click="triggerFileInput" class="cursor-pointer">
            <v-img alt="Foto" src="https://uhwfvrjhlhvxyrrlaqna.supabase.co/storage/v1/object/public/jobportal/default/blank-profile-picture-973460_640.png"></v-img>
          </v-avatar>

          <!-- Input de arquivo escondido -->
          <v-file-input
            ref="fileInput"
            accept="image/*"
            v-model="file"
            style="display: none"
            @change="previewImage"
          ></v-file-input>

          <v-tooltip open-on-hover>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                v-if="imagePreview !== info.user.image_url && imagePreview"
                @click="uploadImage"
                size="small"
                :disabled="!file"
                color="primary"
                class="ml-2"
                icon
                aria-label="Upload"
              >
                <v-icon>mdi-upload</v-icon>
              </v-btn>
            </template>
            <span>Trocar</span>
          </v-tooltip>

          <v-tooltip open-on-hover>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                v-if="imagePreview !== info.user.image_url && imagePreview"
                @click="cancelChange"
                size="small"
                :disabled="!file"
                color="grey"
                class="ml-2"
                icon
                aria-label="Cancelar"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Cancelar</span>
          </v-tooltip>

          <v-tooltip open-on-hover>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                v-if="imagePreview && info.user.image_id"
                @click="deleteImage(true)"
                size="small"
                color="error"
                class="ml-2"
                icon
                aria-label="Remover"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Remover</span>
          </v-tooltip>

        </div>
      </div>
    </v-col>

      <v-col cols="12" class="border mt-4">
        <v-card>
          <v-card-title>
            <div class="d-flex align-center">
              <v-icon class="mr-2 text-gradient-primary">mdi-account-circle</v-icon>
              <h2 class="text-h6 font-weight-bold text-gradient-primary">Meus dados</h2>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12">
                <form @submit.prevent="updateCandidate">
                  <v-switch
                    v-model="formdata.is_employed"
                    :label="`${formdata.is_employed ? 'Empregado' : 'Desempregado'}`"
                    color="success"
                    inset
                    hide-details
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="formdata.name"
                    :counter="10"
                    label="Nome"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <!--<v-text-field
                    v-model="formdata.email"
                    label="E-mail"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />-->

                  <v-text-field
                    ref="phoneInputRef"
                    v-model="formdata.phone"
                    label="Telefone"
                    density="compact"
                    hide-details
                    class="mb-2"
                    type="tel"
                    :counter="15"
                  />

                  <v-text-field
                    ref="cpfInputRef"
                    v-model="formdata.cpf"
                    label="CPF"
                    density="compact"
                    hide-details
                    class="mb-2"
                    type="tel"
                    :counter="15"
                  />

                  <v-select
                    v-model="formdata.marital_status"
                    label="Estado Cívil"
                    :items="['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)']"
                    density="compact"
                    hide-details
                    class="mb-2"
                  ></v-select>

                  <v-text-field
                    v-model="formdata.salary_expectations"
                    label="Pretensão salarial"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <v-select
                    v-model="stateSelected"
                    label="Estado"
                    :items="states"
                    item-title="nome"
                    item-value="item"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <v-select
                    v-model="citySelected"
                    label="Cidade"
                    :items="cities"
                    item-title="nome"
                    item-value="nome"
                    :disabled="cities.length === 0"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <v-text-field
                    :model-value="formattedBirthDate"
                    label="Data de nascimento"
                    readonly
                    @click="openDate(`dateOfBirth`)"
                    density="compact"
                    hide-details
                    class="mb-2"
                  ></v-text-field>

                  <v-dialog v-model="pickerVisible" width="auto">
                    <v-card>
                      <v-date-picker
                        @update:model-value="(val: any) => onDateSelected(val)"
                      ></v-date-picker>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="pickerVisible = false">Fechar</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-textarea
                    label="Sobre mim"
                    v-model="formdata.about"
                    name="input-7-1"
                    variant="filled"
                    auto-grow
                    hide-details
                    density="compact"
                    class="mb-2"
                  ></v-textarea>

                  <v-select
                    v-model="formdata.areas_of_interest"
                    :items="areasOfInterestList"
                    label="Áreas de interesse"
                    density="compact"
                    multiple
                    chips
                    hide-details
                    class="mb-2"
                  />

                  <v-select
                    v-model="formdata.job_types"
                    :items="jobTypesList"
                    label="Tipos de vagas que procura"
                    density="compact"
                    multiple
                    chips
                    hide-details
                    class="mb-2"
                  />

                  <v-text-field
                    v-model="formdata.site"
                    :counter="10"
                    label="Site"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <v-text-field
                    v-model="formdata.linkedin"
                    :counter="10"
                    label="Linkedin"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <v-text-field
                    v-model="formdata.instagram"
                    :counter="10"
                    label="Instagram"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <v-btn class="me-4 bg-gradient-primary" type="submit">
                    Salvar
                  </v-btn>

                </form>
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
              <template v-if="info.user.curriculum_url">
                <div>
                  <a
                    :href="info.user.curriculum_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-decoration-none text-subtitle-1"
                  >
                    Ver currículo atual
                  </a>
                  <v-btn
                    color="error"
                    class="ml-4"
                    @click="deletePDF(true, info.user.curriculum_id)"
                    size="small"
                  >
                    <v-icon left>mdi-delete</v-icon>
                    Remover currículo
                  </v-btn>
                </div>
              </template>
              <template v-else>
                <span class="text-caption mb-2">Envie seu currículo (PDF):</span>

                <v-file-input
                  ref="fileInputPDF"
                  accept="application/pdf"
                  v-model="filePDF"
                  :label="filePDF ? filePDF.name : (info.user.curriculum_url ? 'Arquivo selecionado' : 'Escolher arquivo PDF')"
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
              </template>
            </div>
          </v-card-text>
        </v-card>
      </v-col>


      <v-col cols="12" class="border mt-4">
        <PerfilUserExperiences />
      </v-col>

      <v-col cols="12" class="border mt-4">
        <PerfilUserBehavioral />
      </v-col>

      <v-col cols="12" class="border mt-4">
        <PerfilUserLanguages />
      </v-col>
      
      <v-col cols="12" class="border mt-4">
        <PerfilUserEducations />
      </v-col>

      <v-col cols="12" class="border mt-4">
        <PerfilUserSoftsSkills />
      </v-col>

  </v-row>
</template>

<style lang="scss" scoped>

</style>