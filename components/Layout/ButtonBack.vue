<script lang="ts">

  export default {
    setup() {
      const router = useRouter();
      const navigation = () => {
        router.back()
      }

      return {
        navigation
      }
    }
  }
</script>

<template>
  <v-col cols="12 mt-2">
  <div class="d-flex">
    <v-btn
      @click="navigation"
      text="Voltar"
      variant="flat"
      size="small"
      class="bg-gradient-nav"
    ></v-btn>
  </div>
  </v-col>
</template>

<style lang="scss" scoped>
</style>
