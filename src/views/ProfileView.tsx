import React, { useState } from 'react';
import { UserProfile, Screen } from '../models/types';
import { Edit2, LogOut, Shield, Weight, ChevronRight, CheckCircle } from 'lucide-react';
import { db, doc, updateDoc } from '../services/firebaseService';

interface ProfileProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
  logout: () => void;
}

export default function ProfileView({ user, onNavigate, logout }: ProfileProps) {
  const [weight, setWeight] = useState(user.weight);
  const [height, setHeight] = useState(user.height || 170);
  const [goal, setGoal] = useState(user.proteinGoal);
  const [multiplier, setMultiplier] = useState(user.multiplier);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>(user.weightUnit || 'kg');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e?: React.FormEvent, updatedFields?: Partial<UserProfile>) => {
    if (e) e.preventDefault();
    
    if (user.uid.startsWith('guest-')) {
      // Para visitantes, apenas simulamos o sucesso no estado local
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      return;
    }

    setLoading(true);
    setSuccess(false);
    try {
      const dataToUpdate = {
        weight,
        height,
        proteinGoal: goal,
        multiplier,
        weightUnit,
        ...updatedFields
      };
      await updateDoc(doc(db, 'users', user.uid), dataToUpdate);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    const newUnit = weightUnit === 'kg' ? 'lb' : 'kg';
    setWeightUnit(newUnit);
    
    let newWeight = weight;
    if (newUnit === 'lb') {
      newWeight = Math.round(weight * 2.20462 * 10) / 10;
    } else {
      newWeight = Math.round(weight / 2.20462 * 10) / 10;
    }
    setWeight(newWeight);
    
    handleUpdate(undefined, { weightUnit: newUnit, weight: newWeight });
  };

  const handleSignOut = () => {
    logout();
  };

  const calculateBMI = () => {
    if (!weight || !height || height <= 0) return null;
    const weightInKg = weightUnit === 'kg' ? weight : weight / 2.20462;
    const heightInMeters = height / 100;
    return weightInKg / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { label: 'Abaixo do peso', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
    if (bmiValue < 25) return { label: 'Peso normal', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
    if (bmiValue < 30) return { label: 'Sobrepeso', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' };
    if (bmiValue < 35) return { label: 'Obesidade Grau I', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' };
    if (bmiValue < 40) return { label: 'Obesidade Grau II', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' };
    return { label: 'Obesidade Grau III', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' };
  };

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(bmi) : null;

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
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
              {user.uid.startsWith('guest-') ? 'Sessão de Visitante' : 'Plano Atleta Pro'}
            </p>
          </div>
        </div>
      </header>

      <section className="mb-10 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-slate-50 rounded-2xl">
            <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 block mb-2">Peso</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">{weight}</span>
              <span className="text-[10px] font-bold text-slate-400">{weightUnit}</span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl">
            <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 block mb-2">Altura</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">{height}</span>
              <span className="text-[10px] font-bold text-slate-400">cm</span>
            </div>
          </div>
          <div className="p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-100">
            <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 block mb-2">Meta</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-indigo-700">{goal}</span>
              <span className="text-[10px] font-bold text-indigo-500">g</span>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => handleUpdate(e)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2 ml-1">Peso ({weightUnit})</label>
              <input 
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => {
                  const newWeight = Number(e.target.value);
                  setWeight(newWeight);
                  const effectiveMultiplier = weightUnit === 'kg' ? multiplier : multiplier / 2.20462;
                  setGoal(Math.round(newWeight * effectiveMultiplier));
                }}
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-lg font-black text-slate-900 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2 ml-1">Altura (cm)</label>
              <input 
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-lg font-black text-slate-900 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2 ml-1">Meta (g)</label>
              <input 
                type="number"
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-lg font-black text-slate-900 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              />
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

        {bmi && bmiInfo && (
          <div className={`mt-8 p-6 rounded-3xl border-2 ${bmiInfo.bg} ${bmiInfo.border} transition-all animate-in fade-in slide-in-from-top-4 duration-500`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Seu IMC (OMS)</span>
              <span className={`text-xs font-black px-3 py-1 rounded-full bg-white shadow-sm ${bmiInfo.color}`}>
                {bmi.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${bmiInfo.color.replace('text', 'bg')}`}></div>
              <span className={`text-lg font-black tracking-tight ${bmiInfo.color}`}>
                {bmiInfo.label}
              </span>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 font-medium leading-tight">
              O Índice de Massa Corporal (IMC) é um parâmetro da Organização Mundial da Saúde para avaliar o peso ideal.
            </p>
          </div>
        )}
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
          <button 
            onClick={toggleUnit}
            className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <Weight className="text-slate-400" size={20} />
              <span className="font-bold text-slate-900">Unidades</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${weightUnit === 'kg' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>KG</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${weightUnit === 'lb' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>LB</span>
            </div>
          </button>
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
