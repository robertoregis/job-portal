import supabase from '@/server/utils/supabase'
import { formatDateTimestamp } from '@/composables/formatDate'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID inválido' })
  }

  // Helper para montar retorno final
  async function formatJobEdit(jobEdit: any) {
    if (!jobEdit) return null

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobEdit.job_id)
      .single()

    if (jobError || !job) {
      throw createError({
        statusCode: 404,
        statusMessage: 'A vaga original não foi encontrada'
      })
    }

    return {
      ...jobEdit,
      created_at_formatted: jobEdit.created_at
        ? formatDateTimestamp(jobEdit.created_at, 3)
        : null,
      job
    }
  }

  if (method === 'GET') {
    const { data: jobs_edit, error } = await supabase
      .from('jobs_edit')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !jobs_edit) {
      throw createError({
        statusCode: 404,
        statusMessage: 'A edição da vaga não foi encontrada'
      })
    }

    return await formatJobEdit(jobs_edit)
  }

  if (method === 'PATCH') {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID da edição é obrigatório' })
  }

  try {
    const body = await readBody(event)

    // Campos que podem ser atualizados
    const updateData: any = {}
    if ('status' in body) updateData.status = emptyStringToNull(body.status)
    if ('motive_recusation' in body) updateData.motive_recusation = emptyStringToNull(body.motive_recusation)
    if ('is_closed' in body) updateData.is_closed = body.is_closed

    // Atualiza a edição
    const { data, error } = await supabase
      .from('jobs_edit')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    // Se data vazio, pega registro atual
    const jobEdit = data?.[0] ?? await supabase
      .from('jobs_edit')
      .select('*')
      .eq('id', id)
      .single()

    // Pega o profile_id da empresa
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('profile_id, name, email')
      .eq('id', jobEdit.company_id)
      .single()

    if (companyError) {
      throw new Error(companyError.message)
    }

    return {
      ...jobEdit,
      profile_id: company?.profile_id ?? null,
      name_company: company?.name,
      email: company?.email
}


  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Erro inesperado ao atualizar edição'
    })
  }
}




  if (method === 'DELETE') {
    // Retorna o registro excluído também
    const { data, error } = await supabase
      .from('jobs_edit')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      throw createError({ statusCode: 500, statusMessage: error?.message || 'Erro ao excluir edição' })
    }

    return {
      success: true,
      deleted: data
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
