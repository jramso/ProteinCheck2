import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, doc, setDoc, getDoc, onSnapshot, collection, query, orderBy, limit } from './firebase';
import { UserProfile, Meal, Screen } from './types';
import { AnimatePresence, motion } from 'motion/react';
import Dashboard from './components/Dashboard';
import AddMeal from './components/AddMeal';
import History from './components/History';
import Profile from './components/Profile';
import ScanMeal from './components/ScanMeal';
import { Layout } from './components/Layout';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            weight: 70,
            proteinGoal: 140,
            multiplier: 2.0,
            autoCalculate: true,
            createdAt: new Date().toISOString(),
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'users', user.uid, 'meals'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const mealData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Meal[];
        setMeals(mealData);
      }, (error) => {
        console.error("Firestore Error: ", JSON.stringify({
          error: error.message,
          operationType: 'get',
          path: `users/${user.uid}/meals`,
          authInfo: { userId: user.uid }
        }));
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
        <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-200">
          <span className="text-white text-4xl font-black">P</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Proteína Check-in</h1>
        <p className="text-slate-500 mb-12 max-w-xs">Acompanhe sua ingestão de proteína diária com facilidade e precisão.</p>
        <button
          onClick={handleLogin}
          className="w-full max-w-xs py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
          Entrar com Google
        </button>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard user={user} meals={meals} onNavigate={setCurrentScreen} />;
      case 'add-meal':
        return <AddMeal user={user} onNavigate={setCurrentScreen} />;
      case 'history':
        return <History user={user} meals={meals} onNavigate={setCurrentScreen} />;
      case 'profile':
        return <Profile user={user} onNavigate={setCurrentScreen} />;
      case 'scan':
        return <ScanMeal user={user} onNavigate={setCurrentScreen} />;
      default:
        return <Dashboard user={user} meals={meals} onNavigate={setCurrentScreen} />;
    }
  };

  const getTransition = () => {
    // Simplified logic: specific transitions for specific flows
    if (currentScreen === 'add-meal') return { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } };
    return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  };

  const transition = getTransition();

  return (
    <Layout currentScreen={currentScreen} onNavigate={setCurrentScreen}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={transition.initial}
          animate={transition.animate}
          exit={transition.exit}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-screen pb-24"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
