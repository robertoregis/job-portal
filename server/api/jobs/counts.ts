import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { company_id } = getQuery(event)

  if (!company_id) {
    throw createError({ statusCode: 400, statusMessage: 'company_id is required' })
  }

  // Total de vagas
  const { count: totalCount, error: totalError } = await supabase
    .from('jobs')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', company_id)

  if (totalError) {
    throw createError({ statusCode: 500, statusMessage: totalError.message })
  }

  // Vagas abertas para inscrição
  const { count: openCount, error: openError } = await supabase
    .from('jobs')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', company_id)
    .eq('status', 'Aberta para inscrição')

  if (openError) {
    throw createError({ statusCode: 500, statusMessage: openError.message })
  }

  // Vagas com inscrições encerradas
  const { count: closedSignupCount, error: closedSignupError } = await supabase
    .from('jobs')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', company_id)
    .eq('status', 'Inscrições encerradas')

  if (closedSignupError) {
    throw createError({ statusCode: 500, statusMessage: closedSignupError.message })
  }

  // Vagas encerradas
  const { count: endedCount, error: endedError } = await supabase
    .from('jobs')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', company_id)
    .eq('status', 'Encerrada')

  if (endedError) {
    throw createError({ statusCode: 500, statusMessage: endedError.message })
  }

  return {
    total: totalCount || 0,
    open: openCount || 0,
    closedSignup: closedSignupCount || 0,
    ended: endedCount || 0
  }
})
