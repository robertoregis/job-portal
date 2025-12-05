<script lang="ts">

  export default {
    props: {
		  item: {
				type: Object,
				required: true,
			},
		},
    setup(props: any) {
      const item = toRef(props, 'item')

      return {
        item
      }
    }
  }
</script>

<template>
  <template v-if="item.link">
    <NuxtLink :to="item.link" :target="`${item.is_external ? true : false}`">
      <img class="d-none d-sm-block" :src="item.image_lg_url" alt="" style="width: 100%;">
      <img class="d-sm-none" :src="item.image_sm_url" alt="" style="width: 100%;">
    </NuxtLink>
  </template>
  <template v-else>
    <div>
      <img class="d-none d-sm-block" :src="item.image_lg_url" alt="" style="width: 100%;">
      <img class="d-sm-none" :src="item.image_sm_url" alt="" style="width: 100%;">
    </div>
  </template>
</template>

<style lang="scss" scoped>
</style>
