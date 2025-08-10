import supabase from '@/server/utils/supabase'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required'
    })
  }

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Candidate not found'
      })
    }

    if (data.birth_date) {
      // Garantir que está no formato certo
      const parts = data.birth_date.split(/[-/]/) // quebra por - ou /
      if (parts.length === 3) {
        data.birth_date = `${parts[2]}/${parts[1]}/${parts[0]}`
      }
    }

    return data
  }


  if (method === 'PATCH') {
    const body = await readBody(event)
    const updateData: any = {}

    const fields = ['name', 'email', 'cpf', 'states', 'city', 'marital_status', 'phone', 'about'] // campos que podem ser atualizados
    for (const field of fields) {
      if (field in body) {
        updateData[field] = emptyStringToNull(body[field])
      }
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
