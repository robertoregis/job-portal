<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  video: string
}>()

const videoEl = ref<HTMLVideoElement | null>(null)

onMounted(() => {
  videoEl.value?.play().catch(err => console.warn('Autoplay bloqueado', err))
})

onBeforeUnmount(() => {
  if (videoEl.value) {
    videoEl.value.pause()
    videoEl.value.currentTime = 0
  }
})
</script>

<template>
  <div
    class="videoWrapper"
  >
    <!-- Vídeo de fundo -->
    <video
      ref="videoEl"
      autoplay
      loop
      muted
      playsinline
      :src="video"
      class="absolute object-cover"
    ></video>
</div>
</template>

<style scoped>
video {
  object-fit: cover; /* mantém proporção e cobre o v-sheet */
}
</style>


