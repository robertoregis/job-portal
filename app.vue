<script setup lang="ts">
import { useInfo } from '@/stores/info'

const info: any = useInfo()
const router = useRouter()
const route = useRoute()

const loading = ref(true)
const profile = ref<any>({})
const candidate = ref<any>({})
const company = ref<any>({})
const admin = ref<any>({})

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

    candidate.value = dataCandidate.value.data[0]
    info.setUser({ ...dataCandidate.value.data[0], type: 'candidate' })

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

    company.value = dataCompany.value.data[0]
    info.setUser({ ...dataCompany.value.data[0], type: 'company' })

  } else if (data.value.type === 'admin') {
    // Caso admin, carregar dados do admin se necessário
    const { data: dataAdmin, error: errorAdmin } = await useFetch(`/api/admins`, {
      method: 'GET',
      params: { profile_id: profile.value.id }
    })

    if (errorAdmin.value) {
      loading.value = false
      console.error('Erro ao carregar admin:', errorAdmin.value)
      return
    }

    admin.value = dataAdmin.value.data[0]
    info.setUser({ ...dataAdmin.value.data[0], type: 'admin' })
  }

  // Após carregar o usuário, checa o redirecionamento
  checkRedirect()

  loading.value = false
}

const checkRedirect = () => {
  const user = info.user
  const currentPath = route.path

  // Paths dos dashboards existentes
  const dashboardPaths = ['/dashboard/candidato', '/dashboard/empresa', '/dashboard/admin']

  // 1. Se não estiver logado e estiver em rota dashboard, redireciona para /
  if (!user && currentPath.startsWith('/dashboard')) {
    router.push('/')
    return
  }

  // 2. Se estiver logado, mas estiver em dashboard errado, redireciona para o correto
  if (user && currentPath.startsWith('/dashboard')) {
    const [, dashboardType] = currentPath.split('/').filter(Boolean)

    const userTypeToDashboard: Record<string, string> = {
      candidate: 'candidato',
      company: 'empresa',
      admin: 'admin'
    }

    const userDashboardSegment = userTypeToDashboard[user.type]
    if (dashboardType && userDashboardSegment && dashboardType !== userDashboardSegment) {
      if(dashboardType === 'admin') {
        router.push(`/dashboard/${userDashboardSegment}`)
      } else {
        router.push(`/dashboard/${userDashboardSegment}/${user.id}`)
      }
      return
    }
  }
  // Se não houver motivo para redirecionar, deixa passar
}

onMounted(async () => {
  const supabase = useNuxtApp().$supabase
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    await getProfile(session.user.id)
  } else {
    // Logout limpo se não houver sessão
    await supabase.auth.signOut()
    info.setUser({})
    info.setProfile({})
    localStorage.removeItem('user')
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

