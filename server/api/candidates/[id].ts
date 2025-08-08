// server/api/candidates/[id].ts
import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const method = event.req.method
  const id = getRouterParam(event, 'id')

  if (method === 'PATCH') {
    const { email, profile_id, ...updateData } = await readBody(event)

    // Garante que email e profile_id não sejam alterados
    if (email || profile_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and profile_id cannot be updated'
      })
    }

    const { data, error } = await supabase
      .from('candidates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    return data
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
