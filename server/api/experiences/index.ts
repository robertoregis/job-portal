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
    const { candidate_id, experience_group_id } = getQuery(event)

    let query = supabase.from('experiences').select('*').order('created_at', { ascending: false })

    if (candidate_id) {
      query = query.eq('candidate_id', candidate_id as string)
    }
    if (experience_group_id) {
      query = query.eq('experience_group_id', experience_group_id as string)
    }

    const { data, error } = await query

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  if (method === 'POST') {
    const body = await readBody(event)
    let { position, start_date, end_date, company_name, description, candidate_id, order, experience_group_id } = body

    if (!candidate_id) {
      throw createError({ statusCode: 400, statusMessage: 'candidate_id is required' })
    }

    // 👇 validação do order
    if (order && Number(order) > 3) {
      throw createError({ statusCode: 400, statusMessage: 'order must be 1, 2 or 3' })
    }

    position = emptyStringToNull(position)
    order = emptyStringToNull(order)
    start_date = emptyStringToNull(start_date)
    end_date = emptyStringToNull(end_date)
    company_name = emptyStringToNull(company_name)
    description = emptyStringToNull(description)

    start_date = toISODate(start_date)
    end_date = toISODate(end_date)

    const { data, error } = await supabase
      .from('experiences')
      .insert([{
        position,
        start_date,
        end_date,
        company_name,
        description,
        candidate_id,
        order,
        experience_group_id
      }])
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }


  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
