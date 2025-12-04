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
  Phone,
  Copy,
  Check,
} from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import { SettingsModal } from "./SettingsModal";
import { ExportButton } from "./ExportButton";

const DEFAULT_TEMPLATE = `\uD83C\uDF85 Ho Ho Ho! Ol\u00E1 {nome}!\n\nSeu Amigo Secreto j\u00E1 foi sorteado. Clique no link abaixo para descobrir quem voc\u00EA tirou (\u00E9 segredo! \uD83E\uDD2B):\n\n{link}`;

export const GeneratorScreen: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<EncryptedPair[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [messageTemplate, setMessageTemplate] = useLocalStorage<string>(
    "santa_msg_template",
    DEFAULT_TEMPLATE
  );

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");

    setPhone(value);
  };

  const addParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setParticipants([
      ...participants,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        phone: phone.trim() || undefined,
      },
    ]);
    setName("");
    setPhone("");
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
        giverPhone: giver.phone,
        encryptedReceiver: encryptName(receiver.name),
      };
    });

    setResults(generatedPairs);
    setIsGenerated(true);
  };

  const generateMessageText = (pair: EncryptedPair) => {
    const baseUrl = window.location.href.split("?")[0];
    const revealUrl = `${baseUrl}?q=${pair.encryptedReceiver}`;

    let message = messageTemplate
      .replace("{nome}", pair.giverName)
      .replace("{link}", revealUrl);

    if (!message.includes(revealUrl)) {
      message += `\n\n${revealUrl}`;
    }
    return message;
  };

  const getWhatsAppLink = (pair: EncryptedPair) => {
    const message = generateMessageText(pair);
    let url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;

    if (pair.giverPhone) {
      const cleanPhone = pair.giverPhone.replace(/\D/g, "");
      if (cleanPhone.length >= 10) {
        url += `&phone=55${cleanPhone}`;
      }
    }

    return url;
  };

  const handleCopyMessage = async (pair: EncryptedPair, idx: number) => {
    const message = generateMessageText(pair);
    try {
      await navigator.clipboard.writeText(message);
      setCopiedId(idx.toString());
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Falha ao copiar", err);
    }
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

        <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar">
          {results.map((pair, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                  {pair.giverName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-200">
                      {pair.giverName}
                    </p>
                    {pair.giverPhone && (
                      <span className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded border border-slate-600">
                        {pair.giverPhone}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {pair.giverPhone ? "Envio direto" : "Selecionar contato"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyMessage(pair, idx)}
                  className="p-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors active:scale-95 border border-white/5"
                  title="Copiar mensagem"
                >
                  {copiedId === idx.toString() ? (
                    <Check className="w-4 h-4 text-emerald-400 animate-in zoom-in" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={getWhatsAppLink(pair)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
                >
                  <Share2 className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 bg-slate-900/50 flex flex-col gap-3">
          <ExportButton results={results} />

          <div className="h-px bg-white/5 w-full my-1"></div>

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
          <form
            onSubmit={addParticipant}
            className="flex flex-col sm:flex-row gap-2 items-end"
          >
            <div className="w-full sm:flex-1 space-y-2">
              <Input
                label="Nome do Participante"
                placeholder="Ex: João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <Input
                label="WhatsApp (Opcional)"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={handlePhoneChange}
                inputMode="numeric"
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="w-full sm:w-auto h-[42px] mb-[1px]"
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
