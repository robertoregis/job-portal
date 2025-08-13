<script setup lang="ts">
    import { useInfo } from '@/stores/info';
    import { useShow } from '@/stores/show';
    import { useNotice } from '@/composables/useNotice';
    const { createLog } = useNotice();
    const { notify } = useNotification();
    const info: any = useInfo();
    const show = useShow();
    //// Idiomas
    const languagesArray = [
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
    const clearLanguage = () => {
        language.value = {
        language: null,
        level: null
        }
        dialogLanguage.value = false
    }

    const changeLanguage = () => {
        if (!language.value.name || !language.value.level) {
            notify({ title: 'Erro', text: 'Selecione idioma e nível', type: 'error' })
            return
        }

        const exists = languageList.value.some(
            (l: any) => l.name === language.value.name && l.level === language.value.level
        )

        if (exists) {
            notify({ title: 'Erro', text: 'Idioma com esse nível já adicionado', type: 'error' })
            return
        }

        createLanguage()
        }


    const createLanguage = async () => {
        show.setOverlayDashboard(true)
        const { data, error } = await useFetch('/api/languages', {
            method: 'POST',
            body: {
                level: language.value.level,
                name: language.value.name,
                candidate_id: info.user.id
            }
        })

        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao criar o idioma', type: 'error' })
            return
        }
        createLog({
            title: `Criou o idioma`,
            profile_id: info.profile.id,
            type: 'create_language'
        })
        notify({ title: 'Parabéns!', text: 'O idioma foi criada com sucesso', type: 'success' })
        getLanguages()
        clearLanguage()
        
    }

    const getLanguages = async () => {
        const { data, error } = await useFetch('/api/languages', {
            method: 'GET',
            params: {
                candidate_id: info.user.id
            }
        })

        if (error.value) {
            console.error('Erro ao carregar languages:', error.value)
            return null
        }

        languageList.value = data.value
    }

    const removeLanguage = async (id: string) => {
        show.setOverlayDashboard(true)
        const { data, error } = await useFetch(`/api/languages/${id}`, {
            method: 'DELETE'
        })

        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao remover o idioma', type: 'error' })
            return
        }
        createLog({
            title: `Removeu o idioma`,
            profile_id: info.profile.id,
            type: 'delete_language'
        })
        notify({ title: 'Parabéns!', text: 'O idioma foi removida com sucesso', type: 'success' })
        getLanguages()
    }

    const { data: languages, error, refresh, pending } = await useFetch('/api/languages', {
        method: 'GET',
        params: {
            candidate_id: info.user.id
        }
    })

    if (error.value) {
    } else {
        languageList.value = languages.value
    }
</script>

<template>
    <v-card>
        <v-card-title>
            <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-translate</v-icon>
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
                    @click="removeLanguage(item.id)"
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

    <v-dialog
        v-model="dialogLanguage"
        max-width="400"
    >
        <v-card
        prepend-icon="mdi-translate"
        :title="`Adicionar Idioma`"
        >
        <v-card-text>
            <v-row dense>
            <v-col cols="12">
                <v-select
                v-model="language.name"
                :items="languagesArray"
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
            @click="changeLanguage"
            />
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style lang="scss" scoped>
</style>
