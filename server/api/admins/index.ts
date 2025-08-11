import supabase from '@/server/utils/supabase'
import { formatDateTimestamp } from '@/composables/formatDate'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const { profile_id } = getQuery(event)
    if (!profile_id) {
      throw createError({ statusCode: 400, statusMessage: 'profile_id is required' })
    }

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('profile_id', profile_id)

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    const formattedData = data.map((admin: any) => ({
      ...admin,
      created_at_formatted: admin.created_at ? formatDateTimestamp(admin.created_at, 3) : null,
      updated_at_formatted: admin.updated_at ? formatDateTimestamp(admin.updated_at, 3) : null,
      address: `${admin.city || ''} - ${admin.state || ''}`.trim().replace(/^-\s*|\s*-\s*$/g, '')
    }))

    return formattedData
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const {
      name,
      email,
      profile_id,
      phone,
      state,
      city,
    } = body

    if (!name || !email || !profile_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name, email and profile_id'
      })
    }

    // Faz a conversão de strings vazias para null nos campos opcionais
    const dataToInsert = {
      name,
      email,
      profile_id,
      phone: emptyStringToNull(phone),
      state: emptyStringToNull(state),
      city: emptyStringToNull(city),
      image_url: null,
      image_id: null
      // outros campos que desejar aqui
    }

    const { data, error } = await supabase
      .from('admins')
      .insert([dataToInsert])
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
