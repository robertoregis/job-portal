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

    const { behavioral_profiles_id } = getQuery(event)

    if (!behavioral_profiles_id) {
      throw createError({ statusCode: 400, statusMessage: 'behavioral_profiles_id is required' })
    }

    const folder = 'candidate/behavioral'

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
    const { error: updateError } = await supabase
      .from('behavioral_profiles')
      .update({
        print_result_id: fileName,
        print_result_url: dataURL.publicUrl
      })
      .eq('id', behavioral_profiles_id)

    if (updateError) {
      throw createError({ statusCode: 500, statusMessage: updateError.message })
    }

    return {
      print_result_id: fileName,
      print_result_url: dataURL.publicUrl
    }
  }

  if (method === 'DELETE') {
    const { print_result_id, behavioral_profiles_id }: any = getQuery(event)

    if (!print_result_id) {
      throw createError({ statusCode: 400, statusMessage: 'print_result_id is required' })
    }

    const bucketName = 'jobportal'

    // Remove do storage
    const { error: removeError } = await supabase.storage
      .from(bucketName)
      .remove([print_result_id])

    if (removeError) {
      throw createError({ statusCode: 500, statusMessage: removeError.message })
    }

    // Limpar campos na tabela se vier behavioral_profiles_id e type
    if (behavioral_profiles_id) {
      const table = 'behavioral_profiles'
      const { error: updateError } = await supabase
        .from(table)
        .update({
          print_result_id: null,
          print_result_url: null
        })
        .eq('id', behavioral_profiles_id)

      if (updateError) {
        throw createError({ statusCode: 500, statusMessage: updateError.message })
      }
    }

    return { message: 'Imagem deleteda' }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})



