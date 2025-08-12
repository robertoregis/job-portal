import supabase from '@/server/utils/supabase'

export default defineEventHandler(async () => {
  try {
    const [{ count: companiesCount }, { count: candidatesCount }, { count: jobsCount }, { count: candidaturesCount }] = await Promise.all([
      supabase.from('companies').select('id', { count: 'exact', head: true }),
      supabase.from('candidates').select('id', { count: 'exact', head: true }),
      supabase.from('jobs').select('id', { count: 'exact', head: true }),
      supabase.from('candidatures').select('id', { count: 'exact', head: true }),
    ])

    return {
      companies: companiesCount || 0,
      candidates: candidatesCount || 0,
      jobs: jobsCount || 0,
      candidatures: candidaturesCount || 0,
    }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Erro no servidor' })
  }
})
