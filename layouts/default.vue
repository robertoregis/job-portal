<!-- layouts/default.vue -->
<template>
  <v-app class="d-flex flex-column fill-height">

  <LayoutTop />

  <slot/>

  <LayoutFooter />

  </v-app>
</template>

<style>
.colors {
  color: #077979;
}
</style>