import { describe, it, expect } from 'vitest';
import { normalizeName } from '../../src/utils/suggestionEngine';

describe('suggestions-update deduplication logic', () => {
  // Simulates docSnap check and local deduplication list query excluding the current suggestion ID
  const isDuplicateOnUpdate = (
    currentId: string,
    newName: string,
    newProtein: number,
    existingSuggestions: Array<{ id: string; name: string; proteinPerPortion: number }>
  ): boolean => {
    const normalizedNew = normalizeName(newName);
    return existingSuggestions.some(sug => {
      if (sug.id === currentId) return false;
      return normalizeName(sug.name) === normalizedNew && sug.proteinPerPortion === newProtein;
    });
  };

  const mockSuggestions = [
    { id: 'sug-1', name: 'Ovo Cozido', proteinPerPortion: 6 },
    { id: 'sug-2', name: 'Frango Grelhado', proteinPerPortion: 30 },
  ];

  it('should allow updating a suggestion with no change (does not collide with itself)', () => {
    const isDuplicate = isDuplicateOnUpdate('sug-1', 'Ovo Cozido', 6, mockSuggestions);
    expect(isDuplicate).toBe(false);
  });

  it('should block updating a suggestion to match another existing suggestion', () => {
    const isDuplicate = isDuplicateOnUpdate('sug-1', '  FRANGO   GRELHADO  ', 30, mockSuggestions);
    expect(isDuplicate).toBe(true);
  });

  it('should allow updating to a different name and protein that does not exist', () => {
    const isDuplicate = isDuplicateOnUpdate('sug-1', 'Patinho Moido', 28, mockSuggestions);
    expect(isDuplicate).toBe(false);
  });
});
