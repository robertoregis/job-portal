<script setup lang="ts">
  //import { vMask } from 'vue-the-mask';
  import { useNotice } from '@/composables/useNotice';
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  const { notify } = useNotification();

  definePageMeta({
    layout: 'dashboard' // ou outro nome, conforme os arquivos em layouts/
  })
  const info: any = useInfo();
  const show = useShow();
  const { createNotice } = useNotice();
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
    foundation: '',
    legal_name: '',
    representative_name: '',
    representative_cpf: '',
    representative_email: ''
  })

  const clear = () => {
    formdata.value = {
      name: '',
      phone: '',
      cnpj: '',
      state: null,
      city: null,
      foundation: '',
      legal_name: '',
      representative_name: '',
      representative_cpf: '',
      representative_email: ''
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
        console.error('Erro ao atualizar empresa:', error.value)
        return
      }
      show.setOverlayDashboard(false)
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
    formdata.value.foundation = new Date(val).toLocaleDateString('pt-BR')
    pickerVisible.value = false
  }
  const openDate = () => {
    pickerVisible.value = true;
  }

  const validatePhone = (value: any) => {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/
    return phoneRegex.test(value) || 'Telefone inválido'
  }

  onMounted(() => {
  })

  const { data, error, pending } = await useFetch(`/api/companies/${info.user.id}`, {
    method: 'GET'
  })

  if (error.value) {
  } else {
    formdata.value = {
      name: data.value.name,
      legal_name: data.value.legal_name,
      phone: data.value.phone,
      foundation: data.value.foundation,
      cnpj: data.value.cnpj,
      state: data.value.state,
      city: data.value.city,
      representative_name: data.value.representative_name,
      representative_email: data.value.representative_email,
      representative_cpf: data.value.representative_cpf,
    }
    await getStates()
    if(data.value.state) {
      stateSelected.value = data.value.state
      await getCities(data.value.state)
      citySelected.value = data.value.city
    }
  }
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="d-flex flex-column">
        <span class="text-gradient-primary font-weight-bold">Editar perfil</span>
        <span class="text-caption">Aqui você edita os teus dados</span>
      </div>
    </v-col>
  </v-row>
  <v-row class="mt-5">
      <v-col cols="12" class="border">
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
                    v-model="formdata.cnpj"
                    label="CNPJ"
                    density="compact"
                    hide-details
                    class="mb-2"
                    :counter="15"
                    v-mask="'##.###.###/####-##'"
                  />

                  <v-text-field
                    v-model="formdata.legal_name"
                    :counter="10"
                    label="Razão Social"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <v-text-field
                    v-model="formdata.representative_email"
                    label="E-mail do representante"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <v-text-field
                    v-model="formdata.representative_name"
                    :counter="10"
                    label="Nome do representante"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <v-text-field
                    v-model="formdata.representative_cpf"
                    label="CPF do representante"
                    density="compact"
                    hide-details
                    class="mb-2"
                    :counter="15"
                    v-mask="'###.###.###-##'"
                  />

                  <v-text-field
                    v-model="formdata.phone"
                    label="Telefone"
                    density="compact"
                    hide-details
                    class="mb-2"
                    :counter="15"
                    v-mask="'(##) #####-####'"
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
                    v-model="formdata.foundation"
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