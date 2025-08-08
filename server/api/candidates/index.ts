// server/api/candidates/index.ts
import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'POST') {
    const { name, email, profile_id } = await readBody(event)

    if (!name || !email || !profile_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name, email and profile_id'
      })
    }

    const { data, error } = await supabase
      .from('candidates')
      .insert([{ name, email, profile_id }])
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

