import supabase from '@/server/utils/supabase'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const { candidate_id } = getQuery(event)

    let query = supabase.from('educations').select('*').order('created_at', { ascending: false })

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
    let { course, institution, level, period, notes, candidate_id, candidate_is_complete_educations, candidate_completion_percentage } = body

    if (!candidate_id) {
      throw createError({ statusCode: 400, statusMessage: 'candidate_id is required' })
    }

    // Converte strings vazias para null
    course = emptyStringToNull(course)
    institution = emptyStringToNull(institution)
    level = emptyStringToNull(level)
    period = emptyStringToNull(period)
    notes = emptyStringToNull(notes)

    const { data, error } = await supabase
      .from('educations')
      .insert([{ course, institution, level, period, notes, candidate_id }])
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    if (!candidate_is_complete_educations) {
      const current = Number(candidate_completion_percentage ?? 0)
      const newPct = Math.min(100, current + 10)

      const { error: candidateError } = await supabase
        .from('candidates')
        .update({
          is_complete_educations: true,
          completion_percentage: newPct,
          completion_percentage_formatted: `${newPct}%`,
          is_complete: newPct >= 100
        })
        .eq('id', candidate_id) // sem .select(), sem .single()
    }

    return data
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})


