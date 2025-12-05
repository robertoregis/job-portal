<script setup lang="ts">
    import { useInfo } from '@/stores/info';
    import { useShow } from '@/stores/show';
    import { useNotice } from '@/composables/useNotice';
    const { notify } = useNotification();
    const info: any = useInfo();
    const show = useShow();
    const { createLog } = useNotice();
    //// Escolaridade
    const dialogCarousels = ref<boolean>(false)
    const dialogImages = ref<boolean>(false)
    const carouselsList = ref<any[]>([])
    const types = ['Imagem', 'Vídeo']
    const carousel = ref<any>({
        title: null,
        type: 'Imagem',
        link: null,
        video: null,
        is_external: false
    })
    const typeComputed = computed(() => {
        return carousel.value.type === 'Imagem' ? 'image' : 'video';
    })
    const isDialogOpen = ref(false);
    /*const typeSelected = ref<any>('Imagem')*/
    const carouselId = ref<string>('')
    const editingCarouselIndex = ref<any>(null)
    const editCarousel = (index: any, id: any) => {
        const item = carouselsList.value[index]
        carousel.value = { ...item }
        carouselId.value = id
        editingCarouselIndex.value = index
        dialogCarousels.value = true
    }

    const changeImages = (index: any, id: any) => {
        const item = carouselsList.value[index]
        carousel.value = { ...item }
        carouselId.value = id
        editingCarouselIndex.value = index
        dialogImages.value = true
    }
    
    const clearCarousel = () => {
        carousel.value = {
            title: null,
            type: 'Imagem',
            link: null,
            video: null,
            is_external: false
        }
        dialogCarousels.value = false
        editingCarouselIndex.value = null
        carouselId.value = ''
    }

    const changeCarousel = () => {
        if (!carousel.value.title || !carousel.value.type) {
            notify({ title: 'Erro', text: 'Preencha todos os campos', type: 'error' })
            return
        }
        // Opção 1: verificar se não é null nem undefined
        if (editingCarouselIndex.value !== null && editingCarouselIndex.value !== undefined) {
            updateCarousel(carouselId.value)
        } else {
            createCarousel()
        }
    }

    const openCreate = () => {
        clearCarousel()
        dialogCarousels.value = true
    }

    const createCarousel = async () => {
        show.setOverlayDashboard(true)
        if(typeComputed.value === 'image') {
            carousel.value.video = null
        } else if(typeComputed.value === 'video') {
            carousel.value.image = null
        }
        const newBody = {
            ...carousel.value,
            type: typeComputed.value
        }
        const { data, error } = await useFetch('/api/carousels_items', {
            method: 'POST',
            body: newBody
        })
        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao criar o carrossel', type: 'error' })
            return
        }
        createLog({
            title: `Criou o carrossel`,
            profile_id: info.profile.id,
            type: 'create_carousels'
        })
        notify({ title: 'Parabéns!', text: 'O carrossel foi criada com sucesso', type: 'success' })
        getCarousels()
        clearCarousel()
        
    }

    const getCarousels = async () => {
        const { data, error } = await useFetch('/api/carousels_items', {
            method: 'GET',
            params: {
                isNot: false
            }
        })
        if (error.value) {
            console.error('Erro ao carregar o carrossel:', error.value)
            return null
        }
        /*carouselsList.value = {
            ...data.value,
            type: data.value.type === 'image' ? 'Imagem' : 'Vídeo'
        }*/
        carouselsList.value = data.value.map((carousel: any) => {
            return {
                ...carousel,
                type: carousel.type === 'image' ? 'Imagem' : 'Vídeo'
            }
        })

    }

    const updateCarousel = async (id: string) => {
        show.setOverlayDashboard(true)
        if(typeComputed.value === 'image') {
            carousel.value.video = null
        } else if(typeComputed.value === 'video') {
            carousel.value.image = null
        }
        const newBody = {
            ...carousel.value,
            type: typeComputed.value
        }
        const { data, error } = await useFetch(`/api/carousels_items/${id}`, {
            method: 'PATCH',
            body: newBody
        })
        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao editar o carrossel', type: 'error' })
            return
        }
        createLog({
            title: `Atualizou o carrossel`,
            profile_id: info.profile.id,
            type: 'update_carousels'
        })
        notify({ title: 'Parabéns!', text: 'O carrossel foi editada com sucesso', type: 'success' })
        getCarousels()
        clearCarousel()
    }

    const removeCarousel = async (id: string) => {
        show.setOverlayDashboard(true)
        const { data, error } = await useFetch(`/api/carousels_items/${id}`, {
            method: 'DELETE'
        })
        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao remover o carrossel', type: 'error' })
            return
        }
        createLog({
            title: `Removeu o carrossel`,
            profile_id: info.profile.id,
            type: 'delete_carousels'
        })
        notify({ title: 'Parabéns!', text: 'O carrossel foi removido com sucesso', type: 'success' })
        getCarousels()
        clearCarousel()
    }

    const removeImage = async (id: string, type: string, imageId: string) => {
        show.setOverlayDashboard(true)
        const { data, error } = await useFetch(`/api/carousels_items/${id}/update_image`, {
            method: 'DELETE',
            body: {
                type: type,
                image_id: imageId
            }
        })
        show.setOverlayDashboard(false)
        if (error.value) {
            notify({ title: 'Erro', text: 'Erro ao remover a imagem do carrossel', type: 'error' })
            return
        }
        createLog({
            title: `Removeu a imagem do carrossel: ${carousel.value.title}`,
            profile_id: info.profile.id,
            type: 'delete_image_of_carousels'
        })
        notify({ title: 'Parabéns!', text: 'A imagem do carrossel foi removida com sucesso', type: 'success' })
        getCarousels()
        clearCarousel()
        dialogImages.value = false

    }

    const { data: carousels, error, refresh, pending } = await useFetch('/api/carousels_items', {
        method: 'GET',
        params: {
            isNot: false
        }
    })

    if (error.value) {
    } else {
        carouselsList.value = carousels.value.map((carousel: any) => {
            return {
                ...carousel,
                type: carousel.type === 'image' ? 'Imagem' : 'Vídeo'
            }
        })
    }

    const fileSM = ref<File | null>(null)
    const fileLG = ref<File | null>(null)
    /*const fileInput: any = ref(null)
    const triggerFileInput = () => {
        fileInput.value?.click()
    }*/

    const uploadImage = async (id: string, type: string) => {
        show.setOverlayDashboard(true)
        if (!fileSM.value && !fileLG.value) {
            notify({ title: 'Erro', text: 'Selecione uma imagem', type: 'error' })
            show.setOverlayDashboard(false)
            return
        }
        const file: any = fileSM.value ? fileSM.value : fileLG.value
        const formDataTy = new FormData()
        formDataTy.append('file', file)
        formDataTy.append('type', type)
        const url = `/api/carousels_items/${id}/update_image`

        const { data: imageData, error: imageError }: any = await useFetch(url, {
            method: 'PATCH',
            body: formDataTy
        })

        if (imageError.value) {
            notify({ title: 'Erro', text: 'Erro ao enviar imagem', type: 'error' })
        } else {
            const candidate = info.user
            setTimeout(() => {
                createLog({
                    title: `Adicionou uma imagem no carrossel: ${carousel.value.title}`,
                    profile_id: info.profile.id,
                    type: 'create_images_in_carousel'
                })
                notify({ title: 'Parabéns!', text: 'A imagem foi enviada', type: 'success' })
            }, 1500)
        }
        const oldIndex = editingCarouselIndex.value
        setTimeout(() => {
            dialogImages.value = false
            fileSM.value = null
            fileLG.value = null
            getCarousels()
            clearCarousel()
        }, 500)
        setTimeout(() => {
            show.setOverlayDashboard(false)
            changeImages(oldIndex, id)
        }, 1000)
    }

    const handleOrderChange = async (updatedOrderArray: any) => {
        show.setOverlayDashboard(true)
        try {
            // 1. Chame a API (o endpoint que criamos na resposta anterior)
            const { error } = await useFetch('/api/carousels_items/reoder', {
                method: 'PUT',
                body: updatedOrderArray,
            });

            if (error.value) {
                console.log(error.value.message);
                show.setOverlayDashboard(false)
                notify({ title: 'Deu erro!', text: 'Erro ao atualizar a ordem dos itens', type: 'error' })
            }
            
            isDialogOpen.value = false;
            notify({ title: 'Parabéns!', text: 'A ordem dos itens foi atualizada', type: 'success' })
            getCarousels()
            setTimeout(() => {
                show.setOverlayDashboard(false)
            }, 500)
        } catch (e) {
            // Tratar erro
            console.log(e)
        }
    };

</script>

<template>

    <v-card>
        <v-card-title>
            <div class="d-flex align-center">
            <v-icon class="mr-2 text-gradient-primary">mdi-view-carousel</v-icon>
            <h2 class="text-h6 font-weight-bold text-gradient-primary">Carrossel</h2>
            </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <p class="text-caption font-weight-bold" :class="`${carouselsList.length > 0 ? '' : 'mb-2'}`">Obs: Cada bloco do carrossel precisa ter as duas imagens para exibir no site</p>
            <v-list v-if="carouselsList.length > 0" two-line class="mb-2">
                <v-list-item
                    v-for="(item, i) in carouselsList"
                    :key="i"
                    class="pa-2 border mb-1 rounded"
                >
                    <v-list-item-content class="d-flex align-center">
                        <v-list-item-title class="font-weight-bold">
                        {{ item.title }}
                        </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-content class="d-flex align-center mt-1">
                        <template v-if="item.type === 'Imagem'">
                            <v-btn @click="changeImages(i, item.id)" prepend-icon="mdi-image-plus" :color="`${!item.image_lg_url && !item.image_sm_url ? 'edit' : (item.image_lg_url && item.image_sm_url ? 'primary' : 'off')}`" size="small" class="mr-1">{{ !item.image_lg_url && !item.image_sm_url ? 'Adicionar' : 'Gerenciar' }} imagens</v-btn>
                            <span class="font-weight-bold">: {{ !item.image_lg_url && !item.image_sm_url ? 0 : (item.image_lg_url && item.image_sm_url ? 2 : 1) }}</span>
                        </template>
                        <template v-if="item.type === 'Vídeo'">
                            <span class="font-weight-semibold text-red text-caption">Componente de video</span>
                        </template>
                    </v-list-item-content>

                    <template #append>
                        <div class="d-flex align-center justify-end ga-1">
                        <v-btn
                            icon="mdi-pencil"
                            size="x-small"
                            @click="editCarousel(i, item.id)"
                        ></v-btn>

                        <v-btn
                            icon="mdi-delete"
                            size="x-small"
                            color="error"
                            @click="removeCarousel(item.id)"
                        ></v-btn>
                        </div>
                    </template>
                </v-list-item>
            </v-list>

            <v-btn class="bg-gradient-primary mr-3" @click="openCreate()">
                Adicionar
            </v-btn>
            <v-btn :disabled="carouselsList.length < 1" color="edit" @click="isDialogOpen = true">
                Reordenar
            </v-btn>
        </v-card-text>
    </v-card>

    <v-dialog
        v-model="dialogCarousels"
        max-width="480"
    >
        <v-card
            prepend-icon="mdi-view-carousel"
            :title="`${editingCarouselIndex !== null ? 'Editar' : 'Adicionar'} imagem ao carrossel`"
        >
        <v-card-text>
            <v-row dense>
                <v-col cols="12">
                    <v-text-field
                        v-model="carousel.title"
                        label="Título"
                        required
                        :counter="30"
                        density="compact"
                        hide-details
                        class="mb-1"
                    />
                </v-col>
                <v-col cols="12">
                    <v-select
                        v-model="carousel.type"
                        :items="types"
                        label="Tipo"
                        density="compact"
                        hide-details
                        class="mb-2"
                    />
                </v-col>
                <v-col v-if="typeComputed === 'image'" cols="12 mt-1">
                    <v-text-field
                        v-model="carousel.link"
                        label="Link"
                        required
                        :counter="30"
                        density="compact"
                        hide-details
                        class="mb-1"
                    />
                </v-col>
                <v-col v-if="typeComputed === 'video'" cols="12 mt-1">
                    <v-text-field
                        v-model="carousel.video"
                        label="Vídeo"
                        required
                        :counter="30"
                        density="compact"
                        hide-details
                        class="mb-1"
                    />
                </v-col>
                <v-col cols="12 mt-1">
                    <v-checkbox
                        v-model="carousel.is_external"
                        label="Abrir em um link externo"
                        hide-details
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
            @click="clearCarousel"
            />
            <v-btn
            :text="`${editingCarouselIndex !== null ? 'Salvar' : 'Adicionar'}`"
            color="success"
            variant="flat"
            @click="changeCarousel()"
            />
        </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog
    v-model="dialogImages"
    transition="dialog-bottom-transition"
    fullscreen
>
    <v-card>
        <v-toolbar color="primary">
            <v-card-title>Gerenciar Imagens do Carrossel</v-card-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialogImages = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
            <v-row justify="center" class="w-100">
                <v-col cols="12" sm="10" md="8" lg="10">
                    <v-row dense>
                        <v-col cols="12">
                            <h2 class="text-center">{{carousel.title}}</h2>
                        </v-col>
                        <v-col cols="12" md="7">
                            <v-card class="h-100 pa-2 pa-md-4" variant="outlined">
                                <v-card-title class="text-subtitle-1 pb-2">
                                    <v-icon color="primary" class="mr-2">mdi-monitor</v-icon>
                                    Desktop (40% / 3600x1440)
                                </v-card-title>
                                <v-divider class="mb-3"></v-divider>
                                
                                <div class="image-preview-wrapper image-preview-lg">
                                    <img v-if="carousel.image_lg_url" :src="carousel.image_lg_url" alt="Imagem Desktop" class="fill-image">
                                </div>

                                <v-card-actions class="pt-4">
                                    <div class="d-flex flex-column">
                                        <v-file-input 
                                            label="Upload LG" 
                                            hide-details 
                                            density="compact" 
                                            prepend-icon="mdi-camera"
                                            variant="filled"
                                            style="max-width: 250px; min-width: 140px;"
                                            :disabled="!!carousel.image_lg_url"
                                            v-model="fileLG"
                                            @change="uploadImage(carousel.id, 'lg')"
                                        ></v-file-input>
                                        <span v-if="carousel.image_lg_url" class="text-caption">Para atualizar, remova a imagem antes</span>
                                    </div>
                                    <v-btn v-if="carousel.image_lg_url" @click="removeImage(carousel.id, 'lg', carousel.image_lg_id)" color="error" class="ml-auto" size="small" icon>
                                        <v-icon>mdi-delete</v-icon>
                                        <v-tooltip activator="parent" location="top">Remover Imagem</v-tooltip>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                        
                        <v-col cols="12" md="5">
                            <v-card class="h-100 pa-2 pa-md-4" variant="outlined">
                                <v-card-title class="text-subtitle-1 pb-2">
                                    <v-icon color="primary" class="mr-2">mdi-cellphone</v-icon>
                                    Mobile (75% / 1200x900)
                                </v-card-title>
                                <v-divider class="mb-3"></v-divider>

                                <div class="image-preview-wrapper image-preview-sm">
                                    <img v-if="carousel.image_sm_url" :src="carousel.image_sm_url" alt="Imagem Mobile" class="fill-image">
                                </div>
                                
                                <v-card-actions class="pt-4">
                                    <div class="d-flex flex-column">
                                        <v-file-input 
                                            label="Upload SM" 
                                            hide-details 
                                            density="compact" 
                                            prepend-icon="mdi-camera"
                                            variant="filled"
                                            style="max-width: 250px; min-width: 140px;"
                                            :disabled="!!carousel.image_sm_url"
                                            v-model="fileSM"
                                            @change="uploadImage(carousel.id, 'sm')"
                                        ></v-file-input>
                                        <span v-if="carousel.image_sm_url" class="text-caption">Para atualizar, remova a imagem antes</span>
                                    </div>
                                    <v-btn v-if="carousel.image_sm_url" @click="removeImage(carousel.id, 'sm', carousel.image_sm_id)" color="error" class="ml-auto" size="small" icon>
                                        <v-icon>mdi-delete</v-icon>
                                        <v-tooltip activator="parent" location="top">Remover Imagem</v-tooltip>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</v-dialog>
<AdminReoderCarousel
    v-model="isDialogOpen"
    :items="carouselsList"
    @order-changed="handleOrderChange"
/>
</template>

<style scoped>
/* Contêiner principal para as pré-visualizações */
.image-preview-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    margin-bottom: 16px;
    border: 1px dashed #ccc;
    background-color: #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

/* 🚨 Proporção 40% (Desktop - LG) */
.image-preview-lg {
    padding-bottom: 40%; /* Altura é 40% da Largura */
}

/* 🚨 Proporção 75% (Mobile - SM) */
.image-preview-sm {
    padding-bottom: 75%; /* Altura é 75% da Largura (4:3) */
}

/* Imagem de preenchimento */
.fill-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* Simula o corte real */
}

.placeholder-text {
    position: absolute;
    color: #999;
    text-align: center;
    padding: 10px;
}
</style>
