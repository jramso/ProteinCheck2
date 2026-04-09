import React, { useState } from 'react';
import { UserProfile, Screen } from '../types';
import { Edit2, LogOut, Shield, Weight, ChevronRight, CheckCircle } from 'lucide-react';
import { auth, signOut, db, doc, updateDoc } from '../firebase';

interface ProfileProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
}

export default function Profile({ user, onNavigate }: ProfileProps) {
  const [weight, setWeight] = useState(user.weight);
  const [goal, setGoal] = useState(user.proteinGoal);
  const [multiplier, setMultiplier] = useState(user.multiplier);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        weight,
        proteinGoal: goal,
        multiplier,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const multipliers = [
    { label: 'Manutenção', value: 1.2, desc: '1.2g por kg de peso' },
    { label: 'Ganho Muscular', value: 2.0, desc: '2.0g por kg de peso' },
    { label: 'Performance Elite', value: 2.4, desc: '2.4g por kg de peso' },
  ];

  return (
    <div className="px-6 pb-12">
      <header className="mb-12 pt-4">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-white shadow-lg border-4 border-white">
              <img 
                alt="Avatar" 
                className="w-full h-full object-cover" 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                referrerPolicy="no-referrer"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg hover:scale-110 transition-transform">
              <Edit2 size={16} />
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900">{user.displayName}</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Plano Atleta Pro</p>
          </div>
        </div>
      </header>

      <section className="mb-10 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-5 bg-slate-50 rounded-2xl">
            <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 block mb-2">Peso Atual</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{weight}</span>
              <span className="text-sm font-bold text-slate-400">kg</span>
            </div>
          </div>
          <div className="p-5 bg-indigo-50 rounded-2xl border-2 border-indigo-100">
            <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 block mb-2">Meta Diária</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-indigo-700">{goal}</span>
              <span className="text-sm font-bold text-indigo-500">g</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-3 ml-1">Peso (kg)</label>
              <div className="relative flex items-center">
                <input 
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => {
                    const newWeight = Number(e.target.value);
                    setWeight(newWeight);
                    // Optionally auto-update goal if multiplier is active
                    setGoal(Math.round(newWeight * multiplier));
                  }}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-lg font-black text-slate-900 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-3 ml-1">Meta (g)</label>
              <div className="relative flex items-center">
                <input 
                  type="number"
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-lg font-black text-slate-900 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                />
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black tracking-tight text-lg transition-all active:scale-95 shadow-lg ${success ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'}`}
          >
            {loading ? 'Atualizando...' : success ? 'Perfil Atualizado!' : 'Salvar Alterações'}
          </button>
        </form>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-black tracking-tighter text-slate-900 mb-6 ml-1">Cálculo de Meta</h2>
        <div className="bg-white rounded-[2rem] p-8 space-y-6 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            Ajuste seu multiplicador de proteína com base na sua intensidade de treino atual.
          </p>
          <div className="space-y-3">
            {multipliers.map((m) => (
              <button 
                key={m.value}
                onClick={() => {
                  setMultiplier(m.value);
                  setGoal(Math.round(weight * m.value));
                }}
                className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all group ${multiplier === m.value ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'}`}
              >
                <div className="text-left">
                  <span className={`block font-bold ${multiplier === m.value ? 'text-indigo-700' : 'text-slate-900'}`}>{m.label}</span>
                  <span className={`text-xs font-medium ${multiplier === m.value ? 'text-indigo-500' : 'text-slate-400'}`}>{m.desc}</span>
                </div>
                {multiplier === m.value ? <CheckCircle className="text-indigo-600" size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-black tracking-tighter text-slate-900 mb-6 ml-1">Configurações</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <Weight className="text-slate-400" size={20} />
              <span className="font-bold text-slate-900">Unidades</span>
            </div>
            <span className="text-sm font-bold text-indigo-600">Métrico (kg)</span>
          </div>
          <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <Shield className="text-slate-400" size={20} />
              <span className="font-bold text-slate-900">Privacidade</span>
            </div>
            <ChevronRight className="text-slate-200" size={20} />
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center p-5 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600 font-bold transition-all active:scale-95"
          >
            Sair da Conta
          </button>
        </div>
      </section>
    </div>
  );
}
