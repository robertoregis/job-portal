import supabase from '@/server/utils/supabase'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const { profile_id } = getQuery(event)

    let query = supabase.from('carousels_items')
      .select('*')
      .not('image_lg_url', 'is', null) 
      .not('image_sm_url', 'is', null)
      .order('order_index', { ascending: true, nullsFirst: false }) 
      .order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }


  if (method === 'POST') {
    const body = await readBody(event)
    let { title, type, link, video, is_external, profile_id } = body


    // Converte strings vazias para null
    title = emptyStringToNull(title)
    type = emptyStringToNull(type)
    link = emptyStringToNull(link)
    video = emptyStringToNull(video)
    is_external = emptyStringToNull(is_external)
    profile_id = emptyStringToNull(profile_id)

    const { data, error } = await supabase
      .from('carousels_items')
      .insert([{ title, type, link, video, is_external, profile_id }])
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})


