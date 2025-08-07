<template>
  <v-snackbar
    v-model="state.snackbar.show"
    :color="state.snackbar.color"
    :timeout="state.snackbar.timeout"
    location="bottom"
    elevation="3"
  >
    {{ state.snackbar.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
    import { feedbackState as state } from '@/composables/useFeedback'
</script>
