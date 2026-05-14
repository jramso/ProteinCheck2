import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup } from './services/firebaseService';
import { Meal, Screen } from './models/types';
import { AnimatePresence, motion } from 'motion/react';
import DashboardView from './views/DashboardView';
import AddMealView from './views/AddMealView';
import HistoryView from './views/HistoryView';
import ProfileView from './views/ProfileView';
import ScanMealView from './views/ScanMealView';
import { Layout } from './components/Layout';
import { useAuth } from './hooks/useAuth';
import { useMeals } from './hooks/useMeals';

export default function App() {
  const { user, loading, loginAsGuest } = useAuth();
  const { meals } = useMeals(user?.uid);
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

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
        
        <div className="w-full max-w-xs space-y-4">
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
            Entrar com Google
          </button>

          <button
            onClick={loginAsGuest}
            className="w-full py-4 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
          >
            Entrar como Visitante
          </button>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardView user={user} meals={meals} onNavigate={(s, m) => {
          if (m) setEditingMeal(m);
          else setEditingMeal(null);
          setCurrentScreen(s);
        }} />;
      case 'add-meal':
        return <AddMealView user={user} meal={editingMeal} onNavigate={(s) => {
          setEditingMeal(null);
          setCurrentScreen(s);
        }} />;
      case 'history':
        return <HistoryView user={user} meals={meals} onNavigate={(s, m) => {
          if (m) setEditingMeal(m);
          else setEditingMeal(null);
          setCurrentScreen(s);
        }} />;
      case 'profile':
        return <ProfileView user={user} onNavigate={setCurrentScreen} />;
      case 'scan':
        return <ScanMealView user={user} onNavigate={setCurrentScreen} />;
      default:
        return <DashboardView user={user} meals={meals} onNavigate={setCurrentScreen} />;
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
