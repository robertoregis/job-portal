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
  <a
    href="https://wa.me/554891621132?text=Ol%C3%A1%2C%20quero%20mais%20informa%C3%A7%C3%B5es"
    target="_blank"
    rel="noopener noreferrer"
  >
    <v-btn
      class="whatsapp-btn"
      icon="mdi-whatsapp"
      size="large"
      density="comfortable"
    ></v-btn>
  </a>
</template>

<style lang="scss" scoped>
.whatsapp-btn {
  position: fixed;
  bottom: 20px; /* distância do rodapé */
  right: 20px;  /* distância da lateral */
  background-color: #25D366 !important; /* cor oficial do WhatsApp */
  color: white !important; /* cor do ícone */
  border-radius: 50% !important; /* garante formato circular */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* sombra flutuante */
  z-index: 9999; /* garante que fique por cima */
}
</style>
