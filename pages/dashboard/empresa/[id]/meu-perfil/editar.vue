<script setup lang="ts">
  //import { vMask } from 'vue-the-mask';
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
          content: 'Atualize as informações e dados da sua empresa.'
      }
    ]
  })
  const phoneInputRef: any = ref(null)
  const cpfInputRef: any = ref(null)
  const cnpjInputRef: any = ref(null)
  let phoneMaskInstance: any = null
  let cpfMaskInstance: any = null
  let cnpjMaskInstance: any = null

  definePageMeta({
    layout: 'dashboard' // ou outro nome, conforme os arquivos em layouts/
  })
  const info: any = useInfo();
  const show = useShow();
  const { createNotice, createLog } = useNotice();
  const route = useRoute();
  const router = useRouter();
  const states = ref<any[]>([])
  const stateSelected = ref<any>('')
  const citySelected = ref<any>('')
  const cities = ref<any[]>([])
  const loading = ref<boolean>(true)
  const formdata = ref<any>({
    name: '',
    phone: '',
    cnpj: '',
    state: null,
    city: null,
    foundation_at: '',
    legal_name: '',
    representative_name: '',
    representative_cpf: '',
    //representative_email: '',
    site: null,
    instagram: null,
    linkedin: null
  })

  const formattedFoundationDate = computed(() => {
    if (!formdata.value.foundation_at) return ''

    const parts = formdata.value.foundation_at.split('-') // ["yyyy", "mm", "dd"]
    if (parts.length !== 3) return formdata.value.foundation_at

    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  })


  const clear = () => {
    formdata.value = {
      name: '',
      phone: '',
      cnpj: '',
      state: null,
      city: null,
      foundation_at: '',
      legal_name: '',
      representative_name: '',
      representative_cpf: '',
      //representative_email: '',
      site: null,
      linkedin: null,
      instagram: null
    }
  }

  const updateCompany = async () => {
    show.setOverlayDashboard(true)
    try {
      const { data, error } = await useFetch(`/api/companies/${info.user.id}`, {
        method: 'PATCH',
        body: formdata.value
      })

      if (error.value) {
        notify({ title: 'Erro', text: 'Erro ao atualizar', type: 'error' })
        return
      }
      show.setOverlayDashboard(false)
      createLog({
        title: `Atualizou o perfil`,
        profile_id: info.profile.id,
        type: 'update_perfil'
      })
      notify({ title: 'Parabéns!', text: 'Os teus dados foram atualizados', type: 'success' })
      router.push(`/dashboard/empresa/${info.user.id}/meu-perfil`)
    } catch (err) {
      show.setOverlayDashboard(false)
      notify({ title: 'Erro', text: 'Aconteceu um erro ao atualizar', type: 'error' })
    }
  }

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
    formdata.value.foundation_at = new Date(val).toLocaleDateString('pt-BR')
    pickerVisible.value = false
  }
  const openDate = () => {
    pickerVisible.value = true;
  }

  const validatePhone = (value: any) => {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/
    return phoneRegex.test(value) || 'Telefone inválido'
  }

  const { data, error, pending } = await useFetch(`/api/companies/${info.user.id}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    formdata.value = {
      name: data.value.name,
      legal_name: data.value.legal_name,
      phone: data.value.phone,
      foundation_at: data.value.foundation_at,
      cnpj: data.value.cnpj,
      state: data.value.state,
      city: data.value.city,
      representative_name: data.value.representative_name,
      //representative_email: data.value.representative_email,
      representative_cpf: data.value.representative_cpf,
    }
    await getStates()
    if(data.value.state) {
      stateSelected.value = data.value.state
      await getCities(data.value.state)
      citySelected.value = data.value.city
    }
  }

  const imagePreview = ref<any>(null)
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
    const url = `/api/images?profile_id=${info.profile.id}&type=company`

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
      const company = info.user
      setTimeout(() => {
        info.setUser({
          ...company,
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
        const company = info.user
        info.setUser({
          ...company,
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

    if (cnpjInputRef.value) {
      const nativeCnpjInput = cnpjInputRef.value.$el.querySelector('input')
      if (nativeCnpjInput) {
        cnpjMaskInstance = IMask(nativeCnpjInput, {
          mask: '00.000.000/0000-00'
        })
        cnpjMaskInstance.on('accept', () => {
          formdata.value.cnpj = cnpjMaskInstance.value || ''
        })
      }
    }
  })

  onBeforeUnmount(() => {
    phoneMaskInstance?.destroy()
    cpfMaskInstance?.destroy()
    cnpjMaskInstance?.destroy()
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
                <form @submit.prevent="updateCompany">
                  <v-text-field
                    v-model="formdata.name"
                    :counter="10"
                    label="Nome"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <v-text-field
                    ref="cnpjInputRef"
                    v-model="formdata.cnpj"
                    label="CNPJ"
                    density="compact"
                    hide-details
                    class="mb-2"
                    :counter="15"
                  />

                  <v-text-field
                    v-model="formdata.legal_name"
                    :counter="10"
                    label="Razão Social"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <!--<v-text-field
                    v-model="formdata.representative_email"
                    label="E-mail do representante"
                    density="compact"
                    readonly
                    hide-details
                    class="mb-2"
                  />-->

                  <v-text-field
                    v-model="formdata.representative_name"
                    :counter="10"
                    label="Nome do representante"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <v-text-field
                    ref="cpfInputRef"
                    v-model="formdata.representative_cpf"
                    label="CPF do representante"
                    density="compact"
                    hide-details
                    class="mb-2"
                    :counter="15"
                  />

                  <v-text-field
                    ref="phoneInputRef"
                    v-model="formdata.phone"
                    label="Telefone"
                    density="compact"
                    hide-details
                    class="mb-2"
                    :counter="15"
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
                    :model-value="formattedFoundationDate"
                    label="Data de fundação"
                    readonly
                    @click="openDate()"
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

  </v-row>
</template>

<style lang="scss" scoped>

</style>