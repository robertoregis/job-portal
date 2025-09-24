import supabase from '@/server/utils/supabase'
import { formatDateTimestamp } from '@/composables/formatDate'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const query = getQuery(event)

    const profile_id = query.profile_id as string | undefined
    const page = query.page as string | undefined
    const pageSize = query.pageSize as string | undefined
    const is_complete = query.is_complete as string | undefined

    const pageNumber = page ? parseInt(page, 10) : 1
    const size = pageSize ? parseInt(pageSize, 10) : 10
    const from = (pageNumber - 1) * size
    const to = from + size - 1

    let queryBuilder = supabase
      .from('candidates')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    // filtro profile_id opcional
    if (profile_id) {
      queryBuilder = queryBuilder.eq('profile_id', profile_id)
    }

    if (is_complete !== undefined) {
      const completeBool = is_complete === 'true'
      queryBuilder = queryBuilder.eq('is_complete', completeBool)
    }

    const { data, error, count } = await queryBuilder

    // contar total sem filtros
    const { count: totalCount, error: totalError } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true }) // head evita trazer os dados, só conta

    if (error || totalError) {
      throw createError({ statusCode: 500, statusMessage: error?.message || totalError?.message })
    }

    const formattedData = data.map((candidate: any) => ({
      ...candidate,
      created_at_formatted: candidate.created_at ? formatDateTimestamp(candidate.created_at, 1) : null,
      updated_at_formatted: candidate.updated_at ? formatDateTimestamp(candidate.updated_at, 1) : null,
      address: `${candidate.city || ''} - ${candidate.state || ''}`.trim().replace(/^-\s*|\s*-\s*$/g, '')
    }))

    return {
      data: formattedData,
      count,        // total com filtros
      totalCount,   // total geral sem filtros
      page: pageNumber,
      pageSize: size,
      totalPages: Math.ceil((count ?? 0) / size)
    }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const {
      name,
      email,
      profile_id,
      phone,
      birth_date,
      cpf,
      state,
      city,
      about,
    } = body

    if (!name || !email || !profile_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name, email and profile_id'
      })
    }

    // Faz a conversão de strings vazias para null nos campos opcionais
    const dataToInsert = {
      name,
      email,
      profile_id,
      phone: emptyStringToNull(phone),
      birth_date: emptyStringToNull(birth_date),
      cpf: emptyStringToNull(cpf),
      state: emptyStringToNull(state),
      city: emptyStringToNull(city),
      about: emptyStringToNull(about),
      image_url: null,
      image_id: null,
      completion_percentage: 5,
      completion_percentage_formatted: `5%`
      // outros campos que desejar aqui
    }

    const { data, error } = await supabase
      .from('candidates')
      .insert([dataToInsert])
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    const { data: dataExperience, error: errorExperience } = await supabase
      .from('experience_group')
      .insert([{ candidate_id: data.id }])
      .select()
      .single()

    if (errorExperience) {
      throw createError({
        statusCode: 500,
        statusMessage: errorExperience.message
      })
    }

    return data
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
