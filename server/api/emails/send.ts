import FormData from 'form-data'
import Mailgun from 'mailgun.js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { to, subject, template, variables } = body

  const mailgun = new Mailgun(FormData)
  const mg = mailgun.client({
    username: 'api',
    key: config.MAILGUN_API_KEY,
  })

  if (!config.MAILGUN_API_KEY) {
    throw createError({ statusCode: 500, statusMessage: 'Mailgun API key missing' })
  }

  try {
    const response = await mg.messages.create(config.MAILGUN_DOMAIN, {
      from: `Connect RH One <postmaster@${config.MAILGUN_DOMAIN}>`,
      to,
      subject,
      template, // Nome do template criado no painel do Mailgun
      'h:X-Mailgun-Variables': JSON.stringify(variables), // Variáveis que o template vai usar
    })
    return { message: 'Email enviado com sucesso', response }
  } catch (error: any) {
    console.error('Mailgun error:', error)
    throw createError({ statusCode: 500, statusMessage: `Erro Mailgun: ${error.message}` })
  }
})



