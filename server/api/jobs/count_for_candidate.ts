import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { candidate_id } = getQuery(event)

  if (!candidate_id) {
    throw createError({ statusCode: 400, statusMessage: 'candidate_id is required' })
  }

  // Total de vagas
  const { count: totalCount, error: totalError } = await supabase
    .from('jobs')
    .select('id', { count: 'exact', head: true })
    .eq('candidate_id', candidate_id)

  if (totalError) {
    throw createError({ statusCode: 500, statusMessage: totalError.message })
  }

  return {
    total: totalCount || 0,
  }
})