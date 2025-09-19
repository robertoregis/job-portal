import supabase from '@/server/utils/supabase'
import { formatDateTimestamp } from '@/composables/formatDate'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const { profile_id, page, pageSize, is_master } = getQuery(event)

    const pageNumber = page ? parseInt(page as string, 10) : 1
    const size = pageSize ? parseInt(pageSize as string, 10) : 10

    const from = (pageNumber - 1) * size
    const to = from + size - 1

    let query = supabase
      .from('notices')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (is_master === 'true' || is_master === true) {
      // pega masters OU não-masters com o mesmo profile_id
      if (profile_id) {
        query = query.or(`is_master.eq.true,and(is_master.eq.false,profile_id.eq.${profile_id})`)
      } else {
        // se não veio profile_id, pega só os masters
        query = query.eq('is_master', true)
      }
    } else {
      // não é master → só filtra pelo profile_id, se vier
      if (profile_id) {
        query = query.eq('profile_id', profile_id as string)
      }
      query = query.eq('is_master', false)
    }

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
      totalPages: Math.ceil((count ?? 0) / size)
    }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    let { title, description, type, profile_id, subtitle, is_master } = body

    if (!profile_id) {
      throw createError({ statusCode: 400, statusMessage: 'profile_id is required' })
    }
    if (!title) {
      throw createError({ statusCode: 400, statusMessage: 'title is required' })
    }
    if (!type) {
      throw createError({ statusCode: 400, statusMessage: 'type is required' })
    }

    let is_master_end = false;
    if(is_master) {
      is_master_end = is_master
    }

    title = emptyStringToNull(title)
    description = emptyStringToNull(description)
    type = emptyStringToNull(type)
    subtitle = emptyStringToNull(subtitle)

    const { data, error } = await supabase
      .from('notices')
      .insert([{ title, description, type, profile_id, subtitle, is_master: is_master_end }])
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }
    return data
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})

