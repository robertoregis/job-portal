import supabase from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
    const method = event.req.method;

    if (method !== 'PUT') {
        throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
    }

    // 2. Recebe o array da nova ordem: [{ id: 1, order_index: 2 }, ...]
    const newOrderArray = await readBody(event);

    if (!Array.isArray(newOrderArray) || newOrderArray.length === 0) {
        throw createError({ statusCode: 400, statusMessage: 'Os dados estão inválidos, não são um array.' });
    }
    const { error } = await supabase.rpc('update_carousel_orders', {
        new_order_data: newOrderArray,
    });

    if (error) {
        console.error('Supabase RPC Error:', error); 
        throw createError({ 
            statusCode: 500, 
            statusMessage: 'Failed to update order in database.' 
        });
    }

    return { success: true, message: 'Atualizado a ordem dos itens do carrossel' };
});