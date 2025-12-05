<!-- layouts/dashboard.vue -->
<script setup lang="ts">
  import { useInfo } from '@/stores/info';
  import { useShow } from '@/stores/show';
  const show = useShow();
  const info: any = useInfo();
  const router = useRouter();
  let wasLargeScreen = window.innerWidth >= 960
  const hasNotices = ref<boolean>(false)
  const countsNotices = ref<number>(0)
  const dialogShowJobs = ref(true)

  const evaluateWidth = () => {
    const isLargeScreen = window.innerWidth >= 960

    if (isLargeScreen !== wasLargeScreen) {
      wasLargeScreen = isLargeScreen
      show.setNavigation(isLargeScreen)
    }
  }

  const navigation = () => {
    if(info.user.type === 'admin') {
      router.push('/dashboard/admin/avisos')
    } else if(info.user.type === 'candidate') {
      router.push(`/dashboard/candidato/${info.user.id}/avisos`)
    } else if(info.user.type === 'admin') {
      router.push(`/dashboard/empresa/${info.user.id}/avisos`)
    } 
  }

  const goPerfil = (link: any) => {
    router.push(link)
  }

  const getCountsForCandidate = async () => {
    const { data, error } = await useFetch('/api/candidatures/counts', {
      method: 'GET',
      params: { candidate_id: info.user.id }
    })
    if (error.value) {
      //console.error('Erro ao buscar counts:', error.value)
    } else {
      if(data.value?.total === 0) {
        show.setApplyJob(true)
      }
    }
  }

  onMounted(() => {
    if(window.innerWidth >= 960) {
      show.setNavigation(true)
    }
    nextTick(() => {
      evaluateWidth()
    })
    window.addEventListener('resize', evaluateWidth)
    if(info.user && info.user.type === 'candidate' && info.user.is_complete) {
      getCountsForCandidate()
    }
  })

  const { data, error }: any = await useFetch('/api/notices/todaycount', {
      method: 'GET',
      params: { profile_id: info.user.profile_id, is_master: info.profile.type === 'admin' ? true : false }
    })
    if (error.value) {
    } else {
      info.setCountsNotices(data.value?.count)
      countsNotices.value = data.value?.count
      hasNotices.value = data.value?.hasNotices
    }

</script>
<template>
  <v-app>
    <v-layout class="">
      <v-card
        v-if="info.user.type === 'candidate' && !info.user.curriculum_url"
        hover
        ripple
        @click="goPerfil(`/dashboard/candidato/${info.user.id}/meu-perfil/editar`)"
        class="floating-notify pa-3 d-flex align-center bg-warning"
        elevation="10"
      >
        <v-icon size="24" class="mr-2" color="white">mdi-alert-circle</v-icon>
        <v-card-text class="text-white mb-0 pa-0">
          Adicione um currículo no seu perfil.
        </v-card-text>
      </v-card>
      <LayoutNavigation />
      
      <v-main class="overflow-y-auto" style="height: 100vh;">
        <div class="">
          <v-container>
            <v-row no-gutters class="relative">
              <v-btn
                variant="text"
                size="small"
                icon
                class="notification-btn"
                @click="navigation"
              >
                <v-badge
                  :dot="hasNotices"
                  :color="hasNotices ? 'orange' : 'transparent'"
                  offset-x="5"
                  offset-y="2"
                >
                  <v-icon size="24">mdi-bell</v-icon>
                </v-badge>
              </v-btn>
              <v-col cols="12" v-if="$vuetify.display.smAndDown">
                <v-app-bar flat absolute>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon="mdi-menu"
                    variant="text"
                    @click="show.setNavigation(!show.navigation)"
                  ></v-btn>
                </v-app-bar>
              </v-col>

              <v-col cols="12">
                <slot/>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-main>

      <v-dialog
        v-model="show.applyJob"
        max-width="440"
      >
        <v-card
          class="bg-primary pa-3" 
          rounded="lg" 
          flat
        >
          <v-card-text class="text-center pa-2">    
            <div class="text-h3 mb-4">
              🚀
            </div>

            <h2 class="text-h5 font-weight-bold mb-2">
              Perfil Completo, Parabéns!
            </h2>

            <p class="text-body-1 mb-4">
              Oi, <b>{{ info.user.name }}</b>, você fez o mais difícil que é completar o teu perfil! Agora o último passo:
            </p>

            <v-chip 
              color="white" 
              class="font-weight-bold text-caption pa-4 mb-4"
            >
              Se candidatar e conquistar a sua vaga
            </v-chip>

            <p class="text-body-2 mb-4">
              Não deixe todo esse esforço parado. Clique abaixo e confira as oportunidades que estão esperando pelo seu talento.
            </p>
          </v-card-text>

          <v-card-actions class="d-flex justify-center pa-2">
            <v-btn
              text="Ver Vagas Agora!"
              variant="flat"
              color="bg-navigation text-primary" 
              size="large"
              class="font-weight-black"
            />
          </v-card-actions>
              
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            class="close-button"
            style="position: absolute; top: 8px; right: 8px;"
            @click="show.setApplyJob(false)"
          />
              
        </v-card>
      </v-dialog>
    </v-layout>
    <!--<GlobalSnackbar />-->
    <GlobalOverlay />
  </v-app>
</template>
<style lang="scss" scoped>
.notification-btn {
  position: fixed;
  top: 12px;
  right: 50px;
  z-index: 999;
}
.floating-notify {
  position: fixed;       /* sempre sobre o conteúdo */
  bottom: 24px;             /* distância do topo */
  right: 24px;           /* distância da direita */
  width: 300px;          /* largura fixa */
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.25);
  background-color: white;
  transition: all 0.3s ease;
  z-index: 9999;         /* acima de tudo */
}

.floating-notify:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.35);
}
</style>
