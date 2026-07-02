# Contract: Pexels API Proxy Endpoint

## Overview
Define os contratos de integração da rota proxy local `/api/images/search` no backend com o frontend do aplicativo.

---

## Endpoint: Search Food Image

- **Path**: `/api/images/search`
- **Method**: `GET`
- **Query Parameters**:
  - `q` (string, required): O termo de busca ou nome do alimento a ser pesquisado.

---

### Responses

#### 1. Success (200 OK)
Retornado quando a busca no Pexels encontra fotos gastronômicas correspondentes com sucesso.

- **Content-Type**: `application/json`
- **Body**:
```json
{
  "success": true,
  "query": "ovo",
  "imageUrl": "https://images.pexels.com/photos/162712/egg-yellow-food-one-162712.jpeg?auto=compress&cs=tinysrgb&h=350"
}
```

#### 2. Fallback / Sem Resultados (200 OK)
Retornado quando a busca do Pexels retorna 0 imagens para a pesquisa, mas o servidor graciosamente aplica as regras de fallback gastronômicas no backend.

- **Content-Type**: `application/json`
- **Body**:
```json
{
  "success": false,
  "query": "termo-desconhecido",
  "imageUrl": "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=350",
  "reason": "NO_RESULTS"
}
```

#### 3. Error / Rate Limiting (200 OK ou 500 Internal Server Error)
Retornado quando a chamada do Pexels falha devido a estouro de cota (429), credenciais inválidas ou erro de rede do Pexels. O servidor retorna `success: false` junto com a URL de fallback padrão para evitar crash no front-end.

- **Content-Type**: `application/json`
- **Body**:
```json
{
  "success": false,
  "query": "ovo",
  "imageUrl": "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=350",
  "reason": "API_ERROR",
  "message": "Too Many Requests"
}
```

---

## Rate Limit & Headers
A API do Pexels possui um limite padrão de **25.000 requisições por mês** (cerca de 800 por dia). 
O backend fará o envio da chave via cabeçalho:
`Authorization: [PEXELS_API_KEY]`
e tratará os retornos graciosamente de acordo com as especificações acima.
