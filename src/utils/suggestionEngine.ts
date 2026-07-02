import { LOCAL_FOOD_DATABASE, LocalFood } from '../constants/foodDatabase';

export const getTimeBasedSuggestion = (): { food: LocalFood; period: string } => {
  const hour = new Date().getHours();
  const minutes = new Date().getMinutes();
  const currentTime = hour + minutes / 60;

  let category: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  let periodName: string;

  if (currentTime < 11) {
    category = 'breakfast';
    periodName = 'Café da Manhã';
  } else if (currentTime < 14.5) {
    category = 'lunch';
    periodName = 'Almoço';
  } else if (currentTime < 18) {
    category = 'snack';
    periodName = 'Lanche da Tarde';
  } else {
    category = 'dinner';
    periodName = 'Jantar / Ceia';
  }

  const suggestions = LOCAL_FOOD_DATABASE.filter(f => f.category === category);
  const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

  return {
    food: randomSuggestion,
    period: periodName
  };
};

export const normalizeName = (name: string): string => {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

export const isDuplicateSuggestion = (
  nameA: string,
  proteinA: number,
  nameB: string,
  proteinB: number
): boolean => {
  return normalizeName(nameA) === normalizeName(nameB) && proteinA === proteinB;
};
