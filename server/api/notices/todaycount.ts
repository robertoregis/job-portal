import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { profile_id } = getQuery(event)

  if (!profile_id) {
    throw createError({ statusCode: 400, statusMessage: 'profile_id is required' })
  }

  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

  const { count, error } = await supabase
    .from('notices')
    .select('*', { count: 'exact', head: true }) // head: true não traz os dados, só conta
    .eq('profile_id', profile_id as string)
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return {
    hasNotices: (count ?? 0) > 0,
    count: count ?? 0
  }
})
