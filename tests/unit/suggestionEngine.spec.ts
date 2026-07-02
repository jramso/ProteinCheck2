import { describe, it, expect } from 'vitest';
import { normalizeName, isDuplicateSuggestion } from '../../src/utils/suggestionEngine';

describe('suggestionEngine utilities', () => {
  describe('normalizeName', () => {
    it('should lower case names', () => {
      expect(normalizeName('Frango')).toBe('frango');
    });

    it('should remove accents/diacritics', () => {
      expect(normalizeName('Café da Manhã')).toBe('cafe da manha');
      expect(normalizeName('Pão integral')).toBe('pao integral');
    });

    it('should remove redundant spaces and trim', () => {
      expect(normalizeName('   Frango    Grelhado   ')).toBe('frango grelhado');
    });
  });

  describe('isDuplicateSuggestion', () => {
    it('should identify duplicates with same protein and normalized names', () => {
      expect(isDuplicateSuggestion('Frango Grelhado', 30, 'frango  grelhado', 30)).toBe(true);
      expect(isDuplicateSuggestion('Café', 10, 'cafe', 10)).toBe(true);
    });

    it('should reject as duplicates if protein values differ', () => {
      expect(isDuplicateSuggestion('Frango Grelhado', 30, 'Frango Grelhado', 25)).toBe(false);
    });

    it('should reject as duplicates if names differ', () => {
      expect(isDuplicateSuggestion('Frango Grelhado', 30, 'Patinho', 30)).toBe(false);
    });
  });
});
