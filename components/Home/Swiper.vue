<template>
  <ClientOnly>
    <Swiper
      :modules="modules"
      :slides-per-view="slidesPerView"
      :space-between="spaceBetween"
      :pagination="{ clickable: true }"
      :breakpoints="breakpoints"
      :effect="'fade'"
      :autoplay="{
        delay: 5000
      }"
      class="mySwiper"
    >
      <SwiperSlide v-for="item in items" :key="item.id" style="width: 100%">
        <HomeVideoBackground v-if="item.type === 'video'" :video="item.video" />
        <HomeImageBackground v-else-if="item.type === 'image'" :item="item" />
      </SwiperSlide>
    </Swiper>

    <template #fallback>
      <div style="text-align: center; padding: 20px;">Carregando...</div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, A11y, Autoplay } from 'swiper/modules';

const modules = [Pagination, A11y, Autoplay];

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  slidesPerView: {
    type: Number,
    default: 1
  },
  spaceBetween: {
    type: Number,
    default: 0
  },
});
</script>

<style scoped>
/* Estilo básico para visualização */
.mySwiper {
  width: 100%;
  padding-bottom: 40px; /* Espaço para a paginação */
  padding-top: 10px; /* Espaço para a navegação (setas) */
}

/* Garante que o conteúdo dentro do slide fique visível */
.swiper-slide {
  /*max-height: 500px;*/
}
:deep(.swiper-pagination) {
  bottom: 0px !important;
  text-align: center;
}
:deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background-color: #dbb8f5;
  opacity: 1;
  margin: 0 6px;
  border-radius: 50%;
  transition: all 0.3s ease;
  border: 2px solid rgba(190, 134, 230, 0.5);
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #391a4f;
  width: 16px;
  border-radius: 6px;
  border: 2px solid transparent;
}
</style>