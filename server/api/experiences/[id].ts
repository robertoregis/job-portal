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

    // Converte "" para null em todos os campos
    let updateData = Object.fromEntries(
      Object.entries(body).map(([key, val]) => [key, emptyStringToNull(val)])
    )

    // Converte datas específicas para ISO
    if ('start_date' in updateData) {
      updateData.start_date = toISODate(updateData.start_date)
    }
    if ('end_date' in updateData) {
      updateData.end_date = toISODate(updateData.end_date)
    }

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
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return { success: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
