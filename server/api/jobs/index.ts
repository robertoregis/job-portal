import supabase from '@/server/utils/supabase'
import { formatDateTimestamp } from '@/composables/formatDate'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const { company_id, status, is_active, page, pageSize, state, createdWithinDays, createdMoreThanDays } = getQuery(event)

    const pageNumber = page ? parseInt(page as string, 10) : 1
    const size = pageSize ? parseInt(pageSize as string, 10) : 10

    const from = (pageNumber - 1) * size
    const to = from + size - 1

    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (company_id) {
      query = query.eq('company_id', company_id as string)
    }

    if (status) {
      query = query.eq('status', status as string)
    }

    if (typeof is_active !== 'undefined') {
      query = query.eq('is_active', is_active === 'true')
    }

    if (state) {
      // Se a vaga tiver campo "state" ou "location", adapte aqui:
      query = query.ilike('state', `%${state}%`) // ou eq() se for valor exato
    }

    if (createdWithinDays) {
      // Pega data limite no passado
      const days = parseInt(createdWithinDays as string, 10)
      const dateLimit = new Date()
      dateLimit.setDate(dateLimit.getDate() - days)
      query = query.gte('created_at', dateLimit.toISOString())
    }

    if (createdMoreThanDays) {
      const days = parseInt(createdMoreThanDays as string, 10)
      const dateLimit = new Date()
      dateLimit.setDate(dateLimit.getDate() - days)
      query = query.lt('created_at', dateLimit.toISOString())
    }

    const { data, error, count }: any = await query

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    // Busca imagens das empresas relacionadas
    const companyIds = [...new Set(data.map((job: any) => job.company_id))]

    const { data: companiesData, error: companyError } = await supabase
      .from('companies')
      .select('id, name, image_url')
      .in('id', companyIds)

    if (companyError) {
      throw createError({ statusCode: 500, statusMessage: companyError.message })
    }

    const companyMap = companiesData.reduce((acc: any, company: any) => {
      acc[company.id] = {
        name: company.name,
        image_url: company.image_url
      }
      return acc
    }, {})

    const formattedData = data.map((job: any) => ({
      ...job,
      created_at_formatted: job.created_at ? formatDateTimestamp(job.created_at, 3) : null,
      updated_at_formatted: job.updated_at ? formatDateTimestamp(job.updated_at, 3) : null,
      company_image_url: companyMap[job.company_id]?.image_url || null,
      company_name: companyMap[job.company_id]?.name || null,
      address: `${job.city || ''} - ${job.state || ''}`.trim().replace(/^-\s*|\s*-\s*$/g, '')
    }))

    return {
      data: formattedData,
      count,
      page: pageNumber,
      pageSize: size,
      totalPages: Math.ceil(count / size)
    }
  }



  if (method === 'POST') {
    const body = await readBody(event)
    let {
      title,
      contract_type,
      work_format,
      salary,
      workload,
      weekdays,
      education_level,
      benefits,
      description,
      status,
      icon_status,
      is_active,
      is_closed,
      benefits_simple,
      undergraduate_areas,
      undergraduate_areas_simple,
      knowledge,
      knowledge_simple,
      state,
      city,
      company_id
    } = body

    if (!company_id) {
      throw createError({ statusCode: 400, statusMessage: 'company_id is required' })
    }

    // Tratando strings vazias
    title = emptyStringToNull(title)
    contract_type = emptyStringToNull(contract_type)
    work_format = emptyStringToNull(work_format)
    salary = emptyStringToNull(salary)
    workload = emptyStringToNull(workload)
    education_level = emptyStringToNull(education_level)
    benefits_simple = emptyStringToNull(benefits_simple)
    description = emptyStringToNull(description)
    status = emptyStringToNull(status)
    icon_status = emptyStringToNull(icon_status)
    state = emptyStringToNull(state)
    city = emptyStringToNull(city)
    knowledge_simple = emptyStringToNull(knowledge_simple)
    undergraduate_areas_simple = emptyStringToNull(undergraduate_areas_simple)

    // weekdays pode ser array, não transforma

    // Define defaults caso campos não sejam enviados
    if (status === null) status = 'Aberta para inscrição'
    if (icon_status === null) icon_status = 'mdi-briefcase-plus'
    if (is_active === undefined) is_active = false
    if (is_closed === undefined) is_closed = false

    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        title,
        contract_type,
        work_format,
        salary,
        workload,
        weekdays,
        education_level,
        benefits,
        benefits_simple,
        undergraduate_areas,
        undergraduate_areas_simple,
        knowledge,
        knowledge_simple,
        description,
        status,
        icon_status,
        is_active,
        is_closed,
        state,
        city,
        company_id
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

