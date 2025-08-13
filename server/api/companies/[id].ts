import supabase from '@/server/utils/supabase'
import { formatDateTimestamp } from '@/composables/formatDate'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

function toISODate(value: any) {
  if (!value) return null;

  // Trata string no formato DD/MM/YYYY
  if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split('/');
    // Garante que mês e dia tenham 2 dígitos
    const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().substring(0, 10);
  }

  // Caso já seja uma data em formato ISO ou outro formato reconhecido
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().substring(0, 10);
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
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Company not found'
      })
    }

    return {
      ...data,
      created_at_formatted: data.created_at ? formatDateTimestamp(data.created_at, 3) : null,
      updated_at_formatted: data.updated_at ? formatDateTimestamp(data.updated_at, 3) : null,
      address: `${data.city || ''} - ${data.state || ''}`.trim().replace(/^-\s*|\s*-\s*$/g, '')
    }
  }

  if (method === 'PATCH') {
    const body = await readBody(event)
    const updateData: any = {}

    const fields = [
      'name',
      'cnpj',
      'legal_name',
      'representative_cpf',
      'representative_email',
      'representative_name',
      'state',
      'city',
      'email',
      'phone',
      'about',
      'foundation_at',
      'instagram',
      'site',
      'linkedin',
      'is_confirmation',
      'code_confirmation'
    ]

    for (const field of fields) {
      if (field in body) {
        updateData[field] = emptyStringToNull(body[field])
      }
    }

    if ('foundation_at' in updateData) {
      updateData.foundation_at = toISODate(updateData.foundation_at)
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
