import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const { candidate_id, is_response, page, pageSize, is_redo } = getQuery(event)

    const pageNumber = page ? parseInt(page as string, 10) : 1
    const size = pageSize ? parseInt(pageSize as string, 10) : 10
    const from = (pageNumber - 1) * size
    const to = from + size - 1

    let query = supabase
      .from('behavioral_profiles')
      .select(`
        *,
        candidate: candidates!inner(name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (candidate_id) {
      query = query.eq('candidate_id', candidate_id as string)
    }
    if (is_response) {
      query = query.eq('is_response', false)
    }
    if (is_redo) {
      query = query.eq('is_redo', false)
    }

    const { data, error, count } = await query

    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    const formattedData = data?.map(item => ({
      ...item,
      name_candidate: item.candidate?.name ?? null
    }))

    return {
      data: formattedData,
      count,
      page: pageNumber,
      pageSize: size,
      totalPages: Math.ceil((count ?? 0) / size)
    }
  }


  if (method === 'POST') {
    const body = await readBody(event)
    const { formdata, candidate_id, candidate_is_complete_behavioral, candidate_completion_percentage } = body

    if (!candidate_id) {
      throw createError({ statusCode: 400, statusMessage: 'candidate_id is required' })
    }
    const payload = Object.values(formdata)
    const counts = payload.reduce((acc: any, item: any) => {
      const id = item.response.id;
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
    // Verifica se já existe um registro para este candidato
    const { data: existing, error: existingError } = await supabase
      .from('behavioral_profiles')
      .select('*')
      .eq('candidate_id', candidate_id)
      .single()

    let result

    if (existing) {
      // Atualiza o registro existente
      const { data, error } = await supabase
        .from('behavioral_profiles')
        .update({ is_redo: false }) // aqui você pode atualizar os campos que vieram no body
        .eq('candidate_id', candidate_id)
        .select()
        .single()

      if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
      }

      result = data
    } else {
      // Insere um novo registro
      const insertData = { candidate_id, answers: formdata, counts: counts }

      const { data, error } = await supabase
        .from('behavioral_profiles')
        .insert([insertData])
        .select()
        .single()

      if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
      }

      result = data
    }

    // Atualiza o candidato, se necessário
    if (!candidate_is_complete_behavioral) {
      const current = Number(candidate_completion_percentage ?? 0)
      const newPct = Math.min(100, current + 10)

      const { error: candidateError } = await supabase
        .from('candidates')
        .update({
          is_complete_behavioral: true,
          completion_percentage: newPct,
          completion_percentage_formatted: `${newPct}%`,
          is_complete: newPct >= 100
        })
        .eq('id', candidate_id)
    }

    return result
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})


