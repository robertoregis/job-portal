import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const method = event.req.method
  const id = event.context.params?.id

  if (method === 'GET') {
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'ID is required' })
    }

    const { data, error }: any = await supabase
    .from('behavioral_profiles')
    .select(`
      id,
      created_at,
      updated_at,
      candidates!inner(
        id,
        name,
        profile_id
      ),
      print_result_url,
      print_result_id
    `)
    .eq('id', id)
    .single()

    if (error || !data) {
      throw createError({ statusCode: 404, statusMessage: 'Questionary not found' })
    }

    return {
      id: data.id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      name_candidate: data.candidates?.name ?? null,
      id_candidate: data.candidates?.id ?? null,
      id_profile_candidate: data.candidates?.profile_id ?? null,
      print_result_url: data.print_result_url,
    }
  }


  if (method === 'PATCH' || method === 'PUT') {
    const body = await readBody(event)
    const { formdata } = body

    if (!formdata || typeof formdata !== 'object') throw createError({ statusCode: 400, statusMessage: 'formdata is required' })

    const { data, error } = await supabase
      .from('behavioral_profiles')
      .update({ ...formdata })
      .eq('id', id)
      .select()
      .single()

    if (error) throw createError({ statusCode: 500, statusMessage: error.message })

    return data
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})


