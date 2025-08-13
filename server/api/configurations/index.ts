import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const query = getQuery(event)
    const company_id = query.company_id as string | undefined

    if (!company_id) {
      throw createError({ statusCode: 400, statusMessage: 'company_id is required' })
    }

    // Busca a configuração
    const { data: configData, error: configError } = await supabase
      .from('configurations')
      .select('*')
      .eq('company_id', company_id)
      .single()

    if (configError) {
      throw createError({ statusCode: 500, statusMessage: configError.message })
    }

    // Busca o email da empresa
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('email, name')
      .eq('id', company_id)
      .single()

    if (companyError) {
      throw createError({ statusCode: 500, statusMessage: companyError.message })
    }

    // Junta os dados e retorna
    return {
      ...configData,
      company_email: companyData?.email || null,
      company_name: companyData?.name || null
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})

