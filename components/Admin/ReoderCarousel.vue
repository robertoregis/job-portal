<template>
  <v-dialog 
    v-model="internalDialog" 
    max-width="600" 
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-sort</v-icon>
        Gerenciar Ordem do Carrossel
      </v-card-title>
      
      <v-card-text class="pa-4">
        <p class="text-subtitle-1 mb-4">
          Arraste e solte os itens para definir a nova ordem:
        </p>
        <ClientOnly>
          <draggable
            v-model="reorderableList"
            class="v-list py-0" 
            handle=".drag-handle"
            @end="onDragEnd"
          >
            <div
              v-for="(carouselItem, index) in reorderableList"
              :key="carouselItem.id"
              class="w-100" 
            >
              <v-list-item 
                class="elevation-1 my-2 rounded bg-surface"
                lines="two"
              >
                <template #prepend>
                  <v-icon class="drag-handle cursor-grab mr-2" color="primary">
                    mdi-drag-vertical
                  </v-icon>
                </template>

                <v-list-item-title>
                  {{ carouselItem.title || 'Item Sem Título' }}
                </v-list-item-title>
                
                <v-list-item-subtitle>
                  Tipo: {{ carouselItem.type }}
                </v-list-item-subtitle>

                <template #append>
                  <v-chip size="small" variant="flat" color="primary" class="font-weight-bold">
                    #{{ index + 1 }}
                  </v-chip>
                </template>
              </v-list-item>
            </div>
          </draggable>
        </ClientOnly>

      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <div class="d-flex">
          <v-btn text="Fechar" color="error" variant="flat" class="mr-3" @click="internalDialog = false" />
          <v-btn text="Salvar" color="success" variant="flat" :disabled="!hasUnsavedChanges" @click="save()" />
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { VueDraggableNext as draggable } from 'vue-draggable-next';
  import { ref, watch } from 'vue';

  const props = defineProps({
    modelValue: Boolean,
    items: {
      type: Array,
      required: true,
    },
  });

  // O evento 'order-changed' será disparado apenas quando o botão Salvar for clicado.
  const emit = defineEmits(['update:modelValue', 'order-changed']);

  const internalDialog = ref(props.modelValue);
  watch(() => props.modelValue, (val) => internalDialog.value = val);
  watch(internalDialog, (val) => emit('update:modelValue', val));

  const reorderableList = ref([]);
  // Novo estado para o payload que será enviado
  let payloadToSend = null; 
  // Novo estado para controlar o botão Salvar
  const hasUnsavedChanges = ref(false); 


  // Observa mudanças na prop items e atualiza a lista local
  watch(() => props.items, (newItems) => {
      if (newItems) {
        reorderableList.value = JSON.parse(JSON.stringify(newItems));
        // Resetar o estado ao carregar novos itens
        hasUnsavedChanges.value = false; 
      }
  }, { deep: true, immediate: true });


  // 1. Função chamada ao terminar o arrasto
  const onDragEnd = () => {
      // 1. O array 'reorderableList' já está na nova ordem localmente.
      
      // 2. Mapeamos para criar o array de atualização
      payloadToSend = reorderableList.value.map((item, index) => ({
        id: item.id,
        order_index: index + 1, // Define o novo índice
      }));
      
      // 3. Sinaliza que houve uma mudança e que o botão Salvar deve ser ativado
      hasUnsavedChanges.value = true;
  };

  // 2. Função chamada pelo botão Salvar
  const save = () => {
      if (!payloadToSend || !hasUnsavedChanges.value) {
        // Evita emitir se não houve mudanças
        return;
      }
      
      // Emite o evento para o componente pai salvar no banco de dados
      emit('order-changed', payloadToSend);
      
      // Reseta o estado após emitir a ordem para ser salva
      hasUnsavedChanges.value = false;
      
      // Opcional: Você pode fechar o dialog automaticamente aqui, ou esperar pelo retorno do sucesso no componente pai.
      // internalDialog.value = false; 
  }
</script>

<style scoped>
.cursor-grab {
  cursor: grab;
}
.cursor-grab:active {
  cursor: grabbing;
}
/* Estilo para o item enquanto está sendo arrastado (ghost) */
.sortable-ghost {
  opacity: 0.5;
  background: #f5f5f5;
}
</style>