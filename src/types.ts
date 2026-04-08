export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  weight: number;
  proteinGoal: number;
  multiplier: number;
  autoCalculate: boolean;
  createdAt: any;
}

export interface Meal {
  id?: string;
  name: string;
  protein: number;
  timestamp: any;
  imageUrl?: string;
}

export type Screen = 'dashboard' | 'add-meal' | 'history' | 'profile' | 'scan';
