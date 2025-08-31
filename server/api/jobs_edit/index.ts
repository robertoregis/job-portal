import supabase from '@/server/utils/supabase'
import { formatDateTimestamp } from '@/composables/formatDate'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const { job_id, page, pageSize } = getQuery(event)

    const pageNumber = page ? parseInt(page as string, 10) : 1
    const size = pageSize ? parseInt(pageSize as string, 10) : 10

    const from = (pageNumber - 1) * size
    const to = from + size - 1

    let query = supabase
      .from('jobs_edit')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (job_id) {
      query = query.eq('job_id', job_id as string)
    }

    query.eq('is_closed', false).eq('status', 'pending')

    const { data, error, count } = await query
    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    const formattedData = data.map((c: any) => ({
      ...c,
      created_at_formatted: c.created_at ? formatDateTimestamp(c.created_at, 3) : null,
    }))

    return {
      data: formattedData,
      count,
      page: pageNumber,
      pageSize: size,
      totalPages: Math.ceil((count ?? 0) / size),
    }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    let { profile_id, job_id, company_id, job_data, motive_edit } = body

    if (!profile_id || !job_id || !company_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Os ID do usuário, da vaga e da empresa são requeridos',
      })
    }

    // Verifica se já existe edição em pendência igual
    /*
    const { data: existingEdit, error: checkError } = await supabase
      .from('jobs_edit')
      .select('id')
      .eq('job_id', job_id)
      .eq('status', 'pending')
      .maybeSingle()

    if (checkError) {
      throw createError({ statusCode: 500, statusMessage: checkError.message })
    }

    if (existingEdit) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Já existe uma edição pendente para essa vaga',
      })
    }
    */

    // Limpar valores vazios dentro do objeto job_data
    if (job_data && typeof job_data === 'object') {
      job_data = Object.fromEntries(
        Object.entries(job_data).map(([k, v]) => [k, emptyStringToNull(v)])
      )
    }

    const { data, error } = await supabase
      .from('jobs_edit') // aqui imagino que deveria ser jobs_edit
      .insert([
        {
          profile_id,
          company_id,
          job_data,
          job_id,
          motive_edit
        },
      ])
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
