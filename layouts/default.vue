<!-- layouts/default.vue -->
<script setup lang="ts">
  import { useShow } from '@/stores/show';
  const show = useShow();

  let wasLargeScreen = window.innerWidth >= 960

  const evaluateWidth = () => {
    const isLargeScreen = window.innerWidth >= 960

    if(isLargeScreen) {
      show.setMenu(false)
    }
  }

  onMounted(() => {
    nextTick(() => {
      evaluateWidth()
    })
    window.addEventListener('resize', evaluateWidth)
  })
</script>
<template>
  <v-app class="d-flex flex-column fill-height">

  <LayoutTop />
  <LayoutMenu />

  <slot/>

  <LayoutFooter />
    <GlobalSnackbar />
    <GlobalOverlay />
  </v-app>
</template>

<style>
.colors {
  color: #077979;
}
</style>