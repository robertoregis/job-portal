import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const method = event.req.method
  const id = event.context.params?.id

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('educations')
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

    const { data, error } = await supabase
      .from('educations')
      .update(body)
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
      .from('educations')
      .delete()
      .eq('id', id)

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return { success: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
