import { getImageDimensions } from './image';

const REQUIRED_DIMENSIONS = {
  sm: { 
    width: 1200, 
    height: 900,
    ratio: 4 / 3,
    label: 'Mobile (4:3)'
  },
  lg: { 
    width: 3600, 
    height: 1440,
    ratio: 5 / 2,
    label: 'Desktop (5:2)'
  },
};

export async function validateImageDimensions(file: File, type: 'sm' | 'lg'): Promise<boolean> {
  const required = REQUIRED_DIMENSIONS[type];
  const RATIO_TOLERANCE = 0.02;

  if (!required) {
    throw new Error(`Tipo de imagem de carrossel inválido: ${type}. Use 'sm' ou 'lg'.`);
  }

  try {
    const { width, height } = await getImageDimensions(file);
    
    if (width < required.width || height < required.height) {
      const errorMsg = `A imagem ${type} (${required.label}) é muito pequena. 
      Requerido Mínimo: ${required.width}x${required.height}px. 
      Encontrado: ${width}x${height}px.`;
      
      throw new Error(errorMsg); 
    }

    const actualRatio = width / height;
    
    if (Math.abs(actualRatio - required.ratio) > RATIO_TOLERANCE) {
        
        const requiredRatioText = `${required.width}:${required.height}`;
        const actualRatioText = (actualRatio * 100 / 100).toFixed(2);
        
        const errorMsg = `A proporção da imagem ${type} (${required.label}) está incorreta.
        Proporção ideal: ${requiredRatioText} (${required.ratio.toFixed(2)}). 
        Proporção encontrada: ${actualRatioText}.`;
        
        throw new Error(errorMsg); 
    }

    return true;

  } catch (error) {
    throw error;
  }
}