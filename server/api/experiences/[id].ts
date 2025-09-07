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
  const id = event.context.params?.id

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw createError({ statusCode: 404, statusMessage: 'Not found' })
    }

    return data
  }

  if (method === 'PUT' || method === 'PATCH') {
    const body = await readBody(event)
    let { position, end_date, start_date, company_name, description } = body
    // Converte strings vazias em null
    position = emptyStringToNull(position)
    company_name = emptyStringToNull(company_name)
    description = emptyStringToNull(description)

    // Converte datas específicas para ISO
    if (start_date) {
      start_date = toISODate(start_date)
    }
    if (end_date) {
      end_date = toISODate(end_date)
    }

    const updateData = { position, end_date, start_date, company_name, description }

    const { data, error } = await supabase
      .from('experiences')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  if (method === 'DELETE') {
    const body = await readBody(event) // funciona mesmo no DELETE
    const { candidate_id, candidate_is_complete_experiences, candidate_completion_percentage } = body

    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    if (candidate_is_complete_experiences) {
      // Verifica se ainda existe alguma education para esse candidato
      const { data: remaining, error: remainingError } = await supabase
        .from('experiences')
        .select('id')
        .eq('candidate_id', candidate_id)

      // Se não tiver mais nenhuma education, diminui 10%
      if (!remaining || remaining.length === 0) {
        const current = Number(candidate_completion_percentage ?? 0)
        const newPct = Math.max(0, current - 10) // nunca menor que 0

        await supabase
          .from('candidates')
          .update({
            is_complete_experiences: false,
            completion_percentage: newPct,
            completion_percentage_formatted: `${newPct}%`,
            is_complete: newPct >= 100
          })
          .eq('id', candidate_id)
      }
    }

    return { success: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
