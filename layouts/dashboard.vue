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

  onMounted(() => {
    if(window.innerWidth >= 960) {
      show.setNavigation(true)
    }
    nextTick(() => {
      evaluateWidth()
    })
    window.addEventListener('resize', evaluateWidth)
  })

  const { data, error }: any = await useFetch('/api/notices/todaycount', {
      method: 'GET',
      params: { profile_id: info.user.profile_id }
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
