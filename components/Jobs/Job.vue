<script lang="ts">
  import { useInfo } from '@/stores/info';

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
      const dialogCreateCandidature = ref<boolean>(false)
      const info: any = useInfo()
      const router = useRouter();

      const apply = () => {
        if (info.user && info.user.id && info.user.type === 'candidate') {
          dialogCreateCandidature.value = true
        } else {
          dialog.value = true
        }
      }

      const navigation = (id: number) => {
        dialog.value = false;
        router.push(`/cadastrar/candidato`)
      }

      return {
        dialog,
        job,
        dialogCreateCandidature,
        navigation,
        apply,
        info
      }
    }
  }
</script>
<template>
  <v-col cols="12" md="6" class="">
    <NuxtLink :to="`/vagas/${job.id}`" class="no-underline">
      <v-card class="mx-auto">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-avatar class="mr-2">
              <v-img
                alt="John"
                :src="job.company_image_url"
              ></v-img>
            </v-avatar>
            <span>{{ job.position }}</span>
          </div>
          <span class="text-caption text-titleLight">{{ job.created_at_formatted }}</span>
        </v-card-title>

        <v-card-subtitle>
          <span class="text-subtitle-1">{{ job.company_name }}</span>
        </v-card-subtitle>

        <v-card-text>
          {{ job.description }}
        </v-card-text>

        <v-card-actions>
          <v-btn
            v-if="info.user && info.user.id && info.user.type === 'candidate'"
            @click.prevent="apply"
            class="bg-gradient-primary"
            text="Candidatar-me"
            variant="flat"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </NuxtLink>
  </v-col>

  <v-dialog
    v-model="dialogCreateCandidature"
    max-width="400"
    persistent
  >
    <v-card
      text="Se você curtiu a vaga não perca tempo e faça a sua candidatura."
      title="Candidata-se!"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn color="error" variant="flat" @click="dialogCreateCandidature = false">
          Não
        </v-btn>

        <v-btn color="success" variant="flat" @click="dialogCreateCandidature = false">
          Sim
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

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

          <v-btn variant="flat" color="success" @click="navigation">
            Faça o cadastro
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>

<style lang="scss" scoped>
</style>