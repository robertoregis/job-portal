<script setup lang="ts">
    import { useInfo } from '@/stores/info';
    import { useShow } from '@/stores/show';
    const { notify } = useNotification();
    const info: any = useInfo();
    const show = useShow();
    //// Soft Skill
    const dialogSoftSkill = ref(false)
    const softsList = ref<any>([])
    const softSkill = ref({
        name: '',
        level: null,
        notes: '',
    })
    const softSkillId = ref<string>('')
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
        editingSoftSkillIndex.value = null
        softSkillId.value = ''
    }
    const editingSoftSkillIndex = ref<any>(null)
    const editSoftSkill = (index: any, id: string) => {
        const item = softsList.value[index]
        softSkill.value = { ...item }
        softSkillId.value = id
        editingSoftSkillIndex.value = index
        dialogSoftSkill.value = true
    }
    ////

    const changeSoftSkill = () => {
        if (!softSkill.value.name) {
            notify({ title: 'Erro', text: 'Selecione o nome da soft skill', type: 'error' })
            return
        }
        // Opção 1: verificar se não é null nem undefined
        if (editingSoftSkillIndex.value !== null && editingSoftSkillIndex.value !== undefined) {
            updateSoftSkill(softSkillId.value)
        } else {
            createSoftSkill()
        }
    }

    const createSoftSkill = async () => {
        show.setOverlayDashboard(true)
        const { data, error } = await useFetch('/api/soft_skills', {
            method: 'POST',
            body: {
                level: softSkill.value.level,
                name: softSkill.value.name,
                notes: softSkill.value.notes,
                candidate_id: info.user.id
            }
        })

        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao criar a soft skill', type: 'error' })
            return
        }

        notify({ title: 'Parabéns!', text: 'A soft skill foi criada com sucesso', type: 'success' })
        getSoftSkills()
        clearSoftSkill()
        
    }

    const getSoftSkills = async () => {
        const { data, error } = await useFetch('/api/soft_skills', {
            method: 'GET',
            params: {
                candidate_id: info.user.id
            }
        })

        if (error.value) {
            console.error('Erro ao carregar softSkills:', error.value)
            return null
        }

        softsList.value = data.value
    }

    const updateSoftSkill = async (id: string) => {
        show.setOverlayDashboard(true)
        const { data, error } = await useFetch(`/api/soft_skills/${id}`, {
            method: 'PATCH',
            body: softSkill.value
        })

        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao editar a soft skill', type: 'error' })
            return
        }

        notify({ title: 'Parabéns!', text: 'A soft skill foi editada com sucesso', type: 'success' })
        getSoftSkills()
        clearSoftSkill()
    }

    const removeSoftSkill = async (id: string) => {
        show.setOverlayDashboard(true)
        const { data, error } = await useFetch(`/api/soft_skills/${id}`, {
            method: 'DELETE'
        })

        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao remover a soft skill', type: 'error' })
            return
        }

        notify({ title: 'Parabéns!', text: 'A soft skill foi removida com sucesso', type: 'success' })
        getSoftSkills()
    }

    const { data: softSkills, error, refresh, pending } = await useFetch('/api/soft_skills', {
        method: 'GET',
        params: {
            candidate_id: info.user.id
        }
    })

    if (error.value) {
    } else {
        softsList.value = softSkills.value
    }
</script>

<template>
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
                    @click="editSoftSkill(i, item.id)"
                    ></v-btn>

                    <v-btn
                    icon="mdi-delete"
                    size="x-small"
                    color="error"
                    @click="removeSoftSkill(item.id)"
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
    <v-dialog
            v-model="dialogSoftSkill"
            max-width="400"
        >
            <v-card
            prepend-icon="mdi-star-circle"
            :title="`${editingSoftSkillIndex !== null ? 'Editar' : 'Adicionar'} Soft Skill`"
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
                :text="`${editingSoftSkillIndex !== null ? 'Salvar' : 'Adicionar'}`"
                color="success"
                variant="flat"
                @click="changeSoftSkill"
                />
            </v-card-actions>
            </v-card>
        </v-dialog>
</template>

<style lang="scss" scoped>
</style>
