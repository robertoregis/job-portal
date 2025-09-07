import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const method = event.req.method
  const id = event.context.params?.id

  if (method === 'GET') {
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'ID is required' })
    }

    const { data, error } = await supabase
      .from('behavioral_profiles')
      .select(`
        created_at,
        updated_at,
        candidate: candidates!inner(id, name, profile_id),
        number_1,
        number_2,
        number_3,
        number_4,
        number_5,
        number_6,
        number_7,
        number_8,
        number_9,
        number_10,
        number_11,
        number_12,
        number_13,
        number_14,
        number_15,
        number_16,
        number_17,
        number_18,
        number_19,
        number_20,
        number_21,
        number_22,
        number_23,
        number_24,
        number_25,
        number_26,
        number_27,
        number_28,
        number_29,
        number_30,
        number_31,
        number_32,
        number_33,
        number_34,
        number_35,
        number_36,
        number_37,
        number_38,
        number_39,
        number_40
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      throw createError({ statusCode: 404, statusMessage: 'Questionary not found' })
    }

    // Reorganiza o objeto para retornar só o que você quer
    const form_data = Object.fromEntries(
      Object.entries(data).filter(([key]) => key.startsWith('number_'))
    );

    return {
      created_at: data.created_at,
      updated_at: data.updated_at,
      name_candidate: (data.candidate as any)?.name ?? null,
      id_candidate: (data.candidate as any)?.id ?? null,
      id_profile_candidate: (data.candidate as any)?.profile_id ?? null,
      form_data
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


