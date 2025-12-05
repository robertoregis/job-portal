export function getImageDimensions(file: File | Blob): Promise<{ width: number, height: number, mimeType: string }> {
  return new Promise((resolve, reject) => {
    // Verifica se o arquivo é realmente uma imagem
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('O arquivo fornecido não é uma imagem.'));
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    // Quando o arquivo for lido pelo reader
    reader.onload = (e) => {
      // Define a origem da imagem como o Data URL lido
      img.src = e.target?.result as string;
    };

    // Quando o objeto Image terminar de carregar
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        mimeType: file.type,
      });
    };

    // Lida com erros de carregamento
    img.onerror = () => {
      reject(new Error('Falha ao carregar a imagem.'));
    };

    // Inicia a leitura do arquivo como um Data URL
    reader.readAsDataURL(file);
  });
}