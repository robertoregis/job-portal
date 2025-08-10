import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const method = event.req.method
  const id = event.context.params?.id

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw createError({ statusCode: 404, statusMessage: 'Language not found' })
    }

    return data
  }

  if (method === 'DELETE') {
    const { error } = await supabase
      .from('languages')
      .delete()
      .eq('id', id)

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return { success: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
