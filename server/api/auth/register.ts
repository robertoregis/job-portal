import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  if (event.req.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  const { name, email, password, type } = await readBody(event)

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  // Cria usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // opcional, para pular confirmação (cuidado)
  })

  if (authError) {
    throw createError({ statusCode: 500, statusMessage: authError.message })
  }

  // Cria perfil na tabela 'profiles'
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: authData.user.id, name, email, type }])
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
