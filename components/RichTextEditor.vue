<script setup lang="ts">
import { ref, onMounted, defineEmits, defineProps } from 'vue'

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorContainer = ref<HTMLDivElement | null>(null)
const quillInstance = ref<any>(null)

const props = defineProps<{
  modelValue: string
}>()

onMounted(async () => {
  // Importa o Quill e o módulo de redimensionamento
  const Quill = (await import('quill')).default
  await import('quill/dist/quill.snow.css')

  // Importa o módulo
  const ImageResize = (await import('quill-image-resize-vue')).default

  // Registra o módulo
  Quill.register('modules/imageResize', ImageResize)

  if (editorContainer.value) {
    quillInstance.value = new Quill(editorContainer.value, {
      theme: 'snow',
      placeholder: 'Digite seu conteúdo...',
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean']
        ],
        imageResize: {
          // opções do módulo
          modules: ['Resize', 'DisplaySize', 'Toolbar']
        }
      }
    })

    // Define valor inicial
    quillInstance.value.root.innerHTML = props.modelValue || ''

    // Emite alterações
    quillInstance.value.on('text-change', () => {
      emit('update:modelValue', quillInstance.value!.root.innerHTML)
    })
  }
})
</script>

<template>
  <v-card>
    <div ref="editorContainer" style="min-height: 200px;"></div>
  </v-card>
</template>

<style scoped>
.ql-toolbar {
  border-radius: 8px 8px 0 0;
}
.ql-container {
  border-radius: 0 0 8px 8px;
  min-height: 200px;
}
</style>

