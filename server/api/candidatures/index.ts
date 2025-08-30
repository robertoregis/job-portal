import supabase from '@/server/utils/supabase'
import { formatDateTimestamp } from '@/composables/formatDate'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const { candidate_id, job_id, status, page, pageSize } = getQuery(event)

    const pageNumber = page ? parseInt(page as string, 10) : 1
    const size = pageSize ? parseInt(pageSize as string, 10) : 10

    const from = (pageNumber - 1) * size
    const to = from + size - 1

    let query = supabase
      .from('candidatures')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (candidate_id) query = query.eq('candidate_id', candidate_id as string)
    if (job_id) query = query.eq('job_id', job_id as string)
    if (status) query = query.eq('status', status as string)
    query.eq('is_active', true)
    const { data, error, count }: any = await query
    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    // Buscar dados dos candidatos
    const candidateIds = [...new Set(data.map((c: any) => c.candidate_id))]
    const { data: candidatesData, error: candidateError } = await supabase
      .from('candidates')
      .select('id, name, image_url, marital_status, birth_date')
      .in('id', candidateIds)

    if (candidateError) {
      throw createError({ statusCode: 500, statusMessage: candidateError.message })
    }

    const candidateMap = candidatesData.reduce((acc: any, candidate: any) => {
      acc[candidate.id] = {
        name: candidate.name,
        image_url: candidate.image_url,
        marital_status: candidate.marital_status,
        birth_date: candidate.birth_date
      }
      return acc
    }, {})

    // Buscar dados das vagas
    const jobIds = [...new Set(data.map((c: any) => c.job_id))]
    const { data: jobsData, error: jobError } = await supabase
      .from('jobs')
      .select('id, contract_type, salary, work_format')
      .in('id', jobIds)

    if (jobError) {
      throw createError({ statusCode: 500, statusMessage: jobError.message })
    }

    const jobMap = jobsData.reduce((acc: any, job: any) => {
      acc[job.id] = {
        contract_type: job.contract_type,
        salary: job.salary,
        work_format: job.work_format
      }
      return acc
    }, {})

    const formattedData = data.map((c: any) => ({
      ...c,
      created_at_formatted: c.created_at ? formatDateTimestamp(c.created_at, 3) : null,
      candidate_name: candidateMap[c.candidate_id]?.name || null,
      candidate_image_url: candidateMap[c.candidate_id]?.image_url || null,
      candidate_marital_status: candidateMap[c.candidate_id]?.marital_status || null,
      candidate_birth_date: candidateMap[c.candidate_id]?.birth_date || null,
      contract_type: jobMap[c.job_id]?.contract_type || null,
      salary: jobMap[c.job_id]?.salary || null,
      work_format: jobMap[c.job_id]?.work_format || null
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
    let { state, city, job_id, candidate_id, status, icon_status, title } = body

    if (!candidate_id || !job_id) {
      throw createError({ statusCode: 400, statusMessage: 'candidate_id and job_id are required' })
    }

    // Verifica se já existe candidatura igual
    const { data: existingCandidature, error: checkError } = await supabase
      .from('candidatures')
      .select('id')
      .eq('candidate_id', candidate_id)
      .eq('job_id', job_id)
      .maybeSingle()

    if (checkError) {
      throw createError({ statusCode: 500, statusMessage: checkError.message })
    }

    if (existingCandidature) {
      throw createError({ statusCode: 409, statusMessage: 'Você já se candidatou a essa vaga' })
    }

    title = emptyStringToNull(title)
    state = emptyStringToNull(state)
    city = emptyStringToNull(city)
    status = emptyStringToNull(status) || 'Enviada'
    icon_status = emptyStringToNull(icon_status) || 'mdi-send'

    const { data, error } = await supabase
      .from('candidatures')
      .insert([{
        state,
        city,
        job_id,
        candidate_id,
        status,
        icon_status,
        title
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
