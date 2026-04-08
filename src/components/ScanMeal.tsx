import React, { useState, useEffect } from 'react';
import { UserProfile, Screen } from '../types';
import { ArrowLeft, Camera, Loader2, CheckCircle, Info } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp } from '../firebase';
import { GoogleGenAI } from "@google/genai";

interface ScanMealProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
}

export default function ScanMeal({ user, onNavigate }: ScanMealProps) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ name: string; protein: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setScanning(true);
    // Simulate AI scanning
    setTimeout(() => {
      setResult({ name: 'Frango Grelhado com Salada', protein: 35 });
      setScanning(false);
    }, 2000);
  };

  const handleConfirm = async () => {
    if (!result) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'meals'), {
        name: result.name,
        protein: result.protein,
        timestamp: serverTimestamp(),
      });
      onNavigate('dashboard');
    } catch (error) {
      console.error("Error saving scanned meal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pb-12">
      <header className="flex items-center justify-between mb-8 pt-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="p-2 -ml-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black tracking-tighter text-slate-900">Scan de Refeição</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
          <img src={user.photoURL || ''} alt="User" className="w-full h-full object-cover" />
        </div>
      </header>

      <div className="max-w-md mx-auto space-y-8">
        {/* Viewfinder */}
        <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] bg-slate-900 flex items-center justify-center shadow-2xl shadow-indigo-100">
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-60" 
            src="https://picsum.photos/seed/meal/800/1000" 
            alt="Scan"
            referrerPolicy="no-referrer"
          />
          
          {scanning ? (
            <div className="absolute inset-0 bg-indigo-600/20 flex flex-col items-center justify-center">
              <div className="w-full h-1 bg-indigo-400 shadow-[0_0_15px_#4f46e5] animate-scan"></div>
              <div className="mt-8 p-6 bg-white/10 backdrop-blur-xl rounded-3xl flex flex-col items-center gap-3 border border-white/20">
                <Loader2 className="text-white animate-spin" size={32} />
                <span className="text-white font-bold tracking-widest text-[10px] uppercase">Identificando Nutrientes</span>
              </div>
            </div>
          ) : !result ? (
            <button 
              onClick={handleScan}
              className="relative z-10 w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <Camera size={32} />
            </button>
          ) : null}

          {/* Corners */}
          <div className="absolute top-10 left-10 w-12 h-12 border-t-4 border-l-4 border-white/80 rounded-tl-2xl"></div>
          <div className="absolute top-10 right-10 w-12 h-12 border-t-4 border-r-4 border-white/80 rounded-tr-2xl"></div>
          <div className="absolute bottom-10 left-10 w-12 h-12 border-b-4 border-l-4 border-white/80 rounded-bl-2xl"></div>
          <div className="absolute bottom-10 right-10 w-12 h-12 border-b-4 border-r-4 border-white/80 rounded-br-2xl"></div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tighter text-slate-900">Alimentos Identificados</h2>
              <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold">{result.protein}g Total</span>
            </div>

            <div className="bg-white p-5 rounded-3xl flex items-center justify-between border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{result.name}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Proteína Alta • Estimado</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-indigo-600">{result.protein}g</p>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <button 
                onClick={handleConfirm}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black tracking-tight text-lg shadow-xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {loading ? 'Salvando...' : 'Confirmar e Salvar'}
              </button>
              <p className="text-center text-slate-400 text-sm font-medium">
                Algo errado? <button onClick={() => setResult(null)} className="text-indigo-600 font-bold hover:underline">Ajustar manualmente</button>
              </p>
            </div>
          </div>
        )}

        {!result && !scanning && (
          <div className="flex items-start gap-4 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
            <Info className="text-indigo-600 shrink-0" size={20} />
            <p className="text-sm text-indigo-700 font-medium leading-relaxed">
              Aponte a câmera para sua refeição. Nossa IA identificará os alimentos e estimará a quantidade de proteína automaticamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
