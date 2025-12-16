import React, { useState } from "react";
import { X, ClipboardList, CheckCircle2 } from "lucide-react";
import { Button } from "./Button";
import { parseTextList } from "../utils/textParser";
import { Input } from "./Input";

interface PasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: { name: string; phone?: string }[]) => void;
}

export const PasteModal: React.FC<PasteModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [text, setText] = useState("");
  const [defaultDDD, setDefaultDDD] = useState("");

  if (!isOpen) return null;

  const handleProcess = () => {
    const data = parseTextList(text, defaultDDD);

    if (data.length > 0) {
      onImport(data);
      setText("");
      onClose();
    } else {
      alert(
        "Nenhum participante identificado. Verifique se o formato está correto (Nome Telefone)."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-400" />
            Colar Lista em Massa
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="text-sm text-slate-400">
              <p className="mb-2">
                Cole sua lista abaixo. O sistema entende formatos variados como:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-500 text-xs font-mono">
                <li>Nome 99999-9999</li>
                <li>Nome 99999:9999</li>
                <li>Nome "Apelido" 99999999</li>
              </ul>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-lg border border-white/5">
              <Input
                label="DDD Padrão (Opcional)"
                placeholder="Ex: 11"
                maxLength={2}
                value={defaultDDD}
                onChange={(e) =>
                  setDefaultDDD(e.target.value.replace(/\D/g, ""))
                }
                className="bg-slate-950"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Será adicionado automaticamente se o número tiver apenas 8 ou 9
                dígitos.
              </p>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none custom-scrollbar"
            placeholder={`Exemplo:\nCarlinho 99978:3880\nIsabela 99988-5015\nMaurício "esposo" 999973493\nJoice 999695304`}
          />
        </div>

        <div className="p-5 border-t border-white/5 bg-slate-900/50 rounded-b-2xl flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleProcess} disabled={!text.trim()}>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Processar Lista
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
