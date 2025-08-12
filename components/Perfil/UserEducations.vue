<script setup lang="ts">
    import { useInfo } from '@/stores/info';
    import { useShow } from '@/stores/show';
    const { notify } = useNotification();
    const info: any = useInfo();
    const show = useShow();
    //// Escolaridade
    const dialogEducation = ref(false)
    const educationsList = ref<any>([])
    const education = ref({
        level: null,
        course: null,
        institution: null,
        period: null,
        notes: null
    })
    const educationId = ref<string>('')
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
    const editEducation = (index: any, id: any) => {
        const item = educationsList.value[index]
        education.value = { ...item }
        educationId.value = id
        editingEducationIndex.value = index
        dialogEducation.value = true
    }
    const clearEducation = () => {
        education.value = {
            level: null,
            course: null,
            institution: null,
            period: null,
            notes: null
        }
        dialogEducation.value = false
        editingEducationIndex.value = null
        educationId.value = ''
    }

    const changeEducation = () => {
        if (!education.value.level || !education.value.course || !education.value.period || !education.value.institution) {
            notify({ title: 'Erro', text: 'Apenas o campo notas é opcional', type: 'error' })
            return
        }
        // Opção 1: verificar se não é null nem undefined
        if (editingEducationIndex.value !== null && editingEducationIndex.value !== undefined) {
            updateEducation(educationId.value)
        } else {
            createEducation()
        }
    }

    const createEducation = async () => {
        show.setOverlayDashboard(true)
        const { data, error } = await useFetch('/api/educations', {
            method: 'POST',
            body: {
                level: education.value.level,
                course: education.value.course,
                institution: education.value.institution,
                period: education.value.period,
                notes: education.value.notes,
                candidate_id: info.user.id
            }
        })
        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao criar a escolaridade', type: 'error' })
            return
        }

        notify({ title: 'Parabéns!', text: 'A escolaridade foi criada com sucesso', type: 'success' })
        getEducations()
        clearEducation()
        
    }

    const getEducations = async () => {
        const { data, error } = await useFetch('/api/educations', {
            method: 'GET',
            params: {
                candidate_id: info.user.id
            }
        })

        if (error.value) {
            console.error('Erro ao carregar educations:', error.value)
            return null
        }

        educationsList.value = data.value
    }

    const updateEducation = async (id: string) => {
        const { data, error } = await useFetch(`/api/educations/${id}`, {
            method: 'PATCH',
            body: education.value
        })
        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao editar a escolaridade', type: 'error' })
            return
        }

        notify({ title: 'Parabéns!', text: 'A escolaridade foi editada com sucesso', type: 'success' })
        getEducations()
        clearEducation()
    }

    const removeEducation = async (id: string) => {
        const { data, error } = await useFetch(`/api/educations/${id}`, {
            method: 'DELETE'
        })
        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao remover a escolaridade', type: 'error' })
            return
        }

        notify({ title: 'Parabéns!', text: 'A escolaridade foi removida com sucesso', type: 'success' })
        getEducations()
    }

    const { data: educations, error, refresh, pending } = await useFetch('/api/educations', {
        method: 'GET',
        params: {
            candidate_id: info.user.id
        }
    })

    if (error.value) {
    } else {
        educationsList.value = educations.value
    }

</script>

<template>

    <v-card>
        <v-card-title>
            <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-school</v-icon>
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
                    @click="editEducation(i, item.id)"
                    ></v-btn>

                    <v-btn
                    icon="mdi-delete"
                    size="x-small"
                    color="error"
                    @click="removeEducation(item.id)"
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

    <v-dialog
        v-model="dialogEducation"
        max-width="400"
    >
        <v-card
            prepend-icon="mdi-school"
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
            @click="changeEducation()"
            />
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style lang="scss" scoped>
</style>
