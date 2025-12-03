import supabase from '@/server/utils/supabase'
import { formatDateTimestamp } from '@/composables/formatDate'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const { candidate_id, page, pageSize, is_all } = getQuery(event)

    if (!candidate_id) {
      throw createError({ statusCode: 400, statusMessage: 'candidate_id is required' })
    }

    const pageNumber = page ? parseInt(page as string, 10) : 1
    const size = pageSize ? parseInt(pageSize as string, 10) : 10
    const from = (pageNumber - 1) * size
    const to = from + size - 1

    let query = supabase
      .from('feedbacks')
      .select(`
        *,
        job_direct:jobs(title),
        candidatures (
          candidate_id,
          job:jobs(title)
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (is_all === 'true') {
      query = query.eq('candidate_id', candidate_id)

    } else {
      // Busca Vinculada (Padrão / Página da Candidatura)
      
      query = query
        .not('candidature_id', 'is', null)       // Garante que não é avulso
        .eq('candidatures.candidate_id', candidate_id)
    }

    const { data, count, error } = await query

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    const formattedData = data.map((fb: any) => {
      const titleViaCandidature = fb.candidatures?.job?.title 
      const titleViaDirectJob = fb.job_direct?.title
      const rawJobTitle = titleViaCandidature || titleViaDirectJob

      const isLinked = !!fb.candidature_id;
      // 2. Define o prefixo do título de exibição (se é avulso e/ou nome da vaga)
      let displayTitlePrefix: string;
      if (rawJobTitle) {
          // Tem um nome de vaga.
          if (isLinked) {
              // Caso 1: Parecer Vinculado (Ex: Auxiliar)
              displayTitlePrefix = rawJobTitle;
          } else {
              // Caso 2: Parecer Avulso COM Vaga (Ex: Auxiliar - Avulso)
              displayTitlePrefix = `${rawJobTitle} - Avulso`;
          }
      } else {
          // Caso 2: Avulso sem vaga
          displayTitlePrefix = 'Parecer Avulso'
      }

      // 3. Constrói o título principal (combinando prefixo e data)
      const finalDisplayTitle = `${displayTitlePrefix} - ${formatDateTimestamp(fb.created_at, 1)}`;
      
      // O ID do candidato pode vir da relação ou do próprio feedback
      const realCandidateId = fb.candidatures?.candidate_id || fb.candidate_id

      return {
        ...fb,
        title: finalDisplayTitle,
        job_title: rawJobTitle || null,
        candidate_id: realCandidateId,
        // Flag útil para o front-end saber se pinta de cor diferente, etc.
        is_standalone: !fb.candidature_id,
        created_at_formatted: fb.created_at ? formatDateTimestamp(fb.created_at, 3) : null,
      }
    })

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
    let { content, candidature_id, candidate_id, job_id } = body

    if (!candidate_id) {
      throw createError({ statusCode: 400, statusMessage: 'candidate_id is required' })
    }

    if (!content) {
      throw createError({ statusCode: 400, statusMessage: 'content is required' })
    }

    if(candidature_id) {
      // Checa se já existe um parecer para essa candidatura
      const { data: existing, error: checkError } = await supabase
        .from('feedbacks')
        .select('id')
        .eq('candidature_id', candidature_id)

      if (checkError) {
        throw createError({ statusCode: 500, statusMessage: checkError.message })
      }

      if (existing && existing.length > 0) {
        throw createError({ statusCode: 400, statusMessage: 'Já existe um parecer para esta candidatura.' })
      }
    }
    

    content = emptyStringToNull(content)
    let bodyFeedback: any = {
      content: content,
      candidate_id: candidate_id
    }
    if(candidature_id) {
      bodyFeedback.candidature_id = candidature_id
    }
    if(job_id) {
      bodyFeedback.job_id = job_id
    }
    const { data, error } = await supabase
      .from('feedbacks')
      .insert([bodyFeedback])
      .select()
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
