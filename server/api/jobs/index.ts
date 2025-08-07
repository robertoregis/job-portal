// /server/api/jobs.ts
import supabase from '@/server/utils/supabase'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    // Pegar query param para filtrar por company_id
    const url = new URL(event.req.url!, `http://${event.req.headers.host}`)
    const company_id = url.searchParams.get('company_id')

    let query = supabase.from('jobs').select('*')

    if (company_id) {
      query = query.eq('company_id', company_id)
    }

    const { data, error } = await query

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const {
      position,
      contract_type,
      work_format,
      salary_range,
      workload,
      weekdays,
      education_level,
      description,
      status,
      is_active,
      is_closed,
      benefits,
      company_id,
    } = body

    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          position,
          contract_type,
          work_format,
          salary_range,
          workload,
          weekdays,
          education_level,
          description,
          status,
          is_active,
          is_closed,
          benefits,
          company_id,
        },
      ])
      .select()
      .single()

    if (error) {
        console.log(error)
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  if (method === 'PUT' || method === 'PATCH') {
    const body = await readBody(event)
    const { id, ...fields } = body

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'ID is required for update' })
    }

    const { data, error } = await supabase
      .from('jobs')
      .update(fields)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  if (method === 'DELETE') {
    const url = new URL(event.req.url!, `http://${event.req.headers.host}`)
    const id = url.searchParams.get('id')

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'ID is required for delete' })
    }

    const { data, error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
