import React, { useState } from 'react';
import { ClinicalCaseProtocol, ClinicalTherapyStep } from '../types/pharmacy';
import { X, Stethoscope, Plus, Trash2, Save } from 'lucide-react';

interface ClinicalCaseFormModalProps {
  initialData?: ClinicalCaseProtocol | null;
  onSave: (item: ClinicalCaseProtocol) => void;
  onClose: () => void;
}

export const ClinicalCaseFormModal: React.FC<ClinicalCaseFormModalProps> = ({
  initialData,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || 'Cardiovascular y Renal');
  const [clinicalSummary, setClinicalSummary] = useState(initialData?.clinicalSummary || '');
  const [symptomsStr, setSymptomsStr] = useState(initialData?.symptomsAndSigns.join('\n') || '');

  // 1st line steps
  const [firstLine, setFirstLine] = useState<ClinicalTherapyStep[]>(
    initialData?.firstLineTherapy || [
      { drugName: '', dosage: '', duration: '', notes: '' },
    ]
  );

  // 2nd line steps
  const [secondLine, setSecondLine] = useState<ClinicalTherapyStep[]>(
    initialData?.secondLineTherapy || []
  );

  const [contraindicationsStr, setContraindicationsStr] = useState(
    initialData?.contraindications.join('\n') || ''
  );
  const [redFlagsStr, setRedFlagsStr] = useState(initialData?.redFlags.join('\n') || '');
  const [nonPharmStr, setNonPharmStr] = useState(
    initialData?.nonPharmacologicalMeasures.join('\n') || ''
  );
  const [evidenceLevel, setEvidenceLevel] = useState(initialData?.evidenceLevel || 'Guía Clínica Institucional');

  const handleAddFirstLine = () => {
    setFirstLine((prev) => [...prev, { drugName: '', dosage: '', duration: '', notes: '' }]);
  };

  const handleUpdateFirstLine = (index: number, field: keyof ClinicalTherapyStep, val: string) => {
    setFirstLine((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleRemoveFirstLine = (index: number) => {
    setFirstLine((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSecondLine = () => {
    setSecondLine((prev) => [...prev, { drugName: '', dosage: '', duration: '', notes: '' }]);
  };

  const handleUpdateSecondLine = (index: number, field: keyof ClinicalTherapyStep, val: string) => {
    setSecondLine((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleRemoveSecondLine = (index: number) => {
    setSecondLine((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor introduzca el título de la patología o caso.');
      return;
    }

    const item: ClinicalCaseProtocol = {
      id: initialData?.id || `case-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      clinicalSummary: clinicalSummary.trim() || 'Protocolo terapéutico.',
      symptomsAndSigns: symptomsStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      firstLineTherapy: firstLine.filter((t) => t.drugName.trim().length > 0),
      secondLineTherapy: secondLine.filter((t) => t.drugName.trim().length > 0),
      contraindications: contraindicationsStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      redFlags: redFlagsStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      nonPharmacologicalMeasures: nonPharmStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      evidenceLevel: evidenceLevel.trim(),
      isCustom: true,
    };

    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {initialData ? 'Editar Protocolo de Tratamiento' : 'Nuevo Protocolo: ¿Qué tomar en cada caso?'}
              </h2>
              <p className="text-xs text-slate-400">
                Defina la 1ª y 2ª línea de prescripción médica recomendada
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

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-800 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Patología / Diagnóstico *
              </label>
              <input
                type="text"
                required
                placeholder="ej. Crisis Asmática Leve, Cistitis Aguda..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Categoría / Especialidad
              </label>
              <input
                type="text"
                placeholder="ej. Respiratorio, Infectología, Dolor..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Resumen Clínico y Objetivo Terapéutico
            </label>
            <textarea
              rows={2}
              placeholder="Descripción del cuadro y meta del tratamiento..."
              value={clinicalSummary}
              onChange={(e) => setClinicalSummary(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Síntomas Guía y Hallazgos (uno por línea)
            </label>
            <textarea
              rows={2}
              placeholder="Fiebre > 38°C&#10;Disuria intensa&#10;Dolor suprapúbico"
              value={symptomsStr}
              onChange={(e) => setSymptomsStr(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
            />
          </div>

          {/* 1st Line Prescriptions */}
          <div className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Tratamiento de 1ª Línea (Recomendado) *
              </span>
              <button
                type="button"
                onClick={handleAddFirstLine}
                className="text-xs text-emerald-700 font-bold hover:text-emerald-900 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Fármaco
              </button>
            </div>

            {firstLine.map((step, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-white p-3 rounded-lg border border-emerald-200 text-xs">
                <input
                  type="text"
                  placeholder="Fármaco (ej. Amoxicilina)"
                  value={step.drugName}
                  onChange={(e) => handleUpdateFirstLine(i, 'drugName', e.target.value)}
                  className="px-2 py-1.5 rounded border border-slate-300 font-semibold"
                />
                <input
                  type="text"
                  placeholder="Dosis (ej. 500mg c/8h)"
                  value={step.dosage}
                  onChange={(e) => handleUpdateFirstLine(i, 'dosage', e.target.value)}
                  className="px-2 py-1.5 rounded border border-slate-300"
                />
                <input
                  type="text"
                  placeholder="Duración (ej. 7 a 10 días)"
                  value={step.duration}
                  onChange={(e) => handleUpdateFirstLine(i, 'duration', e.target.value)}
                  className="px-2 py-1.5 rounded border border-slate-300"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Notas o justificación"
                    value={step.notes}
                    onChange={(e) => handleUpdateFirstLine(i, 'notes', e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded border border-slate-300"
                  />
                  {firstLine.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFirstLine(i)}
                      className="p-1 text-rose-500 hover:bg-rose-100 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 2nd Line Prescriptions */}
          <div className="space-y-3 bg-sky-50/50 p-4 rounded-xl border border-sky-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-950 uppercase tracking-wider">
                Tratamiento de 2ª Línea o Alternativas (Alergias / Intolerancia)
              </span>
              <button
                type="button"
                onClick={handleAddSecondLine}
                className="text-xs text-sky-700 font-bold hover:text-sky-900 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Alternativa
              </button>
            </div>

            {secondLine.map((step, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-white p-3 rounded-lg border border-sky-200 text-xs">
                <input
                  type="text"
                  placeholder="Fármaco alternativo"
                  value={step.drugName}
                  onChange={(e) => handleUpdateSecondLine(i, 'drugName', e.target.value)}
                  className="px-2 py-1.5 rounded border border-slate-300 font-semibold"
                />
                <input
                  type="text"
                  placeholder="Dosis"
                  value={step.dosage}
                  onChange={(e) => handleUpdateSecondLine(i, 'dosage', e.target.value)}
                  className="px-2 py-1.5 rounded border border-slate-300"
                />
                <input
                  type="text"
                  placeholder="Duración"
                  value={step.duration}
                  onChange={(e) => handleUpdateSecondLine(i, 'duration', e.target.value)}
                  className="px-2 py-1.5 rounded border border-slate-300"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="En caso de... (ej. alergia a penicilina)"
                    value={step.notes}
                    onChange={(e) => handleUpdateSecondLine(i, 'notes', e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSecondLine(i)}
                    className="p-1 text-rose-500 hover:bg-rose-100 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-rose-800 mb-1">
                Banderas Rojas ("Red Flags") / Alertas
              </label>
              <textarea
                rows={2}
                placeholder="Fiebre > 39°C con rigidez nucal&#10;Disfagia progresiva"
                value={redFlagsStr}
                onChange={(e) => setRedFlagsStr(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-rose-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-800 mb-1">
                Contraindicaciones
              </label>
              <textarea
                rows={2}
                placeholder="Embarazo en 3er trimestre&#10;Falla renal grave"
                value={contraindicationsStr}
                onChange={(e) => setContraindicationsStr(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-amber-300 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Protocolo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
