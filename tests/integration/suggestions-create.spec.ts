import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSuggestion } from '../../src/services/firebaseService';

// Mock firebase/firestore
vi.mock('firebase/firestore', () => {
  return {
    getFirestore: vi.fn(),
    collection: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    serverTimestamp: vi.fn(() => 'mock-timestamp'),
  };
});

// We need to import the mocked modules to change their implementation
import { addDoc, getDocs } from 'firebase/firestore';

describe('suggestions-create integration tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should block guest user with AUTH_REQUIRED error', async () => {
    const res = await createSuggestion('guest-12345', 'Ovo', 6);
    expect(res.success).toBe(false);
    expect(res.error?.code).toBe('AUTH_REQUIRED');
  });

  it('should validate inputs and return VALIDATION_ERROR', async () => {
    const res = await createSuggestion('user-123', ' ', 0);
    expect(res.success).toBe(false);
    expect(res.error?.code).toBe('VALIDATION_ERROR');
  });

  it('should prevent duplicates based on normalized name and protein', async () => {
    // Mock getDocs to return an existing suggestion "ovo" with 6g protein
    vi.mocked(getDocs).mockResolvedValueOnce({
      docs: [
        {
          id: 'sug-1',
          data: () => ({
            name: 'Ovo cozido',
            proteinPerPortion: 6,
          }),
        },
      ],
    } as any);

    const res = await createSuggestion('user-123', '  ovo   cozido  ', 6);
    expect(res.success).toBe(false);
    expect(res.error?.code).toBe('DUPLICATE_SUGGESTION');
  });

  it('should create suggestion successfully if valid and not duplicate', async () => {
    vi.mocked(getDocs).mockResolvedValueOnce({
      docs: [],
    } as any);

    vi.mocked(addDoc).mockResolvedValueOnce({
      id: 'new-sug-id',
    } as any);

    const res = await createSuggestion('user-123', 'Frango Grelhado', 30);
    expect(res.success).toBe(true);
    expect(res.id).toBe('new-sug-id');
  });
});
