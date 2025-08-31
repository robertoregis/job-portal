import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { job_id } = getQuery(event)

  if (!job_id) {
    throw createError({ statusCode: 400, statusMessage: 'job_id is required' })
  }

  // Total candidaturas
  const { count: totalCount, error: totalError } = await supabase
    .from('candidatures')
    .select('id', { count: 'exact', head: true })
    .eq('job_id', job_id)
    .eq('is_active', true)

  if (totalError) {
    throw createError({ statusCode: 500, statusMessage: totalError.message })
  }

  // Candidaturas aprovadas
  const { count: approvedCount, error: approvedError } = await supabase
    .from('candidatures')
    .select('id', { count: 'exact', head: true })
    .eq('job_id', job_id)
    .eq('is_active', true)
    .eq('status', 'Aprovada')

  if (approvedError) {
    throw createError({ statusCode: 500, statusMessage: approvedError.message })
  }

  // Candidaturas rejeitadas
  const { count: rejectedCount, error: rejectedError } = await supabase
    .from('candidatures')
    .select('id', { count: 'exact', head: true })
    .eq('job_id', job_id)
    .eq('is_active', true)
    .eq('status', 'Rejeitada')

  if (rejectedError) {
    throw createError({ statusCode: 500, statusMessage: rejectedError.message })
  }

  return {
    total: totalCount || 0,
    approved: approvedCount || 0,
    rejected: rejectedCount || 0
  }
})
