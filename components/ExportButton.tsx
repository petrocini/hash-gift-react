import React, { useState } from "react";
import { EncryptedPair } from "../types";
import { decryptName } from "../utils/crypto";
import { Button } from "./Button";
import { FileSpreadsheet, Download, Copy, AlertTriangle } from "lucide-react";

interface ExportButtonProps {
  results: EncryptedPair[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ results }) => {
  const [showWarning, setShowWarning] = useState(false);

  const generateData = () => {
    const timestamp = new Date().toLocaleString("pt-BR");
    const baseUrl = window.location.href.split("?")[0];

    return results.map((pair) => {
      const receiver = decryptName(pair.encryptedReceiver);
      const link = `${baseUrl}?q=${pair.encryptedReceiver}`;
      return {
        giver: pair.giverName,
        giverPhone: pair.giverPhone || "-",
        receiver: receiver,
        link: link,
        date: timestamp,
      };
    });
  };

  const handleDownloadCSV = () => {
    const data = generateData();
    let csvContent =
      "Data,Participante,Telefone,Amigo Secreto,Link de Revelacao\n";

    data.forEach((row) => {
      const giver = `"${row.giver.replace(/"/g, '""')}"`;
      const phone = `"${row.giverPhone}"`;
      const receiver = `"${row.receiver.replace(/"/g, '""')}"`;
      csvContent += `"${row.date}",${giver},${phone},${receiver},"${row.link}"\n`;
    });

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `amigo-secreto-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyToClipboard = async () => {
    const data = generateData();
    let textContent = "Data\tParticipante\tTelefone\tAmigo Secreto\tLink\n";

    data.forEach((row) => {
      textContent += `${row.date}\t${row.giver}\t${row.giverPhone}\t${row.receiver}\t${row.link}\n`;
    });

    try {
      await navigator.clipboard.writeText(textContent);
      alert("Dados copiados! Abra o Google Sheets e pressione Ctrl+V.");
    } catch (err) {
      console.error("Falha ao copiar:", err);
      alert("Erro ao copiar para área de transferência.");
    }
  };

  if (!showWarning) {
    return (
      <Button
        variant="danger"
        onClick={() => setShowWarning(true)}
        className="w-full mt-4 border-dashed border-2 bg-transparent hover:bg-red-500/10"
      >
        <span className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" /> Gerar Planilha (Admin)
        </span>
      </Button>
    );
  }

  return (
    <div className="mt-4 p-4 bg-red-950/20 border border-red-500/30 rounded-xl animate-in slide-in-from-top-2">
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-red-200">
            Atenção: Quebra de Sigilo
          </h4>
          <p className="text-xs text-red-300/80 mt-1">
            Ao gerar a planilha, você terá acesso a{" "}
            <strong>todos os pares</strong> sorteados. Use apenas se necessário
            para controle manual.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleDownloadCSV}
          variant="secondary"
          className="text-xs"
        >
          <span className="flex items-center gap-2">
            <Download className="w-3 h-3" /> Baixar .CSV
          </span>
        </Button>
        <Button
          onClick={handleCopyToClipboard}
          variant="secondary"
          className="text-xs"
        >
          <span className="flex items-center gap-2">
            <Copy className="w-3 h-3" /> Copiar para Sheets
          </span>
        </Button>
      </div>

      <button
        onClick={() => setShowWarning(false)}
        className="w-full text-center text-xs text-slate-500 mt-3 hover:text-slate-300 underline"
      >
        Cancelar
      </button>
    </div>
  );
};
