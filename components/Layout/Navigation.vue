<script setup lang="ts">
import { useInfo } from '@/stores/info'
import { useShow } from '@/stores/show'

const { notify } = useNotification()
const authentication: any = useInfo()
const router = useRouter()
const show = useShow()

const profilePoints = {
  name: 15,
  cpf: 10,
  phone: 10,
  email: 10,
  about: 20,
  birth_date: 10,
  marital_status: 5,
  state: 5,
  city: 5,
  image_id: 10,
}

const profilePointsCompany = {
  name: 15,
  cnpj: 15,
  representative_name: 10,
  representative_email: 15,
  representative_cpf: 15,
  email: 10,
  state: 5,
  city: 5,
  image_id: 10,
}

const value = ref(0)

const calculateProfileScore = (profile: any, profilePoints: any) => {
  let total = 0

  for (const key in profilePoints) {
    const fieldValue = profile[key]
    const points = profilePoints[key]

    const isFilled =
      fieldValue !== null &&
      fieldValue !== '' &&
      !(Array.isArray(fieldValue) && fieldValue.length === 0)
    if (isFilled) {
      total += points
    }
  }

  const interval = setInterval(() => {
    if (value.value < total) {
      value.value += 2
    } else {
      clearInterval(interval)
    }
  }, 100)
}

const logout = async () => {
  show.setOverlayDashboard(true)
  setTimeout(async () => {
    router.push('/')
    show.setOverlayDashboard(false)
    const supabase = useNuxtApp().$supabase
    await supabase.auth.signOut()
    authentication.setUser({})
    authentication.setProfile({})
    localStorage.removeItem('user')
  }, 1000)
}

onMounted(() => {
  if (authentication.user?.type === 'candidate') {
    calculateProfileScore(authentication.user, profilePoints)
  } else if (authentication.user?.type === 'company') {
    calculateProfileScore(authentication.user, profilePointsCompany)
  }
})
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
          <v-avatar color="white" size="50"></v-avatar>
          <div class="d-flex flex-column align-center mt-6">
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
        </v-list>
      </v-col>

      <v-col cols="12">
        <div class="d-flex flex-column align-center">
          <v-progress-circular
            :model-value="value"
            :rotate="360"
            :size="40"
            :width="5"
            color="white"
          >
            <span class="text-caption">{{ value }}</span>
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
          <v-avatar color="white" size="50"></v-avatar>
          <div class="d-flex flex-column align-center mt-6">
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
          <v-progress-circular
            :model-value="value"
            :rotate="360"
            :size="40"
            :width="5"
            color="white"
          >
            <span class="text-caption">{{ value }}</span>
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
    <v-row v-if="authentication.user.type === 'admin'" class="pa-3" no-gutters>
      <v-col cols="12" class="mt-2">
        <div class="d-flex flex-column align-center">
          <v-avatar color="white" size="50"></v-avatar>
          <div class="d-flex flex-column align-center mt-6">
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
            <NuxtLink :to="`/dashboard/admin/paginas`" class="d-flex align-center no-underline text-white text-subtitle-2">
              <v-icon class="mr-1" size="18">mdi-file-document</v-icon>
              <span>Páginas</span>
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