import supabase from '@/server/utils/supabase'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const { candidate_id, page, pageSize, } = getQuery(event)

    const pageNumber = page ? parseInt(page as string, 10) : 1
    const size = pageSize ? parseInt(pageSize as string, 10) : 10

    const from = (pageNumber - 1) * size
    const to = from + size - 1

    if (!candidate_id) {
      throw createError({ statusCode: 400, statusMessage: 'candidate_id is required' })
    }

    const { data, count, error } = await supabase
      .from('feedbacks')
      .select(`
        *,
        candidatures!inner(
          candidate_id,
          job:jobs(title)
        )
      `, { count: 'exact' }) // <-- aqui pedimos o count exato
      .eq('candidatures.candidate_id', candidate_id)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    // Achata o resultado para trazer job_title direto
    const flattened = data.map((fb: any) => ({
      ...fb,
      job_title: fb.candidatures?.job?.title || null,
      candidate_id: fb.candidatures?.candidate_id || null
    }))

    return {
      data: flattened,
      count,
      page: pageNumber,
      pageSize: size,
      totalPages: Math.ceil((count ?? 0) / size)
    }
  }

  if (method === 'POST') {
  const body = await readBody(event)
    let { content, candidature_id } = body

    if (!candidature_id) {
      throw createError({ statusCode: 400, statusMessage: 'candidature_id is required' })
    }

    if (!content) {
      throw createError({ statusCode: 400, statusMessage: 'content is required' })
    }

    // Checa se já existe um parecer para essa candidatura
    const { data: existing, error: checkError } = await supabase
      .from('feedbacks')
      .select('id')
      .eq('candidature_id', candidature_id)

    if (checkError) {
      throw createError({ statusCode: 500, statusMessage: checkError.message })
    }

    if (existing && existing.length > 0) {
      throw createError({ statusCode: 400, statusMessage: 'Já existe um parecer para esta candidatura.' })
    }

    content = emptyStringToNull(content)

    const { data, error } = await supabase
      .from('feedbacks')
      .insert([{ content, candidature_id }])
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
