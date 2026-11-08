import React from 'react';
import { Medication, PregnancyCategory } from '../types/pharmacy';
import { 
  FileText, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck, 
  Pill,
  Baby,
  Eye
} from 'lucide-react';

interface MedicationCardProps {
  medication: Medication;
  onViewDetails: (med: Medication) => void;
  onEdit: (med: Medication) => void;
  onDelete: (id: string) => void;
  onSelectCategory?: (category: string) => void;
}

export const getPregnancyBadgeClass = (category: PregnancyCategory) => {
  switch (category) {
    case 'A':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'B':
      return 'bg-sky-100 text-sky-800 border-sky-300';
    case 'C':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'D':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'X':
      return 'bg-red-100 text-red-800 border-red-300 font-bold';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onViewDetails,
  onEdit,
  onDelete,
  onSelectCategory,
}) => {
  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Black Box Warning Ribbon if present */}
      {medication.safety.blackBoxWarning && (
        <div className="bg-amber-500/10 border-b border-amber-300 px-3 py-1 flex items-center gap-1.5 text-[11px] font-semibold text-amber-900">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="truncate">Alerta de Seguridad / Advertencia Farmacológica</span>
        </div>
      )}

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Top Header: Image, Titles & Pregnancy Badge */}
        <div className="flex gap-3.5 items-start">
          {/* Drug Photo / Illustration */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 group-hover:shadow-xs transition-shadow">
            {medication.photoUrl ? (
              <img
                src={medication.photoUrl}
                alt={medication.genericName}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-600">
                <Pill className="w-8 h-8" />
              </div>
            )}
            <button
              onClick={() => onViewDetails(medication)}
              title="Ver imagen y ficha completa"
              className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          {/* Titles & Classifications */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 
                onClick={() => onViewDetails(medication)}
                className="font-bold text-base sm:text-lg text-slate-900 hover:text-teal-700 cursor-pointer truncate"
              >
                {medication.genericName}
              </h3>

              {/* Pregnancy Badge */}
              <div 
                title={`Categoría en Embarazo: ${medication.safety.pregnancyCategory} (${medication.safety.pregnancyDetails || ''})`}
                className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md border font-semibold shrink-0 ${getPregnancyBadgeClass(
                  medication.safety.pregnancyCategory
                )}`}
              >
                <Baby className="w-3 h-3" />
                <span>Cat. {medication.safety.pregnancyCategory}</span>
              </div>
            </div>

            {/* Commercial Names */}
            {medication.commercialNames && medication.commercialNames.length > 0 && (
              <p className="text-xs text-slate-500 truncate mt-0.5">
                <span className="font-medium text-slate-600">Comercial:</span> {medication.commercialNames.join(', ')}
              </p>
            )}

            {/* ATC Code */}
            {medication.atcCode && (
              <span className="inline-block text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-1">
                ATC: {medication.atcCode}
              </span>
            )}
          </div>
        </div>

        {/* Classification Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {medication.classifications.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(cat)}
              className="text-[11px] font-medium bg-teal-50 hover:bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200/80 transition-colors cursor-pointer"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Clinical Description / Summary */}
        <p className="text-xs text-slate-600 line-clamp-2 mt-2.5 leading-relaxed">
          {medication.description}
        </p>

        {/* Presentations pills */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-700">
          <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Presentación:</span>
          {medication.presentations.slice(0, 2).map((pres, i) => (
            <span
              key={i}
              className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-md font-mono"
            >
              {pres.form} ({pres.concentration})
            </span>
          ))}
          {medication.presentations.length > 2 && (
            <span className="text-[10px] text-slate-500">
              +{medication.presentations.length - 2} más
            </span>
          )}
        </div>

        {/* Mechanism of Action highlight */}
        <div className="mt-2.5 bg-slate-50 rounded-xl p-2.5 text-xs border border-slate-200/60">
          <span className="font-semibold text-slate-800 block text-[11px] mb-0.5">
            Mecanismo de acción:
          </span>
          <p className="text-slate-600 line-clamp-2 leading-relaxed text-[11px]">
            {medication.mechanismOfAction}
          </p>
        </div>

        {/* Safety indicators footer */}
        <div className="mt-auto pt-3 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span className="truncate max-w-[170px]">{medication.prescriptionType}</span>
          </div>
          {medication.drugInteractions.length > 0 && (
            <span className="text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[10px]">
              {medication.drugInteractions.length} Interacciones
            </span>
          )}
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="bg-slate-50/80 px-4 py-2.5 border-t border-slate-200/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetails(medication)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-2xs active:scale-95 transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Ficha Técnica</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(medication)}
            title="Editar Fármaco"
            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`¿Estás seguro de eliminar "${medication.genericName}" del vademécum?`)) {
                onDelete(medication.id);
              }
            }}
            title="Eliminar Fármaco"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
