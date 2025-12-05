<script lang="ts">

  export default {
    props: {
		image: {
				type: String,
				required: true,
			},
		},
    setup(props: any) {
      const image = toRef(props, 'image')

      return {
        image
      }
    }
  }
</script>

<template>
  <div>
    <img :src="image" alt="" style="width: 100%">
  </div>
</template>

<style lang="scss" scoped>
</style>