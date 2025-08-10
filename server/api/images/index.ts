import supabase from '@/server/utils/supabase'
import sharp from 'sharp'

function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'POST') {
    const parts: any = await readMultipartFormData(event)
    const filePart = parts.find((p: any) => p.name === 'file')

    if (!filePart || !filePart.data) {
      throw createError({ statusCode: 400, statusMessage: 'File is required' })
    }

    // Limitar tamanho máximo do arquivo antes de compressão (2MB)
    const maxFileSize = 2 * 1024 * 1024
    if (filePart.data.byteLength > maxFileSize) {
      throw createError({ statusCode: 400, statusMessage: 'File size exceeds 2MB limit' })
    }

    const { profile_id, type } = getQuery(event)

    if (!profile_id) {
      throw createError({ statusCode: 400, statusMessage: 'profile_id is required' })
    }

    if (type !== 'company' && type !== 'candidate') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid type. Must be "company" or "candidate"' })
    }

    const folder = type === 'company' ? 'company' : 'candidate'

    // Comprimir a imagem com sharp
    let compressedBuffer
    try {
      compressedBuffer = await sharp(filePart.data)
        .resize({ width: 800 })      // largura máxima 800px (mantém proporção)
        .jpeg({ quality: 80 })       // converte para jpeg com qualidade 80%
        .toBuffer()
    } catch (e) {
      throw createError({ statusCode: 500, statusMessage: 'Error compressing image' })
    }

    // Gerar nome único para arquivo, forçando extensão .jpg
    const timestamp = Date.now()
    const fileName = `${folder}/${timestamp}_${filePart.filename.replace(/\.[^/.]+$/, '.jpg')}`
    const bucketName = 'jobportal' // ajuste conforme seu bucket

    // Upload da imagem comprimida
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, compressedBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg'
      })

    if (uploadError) {
      throw createError({ statusCode: 500, statusMessage: uploadError.message })
    }

    // Gerar URL pública
    const { data: dataURL } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    // Atualizar tabela
    const table = type === 'company' ? 'companies' : 'candidates'
    const { error: updateError } = await supabase
      .from(table)
      .update({
        image_id: fileName,
        image_url: dataURL.publicUrl
      })
      .eq('profile_id', profile_id)

    if (updateError) {
      throw createError({ statusCode: 500, statusMessage: updateError.message })
    }

    return {
      image_id: fileName,
      image_url: dataURL.publicUrl
    }
  }

  if (method === 'DELETE') {
    const { image_id, profile_id, type }: any = getQuery(event)

    if (!image_id) {
      throw createError({ statusCode: 400, statusMessage: 'image_id is required' })
    }

    if (type && type !== 'company' && type !== 'candidate') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid type. Must be "company" or "candidate"' })
    }

    const bucketName = 'jobportal'

    // Remove do storage
    const { error: removeError } = await supabase.storage
      .from(bucketName)
      .remove([image_id])

    if (removeError) {
      throw createError({ statusCode: 500, statusMessage: removeError.message })
    }

    // Limpar campos na tabela se vier profile_id e type
    if (profile_id && type) {
      const table = type === 'company' ? 'companies' : 'candidates'
      const { error: updateError } = await supabase
        .from(table)
        .update({
          image_id: null,
          image_url: null
        })
        .eq('profile_id', profile_id)

      if (updateError) {
        throw createError({ statusCode: 500, statusMessage: updateError.message })
      }
    }

    return { message: 'Image deleted' }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})


