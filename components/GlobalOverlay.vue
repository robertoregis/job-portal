<template>
  <v-overlay
    :model-value="isShow"
    persistent
    class="d-flex justify-center align-center"
  >
    <v-progress-circular
      indeterminate
      color="white"
      size="90"
      width="15"
    />
  </v-overlay>
</template>

<script setup lang="ts">
  import { useShow } from '#imports';

  const show = useShow();
  const isShow = computed(() => {
    return show.overlayDashboard || show.overlaySite;
  })
</script>
