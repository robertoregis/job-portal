import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const method = event.req.method

  // ---------------------- GET ----------------------
  if (method === 'GET') {
    const { behavioral_profiles_id } = getQuery(event)

    let query = supabase
      .from('result_behavioral')
      .select(`
        *,
        behavioral_profiles (
          candidate: candidates!inner(name)
        )
      `)
      .order('created_at', { ascending: false })

    if (behavioral_profiles_id) {
      query = query.eq('behavioral_profiles_id', behavioral_profiles_id as string)
    }

    const { data, error } = await query

    if (error) throw createError({ statusCode: 500, statusMessage: error.message })

    const formattedData = data?.map(item => ({
      ...item,
      name_candidate: item.behavioral_profiles?.candidate?.name ?? null
    }))

    return {
      data: formattedData
    }

  }

  // ---------------------- POST ----------------------
  if (method === 'POST') {
    const body = await readBody(event)
    const { formdata, behavioral_profiles_id } = body

    if (!behavioral_profiles_id) {
      throw createError({ statusCode: 400, statusMessage: 'behavioral_profiles_id is required' })
    }

    if (!formdata || typeof formdata !== 'object') {
      throw createError({ statusCode: 400, statusMessage: 'formdata is required' })
    }

    // Verifica se já existe resultado
    const { data: existing, error: existingError } = await supabase
      .from('result_behavioral')
      .select('id')
      .eq('behavioral_profiles_id', behavioral_profiles_id)
      .limit(1) // evita erro do single
      .maybeSingle()

    if (existing) {
      throw createError({ statusCode: 400, statusMessage: 'Result already exists' })
    }

    // Insere um novo registro
    const insertData = { behavioral_profiles_id, ...formdata }

    const { data, error } = await supabase
      .from('result_behavioral')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    const { error: updateError } = await supabase
      .from('behavioral_profiles')
      .update({ is_response: true })
      .eq('id', behavioral_profiles_id)

    if (updateError) {
      throw createError({ statusCode: 500, statusMessage: updateError.message })
    }

    return data
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})



