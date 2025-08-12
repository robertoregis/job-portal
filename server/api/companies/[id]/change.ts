import supabase from '@/server/utils/supabase'
import { formatDateTimestamp } from '@/composables/formatDate'

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

  if (method === 'PATCH') {
    const body = await readBody(event)
    const updateData: any = {}

    const fields = [
      'is_approved',
      // 'approved_at', // vamos controlar aprovado_at internamente
    ]

    for (const field of fields) {
      if (field in body) {
        updateData[field] = emptyStringToNull(body[field])
      }
    }

    // Lógica para ajustar approved_at automaticamente:
    if ('is_approved' in updateData) {
      if (updateData.is_approved === true || updateData.is_approved === 'true') {
        updateData.approved_at = new Date().toISOString()
      } else {
        updateData.approved_at = null
      }
    }

    const { data, error } = await supabase
      .from('companies')
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
