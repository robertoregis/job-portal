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
      } else if(userStorage.type === 'user') {
        router.push('/dashboard/candidato/123')
      } else if(userStorage.type === 'admin') {
        router.push('/dashboard/admin/123')
      }
    }
  }

  onMounted(() => {
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

