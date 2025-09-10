// composables/useNotice.ts
export function useNotice() {
  const createNotice = async (notice: { 
    title: string, 
    description?: string, 
    subtitle?: string, 
    profile_id: string, 
    type: string,
    is_master?: boolean
  }) => {
    const { data, error } = await useFetch('/api/notices', {
      method: 'POST',
      body: {
        title: notice.title || null,
        description: notice.description || '',
        type: notice.type || '',
        subtitle: notice.subtitle || '',
        profile_id: notice.profile_id,
        is_master: notice.is_master || false
      }
    })

    if (error.value) {
      console.error('Erro ao criar aviso:', error.value)
      return null
    }
    return data.value
  }

  const createLog = async (log: { 
    title: string, 
    description?: string, 
    subtitle?: string, 
    profile_id: string, 
    type: string,
    is_master?: boolean
  }) => {
    const { data, error } = await useFetch('/api/app-logs', {
      method: 'POST',
      body: {
        title: log.title || null,
        description: log.description || '',
        type: log.type || '',
        profile_id: log.profile_id,
        is_master: log.is_master || false
      }
    })

    if (error.value) {
      console.error('Erro ao criar log:', error.value)
      return null
    }
    return data.value
  }

  return { createNotice, createLog }
}
