import axios from 'axios';
import { LOCAL_FOOD_DATABASE } from '../constants/foodDatabase';

export interface FatSecretFood {
  food_id: string;
  food_name: string;
  food_description: string;
  food_type?: string;
  food_url?: string;
}

export const fatSecretService = {
  async search(query: string): Promise<FatSecretFood[]> {
    const localResults = LOCAL_FOOD_DATABASE.filter(f => 
      f.food_name.toLowerCase().includes(query.toLowerCase())
    ).map(f => ({
      food_id: f.food_id,
      food_name: f.food_name,
      food_description: f.food_description
    }));

    try {
      const response = await axios.get(`/api/food/search?q=${encodeURIComponent(query)}`);
      const food = response.data?.foods?.food;
      const apiResults = food ? (Array.isArray(food) ? food : [food]) : [];
      
      // Combine results, prioritizing local ones that match exactly or API results
      return [...localResults, ...apiResults];
    } catch (error) {
      console.error('FatSecret Search Error, using local database:', error);
      return localResults;
    }
  },

  async autocomplete(query: string): Promise<string[]> {
    const localSuggestions = LOCAL_FOOD_DATABASE
      .filter(f => f.food_name.toLowerCase().includes(query.toLowerCase()))
      .map(f => f.food_name);

    try {
      const response = await axios.get(`/api/food/autocomplete?q=${encodeURIComponent(query)}`);
      const suggestions = response.data?.suggestions?.suggestion;
      const apiSuggestions = suggestions ? (Array.isArray(suggestions) ? suggestions : [suggestions]) : [];
      
      return Array.from(new Set([...localSuggestions, ...apiSuggestions]));
    } catch (error) {
      console.error('FatSecret Autocomplete Error, using local database:', error);
      return localSuggestions;
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
