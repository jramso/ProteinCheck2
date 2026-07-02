import { Timestamp, FieldValue } from 'firebase/firestore';

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
  createdAt: Timestamp | FieldValue | string | Date;
}

export interface Meal {
  id?: string;
  name: string;
  protein: number;
  timestamp: Timestamp | FieldValue | string | Date;
  imageUrl?: string;
  quantityMultiplier?: number;
  suggestionId?: string | null;
}

export interface SugestaoConsumo {
  id?: string;
  userId: string;
  name: string;
  nameNormalized: string;
  proteinPerPortion: number;
  createdAt: Timestamp | FieldValue | string | Date;
  updatedAt: Timestamp | FieldValue | string | Date;
}

export type SuggestionErrorCode =
  | 'AUTH_REQUIRED'
  | 'VALIDATION_ERROR'
  | 'DUPLICATE_SUGGESTION'
  | 'NOT_FOUND'
  | 'PERSISTENCE_ERROR';

export interface SuggestionError {
  code: SuggestionErrorCode;
  message: string;
}

export type Screen = 'dashboard' | 'add-meal' | 'history' | 'profile' | 'scan';
