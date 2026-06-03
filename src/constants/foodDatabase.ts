export interface LocalFood {
  food_id: string;
  food_name: string;
  food_description: string;
  protein: number;
  category: 'breakfast' | 'lunch' | 'snack' | 'dinner';
}

export const LOCAL_FOOD_DATABASE: LocalFood[] = [
  {
    food_id: "L1",
    food_name: "Peito de Frango Grelhado",
    food_description: "Porção de 100g. Proteína: 31g | Calorias: 165kcal",
    protein: 31,
    category: 'lunch'
  },
  {
    food_id: "L2",
    food_name: "Ovo Cozido",
    food_description: "Unidade grande (50g). Proteína: 6g | Calorias: 78kcal",
    protein: 6,
    category: 'breakfast'
  },
  {
    food_id: "L3",
    food_name: "Whey Protein (1 scoop)",
    food_description: "Porção de 30g. Proteína: 24g | Calorias: 120kcal",
    protein: 24,
    category: 'snack'
  },
  {
    food_id: "L4",
    food_name: "Iogurte Grego Natural",
    food_description: "Pote de 170g. Proteína: 17g | Calorias: 100kcal",
    protein: 17,
    category: 'snack'
  },
  {
    food_id: "L5",
    food_name: "Carne Moída (Patinho)",
    food_description: "Porção de 100g. Proteína: 26g | Calorias: 220kcal",
    protein: 26,
    category: 'lunch'
  },
  {
    food_id: "L6",
    food_name: "Filé de Tilápia",
    food_description: "Porção de 100g. Proteína: 20g | Calorias: 96kcal",
    protein: 20,
    category: 'dinner'
  },
  {
    food_id: "L7",
    food_name: "Atum em Lata (em água)",
    food_description: "Lata de 120g. Proteína: 25g | Calorias: 110kcal",
    protein: 25,
    category: 'dinner'
  },
  {
    food_id: "L8",
    food_name: "Queijo Cottage",
    food_description: "Porção de 100g. Proteína: 11g | Calorias: 98kcal",
    protein: 11,
    category: 'breakfast'
  },
  {
    food_id: "L9",
    food_name: "Feijão Preto Cozido",
    food_description: "Concha de 100g. Proteína: 9g | Calorias: 132kcal",
    protein: 9,
    category: 'lunch'
  },
  {
    food_id: "L10",
    food_name: "Lombo de Porco Assado",
    food_description: "Porção de 100g. Proteína: 27g | Calorias: 240kcal",
    protein: 27,
    category: 'lunch'
  },
  {
    food_id: "L11",
    food_name: "Leite Desnatado",
    food_description: "Copo de 200ml. Proteína: 6g | Calorias: 70kcal",
    protein: 6,
    category: 'breakfast'
  },
  {
    food_id: "L12",
    food_name: "Amendoim Torrado",
    food_description: "Punhado de 30g. Proteína: 7g | Calorias: 170kcal",
    protein: 7,
    category: 'snack'
  },
  {
    food_id: "L13",
    food_name: "Clara de Ovo",
    food_description: "Unidade. Proteína: 3.6g | Calorias: 17kcal",
    protein: 3.6,
    category: 'breakfast'
  },
  {
    food_id: "L14",
    food_name: "Tofu",
    food_description: "Porção de 100g. Proteína: 8g | Calorias: 76kcal",
    protein: 8,
    category: 'dinner'
  },
  {
    food_id: "L15",
    food_name: "Salmão Grelhado",
    food_description: "Porção de 100g. Proteína: 22g | Calorias: 208kcal",
    protein: 22,
    category: 'dinner'
  }
];

