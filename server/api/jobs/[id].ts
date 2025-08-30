import supabase from '@/server/utils/supabase';
import { formatDateTimestamp } from '@/composables/formatDate';

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  try {
    const method = event.req.method
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'ID is required' })
    }

    if (method === 'GET') {
      // não pegue mais id de getQuery aqui!
      // const { id } = getQuery(event)  <--- remova isso
      const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !job) {
        throw createError({ statusCode: 404, statusMessage: 'Job not found' })
      }

      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('name, image_url')
        .eq('id', job.company_id)
        .single()
      if (companyError) {
        throw createError({ statusCode: 500, statusMessage: companyError.message })
      }

      return {
        ...job,
        created_at_formatted: job.created_at ? formatDateTimestamp(job.created_at, 3) : null,
        updated_at_formatted: job.updated_at ? formatDateTimestamp(job.updated_at, 3) : null,
        company_name: company?.name || null,
        company_image_url: company?.image_url || null,
        address: `${job.city || ''} - ${job.state || ''}`.trim().replace(/^-\s*|\s*-\s*$/g, '')
      }
    }


    if (method === 'PATCH' || method === 'PUT') {
      const body = await readBody(event)

      // Permitir edição completa, incluindo status e flags
      const updateData: any = {}
      const fields = [
        'title',
        'contract_type',
        'work_format',
        'salary',
        'workload',
        'weekdays',
        'education_level',
        'benefits',
        'description',
        'status',
        'icon_status',
        'is_active',
        'is_closed',
        'state',
        'city',
        'benefits_simple',
        'undergraduate_areas_simple',
        'knowledge_simple'
      ]

      for (const field of fields) {
        if (field in body) {
          updateData[field] = emptyStringToNull(body[field])
        }
      }

      const { data, error } = await supabase
        .from('jobs')
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
        .from('jobs')
        .delete()
        .eq('id', id)

      if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
      }

      return { success: true }
    }

    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  } catch(err: any) {
    console.error('Erro no handler de /api/jobs/[id]:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Internal Server Error'
    })
  }
})
