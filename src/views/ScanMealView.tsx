import React, { useState, useRef } from 'react';
import { UserProfile, Screen } from '../models/types';
import { ArrowLeft, Camera, Loader2, Info } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp } from '../services/firebaseService';
import { fatSecretService } from '../services/fatsecretService';
import { GoogleGenAI } from "@google/genai";
import { extractProteinFromDescription } from '../utils/mealParsers';
import { Button } from '../components/common/Button';

interface ScanMealProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
}

export default function ScanMealView({ user, onNavigate }: ScanMealProps) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ name: string; protein: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (base64Image: string) => {
    setScanning(true);
    setError(null);
    try {
      let foodName = '';
      const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
      
      try {
        const recognitionResult = await fatSecretService.recognize(base64Image);
        if (recognitionResult && recognitionResult.food_predictions) {
          foodName = recognitionResult.food_predictions.food_prediction[0].food_name;
        }
      } catch (fsErr) {
        console.warn("FatSecret Recognition failed, falling back to Gemini", fsErr);
      }

      if (!foodName) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = "Identifique o alimento principal nesta imagem e retorne APENAS o nome do alimento em português. Exemplo: 'Frango Grelhado'.";
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: base64Data } }
            ]
          }
        });
        
        foodName = response.text.trim().replace(/[*_#]/g, '');
      }

      if (!foodName) throw new Error("Não foi possível identificar o alimento.");

      try {
        const searchResults = await fatSecretService.search(foodName);
        if (searchResults.length > 0) {
          const food = searchResults[0];
          setResult({
            name: food.food_name,
            protein: extractProteinFromDescription(food.food_description)
          });
          setScanning(false);
          return;
        }
      } catch (searchErr) {
        console.warn("FatSecret Search failed, using Gemini for estimation", searchErr);
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const proteinPrompt = `Estime a quantidade de proteína (em gramas) para uma porção média de '${foodName}'. Retorne APENAS o número.`;
      
      const proteinResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: proteinPrompt
      });
      
      const estimatedProtein = parseInt(proteinResponse.text.replace(/\D/g, '')) || 0;
      setResult({
        name: foodName,
        protein: estimatedProtein
      });
    } catch (err: any) {
      console.error("Scan Error:", err);
      setError("Erro ao processar imagem. Tente novamente ou insira manualmente.");
    } finally {
      setScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      processImage(base64String);
    };
    reader.readAsDataURL(file);
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
        <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')} className="-ml-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-black tracking-tighter text-slate-900">Scan de Refeição</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
          <img src={user.photoURL || ''} alt="User" className="w-full h-full object-cover" />
        </div>
      </header>

      <div className="max-w-md mx-auto space-y-8">
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
                <span className="text-white font-bold tracking-widest text-[10px] uppercase">Analisando via FatSecret</span>
              </div>
            </div>
          ) : !result ? (
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="relative z-10 w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white flex items-center justify-center text-white active:scale-90 transition-transform"
              >
                <Camera size={32} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          ) : null}

          <div className="absolute top-10 left-10 w-12 h-12 border-t-4 border-l-4 border-white/80 rounded-tl-2xl"></div>
          <div className="absolute top-10 right-10 w-12 h-12 border-t-4 border-r-4 border-white/80 rounded-tr-2xl"></div>
          <div className="absolute bottom-10 left-10 w-12 h-12 border-b-4 border-l-4 border-white/80 rounded-bl-2xl"></div>
          <div className="absolute bottom-10 right-10 w-12 h-12 border-b-4 border-r-4 border-white/80 rounded-br-2xl"></div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3">
            <Info size={20} />
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tighter text-slate-900">Alimentos Identificados</h2>
              <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold">{result.protein}g Total</span>
            </div>

            <div className="bg-white p-5 rounded-3xl flex items-center justify-between border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Loader2 size={24} className="animate-pulse" />
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
              <Button 
                fullWidth 
                size="xl" 
                onClick={handleConfirm}
                loading={loading}
              >
                Confirmar e Salvar
              </Button>
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
