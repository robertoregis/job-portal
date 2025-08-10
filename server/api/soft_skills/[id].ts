import supabase from '@/server/utils/supabase'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('soft_skills')
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
    let { name, level, notes } = body

    // Converte strings vazias em null
    name = emptyStringToNull(name)
    notes = emptyStringToNull(notes)
    if (typeof level === 'string') {
      level = emptyStringToNull(level)
    }

    const updateData = { name, level, notes }

    const { data, error } = await supabase
      .from('soft_skills')
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
      .from('soft_skills')
      .delete()
      .eq('id', id)

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return { success: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
