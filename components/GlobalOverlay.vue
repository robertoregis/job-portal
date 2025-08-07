<template>
  <v-overlay
    :model-value="state.loading.show"
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
import { feedbackState as state } from '@/composables/useFeedback'
</script>
