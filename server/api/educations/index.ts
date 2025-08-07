/*import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    // Pega candidate_id da query, se existir
    const { candidate_id } = getQuery(event)

    let query = supabase.from('educations').select('*')

    // Aplica filtro se candidate_id estiver presente
    if (candidate_id) {
      query = query.eq('candidate_id', candidate_id as string)
    }

    const { data, error } = await query

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const { course, institution, level, period, notes, candidate_id } = body

    const { data, error } = await supabase
      .from('educations')
      .insert([{ course, institution, level, period, notes, candidate_id }])
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})*/

