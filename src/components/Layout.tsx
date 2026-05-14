import React from 'react';
import { Screen } from '../models/types';
import { LayoutDashboard, History, User, Bell, Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function Layout({ children, currentScreen, onNavigate }: LayoutProps) {
  const showNav = ['dashboard', 'history', 'profile', 'scan'].includes(currentScreen);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex justify-between items-center px-6 py-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <button className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-xl transition-colors">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-black tracking-tighter text-indigo-700">Proteína Check-in</h1>
          </div>
          <button className="text-slate-400 hover:text-indigo-600 transition-colors">
            <Bell size={24} />
          </button>
        </div>
      </header>

      <main className="pt-20 max-w-2xl mx-auto">
        {children}
      </main>

      {/* Bottom Nav */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-100 pb-8 pt-3 px-6 z-50">
          <div className="flex justify-around items-center max-w-2xl mx-auto">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}
            >
              <div className={`p-2 rounded-xl ${currentScreen === 'dashboard' ? 'bg-indigo-50' : ''}`}>
                <LayoutDashboard size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('history')}
              className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'history' ? 'text-indigo-600' : 'text-slate-400'}`}
            >
              <div className={`p-2 rounded-xl ${currentScreen === 'history' ? 'bg-indigo-50' : ''}`}>
                <History size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Histórico</span>
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`}
            >
              <div className={`p-2 rounded-xl ${currentScreen === 'profile' ? 'bg-indigo-50' : ''}`}>
                <User size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Perfil</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
