import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, doc, collection, setDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
}, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}
testConnection();

import { SuggestionError, SuggestionErrorCode } from '../models/types';
import { normalizeName } from '../utils/suggestionEngine';

export function logFunctionalError(code: SuggestionErrorCode, context: Record<string, unknown>) {
  console.error("Functional Error: ", JSON.stringify({
    code,
    timestamp: new Date().toISOString(),
    ...context
  }));
}

export async function createSuggestion(
  userId: string,
  name: string,
  proteinPerPortion: number
): Promise<{ success: boolean; id?: string; error?: SuggestionError }> {
  if (!userId || userId.startsWith('guest-')) {
    logFunctionalError('AUTH_REQUIRED', { userId, operation: 'createSuggestion' });
    return { success: false, error: { code: 'AUTH_REQUIRED', message: 'Você precisa estar logado para salvar sugestões.' } };
  }

  const trimmedName = name.trim();
  if (!trimmedName || proteinPerPortion <= 0) {
    logFunctionalError('VALIDATION_ERROR', { userId, name, proteinPerPortion, operation: 'createSuggestion' });
    return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Nome é obrigatório e proteína deve ser maior que zero.' } };
  }

  try {
    const q = query(collection(db, 'users', userId, 'suggestions'));
    const snapshot = await getDocs(q);
    const normalizedNew = normalizeName(trimmedName);
    
    const isDuplicate = snapshot.docs.some(doc => {
      const data = doc.data();
      return normalizeName(data.name) === normalizedNew && Number(data.proteinPerPortion) === proteinPerPortion;
    });

    if (isDuplicate) {
      logFunctionalError('DUPLICATE_SUGGESTION', { userId, name: trimmedName, proteinPerPortion, operation: 'createSuggestion' });
      return { success: false, error: { code: 'DUPLICATE_SUGGESTION', message: 'Este alimento já está cadastrado como sugestão com esta quantidade de proteína.' } };
    }

    const docRef = await addDoc(collection(db, 'users', userId, 'suggestions'), {
      userId,
      name: trimmedName,
      nameNormalized: normalizedNew,
      proteinPerPortion,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.info("Functional Event: SUGGESTION_CREATED", JSON.stringify({
      userId,
      id: docRef.id,
      name: trimmedName,
      proteinPerPortion,
      timestamp: new Date().toISOString()
    }));

    return { success: true, id: docRef.id };
  } catch (error: any) {
    logFunctionalError('PERSISTENCE_ERROR', { userId, error: error.message, operation: 'createSuggestion' });
    return { success: false, error: { code: 'PERSISTENCE_ERROR', message: 'Erro ao salvar no banco de dados.' } };
  }
}

export async function updateSuggestion(
  userId: string,
  suggestionId: string,
  name: string,
  proteinPerPortion: number
): Promise<{ success: boolean; error?: SuggestionError }> {
  if (!userId || userId.startsWith('guest-')) {
    logFunctionalError('AUTH_REQUIRED', { userId, suggestionId, operation: 'updateSuggestion' });
    return { success: false, error: { code: 'AUTH_REQUIRED', message: 'Você precisa estar logado para editar sugestões.' } };
  }

  const trimmedName = name.trim();
  if (!trimmedName || proteinPerPortion <= 0) {
    logFunctionalError('VALIDATION_ERROR', { userId, suggestionId, name, proteinPerPortion, operation: 'updateSuggestion' });
    return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Nome é obrigatório e proteína deve ser maior que zero.' } };
  }

  try {
    const docRef = doc(db, 'users', userId, 'suggestions', suggestionId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      logFunctionalError('NOT_FOUND', { userId, suggestionId, operation: 'updateSuggestion' });
      return { success: false, error: { code: 'NOT_FOUND', message: 'Sugestão não encontrada.' } };
    }

    const q = query(collection(db, 'users', userId, 'suggestions'));
    const snapshot = await getDocs(q);
    const normalizedNew = normalizeName(trimmedName);

    const isDuplicate = snapshot.docs.some(doc => {
      if (doc.id === suggestionId) return false;
      const data = doc.data();
      return normalizeName(data.name) === normalizedNew && Number(data.proteinPerPortion) === proteinPerPortion;
    });

    if (isDuplicate) {
      logFunctionalError('DUPLICATE_SUGGESTION', { userId, suggestionId, name: trimmedName, proteinPerPortion, operation: 'updateSuggestion' });
      return { success: false, error: { code: 'DUPLICATE_SUGGESTION', message: 'Este alimento já está cadastrado como sugestão com esta quantidade de proteína.' } };
    }

    await updateDoc(docRef, {
      name: trimmedName,
      nameNormalized: normalizedNew,
      proteinPerPortion,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error: any) {
    logFunctionalError('PERSISTENCE_ERROR', { userId, suggestionId, error: error.message, operation: 'updateSuggestion' });
    return { success: false, error: { code: 'PERSISTENCE_ERROR', message: 'Erro ao atualizar no banco de dados.' } };
  }
}

export async function deleteSuggestion(
  userId: string,
  suggestionId: string
): Promise<{ success: boolean; error?: SuggestionError }> {
  if (!userId || userId.startsWith('guest-')) {
    logFunctionalError('AUTH_REQUIRED', { userId, suggestionId, operation: 'deleteSuggestion' });
    return { success: false, error: { code: 'AUTH_REQUIRED', message: 'Você precisa estar logado para excluir sugestões.' } };
  }

  try {
    const docRef = doc(db, 'users', userId, 'suggestions', suggestionId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      logFunctionalError('NOT_FOUND', { userId, suggestionId, operation: 'deleteSuggestion' });
      return { success: false, error: { code: 'NOT_FOUND', message: 'Sugestão não encontrada.' } };
    }

    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    logFunctionalError('PERSISTENCE_ERROR', { userId, suggestionId, error: error.message, operation: 'deleteSuggestion' });
    return { success: false, error: { code: 'PERSISTENCE_ERROR', message: 'Erro ao excluir do banco de dados.' } };
  }
}

export { signInWithPopup, signOut, onAuthStateChanged, doc, collection, setDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp };
export type { FirebaseUser };
