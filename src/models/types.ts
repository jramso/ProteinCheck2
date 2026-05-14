export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  weight: number;
  height: number;
  proteinGoal: number;
  multiplier: number;
  autoCalculate: boolean;
  weightUnit?: 'kg' | 'lb';
  createdAt: string;
}

export interface Meal {
  id?: string;
  name: string;
  protein: number;
  timestamp: any;
  imageUrl?: string;
}

export type Screen = 'dashboard' | 'add-meal' | 'history' | 'profile' | 'scan';
