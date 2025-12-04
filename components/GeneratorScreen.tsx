import React, { useState } from "react";
import { Participant, EncryptedPair } from "../types";
import { Button } from "./Button";
import { Input } from "./Input";
import { ParticipantList } from "./ParticipantList";
import { encryptName } from "../utils/crypto";
import {
  Gift,
  Share2,
  Sparkles,
  RefreshCw,
  UserPlus,
  Settings,
} from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import { SettingsModal } from "./SettingsModal";

const DEFAULT_TEMPLATE = `\uD83C\uDF85 Ho Ho Ho! Ol\u00E1 {nome}!\n\nSeu Amigo Secreto j\u00E1 foi sorteado. Clique no link abaixo para descobrir quem voc\u00EA tirou (\u00E9 segredo! \uD83E\uDD2B):\n\n{link}`;

export const GeneratorScreen: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [name, setName] = useState("");
  const [results, setResults] = useState<EncryptedPair[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [messageTemplate, setMessageTemplate] = useLocalStorage<string>(
    "santa_msg_template",
    DEFAULT_TEMPLATE
  );

  const addParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setParticipants([
      ...participants,
      { id: crypto.randomUUID(), name: name.trim() },
    ]);
    setName("");
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const handleSorteio = () => {
    if (participants.length < 2) return;

    const pool = [...participants];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const generatedPairs: EncryptedPair[] = pool.map((giver, index) => {
      const receiver = pool[(index + 1) % pool.length];

      return {
        giverName: giver.name,
        encryptedReceiver: encryptName(receiver.name),
      };
    });

    setResults(generatedPairs);
    setIsGenerated(true);
  };

  const getWhatsAppLink = (pair: EncryptedPair) => {
    const baseUrl = window.location.href.split("?")[0];
    const revealUrl = `${baseUrl}?q=${pair.encryptedReceiver}`;

    let message = messageTemplate
      .replace("{nome}", pair.giverName)
      .replace("{link}", revealUrl);

    if (!message.includes(revealUrl)) {
      message += `\n\n${revealUrl}`;
    }

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  };

  const reset = () => {
    setParticipants([]);
    setResults([]);
    setIsGenerated(false);
  };

  if (isGenerated) {
    return (
      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 bg-gradient-to-r from-emerald-900/50 to-slate-900 border-b border-white/5 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Sorteio Realizado!
          </h2>
          <p className="text-slate-400 text-sm">
            Envie os links individuais para cada participante.
          </p>
        </div>

        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {results.map((pair, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                  {pair.giverName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-slate-200">{pair.giverName}</p>
                  <p className="text-xs text-slate-500">Clique para enviar</p>
                </div>
              </div>

              <a
                href={getWhatsAppLink(pair)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-all active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 bg-slate-900/50">
          <Button
            onClick={reset}
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Novo Sorteio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="p-6 border-b border-white/5 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2.5 rounded-xl shadow-lg shadow-emerald-900/20">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Amigo Secreto</h1>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Gerador Seguro
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Configurações"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={addParticipant} className="flex gap-2">
            <Input
              label="Novo Participante"
              placeholder="Nome ou Apelido"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <Button
              type="submit"
              variant="secondary"
              className="mt-[26px]"
              disabled={!name.trim()}
            >
              <UserPlus className="w-5 h-5" />
            </Button>
          </form>

          <div className="bg-slate-950/30 rounded-xl border border-white/5 min-h-[200px] max-h-[300px] overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-2">
              <ParticipantList
                participants={participants}
                onRemove={removeParticipant}
                readOnly={false}
              />
            </div>
          </div>

          <Button
            onClick={handleSorteio}
            disabled={participants.length < 2}
            className="w-full py-4 text-lg shadow-xl shadow-emerald-900/20"
          >
            Realizar Sorteio
          </Button>

          <p className="text-center text-xs text-slate-500 px-4">
            A lógica roda no seu navegador. Os links gerados contêm o resultado
            criptografado.
          </p>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTemplate={messageTemplate}
        onSave={setMessageTemplate}
        defaultTemplate={DEFAULT_TEMPLATE}
      />
    </>
  );
};
