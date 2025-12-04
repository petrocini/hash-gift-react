import React from 'react';
import { Participant } from '../types';
import { Trash2, User } from 'lucide-react';

interface ParticipantListProps {
  participants: Participant[];
  onRemove: (id: string) => void;
  readOnly: boolean;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({ participants, onRemove, readOnly }) => {
  if (participants.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-4">
        <User className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">Nenhum participante adicionado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {participants.map((p) => (
        <div 
          key={p.id} 
          className="group flex items-center justify-between p-3 bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 rounded-lg transition-all animate-in slide-in-from-left-2 duration-300"
        >
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-xs font-bold text-slate-400">
               {p.name.charAt(0).toUpperCase()}
             </div>
             <span className="font-medium text-slate-200">{p.name}</span>
          </div>
          
          {!readOnly && (
            <button 
              onClick={() => onRemove(p.id)}
              className="text-slate-600 hover:text-red-400 p-2 rounded-md hover:bg-red-500/10 transition-colors"
              aria-label="Remover"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};