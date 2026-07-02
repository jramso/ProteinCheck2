import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserProfile, SugestaoConsumo } from '../../src/models/types';

let stateValues: any[] = [];
let hookIndex = 0;

vi.mock('react', async () => {
  const actual = await vi.importActual('react') as any;
  return {
    ...actual,
    useState: (init: any) => {
      const idx = hookIndex++;
      if (stateValues[idx] === undefined) {
        stateValues[idx] = init;
      }
      const setVal = (val: any) => {
        stateValues[idx] = typeof val === 'function' ? val(stateValues[idx]) : val;
      };
      return [stateValues[idx], setVal];
    },
    useEffect: (fn: any) => {
      fn();
    }
  };
});

vi.mock('../../src/services/firebaseService', () => {
  return {
    db: {},
    collection: vi.fn(() => 'mock-collection'),
    addDoc: vi.fn().mockResolvedValue({ id: 'mock-meal-id' }),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    serverTimestamp: vi.fn(() => 'mock-timestamp'),
    createSuggestion: vi.fn(),
    updateSuggestion: vi.fn(),
    deleteSuggestion: vi.fn(),
  };
});

import { useAddMealForm } from '../../src/hooks/useAddMealForm';
import { addDoc } from '../../src/services/firebaseService';

describe('suggestions-consume integration tests', () => {
  const user: UserProfile = {
    uid: 'user-123',
    displayName: 'User',
    email: 'user@example.com',
    photoURL: null,
    weight: 70,
    height: 170,
    proteinGoal: 140,
    multiplier: 2.0,
    autoCalculate: true,
    createdAt: '2026-06-30T18:00:00Z',
  };

  const suggestion: SugestaoConsumo = {
    id: 'sug-1',
    userId: 'user-123',
    name: 'Whey Protein',
    nameNormalized: 'whey protein',
    proteinPerPortion: 24,
    createdAt: '2026-06-30T18:00:00Z',
    updatedAt: '2026-06-30T18:00:00Z',
  };

  beforeEach(() => {
    stateValues = [];
    hookIndex = 0;
    vi.clearAllMocks();
  });

  it('should correctly enter selected suggestion and transition to quantity step', () => {
    hookIndex = 0;
    let hook = useAddMealForm(user, null);
    
    hook.handleSelectSuggestion(suggestion);

    hookIndex = 0;
    hook = useAddMealForm(user, null);

    expect(hook.selectedSuggestion).toEqual(suggestion);
    expect(hook.name).toBe('Whey Protein');
    expect(hook.quantityMultiplier).toBe(1.0);
    expect(hook.step).toBe('quantity');
  });

  it('should calculate the final protein and transition back to form step on confirm', () => {
    hookIndex = 0;
    let hook = useAddMealForm(user, null);
    
    hook.handleSelectSuggestion(suggestion);
    
    hookIndex = 0;
    hook = useAddMealForm(user, null);
    
    hook.setQuantityMultiplier(1.5);
    
    hookIndex = 0;
    hook = useAddMealForm(user, null);
    
    hook.handleConfirmQuantity();

    hookIndex = 0;
    hook = useAddMealForm(user, null);

    expect(hook.protein).toBe(36); // 24 * 1.5 = 36
    expect(hook.step).toBe('form');
  });

  it('should include suggestionId and quantityMultiplier in the saved meal doc', async () => {
    hookIndex = 0;
    let hook = useAddMealForm(user, null);
    
    hook.handleSelectSuggestion(suggestion);
    
    hookIndex = 0;
    hook = useAddMealForm(user, null);
    
    hook.setQuantityMultiplier(1.5);
    
    hookIndex = 0;
    hook = useAddMealForm(user, null);
    
    hook.handleConfirmQuantity();
    
    hookIndex = 0;
    hook = useAddMealForm(user, null);
    
    await hook.handleSave();

    expect(addDoc).toHaveBeenCalledWith('mock-collection', {
      name: 'Whey Protein',
      protein: 36,
      timestamp: 'mock-timestamp',
      quantityMultiplier: 1.5,
      suggestionId: 'sug-1',
    });
  });
});
