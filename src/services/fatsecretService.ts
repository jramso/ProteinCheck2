import axios from 'axios';

export interface FatSecretFood {
  food_id: string;
  food_name: string;
  food_description: string;
  food_type: string;
  food_url: string;
}

export const fatSecretService = {
  async search(query: string): Promise<FatSecretFood[]> {
    try {
      const response = await axios.get(`/api/food/search?q=${encodeURIComponent(query)}`);
      const food = response.data?.foods?.food;
      if (!food) return [];
      return Array.isArray(food) ? food : [food];
    } catch (error) {
      console.error('FatSecret Search Error:', error);
      return [];
    }
  },

  async autocomplete(query: string): Promise<string[]> {
    try {
      const response = await axios.get(`/api/food/autocomplete?q=${encodeURIComponent(query)}`);
      const suggestions = response.data?.suggestions?.suggestion;
      if (!suggestions) return [];
      return Array.isArray(suggestions) ? suggestions : [suggestions];
    } catch (error) {
      console.error('FatSecret Autocomplete Error:', error);
      return [];
    }
  },

  async recognize(base64Image: string): Promise<any> {
    try {
      const response = await axios.post('/api/food/recognize', { image: base64Image });
      return response.data;
    } catch (error) {
      console.error('FatSecret Recognize Error:', error);
      return null;
    }
  }
};
