import React, { useEffect, useState } from "react";
import { decryptName } from "../utils/crypto";
import { Button } from "./Button";
import { Gift, AlertTriangle, Eye, EyeOff } from "lucide-react";

export const RevelationScreen: React.FC = () => {
  const [revealedName, setRevealedName] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = params.get("q");

    if (!hash) {
      setError(true);
      return;
    }

    const result = decryptName(hash);
    if (!result) {
      setError(true);
    } else {
      setRevealedName(result);
    }
  }, []);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  if (error) {
    return (
      <div className="w-full max-w-md bg-red-950/30 backdrop-blur-md border border-red-500/20 rounded-2xl p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-200 mb-2">Link Inválido</h2>
        <p className="text-red-400 mb-6">
          Não foi possível ler o segredo deste link. Verifique se ele está
          completo.
        </p>
        <Button
          onClick={() => (window.location.href = window.location.origin)}
          variant="secondary"
        >
          Voltar para Início
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8 text-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-green-500 to-red-500 opacity-50"></div>

        <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Gift className="w-10 h-10 text-emerald-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Seu Amigo Secreto
        </h1>
        <p className="text-slate-400 mb-8">O momento da verdade chegou!</p>

        {!isRevealed ? (
          <div className="py-8">
            <Button
              onClick={handleReveal}
              className="w-full py-4 text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-0"
            >
              <span className="flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" /> REVELAR AGORA
              </span>
            </Button>
          </div>
        ) : (
          <div className="animate-in zoom-in duration-500">
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 mb-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
              <p className="text-sm text-slate-500 uppercase tracking-widest mb-2 font-semibold">
                Você tirou:
              </p>
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm">
                {revealedName}
              </h2>
            </div>

            <p className="text-sm text-slate-500 mb-6">
              Tire um print para não esquecer! 📸
            </p>

            <Button
              onClick={() => setIsRevealed(false)}
              variant="secondary"
              className="text-slate-400 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <EyeOff className="w-4 h-4" /> Esconder Novamente
              </span>
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <a
          href={window.location.origin}
          className="text-slate-500 hover:text-emerald-400 text-sm underline transition-colors"
        >
          Criar meu próprio sorteio
        </a>
      </div>
    </div>
  );
};
