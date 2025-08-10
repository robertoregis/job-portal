import supabase from '@/server/utils/supabase'
import { formatDateTimestamp } from '@/composables/formatDate'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  if (method === 'GET') {
    const { data: candidature, error } = await supabase
      .from('candidatures')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !candidature) {
      throw createError({ statusCode: 404, statusMessage: 'Candidature not found' })
    }

    // Buscar dados do candidato
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id, name, image_url')
      .eq('id', candidature.candidate_id)
      .single()

    if (candidateError) {
      throw createError({ statusCode: 500, statusMessage: candidateError.message })
    }

    return {
      ...candidature,
      created_at_formatted: candidature.created_at
        ? formatDateTimestamp(candidature.created_at, 3)
        : null,
      candidate_name: candidate?.name || null,
      candidate_image_url: candidate?.image_url || null,
      address: `${candidature?.city || ''} - ${candidature?.state || ''}`.trim().replace(/^-\s*|\s*-\s*$/g, '')
    }
  }

  if (method === 'PATCH') {
    const body = await readBody(event)

    // Converte valores vazios para null
    const updateData = Object.fromEntries(
      Object.entries(body).map(([key, value]) => [key, emptyStringToNull(value)])
    )

    const { data, error } = await supabase
      .from('candidatures')
      .update(updateData)
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
      .from('candidatures')
      .delete()
      .eq('id', id)

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return { success: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
