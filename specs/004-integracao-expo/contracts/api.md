# API Contract: Backend Proxy Local

Esta especificação define os endpoints expostos pelo servidor Express local (`server.ts`) a serem consumidos tanto pela Web quanto pela aplicação Mobile (Expo Go).

O aplicativo móvel acessará a API usando o endereço IP local do host de desenvolvimento (ex: `http://192.168.x.x:3000`) ao invés de `localhost`, devido às limitações do emulador/dispositivo real.

---

## 1. Busca de Alimentos (Search)

Realiza a busca de alimentos por palavra-chave na API do FatSecret.

- **URL**: `/api/food/search`
- **Método**: `GET`
- **Parâmetros de Consulta (Query Params)**:
  - `q` (string, obrigatório): Expressão de busca (ex: `frango`).
- **Resposta de Sucesso (HTTP 200)**:
  Retorna o JSON bruto do FatSecret contendo os alimentos correspondentes.
  ```json
  {
    "foods": {
      "food": [
        {
          "food_id": "33689",
          "food_name": "Peito de Frango",
          "food_type": "Brand",
          "food_description": "Per 100g - Calories: 165kcal | Fat: 3.60g | Carbs: 0.00g | Protein: 31.00g",
          "food_url": "https://www.fatsecret.com/calories-nutrition/generic/chicken-breast"
        }
      ]
    }
  }
  ```

---

## 2. Autocompletar Busca (Autocomplete)

Retorna sugestões de autocompletar com base na digitação parcial do usuário.

- **URL**: `/api/food/autocomplete`
- **Método**: `GET`
- **Parâmetros de Consulta (Query Params)**:
  - `q` (string, obrigatório): Expressão parcial (ex: `fra`).
- **Resposta de Sucesso (HTTP 200)**:
  ```json
  {
    "suggestions": {
      "suggestion": [
        "frango",
        "frango grelhado",
        "frango desfiado"
      ]
    }
  }
  ```

---

## 3. Reconhecimento de Refeições por Imagem (Food Recognition)

Envia uma imagem em formato base64 para identificação automatizada.

- **URL**: `/api/food/recognize`
- **Método**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Corpo da Requisição (JSON)**:
  ```json
  {
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD..."
  }
  ```
- **Resposta de Sucesso (HTTP 200)**:
  Retorna o JSON de estimativa de alimentos e suas propriedades.
  ```json
  {
    "food_recognition": {
      "predictions": [
        {
          "food_name": "Chicken Breast",
          "probability": 0.95
        }
      ]
    }
  }
  ```
