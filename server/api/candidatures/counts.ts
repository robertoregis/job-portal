import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { candidate_id } = getQuery(event)

  if (!candidate_id) {
    throw createError({ statusCode: 400, statusMessage: 'candidate_id is required' })
  }

  // Total candidaturas
  const { count: totalCount, error: totalError } = await supabase
    .from('candidatures')
    .select('id', { count: 'exact', head: true })
    .eq('candidate_id', candidate_id)
    .eq('is_active', true)

  if (totalError) {
    throw createError({ statusCode: 500, statusMessage: totalError.message })
  }

  // Candidaturas contratadas
  const { count: approvedCount, error: approvedError } = await supabase
    .from('candidatures')
    .select('id', { count: 'exact', head: true })
    .eq('candidate_id', candidate_id)
    .eq('is_active', true)
    .eq('status', 'Contratados')

  if (approvedError) {
    throw createError({ statusCode: 500, statusMessage: approvedError.message })
  }

  // Candidaturas desclassificadas
  const { count: rejectedCount, error: rejectedError } = await supabase
    .from('candidatures')
    .select('id', { count: 'exact', head: true })
    .eq('candidate_id', candidate_id)
    .eq('is_active', true)
    .eq('status', 'Desclassificado')

  if (rejectedError) {
    throw createError({ statusCode: 500, statusMessage: rejectedError.message })
  }

  return {
    total: totalCount || 0,
    approved: approvedCount || 0,
    rejected: rejectedCount || 0
  }
})
