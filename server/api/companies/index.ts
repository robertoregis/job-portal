import supabase from '@/server/utils/supabase'
import { formatDateTimestamp } from '@/composables/formatDate'

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const { profile_id } = getQuery(event)
    if (!profile_id) {
      throw createError({ statusCode: 400, statusMessage: 'profile_id is required' })
    }

    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('profile_id', profile_id)

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    const formattedData = data.map((company: any) => ({
      ...company,
      created_at_formatted: company.created_at ? formatDateTimestamp(company.created_at, 3) : null,
      updated_at_formatted: company.updated_at ? formatDateTimestamp(company.updated_at, 3) : null,
      address: `${company.city || ''} - ${company.state || ''}`.trim().replace(/^-\s*|\s*-\s*$/g, '')
    }))

    return formattedData
  }


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
        profile_id,
        image_url: null,
        image_id: null
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
