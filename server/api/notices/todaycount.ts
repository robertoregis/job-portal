import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { profile_id, is_master } = getQuery(event)

  if (!profile_id) {
    throw createError({ statusCode: 400, statusMessage: 'profile_id is required' })
  }

  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

  let query = supabase
    .from('notices')
    .select('*', { count: 'exact', head: true }) // head: true não traz os dados, só conta
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay)

  if (is_master === 'true' || is_master === true) {
    // master: pegar notices globais (is_master=true) OU notices do profile_id
    if (profile_id) {
      // mais simples e eficaz: is_master true OR profile_id = X
      query = query.or(`is_master.eq.true,profile_id.eq.${profile_id}`)
    } else {
      // nenhum profile_id passado → só masters
      query = query.eq('is_master', true)
    }
  } else {
    // não é master: só notices do profile_id e is_master = false
    query = query.eq('profile_id', profile_id as string).eq('is_master', false)
  }

  const { count, error } = await query

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return {
    hasNotices: (count ?? 0) > 0,
    count: count ?? 0
  }
})
