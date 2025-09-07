<script setup lang="ts">
  import { useInfo } from '@/stores/info'
  import { useShow } from '@/stores/show'
  import { useNotice } from '@/composables/useNotice';
  const { notify } = useNotification()
  const authentication: any = useInfo()
  const router = useRouter()
  const show = useShow()
  const { createLog } = useNotice();
  const info: any = useInfo();

  const logout = async () => {
    show.setOverlayDashboard(true)
    setTimeout(async () => {
      createLog({
        title: `Deslogou`,
        profile_id: authentication.profile.id,
        type: 'logout'
      })
      router.push('/')
      show.setOverlayDashboard(false)
      const supabase = useNuxtApp().$supabase
      await supabase.auth.signOut()
      authentication.setUser({})
      authentication.setProfile({})
      localStorage.removeItem('user')
    }, 1000)
  }

</script>

<template>
  <v-navigation-drawer
    v-model="show.navigation"
    class="bg-gradient-primary"
    :temporary="$vuetify.display.smAndDown"
    :permanent="$vuetify.display.mdAndUp"
    style="height: 100vh; overflow: hidden;"
  >

    <v-row v-if="authentication.user.type === 'candidate'" class="pa-3" no-gutters>
      <v-col cols="12" class="mt-2">
        <div class="d-flex flex-column align-center">
          <v-avatar size="60">
            <v-img
              alt="logo com símbolo da Conect One RH"
              src="/logo-simbolo.png"
            ></v-img>
          </v-avatar>
          <div class="d-flex flex-column align-center mt-4">
            <v-avatar v-if="authentication.user.image_url" size="70">
              <v-img
                alt=""
                :src="authentication.user.image_url"
              ></v-img>
            </v-avatar>
            <v-avatar v-else size="70">
              <v-img
                alt=""
                src="https://uhwfvrjhlhvxyrrlaqna.supabase.co/storage/v1/object/public/jobportal/default/blank-profile-picture-973460_640.png"
              ></v-img>
            </v-avatar>
            <span>{{ authentication.user.name }}</span>
            <span class="text-caption">{{ authentication.user.email }}</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="mt-3">
        <v-list nav>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/candidato/${authentication.user.id}`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-view-dashboard</v-icon>
              <span>Dashboard</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/candidato/${authentication.user.id}/meu-perfil`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-account</v-icon>
              <span>Meu perfil</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/candidato/${authentication.user.id}/minhas-candidaturas`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-clipboard-list</v-icon>
              <span>Minhas candidaturas</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/candidato/${authentication.user.id}/avisos`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-bell</v-icon>
              <span>Avisos</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/candidato/${authentication.user.id}/ajustes`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-cog</v-icon>
              <span>Ajustes</span>
            </NuxtLink>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12">
        <div class="d-flex flex-column align-center">
          <v-progress-circular
            @click="router.push(`/dashboard/candidato/${info.user.id}/meu-perfil/editar`)"
            :model-value="info.user.completion_percentage_formatted"
            :rotate="360"
            :size="40"
            :width="5"
            color="white"
            class="cursor-pointer"
          >
            <span class="text-caption">{{ info.user.completion_percentage_formatted }}</span>
          </v-progress-circular>
          <span class="mt-1 text-caption">Seu progresso...</span>
          <v-btn
            @click="logout"
            color="white"
            text="Sair"
            variant="flat"
            class="mt-4"
            size="small"
          ></v-btn>
          <v-btn
            @click="router.push('/')"
            color="white"
            text="Ir para o site"
            variant="flat"
            class="mt-2"
            size="small"
          ></v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="authentication.user.type === 'company'" class="pa-3" no-gutters>
      <v-col cols="12" class="mt-2">
        <div class="d-flex flex-column align-center">
          <v-avatar size="60">
            <v-img
              alt="logo com símbolo da Conect One RH"
              src="/logo-simbolo.png"
            ></v-img>
          </v-avatar>
          <div class="d-flex flex-column align-center mt-4">
            <v-avatar v-if="authentication.user.image_url" size="70">
              <v-img
                alt="John"
                :src="authentication.user.image_url"
              ></v-img>
            </v-avatar>
            <v-avatar v-else color="white" size="70">
            </v-avatar>
            <span>{{ authentication.user.name }}</span>
            <span class="text-caption">{{ authentication.user.email }}</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="mt-3">
        <v-list nav>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/empresa/${authentication.user.id}`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-view-dashboard</v-icon>
              <span>Dashboard</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/empresa/${authentication.user.id}/meu-perfil`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-account</v-icon>
              <span>Meu perfil</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/empresa/${authentication.user.id}/minhas-vagas`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-clipboard-list</v-icon>
              <span>Minhas vagas</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/empresa/${authentication.user.id}/avisos`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-bell</v-icon>
              <span>Avisos</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/empresa/${authentication.user.id}/ajustes`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-cog</v-icon>
              <span>Ajustes</span>
            </NuxtLink>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12">
        <div class="d-flex flex-column align-center">
          <v-btn
            @click="logout"
            color="white"
            text="Sair"
            variant="flat"
            class="mt-4"
            size="small"
          ></v-btn>
          <v-btn
            @click="router.push('/')"
            color="white"
            text="Ir para o site"
            variant="flat"
            class="mt-2"
            size="small"
          ></v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="authentication.user.type === 'admin'" class="pa-3" no-gutters>
      <v-col cols="12" class="mt-2">
        <div class="d-flex flex-column align-center">
          <v-avatar size="60">
            <v-img
              alt="logo com símbolo da Conect One RH"
              src="/logo-simbolo.png"
            ></v-img>
          </v-avatar>
          <div class="d-flex flex-column align-center mt-4">
            <v-avatar v-if="authentication.user.image_url" size="70">
              <v-img
                alt="John"
                :src="authentication.user.image_url"
              ></v-img>
            </v-avatar>
            <v-avatar v-else color="white" size="70">
            </v-avatar>
            <span>{{ authentication.user.name }}</span>
            <span class="text-caption">{{ authentication.user.email }}</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="mt-3">
        <v-list nav>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/admin`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-view-dashboard</v-icon>
              <span>Dashboard</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/admin/meu-perfil`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-account</v-icon>
              <span>Meu perfil</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/admin/empresas`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-clipboard-list</v-icon>
              <span>Empresas</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/admin/administradores`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-account-tie-hat</v-icon>
              <span>Administradores</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/admin/vagas`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-briefcase</v-icon>
              <span>Vagas</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/admin/edicao-de-vagas`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-briefcase-edit</v-icon>
              <span>Edição de vagas</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/admin/paginas`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-file-document</v-icon>
              <span>Páginas</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/admin/avisos`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-bell</v-icon>
              <span>Avisos</span>
            </NuxtLink>
          </v-list-item>
          <v-list-item class="d-flex" style="min-height: unset">
            <NuxtLink :to="`/dashboard/admin/ajustes`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-cog</v-icon>
              <span>Ajustes</span>
            </NuxtLink>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12">
        <div class="d-flex flex-column align-center">
          <v-btn
            @click="logout"
            color="white"
            text="Sair"
            variant="flat"
            class="mt-4"
            size="small"
          ></v-btn>
          <v-btn
            @click="router.push('/')"
            color="white"
            text="Ir para o site"
            variant="flat"
            class="mt-2"
            size="small"
          ></v-btn>
        </div>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
</style>