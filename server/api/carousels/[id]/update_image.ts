import supabase from '@/server/utils/supabase';
import sharp from 'sharp';
import { readBody, readMultipartFormData, createError, defineEventHandler } from 'h3';

// Função auxiliar para converter string vazia em null (padrão Supabase/Postgres)
function emptyStringToNull(value: any) {
  return value === '' ? null : value
}

const BUCKET_NAME = 'jobportal';
const FOLDER_NAME = 'carousels';
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export default defineEventHandler(async (event) => {
  const method = event.req.method;
  const id = event.context.params?.id;

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' });
  }

  const itemId = parseInt(id);
  if (isNaN(itemId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID format' });
  }

  // --- MÉTODOS PUT / PATCH (UPLOAD E ATUALIZAÇÃO) ---
  if (method === 'PUT' || method === 'PATCH') {
    const parts: any = await readMultipartFormData(event);
    
    const filePart = parts.find((p: any) => p.name === 'file');
    
    // 2. CONSTRUIR O updateData A PARTIR DOS CAMPOS DE TEXTO EM 'parts'
    const updateData: Record<string, string | null> = {};
    
    for (const part of parts) {
        // Se o campo não for o arquivo, tratamos como campo de texto
        if (part.name !== 'file' && part.data) {
            // Converte o Buffer de volta para string
            const value = part.data.toString('utf8'); 
            
            // Aplica a lógica de emptyStringToNull e armazena
            updateData[part.name] = emptyStringToNull(value);
        }
    }

    const type = updateData.type as 'lg' | 'sm';
    
    // 🛡️ Validação de Entrada
    if (!filePart || !filePart.data) {
      throw createError({ statusCode: 400, statusMessage: 'O arquivo é obrigatório' });
    }
    if (filePart.data.byteLength > MAX_FILE_SIZE) {
      throw createError({ statusCode: 400, statusMessage: 'O arquivo excedeu o máximo de 4MB' });
    }
    if (type !== 'lg' && type !== 'sm') {
      throw createError({ statusCode: 400, statusMessage: 'O tipo precisa ser "lg" ou "sm"' });
    }

    // --- LÓGICA DE BUSCA DO ARQUIVO ANTIGO ---
    const oldIdColumn = type === 'lg' ? 'image_lg_id' : 'image_sm_id';
    
    // Busca o ID do arquivo antigo no banco ANTES de qualquer upload
    const { data: oldData } = await supabase
      .from('carousels')
      .select(oldIdColumn)
      .eq('id', itemId)
      .single();
      
    const oldImageId = (oldData as any)?.[oldIdColumn];

    // --- OTIMIZAÇÃO E UPLOAD DA NOVA IMAGEM ---
    const resizeWidth = type === 'lg' ? 3600 : 1200;
    let compressedBuffer: Buffer;
    
    try {
      compressedBuffer = await sharp(filePart.data)
        .resize({ width: resizeWidth, withoutEnlargement: true }) // Redimensiona de forma inteligente
        .jpeg({ quality: 80 })
        .toBuffer();
    } catch (e) {
      console.error('Erro ao comprimir imagem:', e);
      throw createError({ statusCode: 500, statusMessage: 'Error compressing image' });
    }

    const timestamp = Date.now();
    const fileName = `${FOLDER_NAME}/${type}/${timestamp}_${filePart.filename.replace(/\.[^/.]+$/, '.jpg')}`;
    
    // Upload da imagem comprimida
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, compressedBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg',
      });
      
    if (uploadError) {
      throw createError({ statusCode: 500, statusMessage: `Upload error: ${uploadError.message}` });
    }

    // Gerar URL pública
    const { data: dataURL } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    // --- ATUALIZAÇÃO NO BANCO DE DADOS ---
    const updateObject = {
      [`image_${type}_url`]: dataURL.publicUrl,
      [`image_${type}_id`]: fileName
    };
    
    const { error: updateError } = await supabase
      .from('carousels')
      .update(updateObject)
      .eq('id', itemId);

    if (updateError) {
      throw createError({ statusCode: 500, statusMessage: `Database update error: ${updateError.message}` });
    }

    // --- REMOÇÃO DO ARQUIVO ANTIGO (PÓS-SUCESSO) ---
    if (oldImageId) {
      const { error: removeError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([oldImageId]);

      if (removeError) {
        // Apenas logar. O novo arquivo foi salvo, o erro não é fatal para o usuário.
        console.error('Erro ao remover arquivo antigo:', removeError.message);
      }
    }

    return { success: true };
  }

  // --- MÉTODO DELETE (REMOÇÃO DO ARQUIVO E URL) ---
  if (method === 'DELETE') {
    const body = await readBody(event);
    const updateData = Object.fromEntries(
        Object.entries(body).map(([key, val]) => [key, emptyStringToNull(val)])
    );
    const type = updateData.type as 'lg' | 'sm';
    const imageIdToRemove = updateData.image_id as string;
    
    if (type !== 'lg' && type !== 'sm') {
      throw createError({ statusCode: 400, statusMessage: 'O tipo é obrigatório para remover' });
    }

    if(imageIdToRemove) {
      const { error: removeError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([imageIdToRemove]);

      if (removeError) {
        throw createError({ statusCode: 500, statusMessage: `Storage removal error: ${removeError.message}` });
      }
    }

    const updateObject = {
      [`image_${type}_url`]: null,
      [`image_${type}_id`]: null
    };

    const { error: updateError } = await supabase
      .from('carousels')
      .update(updateObject)
      .eq('id', itemId);

    if (updateError) {
      throw createError({ statusCode: 500, statusMessage: `Database cleanup error: ${updateError.message}` });
    }

    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});