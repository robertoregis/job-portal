<script setup lang="ts">
  //import { vMask } from 'vue-the-mask';

  definePageMeta({
    layout: 'dashboard' // ou outro nome, conforme os arquivos em layouts/
  })

  const states = ref<any[]>([])
  const stateSelected = ref<any>('')
  const citySelected = ref<any>('')
  const cities = ref<any[]>([])
  const loading = ref<boolean>(true)
  const formdata = ref<any>({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    state: null,
    city: null,
    about: ''
  })

  const typeDate = ref<string>('')
  const submit = () => {}

  watch(stateSelected, async (newState) => {
    if (newState) {
      formdata.value.state = newState;
      await getCities(newState) // ou newState.id, dependendo da estrutura
      citySelected.value = null
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
      formdata.value.city = '';
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

  const onDateSelected = (val: any, type: string) => {
    if(type === `dateOfBirth`) {
      formdata.value.date_of_birth = new Date(val).toLocaleDateString('pt-BR')
    } else if(type === `dateEnd`) {
      experience.value.dateEnd = new Date(val).toLocaleDateString('pt-BR')
    } else if(type === `dateInitial`) {
      experience.value.dateInitial = new Date(val).toLocaleDateString('pt-BR')
    }
    pickerVisible.value = false
  }
  const openDate = (type: string) => {
    typeDate.value =  type;
    pickerVisible.value = true;
  }

  const validatePhone = (value: any) => {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/
    return phoneRegex.test(value) || 'Telefone inválido'
  }

  //// Escolaridade
  const dialogEducation = ref(false)
  const educationsList = ref<any>([])
  const education = ref({
    level: null,
    course: '',
    institution: '',
    period: '',
    notes: ''
  })
  const educationLevels = [
    "Fundamental Incompleto",
    "Fundamental Completo",
    "Médio Incompleto",
    "Ensino Médio",
    "Técnico",
    "Tecnólogo",
    "Graduação",
    "Pós-graduação",
    "Mestrado",
    "Doutorado"
  ]
  const editingEducationIndex = ref<any>(null)
  const editEducation = (index: any) => {
    const item = educationsList.value[index]
    education.value = { ...item }
    editingEducationIndex.value = index
    dialogEducation.value = true
  }
  const removeEducation = (index: any) => {
    educationsList.value.splice(index, 1)
  }
  const addEducation = () => {
    if (!education.value.level || !education.value.course || !education.value.period || !education.value.institution) {
      alert('Apenas o campo notas é opcional')
      return
    }
    if (editingEducationIndex.value !== null) {
      educationsList.value[editingEducationIndex.value] = { ...education.value }
    } else {
      educationsList.value.push({ ...education.value })
    }

    clearEducation()
  }
  const clearEducation = () => {
    education.value = {
      level: null,
      course: '',
      institution: '',
      period: '',
      notes: ''
    }
    dialogEducation.value = false
    editingEducationIndex.value = null
  }
  ////

  //// Soft Skill
  const dialogSoftSkill = ref(false)
  const softsList = ref<any>([])
  const softSkill = ref({
    name: '',
    level: null,
    notes: '',
  })
  const skillLevels = [
    'Iniciante',
    'Intermediário',
    'Avançado',
    'Especialista',
  ]
  const clearSoftSkill = () => {
    softSkill.value = {
      name: '',
      level: null,
      notes: '',
    }
    dialogSoftSkill.value = false
    editingIndex.value = null
  }
  const addSoftSkill = () => {
    if (!softSkill.value.name) {
      alert('Selecione o nome do soft skill')
      return
    }
    if (editingIndex.value !== null) {
      softsList.value[editingIndex.value] = { ...softSkill.value }
    } else {
      softsList.value.push({ ...softSkill.value })
    }
    clearSoftSkill()
  }
  const editingIndex = ref<any>(null)
  const editSoftSkill = (index: any) => {
    const item = softsList.value[index]
    softSkill.value = { ...item }
    editingIndex.value = index
    dialogSoftSkill.value = true
  }
  const removeSoftSkill = (index: any) => {
    softsList.value.splice(index, 1)
  }
  ////

  //// Idiomas
  const languages = [
    { name: 'Português', code: 'pt' },
    { name: 'Inglês', code: 'en' },
    { name: 'Espanhol', code: 'es' },
    { name: 'Francês', code: 'fr' },
  ]
  const levels = [
    'Básico',
    'Intermediário',
    'Avançado',
    'Fluente',
    'Nativo',
  ]
  const dialogLanguage = ref(false)
  const language = ref<any>({
    name: null,
    level: null
  })
  const languageList = ref<any>([])
  function addLanguage() {
    if (!language.value.name || !language.value.level) {
      alert('Selecione idioma e nível')
      return
    }
    const languageName = languages.find(
      (l) => l.code === language.value.name
    )?.name
    // Evita adicionar idioma repetido
    const exists = languageList.value.some(
      (l: any) => l.languageName === languageName
    )
    if (exists) {
      alert('Idioma já adicionado')
      return
    }
    languageList.value.push({ ...language.value })
    clearLanguage()
  }
  const clearLanguage = () => {
    language.value = {
      language: null,
      level: null
    }
    dialogLanguage.value = false
  }
  const removeLanguage = (index: any) => {
    languageList.value.splice(index, 1)
  }
  ////

  //// Experiência profissional
  const periods = [
    'Menos de 6 meses',
    'Entre 6 meses e 1 ano',
    'Entre 1 a 3 anos',
    'Entre 3 a 5 anos',
    'Mais de 5 anos',
  ]
  const experience = ref<any>({
    period: null,
    dateInitial: '',
    dateEnd: '',
    companyName: '',
    description: ''
  })
  const dialogExperience = ref(false)
  const experiencesList = ref<any>([])
  const addExperience = () => {
    if (!experience.value.period || !experience.value.companyName) {
      alert('Selecione o nome da empresa e o período')
      return
    }
    if (editingIndex.value !== null) {
      experiencesList.value[editingExperienceIndex.value] = { ...experience.value }
    } else {
      experiencesList.value.push({ ...experience.value })
    }
    clearExperience()
  }
  const editingExperienceIndex = ref<any>(null)
  const editExperience = (index: any) => {
    const item = experiencesList.value[index]
    experience.value = { ...item }
    editingExperienceIndex.value = index
    dialogExperience.value = true
  }
  const removeExperience = (index: any) => {
    experiencesList.value.splice(index, 1)
  }
  const clearExperience = () => {
    experience.value = {
      period: null,
      dateInitial: '',
      dateEnd: '',
      companyName: '',
      description: ''
    }
    dialogExperience.value = false;
    editingExperienceIndex.value = null
  }
  ////

  onMounted(() => {
    getStates()
  })
</script>

<template>
  <v-row no-gutters class="mt-5">
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
                <form @submit.prevent="submit">
                  <v-text-field
                    v-model="formdata.name"
                    :counter="10"
                    label="Nome"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <v-text-field
                    v-model="formdata.email"
                    label="E-mail"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <v-text-field
                    v-model="formdata.phone"
                    label="Telefone"
                    density="compact"
                    hide-details
                    class="mb-2"
                    type="tel"
                    :counter="15"
                    v-mask="'(##) #####-####'"
                  />

                  <v-select
                    label="Estado Cívil"
                    :items="['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)']"
                    density="compact"
                    hide-details
                    class="mb-2"
                  ></v-select>

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
                    v-model="formdata.date_of_birth"
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
                        @update:model-value="(val: any) => onDateSelected(val, typeDate)"
                      ></v-date-picker>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="pickerVisible = false">Fechar</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-textarea
                    label="Sobre mim"
                    :model-value="formdata.about"
                    name="input-7-1"
                    variant="filled"
                    auto-grow
                    hide-details
                    density="compact"
                    class="mb-2"
                  ></v-textarea>

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
          <v-card-title>
            <div class="d-flex align-center">
              <v-icon class="mr-2 text-gradient-primary">mdi-account-circle</v-icon>
              <h2 class="text-h6 font-weight-bold text-gradient-primary">Experiência profissional</h2>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list v-if="experiencesList.length > 0" two-line class="mb-2">
              <v-list-item
                v-for="(item, i) in experiencesList"
                :key="i"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item.name_company }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.period }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-btn class="bg-gradient-primary" @click="dialogExperience = true">
              Adicionar
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" class="border mt-4">
        <v-card>
          <v-card-title>
            <div class="d-flex align-center">
              <v-icon class="mr-2 text-gradient-primary">mdi-account-circle</v-icon>
              <h2 class="text-h6 font-weight-bold text-gradient-primary">Softs Skill</h2>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list v-if="softsList.length > 0" two-line class="mb-2">
              <v-list-item
                v-for="(item, i) in softsList"
                :key="i"
                class="pa-1 border mb-1"
              >
                <!-- Conteúdo principal -->
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle v-if="item.level">{{ item.level }}</v-list-item-subtitle>
                </v-list-item-content>

                <!-- Botões de ação no canto superior direito -->
                <template #append>
                  <div class="d-flex align-center justify-end ga-1">
                    <v-btn
                      icon="mdi-pencil"
                      size="x-small"
                      @click="editSoftSkill(i)"
                    ></v-btn>

                    <v-btn
                      icon="mdi-delete"
                      size="x-small"
                      color="error"
                      @click="removeSoftSkill(i)"
                    ></v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>


            <v-btn class="bg-gradient-primary" @click="dialogSoftSkill = true">
              Adicionar
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" class="border mt-4">
        <v-card>
          <v-card-title>
            <div class="d-flex align-center">
              <v-icon class="mr-2 text-gradient-primary">mdi-account-circle</v-icon>
              <h2 class="text-h6 font-weight-bold text-gradient-primary">Idiomas</h2>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list two-line class="mt-2" v-if="languageList.length > 0">
              <v-list-item
                v-for="(item, i) in languageList"
                :key="i"
                class="pa-1 border mb-1"
              >
                <!-- Conteúdo principal -->
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle v-if="item.level">{{ item.level }}</v-list-item-subtitle>
                </v-list-item-content>

                <!-- Botões de ação no canto superior direito -->
                <template #append>
                  <div class="d-flex align-center justify-end ga-1">
                    <v-btn
                      icon="mdi-delete"
                      size="x-small"
                      color="error"
                      @click="removeLanguage(i)"
                    ></v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <v-btn class="bg-gradient-primary" @click="dialogLanguage = true">
              Adicionar
            </v-btn>

          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" class="border mt-4">
        <v-card>
          <v-card-title>
            <div class="d-flex align-center">
              <v-icon class="mr-2 text-gradient-primary">mdi-account-circle</v-icon>
              <h2 class="text-h6 font-weight-bold text-gradient-primary">Escolaridade</h2>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list v-if="educationsList.length > 0" two-line class="mb-2">
              <v-list-item
                v-for="(item, i) in educationsList"
                :key="i"
                class="pa-1 border mb-1 rounded"
              >
                <!-- Conteúdo principal -->
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">{{ item.course }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.level }}</v-list-item-subtitle>
                </v-list-item-content>

                <!-- Botões de ação no canto superior direito -->
                <template #append>
                  <div class="d-flex align-center justify-end ga-1">
                    <v-btn
                      icon="mdi-pencil"
                      size="x-small"
                      @click="editEducation(i)"
                    ></v-btn>

                    <v-btn
                      icon="mdi-delete"
                      size="x-small"
                      color="error"
                      @click="removeEducation(i)"
                    ></v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <v-btn class="bg-gradient-primary" @click="dialogEducation = true">
              Adicionar
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>


      <v-dialog
        v-model="dialogExperience"
        max-width="400"
      >
        <v-card
            prepend-icon="mdi-account"
            title="Criar experiência profissional"
          >
            <v-card-text>
              <v-row dense>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="experience.companyName"
                    required
                    :counter="10"
                    label="Nome da empresa"
                    density="compact"
                    hide-details
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="experience.dateInitial"
                    label="Data inicial"
                    readonly
                    @click="openDate(`dateInitial`)"
                    density="compact"
                    hide-details
                    class="mb-1"
                    required
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="experience.dateEnd"
                    label="Data final"
                    readonly
                    @click="openDate(`dateEnd`)"
                    density="compact"
                    hide-details
                    class="mb-1"
                    required
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                >
                <v-select
                  v-model="experience.period"
                  :items="periods"
                  label="Périodo"
                  hide-details
                  density="compact"
                  class="mb-1"
                />
                </v-col>

                <v-col
                  cols="12"
                >
                  <v-textarea
                    label="Descrição"
                    :model-value="experience.description"
                    name="input-7-1"
                    variant="filled"
                    auto-grow
                    hide-details
                    density="compact"
                    class="mb-1"
                  ></v-textarea>
                </v-col>
              </v-row>

            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                text="Fechar"
                color="error"
                variant="flat"
                @click="clearExperience"
              ></v-btn>

              <v-btn
                color="success"
                :text="`${editingExperienceIndex !== null ? 'Salvar' : 'Adicionar'}`"
                variant="flat"
                @click="addExperience"
              ></v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialogSoftSkill"
        max-width="400"
      >
        <v-card
          prepend-icon="mdi-star-circle"
          :title="`${editingIndex !== null ? 'Editar' : 'Adicionar'} Soft Skill`"
        >
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="softSkill.name"
                  label="Nome da Soft Skill"
                  required
                  :counter="30"
                  density="compact"
                  hide-details
                  class="mb-1"
                />
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="softSkill.level"
                  :items="skillLevels"
                  label="Nível"
                  density="compact"
                  hide-details
                  class="mb-1"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="softSkill.notes"
                  label="Notas (opcional)"
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
              text="Fechar"
              color="error"
              variant="flat"
              @click="clearSoftSkill"
            />
            <v-btn
              :text="`${editingIndex !== null ? 'Salvar' : 'Adicionar'}`"
              color="success"
              variant="flat"
              @click="addSoftSkill"
            />
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialogLanguage"
        max-width="400"
      >
        <v-card
          prepend-icon="mdi-star-circle"
          :title="`Adicionar Idioma`"
        >
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-select
                  v-model="language.name"
                  :items="languages"
                  item-title="name"
                  required
                  label="Idiomas"
                  density="compact"
                  hide-details
                  class="mb-1"
                />
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="language.level"
                  :items="levels"
                  label="Nível"
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
              text="Fechar"
              color="error"
              variant="flat"
              @click="clearLanguage"
            />
            <v-btn
              text="Adicionar"
              color="success"
              variant="flat"
              @click="addLanguage"
            />
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialogEducation"
        max-width="400"
      >
        <v-card
          prepend-icon="mdi-star-circle"
          :title="`${editingEducationIndex !== null ? 'Editar' : 'Adicionar'} Escolaridade`"
        >
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="education.course"
                  label="Curso"
                  required
                  :counter="30"
                  density="compact"
                  hide-details
                  class="mb-1"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="education.institution"
                  label="Instituição"
                  required
                  :counter="30"
                  density="compact"
                  hide-details
                  class="mb-1"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="education.period"
                  label="Périodo"
                  required
                  :counter="30"
                  density="compact"
                  hide-details
                  class="mb-1"
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="education.level"
                  :items="educationLevels"
                  label="Nível"
                  density="compact"
                  hide-details
                  class="mb-1"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="education.notes"
                  label="Notas (opcional)"
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
              text="Fechar"
              color="error"
              variant="flat"
              @click="clearEducation"
            />
            <v-btn
              :text="`${editingEducationIndex !== null ? 'Salvar' : 'Adicionar'}`"
              color="success"
              variant="flat"
              @click="addEducation"
            />
          </v-card-actions>
        </v-card>
      </v-dialog>

  </v-row>
</template>

<style lang="scss" scoped>

</style>