// server/api/candidatures/check-exists.ts

import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // Apenas aceita GET para pesquisa
  if (event.req.method !== 'GET') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  const { candidate_id, job_id } = getQuery(event)

  if (!candidate_id || !job_id) {
    throw createError({ statusCode: 400, statusMessage: 'candidate_id and job_id are required' })
  }

  // 1. Pesquisa no Supabase
  const { data, error } = await supabase
    .from('candidatures')
    .select('id') // Selecionar apenas o ID para ser mais leve
    .eq('candidate_id', candidate_id as string)
    .eq('job_id', job_id as string)
    .maybeSingle() // Busca no máximo um resultado

  if (error) {
    // Trata erros de comunicação com o DB
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  // 2. Retorna o resultado
  // Se 'data' não for nulo, a candidatura existe.
  return {
    exists: !!data, // true ou false
    candidature_id: data?.id || null // Opcional: retorna o ID se existir
  }
})