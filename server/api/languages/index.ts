import supabase from '@/server/utils/supabase'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const { candidate_id } = getQuery(event)

    let query = supabase.from('languages').select('*').order('created_at', { ascending: false })

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
    let { name, level, candidate_id } = body

    if (!candidate_id) {
      throw createError({ statusCode: 400, statusMessage: 'candidate_id is required' })
    }
    if (!name) {
      throw createError({ statusCode: 400, statusMessage: 'name is required' })
    }

    name = emptyStringToNull(name)
    level = emptyStringToNull(level)

    // Verifica se já existe linguagem com esse name para o candidate_id
    const { data: existing, error: existsError } = await supabase
      .from('languages')
      .select('id')
      .eq('candidate_id', candidate_id)
      .eq('name', name)
      .eq('level', level)
      .single()

    if (existsError === null && existing) {
      throw createError({ statusCode: 409, statusMessage: 'Language with this name already exists' })
    }

    const { data, error } = await supabase
      .from('languages')
      .insert([{ name, level, candidate_id }])
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
