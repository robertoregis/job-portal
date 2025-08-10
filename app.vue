<script setup lang="ts">
import { useInfo } from '@/stores/info'

const info: any = useInfo()
const router = useRouter()
const route = useRoute()

const loading = ref(true)
const profile = ref<any>({})
const candidate = ref<any>({})
const company = ref<any>({})

const getProfile = async (id: string) => {
  loading.value = true
  const { data, error } = await useFetch(`/api/profiles/${id}`, {
    method: 'GET'
  })

  if (error.value) {
    loading.value = false
    console.error('Erro ao carregar profile:', error.value)
    return
  }

  profile.value = data.value
  info.setProfile(data.value)

  if (data.value.type === 'candidate') {
    const { data: dataCandidate, error: errorCandidate } = await useFetch(`/api/candidates`, {
      method: 'GET',
      params: { profile_id: profile.value.id }
    })

    if (errorCandidate.value) {
      loading.value = false
      console.error('Erro ao carregar candidato:', errorCandidate.value)
      return
    }

    candidate.value = dataCandidate.value
    info.setUser({ ...dataCandidate.value[0], type: 'candidate' })
  } else if (data.value.type === 'company') {
    const { data: dataCompany, error: errorCompany } = await useFetch(`/api/companies`, {
      method: 'GET',
      params: { profile_id: profile.value.id }
    })

    if (errorCompany.value) {
      loading.value = false
      console.error('Erro ao carregar empresa:', errorCompany.value)
      return
    }

    company.value = dataCompany.value
    info.setUser({ ...dataCompany.value[0], type: 'company' })
  }

  // Após carregar o usuário, checa o redirecionamento
  checkRedirect()

  loading.value = false
}

const checkRedirect = () => {
  const user = info.user
  const currentPath = route.path

  const dashboardPaths = ['/dashboard/candidato', '/dashboard/empresa', '/dashboard/admin']

  // 1. Se não estiver logado e estiver no dashboard, redireciona para /
  if (!user && currentPath.startsWith('/dashboard')) {
    router.push('/')
    return
  }

  // 2. Se estiver logado, mas estiver num dashboard que não é o seu tipo, redireciona para o correto
  if (user && currentPath.startsWith('/dashboard')) {
    // Obtém o segmento após /dashboard/
    const [, dashboardType] = currentPath.split('/').filter(Boolean)

    // Map tipo do usuário para o segmento da url
    const userTypeToDashboard: any = {
      candidate: 'candidato',
      company: 'empresa',
      admin: 'admin'
    }
    const userDashboardSegment = userTypeToDashboard[user.type]

    if (dashboardType && userDashboardSegment && dashboardType !== userDashboardSegment) {
      router.push(`/dashboard/${userDashboardSegment}/${user.id}`)
      return
    }
  }

  // Se não caiu em nenhuma regra, não faz nada (deixa passar)
}

onMounted(async () => {
  const supabase = useNuxtApp().$supabase
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    await getProfile(session.user.id)
  } else {
    // Se não estiver logado, mas está em rota dashboard, redireciona para /
    if (route.path.startsWith('/dashboard')) {
      router.push('/')
    }
    loading.value = false
  }
})
</script>

<template>
  <div v-if="!loading">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <notifications position="bottom center" :speed="500" />
  </div>
</template>
<style>
</style>

