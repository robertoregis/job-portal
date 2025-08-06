<script lang="ts">
  export default {
    props: {
			job: {
				type: Object,
				required: true,
			},
		},
    setup(props: any, {emit}) {
      const dialog = ref<boolean>(false)
      const job = toRef(props, 'job')

      return {
        dialog,
        job
      }
    }
  }
</script>
<template>
  <v-col cols="12" md="6" class="">
    <NuxtLink to="/vagas/1" class="no-underline">
      <v-card class="mx-auto">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-avatar class="mr-2">
              <v-img
                alt="John"
                src="https://cdn.vuetifyjs.com/images/john.jpg"
              ></v-img>
            </v-avatar>
            <span>{{ job.title }}</span>
          </div>
          <span class="text-caption text-titleLight">{{ job.created_date }}</span>
        </v-card-title>

        <v-card-subtitle>
          <span class="text-subtitle-1">{{ job.company }}</span>
        </v-card-subtitle>

        <v-card-text>
          {{ job.description }}
        </v-card-text>

        <v-card-actions>
          <v-btn
            @click.prevent="dialog = true"
            class="bg-gradient-primary"
            text="Candidatar-me"
            variant="flat"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </NuxtLink>
  </v-col>
  <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card
        prepend-icon="mdi-briefcase"
        text="Para se candidatar a ela é preciso ter um cadastro. É rápido e fácil fazer um!"
        title="Gostou da vaga?"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn variant="flat" color="success" @click="dialog = false">
            Faça o cadastro
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>

<style lang="scss" scoped>
</style>