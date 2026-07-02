import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateSuggestion, deleteSuggestion } from '../../src/services/firebaseService';

// Mock firebase/firestore
vi.mock('firebase/firestore', () => {
  return {
    getFirestore: vi.fn(),
    collection: vi.fn(),
    doc: vi.fn(() => 'mock-doc-ref'),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    serverTimestamp: vi.fn(() => 'mock-timestamp'),
  };
});

import { getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

describe('suggestions-manage integration tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateSuggestion', () => {
    it('should return NOT_FOUND if the suggestion does not exist', async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => false,
      } as any);

      const res = await updateSuggestion('user-123', 'sug-nonexistent', 'Whey', 24);
      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('NOT_FOUND');
    });

    it('should successfully update suggestion and prevent self-deduplication collisions', async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
      } as any);

      // Existing suggestions has the updated one itself.
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: [
          {
            id: 'sug-1',
            data: () => ({
              name: 'Ovo Cozido',
              proteinPerPortion: 6,
            }),
          },
        ],
      } as any);

      const res = await updateSuggestion('user-123', 'sug-1', 'Ovo Cozido', 6);
      expect(res.success).toBe(true);
      expect(updateDoc).toHaveBeenCalledWith('mock-doc-ref', {
        name: 'Ovo Cozido',
        nameNormalized: 'ovo cozido',
        proteinPerPortion: 6,
        updatedAt: 'mock-timestamp',
      });
    });

    it('should block updates that create duplicate records', async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
      } as any);

      // doc.id is 'sug-2' (different from updating 'sug-1'), so it triggers duplication block
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: [
          {
            id: 'sug-2',
            data: () => ({
              name: 'Frango Grelhado',
              proteinPerPortion: 30,
            }),
          },
        ],
      } as any);

      const res = await updateSuggestion('user-123', 'sug-1', 'Frango Grelhado', 30);
      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('DUPLICATE_SUGGESTION');
    });
  });

  describe('deleteSuggestion', () => {
    it('should return NOT_FOUND if the suggestion does not exist', async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => false,
      } as any);

      const res = await deleteSuggestion('user-123', 'sug-nonexistent');
      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('NOT_FOUND');
    });

    it('should successfully delete suggestion if it exists', async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
      } as any);

      const res = await deleteSuggestion('user-123', 'sug-1');
      expect(res.success).toBe(true);
      expect(deleteDoc).toHaveBeenCalledWith('mock-doc-ref');
    });
  });
});
