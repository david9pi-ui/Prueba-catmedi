import React, { useState } from 'react';
import { DrugClassification } from '../types/pharmacy';
import { X, Layers, Save } from 'lucide-react';

interface ClassificationFormModalProps {
  initialData?: DrugClassification | null;
  onSave: (classification: DrugClassification) => void;
  onClose: () => void;
}

const THERAPEUTIC_AREAS = [
  'Dolor e Inflamación',
  'Infectología',
  'Cardiología y Nefrología',
  'Endocrinología y Metabolismo',
  'Gastroenterología',
  'Neumología y Respiratorio',
  'Hematología y Hemostasia',
  'Salud Mental y Psiquiatría',
  'Neurología',
  'Alergología e Inmunología',
  'Dermatología',
  'Oftalmología',
  'Ginecología y Obstetricia',
  'Urología',
  'Oncología',
];

export const ClassificationFormModal: React.FC<ClassificationFormModalProps> = ({
  initialData,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [therapeuticArea, setTherapeuticArea] = useState(initialData?.therapeuticArea || THERAPEUTIC_AREAS[0]);
  const [description, setDescription] = useState(initialData?.description || '');
  const [mechanismSummary, setMechanismSummary] = useState(initialData?.mechanismSummary || '');
  const [colorTheme, setColorTheme] = useState(initialData?.colorTheme || 'indigo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor introduzca el nombre de la clasificación.');
      return;
    }

    const item: DrugClassification = {
      id: initialData?.id || `class-${Date.now()}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      therapeuticArea,
      description: description.trim() || 'Grupo farmacológico clínico.',
      mechanismSummary: mechanismSummary.trim() || 'Mecanismo farmacodinámico característico.',
      colorTheme,
    };

    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {initialData ? 'Editar Clasificación' : 'Crear Nueva Clasificación / Grupo'}
              </h2>
              <p className="text-xs text-slate-400">
                Agrupe medicamentos bajo una misma familia farmacológica
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nombre de la Clasificación o Familia *
            </label>
            <input
              type="text"
              required
              placeholder="ej. Diuréticos de Asa, Betabloqueantes..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Área Terapéutica / Especialidad
            </label>
            <select
              value={therapeuticArea}
              onChange={(e) => setTherapeuticArea(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {THERAPEUTIC_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Descripción General del Grupo
            </label>
            <textarea
              rows={2}
              placeholder="Definición clínica de los fármacos pertenecientes a este grupo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Resumen del Mecanismo Farmacológico
            </label>
            <textarea
              rows={2}
              placeholder="Mecanismo bioquímico común del grupo..."
              value={mechanismSummary}
              onChange={(e) => setMechanismSummary(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Clasificación</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
