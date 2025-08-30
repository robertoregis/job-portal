import supabase from '@/server/utils/supabase'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

function toISODate(value: any) {
  if (!value) return null
  const d = new Date(value)
  if (isNaN(d.getTime())) return null
  return d.toISOString().substring(0, 10)
}

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const { candidate_id } = getQuery(event)

    let query = supabase.from('experience_group').select('*').order('created_at', { ascending: false })

    if (candidate_id) {
      query = query.eq('candidate_id', candidate_id as string)
    }

    const { data, error } = await query

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }
  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
