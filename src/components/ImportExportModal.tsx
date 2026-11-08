import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  RotateCcw, 
  AlertCircle,
  FileJson,
  CheckCircle2
} from 'lucide-react';
import { exportDatabaseJSON, importDatabaseJSON } from '../utils/storage';

interface ImportExportModalProps {
  onClose: () => void;
  onDataReload: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  onClose,
  onDataReload,
}) => {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDownloadJSON = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmindex-pro-vademecum-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    const jsonStr = exportDatabaseJSON();
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setImportText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleApplyImport = () => {
    if (!importText.trim()) {
      setStatusMessage({ type: 'error', text: 'Por favor pegue el contenido JSON o cargue un archivo.' });
      return;
    }

    const res = importDatabaseJSON(importText);
    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: `Base de datos importada correctamente (${res.medCount || 0} medicamentos, ${res.classCount || 0} clasificaciones).`,
      });
      onDataReload();
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/20 text-teal-400 rounded-lg">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Copia de Seguridad & Respaldos
              </h2>
              <p className="text-xs text-slate-400">
                Exporte o importe su base de datos completa de medicamentos y protocolos
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 text-slate-800">
          {/* Export Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              1. Exportar Datos Actuales (Backup)
            </span>
            <p className="text-xs text-slate-600">
              Descargue un archivo JSON con todos los fármacos registrados, clasificaciones y guías clínicas para transferir entre dispositivos o guardar una copia de seguridad.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDownloadJSON}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Archivo JSON</span>
              </button>

              <button
                type="button"
                onClick={handleCopyJSON}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado!' : 'Copiar al Portapapeles'}</span>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              2. Importar o Restaurar Backup
            </span>
            <p className="text-xs text-slate-600">
              Seleccione un archivo JSON de respaldo o pegue el contenido para actualizar la base de datos de la aplicación.
            </p>

            <div className="space-y-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-medium text-slate-700 cursor-pointer shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Cargar archivo .json</span>
                <input 
                  type="file" 
                  accept=".json,application/json" 
                  onChange={handleFileChange}
                  className="hidden" 
                />
              </label>

              <textarea
                rows={3}
                placeholder="O pegue el contenido JSON aquí..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <button
              type="button"
              onClick={handleApplyImport}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Importar y Aplicar Cambios</span>
            </button>
          </div>

          {statusMessage && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
