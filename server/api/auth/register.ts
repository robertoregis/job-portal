import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  if (event.req.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  const { name, email, password, type } = await readBody(event)

  if (!name || !email || !password || !type) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  // Cria usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    throw createError({ statusCode: 500, statusMessage: authError.message })
  }

  // Cria perfil na tabela 'profiles'
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert([{ id: authData.user.id, name, email, type }])
    .select()
    .single()

  if (profileError) {
    throw createError({ statusCode: 500, statusMessage: profileError.message })
  }

  // Dependendo do tipo, cria um registro em companies ou candidates
  if (type === 'company') {
    const { error: companyError } = await supabase
      .from('companies')
      .insert([{ name, email, profile_id: profile.id }])

    if (companyError) {
      throw createError({ statusCode: 500, statusMessage: companyError.message })
    }
  } 
  else if (type === 'candidate') {
    const { error: candidateError } = await supabase
      .from('candidates')
      .insert([{ name, email, profile_id: profile.id }])

    if (candidateError) {
      throw createError({ statusCode: 500, statusMessage: candidateError.message })
    }
  }

  return profile
})

