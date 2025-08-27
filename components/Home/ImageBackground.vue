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
  <v-sheet
    height="400"
    class="d-flex flex-column justify-center align-center text-white"
    :style="{
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }"
  >
    <h1 class="text-h4 font-weight-thin mb-4">Conect One RH</h1>
    <h4 class="subheading">Conectando talentos às melhores oportunidades</h4>
  </v-sheet>
</template>

<style lang="scss" scoped>
</style>
