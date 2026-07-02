import axios from 'axios';
import { PexelsImageSearchResult } from '../models/types';
import { getLocalFallbackUrl } from '../utils/imageFallbacks';

// Cache em memória simples para evitar buscas redundantes
const imageCache: Record<string, string> = {};

export async function searchFoodImage(query: string): Promise<string> {
  const trimmed = query.trim();
  if (!trimmed) {
    return getLocalFallbackUrl('');
  }

  // Se já estiver no cache, retorna a URL imediatamente
  if (imageCache[trimmed]) {
    return imageCache[trimmed];
  }

  try {
    const response = await axios.get<PexelsImageSearchResult>('/api/images/search', {
      params: { q: trimmed }
    });

    const url = response.data.imageUrl;
    // Cacheia o resultado
    imageCache[trimmed] = url;
    return url;
  } catch (error) {
    console.error("Error searching food image:", error);
    // Em caso de erro HTTP de rede do frontend, retorna o fallback gastronômico mapeado
    return getLocalFallbackUrl(trimmed);
  }
}
