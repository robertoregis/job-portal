// composables/useLog.ts
export function useLog() {
  const createLog = async (log: { 
    title: string, 
    description?: string, 
    subtitle?: string, 
    profile_id: string, 
    type: string 
  }) => {
    const { data, error } = await useFetch('/api/app-logs', {
      method: 'POST',
      body: {
        title: log.title || null,
        description: log.description || '',
        type: log.type || '',
        profile_id: log.profile_id
      }
    })

    if (error.value) {
      console.error('Erro ao criar log:', error.value)
      return null
    }
    return data.value
  }

  return { createLog }
}