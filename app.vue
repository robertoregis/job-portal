<script setup lang="ts">
  import { useInfo } from '#imports';

  const info = useInfo();
  const router = useRouter();


  const getUser = () => {
    const user: any = localStorage.getItem('user')
    const userStorage = JSON.parse(user);
    if(userStorage) {
      info.setUser(userStorage)
      if(userStorage.type === 'company') {
        router.push('/dashboard/empresa/123')
      } else if(userStorage.type === 'candidate') {
        router.push('/dashboard/candidato/123')
      } else if(userStorage.type === 'admin') {
        router.push('/dashboard/admin/123')
      }
    }
  }

  onMounted(async () => {
    const supabase = useNuxtApp().$supabase

  const { data: { session } } = await supabase.auth.getSession()
  console.log(session)
  if (session) {
    // usuário logado, tem sessão válida
    console.log('Usuário:', session.user)
  } else {
    console.log('dddd')
    // não está logado
  }
    getUser()
  })
</script>
<template>
  <div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
  </div>
</template>
<style>
</style>

