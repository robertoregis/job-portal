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

      let company = null;
    
      // 🌟 CORREÇÃO: SÓ BUSQUE A EMPRESA SE O company_id EXISTIR!
      if (job.company_id) { 
          const { data: companyData, error: companyError } = await supabase
              .from('companies')
              .select('name, image_url')
              .eq('id', job.company_id)
              .single()
              
          if (companyError) {
              // Se der erro, joga 500. Se não encontrar (404), 'company' será null.
              throw createError({ statusCode: 500, statusMessage: companyError.message })
          }

          company = companyData;
      }

      return {
        ...job,
        created_at_formatted: job.created_at ? formatDateTimestamp(job.created_at, 3) : null,
        updated_at_formatted: job.updated_at ? formatDateTimestamp(job.updated_at, 3) : null,
        company_name: company?.name || (job.company_name || null),
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
        'knowledge_simple',
        'knowledge',
        'undergraduate_areas',
        'company_id',
        'is_hidden_name_company',
        'is_hidden_salary'
      ]

      for (const field of fields) {
        if (field in body) {
          updateData[field] = emptyStringToNull(body[field])
        }
      }

      // 🌟 INÍCIO DA VALIDAÇÃO DO company_id 🌟
      const newCompanyId = updateData.company_id;

      // 1. Verificar se o company_id está presente na atualização E não é nulo
      if (newCompanyId) {
          // 2. Tentar buscar a empresa para validar se o UUID existe
          const { data: companyExists, error: companyCheckError } = await supabase
              .from('companies')
              .select('id')
              .eq('id', newCompanyId)
              .maybeSingle(); // Usar maybeSingle é mais rápido, ele retorna null se não encontrar

          // Se houve um erro de conexão/query, lance um 500
          if (companyCheckError) {
              throw createError({ 
                  statusCode: 500, 
                  statusMessage: companyCheckError.message 
              });
          }

          // Se a empresa não foi encontrada (companyExists é null), lance 400
          if (!companyExists) {
              throw createError({
                  statusCode: 400,
                  statusMessage: 'A empresa com o ID fornecido não foi encontrada.'
              });
          }
          // Se a empresa for encontrada, a execução continua normalmente.
      }

      let statusChangedToClosed;
      if(updateData.status && updateData.status === 'Encerrada') {
        updateData.is_closed = true;
        updateData.is_active = false;
        statusChangedToClosed = true;
      } else {
        updateData.is_closed = false;
        //updateData.is_active = true;
        statusChangedToClosed = false;
      }
      

      const { data: job, error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error || !job) {
        throw createError({ statusCode: 500, statusMessage: error?.message || 'Erro ao atualizar vaga' })
      }
      let company: any = null;
      if(job.company_id) {
        // Pega o profile_id da empresa
        const { data: dataCompany, error: companyError } = await supabase
          .from('companies')
          .select('profile_id')
          .eq('id', job.company_id)
          .single()

        if (companyError) {
          throw createError({ statusCode: 500, statusMessage: companyError.message })
        }
        company = dataCompany
      }

      if (statusChangedToClosed) {
        if(company) {
          // 1) Notice para a empresa
          await supabase.from('notices').insert([{
            profile_id: company?.profile_id,
            title: 'Vaga encerrada',
            description: `A vaga "${job.title}" foi encerrada.`,
            type: 'job',
            subtitle: 'Vaga', 
            is_master: false,
          }]);
        }

        // 2) Notices para todos os candidatos que se candidataram
        const { data: candidatures } = await supabase
          .from('candidatures')
          .select('candidate_id')
          .eq('job_id', job.id);

        if (candidatures?.length) {
          const noticesForCandidates = candidatures.map(c => ({
            profile_id: c.candidate_id,  // aqui usamos profile_id = candidate_id
            title: 'Vaga encerrada',
            description: `A vaga "${job.title}" para a qual você se candidatou foi encerrada.`,
            type: 'job',
            subtitle: 'Vaga', 
            is_master: false,
          }));

          // Insere em batch
          await supabase.from('notices').insert(noticesForCandidates);
        }
      }

      return {
        ...job,
        profile_id: company?.profile_id ?? null
      }
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
