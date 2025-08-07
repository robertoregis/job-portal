// server/api/companies.ts
import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'POST') {
    const body = await readBody(event)
    const {
      name,
      cnpj,
      legal_name,
      representative_cpf,
      representative_email,
      representative_name,
      state,
      city,
      profile_id
    } = body

    if (!name || !profile_id) {
      throw createError({ statusCode: 400, statusMessage: 'Missing required fields: name and profile_id' })
    }

    const { data, error } = await supabase
      .from('companies')
      .insert([{
        name,
        cnpj,
        legal_name,
        representative_cpf,
        representative_email,
        representative_name,
        state,
        city,
        profile_id
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
