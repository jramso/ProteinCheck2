# Data Model: Imagens Gastronômicas com Pexels API

## Entities

### Refeicao (Meal)
- **id**: string (Document ID no Firestore)
- **name**: string (Nome do alimento/refeição)
- **protein**: number (Proteína em gramas)
- **timestamp**: timestamp (Data/hora de registro)
- **imageUrl**: string | null (URL da imagem gastronômica retornada do Pexels ou fallback)
- **quantityMultiplier**: number (Opcional, multiplicador de porções)
- **suggestionId**: string | null (Opcional, ID da sugestão de origem)

*Validation Rules for data integrity*:
- `imageUrl` deve ser uma string contendo um padrão de URL válido (se não for nulo/vazio) e ter tamanho menor que 1024 caracteres.

---

### PexelsImageSearchResult
- **id**: number (ID único retornado pelo Pexels)
- **photographer**: string (Nome do fotógrafo para créditos internos, opcional)
- **imageUrl**: string (URL selecionada e otimizada, ex: tamanho `medium` ou `small`)

---

## Mapeamento de Fallbacks Locais (Estáticos)
Caso a API retorne zero resultados ou esteja offline, o sistema mapeará palavras-chave do alimento para URLs de fallbacks culinários de alta qualidade:

| Categoria | Palavras-Chave de Exemplo | URL do Fallback (Comida Realista) |
|---|---|---|
| Ovos / Proteínas | "ovo", "egg", "omelete", "claras" | `https://images.pexels.com/photos/162712/egg-yellow-food-one-162712.jpeg` |
| Carne / Frango | "carne", "frango", "bife", "meat", "chicken" | `https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg` |
| Bebidas / Shakes | "whey", "shake", "leite", "suco", "vitamina" | `https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg` |
| Salada / Vegetal | "salada", "alface", "tomate", "vegetal", "legume" | `https://images.pexels.com/photos/406152/pexels-photo-406152.jpeg` |
| Padrão (Geral) | Todos os outros alimentos sem match | `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg` |
