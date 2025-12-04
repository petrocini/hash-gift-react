import React, { useState, useEffect } from "react";
import { X, Save, RotateCcw, MessageSquareText } from "lucide-react";
import { Button } from "./Button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: string;
  onSave: (template: string) => void;
  defaultTemplate: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTemplate,
  onSave,
  defaultTemplate,
}) => {
  const [text, setText] = useState(currentTemplate);

  useEffect(() => {
    if (isOpen) {
      setText(currentTemplate);
    }
  }, [isOpen, currentTemplate]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(text);
    onClose();
  };

  const handleReset = () => {
    if (confirm("Restaurar o texto padrão?")) {
      setText(defaultTemplate);
    }
  };

  const insertTag = (tag: string) => {
    const textArea = document.getElementById(
      "message-template"
    ) as HTMLTextAreaElement;
    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const newText = text.substring(0, start) + tag + text.substring(end);
      setText(newText);
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(start + tag.length, start + tag.length);
      }, 0);
    } else {
      setText((prev) => prev + tag);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <MessageSquareText className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Configurar Mensagem
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="text-sm text-slate-400 mb-4">
            Personalize a mensagem enviada pelo WhatsApp. Use as variáveis
            abaixo para inserir dados dinâmicos:
          </p>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => insertTag("{nome}")}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-md transition-colors"
            >
              {"{nome}"}
            </button>
            <button
              onClick={() => insertTag("{link}")}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-blue-500/30 text-blue-400 text-xs font-mono rounded-md transition-colors"
            >
              {"{link}"}
            </button>
          </div>

          <textarea
            id="message-template"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
            placeholder="Digite sua mensagem aqui..."
          />

          <div className="mt-2 text-xs text-slate-500 flex justify-between">
            <span>Variáveis obrigatórias para um bom funcionamento.</span>
            {!text.includes("{link}") && (
              <span className="text-red-400 font-medium">
                Atenção: A variável {"{link}"} está faltando!
              </span>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-white/5 flex justify-between bg-slate-900/50 rounded-b-2xl">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Restaurar Padrão
          </button>

          <Button onClick={handleSave} disabled={!text.trim()}>
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" /> Salvar Alterações
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
