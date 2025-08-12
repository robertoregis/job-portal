import supabase from '@/server/utils/supabase'
import { formatDateTimestamp } from '@/composables/formatDate'

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const query = getQuery(event)
    
    const profile_id = query.profile_id as string | undefined
    const is_approved = query.is_approved as string | undefined
    const status = query.status as string | undefined
    const page = query.page as string | undefined
    const pageSize = query.pageSize as string | undefined

    const pageNumber = page ? parseInt(page, 10) : 1
    const size = pageSize ? parseInt(pageSize, 10) : 10
    const from = (pageNumber - 1) * size
    const to = from + size - 1

    let queryBuilder = supabase
      .from('companies')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    // filtro profile_id opcional
    if (profile_id) {
      queryBuilder = queryBuilder.eq('profile_id', profile_id)
    }

    if (is_approved !== undefined) {
      const approvedBool = is_approved === 'true'
      queryBuilder = queryBuilder.eq('is_approved', approvedBool)
    }

    if (status) {
      queryBuilder = queryBuilder.eq('status', status)
    }

    const { data, error, count } = await queryBuilder

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    const formattedData = data.map((company: any) => ({
      ...company,
      created_at_formatted: company.created_at ? formatDateTimestamp(company.created_at, 3) : null,
      updated_at_formatted: company.updated_at ? formatDateTimestamp(company.updated_at, 3) : null,
      approved_at_formatted: company.approved_at ? formatDateTimestamp(company.approved_at, 3) : null,
      address: `${company.city || ''} - ${company.state || ''}`.trim().replace(/^-\s*|\s*-\s*$/g, '')
    }))

    return {
      data: formattedData,
      count,
      page: pageNumber,
      pageSize: size,
      totalPages: Math.ceil((count ?? 0) / size)
    }
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
        image_id: null,
        status: 'Esperando',
        approved_at: null,
        is_approved: false
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
