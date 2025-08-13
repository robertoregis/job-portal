<script setup lang="ts">
    import { useInfo } from '@/stores/info';
    import { useShow } from '@/stores/show';
    const { notify } = useNotification();
    const info: any = useInfo();
    const show = useShow();
    //// Escolaridade
    const dialogBenefits = ref(false)
    const benefitsList = ref<any>([])
    const benefit = ref<any>({
        title: null,
        subtitle: null,
        icon: null,
        description: null
    })
    const benefitId = ref<string>('')
    const editingBenefitIndex = ref<any>(null)
    const editBenefit = (index: any, id: any) => {
        const item = benefitsList.value[index]
        benefit.value = { ...item }
        benefitId.value = id
        editingBenefitIndex.value = index
        dialogBenefits.value = true
    }
    const clearBenefit = () => {
        benefit.value = {
            title: null,
            icon: null,
            description: null
        }
        dialogBenefits.value = false
        editingBenefitIndex.value = null
        benefitId.value = ''
    }

    const changeBenefit = () => {
        if (!benefit.value.title || !benefit.value.icon || !benefit.value.description) {
            notify({ title: 'Erro', text: 'Preencha todos os campos', type: 'error' })
            return
        }
        // Opção 1: verificar se não é null nem undefined
        if (editingBenefitIndex.value !== null && editingBenefitIndex.value !== undefined) {
            updateBenefit(benefitId.value)
        } else {
            createBenefit()
        }
    }

    const createBenefit = async () => {
        show.setOverlayDashboard(true)
        const { data, error } = await useFetch('/api/benefits', {
            method: 'POST',
            body: {
                title: benefit.value.title,
                icon: benefit.value.icon,
                description: benefit.value.description,
            }
        })
        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao criar o benefício', type: 'error' })
            return
        }

        notify({ title: 'Parabéns!', text: 'O benefício foi criada com sucesso', type: 'success' })
        getBenefits()
        clearBenefit()
        
    }

    const getBenefits = async () => {
        const { data, error } = await useFetch('/api/benefits', {
            method: 'GET',
            params: {
                candidate_id: info.user.id
            }
        })

        if (error.value) {
            console.error('Erro ao carregar o benefício:', error.value)
            return null
        }

        benefitsList.value = data.value
    }

    const updateBenefit = async (id: string) => {
        show.setOverlayDashboard(true)
        const { data, error } = await useFetch(`/api/benefits/${id}`, {
            method: 'PATCH',
            body: benefit.value
        })
        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao editar o benefício', type: 'error' })
            return
        }

        notify({ title: 'Parabéns!', text: 'O benefício foi editada com sucesso', type: 'success' })
        getBenefits()
        clearBenefit()
    }

    const removeBenefit = async (id: string) => {
        show.setOverlayDashboard(true)
        const { data, error } = await useFetch(`/api/benefits/${id}`, {
            method: 'DELETE'
        })
        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao remover o benefício', type: 'error' })
            return
        }

        notify({ title: 'Parabéns!', text: 'O benefício foi removido com sucesso', type: 'success' })
        getBenefits()
    }

    const { data: benefits, error, refresh, pending } = await useFetch('/api/benefits', {
        method: 'GET',
        params: {}
    })

    if (error.value) {
    } else {
        benefitsList.value = benefits.value
    }

    const dialogIcon = ref(false)
    const selectedIcon = ref<string | null>(null)

    // Lista de ícones para serviços e benefícios
    const icons = [
        'mdi-account-cog',
        'mdi-briefcase-check',
        'mdi-cash-multiple',
        'mdi-shield-check',
        'mdi-laptop',
        'mdi-heart-pulse',
        'mdi-truck-fast',
        'mdi-calendar-check',
        'mdi-car-multiple',
        'mdi-wallet',
        'mdi-food-apple',
        'mdi-school',
        'mdi-stethoscope',
        'mdi-headset',
        'mdi-airplane',
        'mdi-bus',
        'mdi-bike',
        'mdi-coffee',
        'mdi-gift',
        'mdi-cellphone',
        'mdi-hospital-box',
        'mdi-home-heart',
        'mdi-medicine',
        'mdi-wifi',
        'mdi-fire',
        'mdi-water',
        'mdi-basket',
        'mdi-baby-carriage',
        'mdi-briefcase-variant',
        'mdi-lifebuoy',
        'mdi-cctv',
        'mdi-security',
        'mdi-medal',
        'mdi-car-electric',
        'mdi-puzzle',
        'mdi-shoe-formal',
        'mdi-desktop-mac',
        'mdi-server',
        'mdi-cloud-upload',
        'mdi-cloud-download',
        'mdi-chip',
        'mdi-keyboard',
        'mdi-mouse-variant',
        'mdi-folder',
        'mdi-file-document',
        'mdi-file-pdf',
        'mdi-file-image',
        'mdi-file-video',
        'mdi-account-group',
        'mdi-account-multiple',
        'mdi-account-star',
        'mdi-calendar',
        'mdi-email',
        'mdi-lock',
        'mdi-phone',
        'mdi-bell',
        'mdi-credit-card',
        'mdi-clipboard-check',
        'mdi-truck',
        'mdi-forklift',
        'mdi-robot',
        'mdi-cash',
        'mdi-taxi',
        'mdi-car-sports',
        'mdi-seat-recline-extra',
        'mdi-briefcase',
        'mdi-lamp',
        'mdi-lightbulb-on-outline',
        'mdi-cloud-sync',
        'mdi-cash-plus',
        'mdi-cash-minus',
        'mdi-account-heart',
        'mdi-account-box-multiple',
        'mdi-bank',
        'mdi-basketball',
        'mdi-battery-charging',
        'mdi-battery-high',
        'mdi-beach',
        'mdi-bell-ring',
        'mdi-bike-fast',
        'mdi-bluetooth',
        'mdi-book-open-page-variant',
        'mdi-bowling',
        'mdi-brain',
        'mdi-bus-articulated-end',
        'mdi-camera-account',
        'mdi-camera-iris',
        'mdi-cash-refund',
        'mdi-chart-line',
        'mdi-check-circle-outline',
        'mdi-check-decagram',
        'mdi-clipboard-text',
        ]

    // Função para selecionar o ícone
    const selectIcon = (icon: string) => {
        selectedIcon.value = icon
        benefit.value.icon = icon
        dialogIcon.value = false // fecha o diálogo ao selecionar
    }

</script>

<template>

    <v-card>
        <v-card-title>
            <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-crown</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Benefícios</h2>
            </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-list v-if="benefitsList.length > 0" two-line class="mb-2">
            <v-list-item
                v-for="(item, i) in benefitsList"
                :key="i"
                class="pa-1 border mb-1 rounded"
            >
                <v-list-item-content class="d-flex align-center">
                    <v-icon class="mr-2">{{ item.icon }}</v-icon>
                    <v-list-item-title class="font-weight-bold">
                    {{ item.title }}
                    </v-list-item-title>
                </v-list-item-content>

                <template #append>
                    <div class="d-flex align-center justify-end ga-1">
                    <v-btn
                        icon="mdi-pencil"
                        size="x-small"
                        @click="editBenefit(i, item.id)"
                    ></v-btn>

                    <v-btn
                        icon="mdi-delete"
                        size="x-small"
                        color="error"
                        @click="removeBenefit(item.id)"
                    ></v-btn>
                    </div>
                </template>
                </v-list-item>

            </v-list>

            <v-btn class="bg-gradient-primary" @click="dialogBenefits = true">
            Adicionar
            </v-btn>
        </v-card-text>
    </v-card>

    <v-dialog
        v-model="dialogBenefits"
        max-width="400"
    >
        <v-card
            prepend-icon="mdi-crown"
            :title="`${editingBenefitIndex !== null ? 'Editar' : 'Adicionar'} Benefícios`"
        >
        <v-card-text>
            <v-row dense>
                <v-col cols="12">
                    <v-row no-gutters>
                        <v-col cols="2">
                            <v-icon size="30">{{ benefit.icon }}</v-icon>
                        </v-col>
                        <v-col cols="10">
                            <v-btn @click="dialogIcon = true" class="w-100">{{ benefit.icon ? 'Troque de ícone' : 'Escolha um ícone' }}</v-btn>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12 mt-1">
                    <v-text-field
                        v-model="benefit.title"
                        label="Título"
                        required
                        :counter="30"
                        density="compact"
                        hide-details
                        class="mb-1"
                    />
                </v-col>
                <v-col cols="12 mt-1">
                    <v-text-field
                        v-model="benefit.subtitle"
                        label="Subtítulo"
                        required
                        :counter="30"
                        density="compact"
                        hide-details
                        class="mb-1"
                    />
                </v-col>
                <v-col cols="12">
                    <v-textarea
                    v-model="benefit.description"
                    label="Descrição"
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
            @click="clearBenefit"
            />
            <v-btn
            :text="`${editingBenefitIndex !== null ? 'Salvar' : 'Adicionar'}`"
            color="success"
            variant="flat"
            @click="changeBenefit()"
            />
        </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog
        v-model="dialogIcon"
        transition="dialog-bottom-transition"
        fullscreen
    >
        <v-card>
        <v-card-title>Selecione um ícone</v-card-title>

        <v-card-text>
            <div class="d-flex flex-wrap gap-4" style="max-height: 70vh; overflow-y: auto; padding: 8px;">
            <v-btn
                v-for="icon in icons"
                :key="icon"
                icon
                :color="benefit.icon === icon ? 'primary' : undefined"
                @click="selectIcon(icon)"
                class="ma-1"
                style="width: 40px; height: 40px;"
            >
                <v-icon size="22">{{ icon }}</v-icon>
            </v-btn>
            </div>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogIcon = false">Cancelar</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style lang="scss" scoped>
</style>
