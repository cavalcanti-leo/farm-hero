import React, { useState, useRef } from "react";
import { useTheme } from "@/lib/theme-context";
import {
  Upload,
  FileImage,
  X,
  CheckCircle2,
  Camera,
  Pill,
  AlertCircle,
  Send,
  Image,
} from "lucide-react";

interface ReceiptFile {
  id: string;
  name: string;
  preview: string;
  size: number;
  status: "ready" | "sending" | "sent" | "error";
}

export const ExportarDadosRoute: React.FC = () => {
  const {
    isDark,
    cardBgClass,
    cardBorderClass,
    textPrimaryClass,
    textSecondaryClass,
    pageBgClass,
  } = useTheme();
  const [files, setFiles] = useState<ReceiptFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: File[]) => {
    const receipts = newFiles
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({
        id: Math.random().toString(36).slice(2),
        name: f.name,
        preview: URL.createObjectURL(f),
        size: f.size,
        status: "ready" as const,
      }));
    setFiles((prev) => [...prev, ...receipts]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSend = async () => {
    if (files.length === 0) return;
    setSending(true);
    setFiles((prev) => prev.map((f) => ({ ...f, status: "sending" as const })));
    await new Promise((r) => setTimeout(r, 2000));
    setFiles((prev) => prev.map((f) => ({ ...f, status: "sent" as const })));
    setSending(false);
  };

  const readyCount = files.filter((f) => f.status === "ready").length;
  const sentCount = files.filter((f) => f.status === "sent").length;

  return (
    <div className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 ${pageBgClass}`}>
      {/* Header */}
      <div className={`rounded-3xl p-4 flex items-center gap-3 ${cardBgClass} ${cardBorderClass}`}>
        <div className="w-12 h-12 rounded-2xl bg-[#1a7a4a] text-white flex items-center justify-center shrink-0">
          <Pill className="w-7 h-7" />
        </div>
        <div>
          <h1 className={`text-base font-black leading-tight ${textPrimaryClass}`}>
            Enviar Receitas Médicas
          </h1>
          <p className={`text-xs font-bold ${textSecondaryClass}`}>
            Envie fotos das suas receitas para o farmacêutico de forma segura.
          </p>
        </div>
      </div>

      {/* Info box */}
      <div
        className={`rounded-2xl p-3 flex items-start gap-3 ${isDark ? "bg-blue-950 border border-blue-900" : "bg-blue-50 border border-blue-200"}`}
      >
        <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <p
          className={`text-xs font-semibold leading-snug ${isDark ? "text-blue-300" : "text-blue-700"}`}
        >
          As imagens são enviadas com criptografia de ponta a ponta e só podem ser vistas pelo seu
          farmacêutico vinculado.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-10 cursor-pointer transition-all ${
          dragging
            ? "border-[#00b09b] bg-green-50"
            : isDark
              ? "border-slate-700 hover:border-[#00b09b] bg-slate-800"
              : "border-gray-300 hover:border-[#00b09b] bg-white"
        }`}
      >
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${dragging ? "bg-green-100" : isDark ? "bg-slate-700" : "bg-gray-100"}`}
        >
          <Upload
            className={`w-8 h-8 ${dragging ? "text-[#1a7a4a]" : isDark ? "text-slate-400" : "text-gray-400"}`}
          />
        </div>
        <div className="text-center">
          <p className={`font-black text-sm ${textPrimaryClass}`}>
            {dragging ? "Solte as imagens aqui!" : "Arraste ou clique para selecionar"}
          </p>
          <p className={`text-xs font-semibold ${textSecondaryClass} mt-0.5`}>
            PNG, JPG, HEIC — receitas médicas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-[#1a7a4a] text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-[#156038] transition-colors">
            <FileImage className="w-3.5 h-3.5" /> Selecionar arquivo
          </button>
          <button className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-black px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors">
            <Camera className="w-3.5 h-3.5" /> Câmera
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          capture="environment"
        />
      </div>

      {/* Lista de arquivos */}
      {files.length > 0 && (
        <div className={`rounded-3xl overflow-hidden ${cardBgClass} ${cardBorderClass}`}>
          <div
            className={`px-4 py-3 flex items-center justify-between border-b ${isDark ? "border-slate-700" : "border-gray-100"}`}
          >
            <span className={`text-xs font-black ${textSecondaryClass}`}>
              {files.length} receita(s)
            </span>
            {sentCount > 0 && (
              <span className="text-[10px] font-black text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                {sentCount} enviada(s) ✅
              </span>
            )}
          </div>
          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                  <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${textPrimaryClass}`}>{file.name}</p>
                  <p className={`text-[11px] font-semibold ${textSecondaryClass}`}>
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {file.status === "ready" && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="w-7 h-7 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {file.status === "sending" && (
                    <div className="w-5 h-5 border-2 border-[#1a7a4a] border-t-transparent rounded-full animate-spin" />
                  )}
                  {file.status === "sent" && <CheckCircle2 className="w-5 h-5 text-[#1a7a4a]" />}
                </div>
              </div>
            ))}
          </div>

          {/* Botão enviar */}
          {readyCount > 0 && (
            <div
              className={`px-4 py-3 border-t ${isDark ? "border-slate-700" : "border-gray-100"}`}
            >
              <button
                onClick={handleSend}
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#1a7a4a] hover:bg-[#156038] text-white text-sm font-black rounded-2xl transition-all disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Enviar {readyCount} receita(s)
                  </>
                )}
              </button>
            </div>
          )}

          {sentCount === files.length && files.length > 0 && (
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-black text-green-800">
                    Receitas enviadas com sucesso!
                  </p>
                  <p className="text-[11px] font-semibold text-green-600">
                    Seu farmacêutico foi notificado.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
