import React, { useState } from 'react';
import { Medication } from '../types/pharmacy';
import { getPregnancyBadgeClass } from './MedicationCard';
import { 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Pill, 
  Baby, 
  Heart, 
  Activity, 
  AlertCircle, 
  FileText, 
  Copy, 
  Check, 
  Edit3,
  Layers,
  Sparkles
} from 'lucide-react';

interface MedicationDetailModalProps {
  medication: Medication | null;
  onClose: () => void;
  onEdit: (med: Medication) => void;
  onSelectCategory?: (category: string) => void;
}

export const MedicationDetailModal: React.FC<MedicationDetailModalProps> = ({
  medication,
  onClose,
  onEdit,
  onSelectCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'dosage' | 'safety' | 'adverse' | 'interactions'>('general');
  const [copied, setCopied] = useState(false);

  if (!medication) return null;

  const handleCopySummary = () => {
    const text = `
FARMACO: ${medication.genericName}
Nombres comerciales: ${medication.commercialNames.join(', ')}
Clasificación: ${medication.classifications.join(', ')}
Presentaciones: ${medication.presentations.map(p => `${p.form} ${p.concentration} (${p.route})`).join('; ')}
Dosis Adultos: ${medication.dosageAndPosology.adult}
Dosis Pediátrica: ${medication.dosageAndPosology.pediatric || 'No especificada'}
Ajuste Renal: ${medication.dosageAndPosology.renalAdjustment || 'No requiere'}
Seguridad Embarazo: Cat. ${medication.safety.pregnancyCategory} (${medication.safety.pregnancyDetails || ''})
Contraindicaciones: ${medication.safety.contraindications.join(', ')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 relative flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Image / Thumbnail */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
              {medication.photoUrl ? (
                <img 
                  src={medication.photoUrl} 
                  alt={medication.genericName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-teal-400">
                  <Pill className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded">
                  {medication.atcCode ? `ATC: ${medication.atcCode}` : 'FÁRMACO CLÍNICO'}
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {medication.prescriptionType}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded border font-bold ${getPregnancyBadgeClass(medication.safety.pregnancyCategory)}`}>
                  Embarazo Cat. {medication.safety.pregnancyCategory}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
                {medication.genericName}
              </h2>

              {medication.commercialNames.length > 0 && (
                <p className="text-xs text-slate-300 truncate mt-0.5">
                  <span className="text-slate-400">Marcas:</span> {medication.commercialNames.join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Close & Action buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Copiar Ficha Rápida"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(medication);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Editar</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Black box alert banner if active */}
        {medication.safety.blackBoxWarning && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 flex items-start gap-2 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-slate-950" />
            <div>
              <span className="font-bold uppercase tracking-wider text-[11px] block">
                Advertencia de Seguridad Farmacológica:
              </span>
              <span>{medication.safety.blackBoxWarning}</span>
            </div>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'general'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Presentación & Mecanismo
          </button>
          <button
            onClick={() => setActiveTab('dosage')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'dosage'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Dosis y Posología
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'safety'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Seguridad & Embarazo
          </button>
          <button
            onClick={() => setActiveTab('adverse')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'adverse'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Efectos Adversos
          </button>
          <button
            onClick={() => setActiveTab('interactions')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'interactions'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Interacciones</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
              {medication.drugInteractions.length}
            </span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* TAB 1: GENERAL & MECANISMO */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Classifications */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  Clasificación y Familia Farmacológica
                </h4>
                <div className="flex flex-wrap gap-2">
                  {medication.classifications.map((cat, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onSelectCategory) onSelectCategory(cat);
                      }}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Descripción Clínica
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  {medication.description}
                </p>
              </div>

              {/* Presentations */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-teal-600" />
                  Formas Farmacéuticas y Presentaciones
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {medication.presentations.map((pres, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition-colors flex items-start justify-between"
                    >
                      <div>
                        <span className="font-semibold text-sm text-slate-900 block">{pres.form}</span>
                        <span className="text-xs text-slate-600 font-mono">{pres.concentration}</span>
                        {pres.packageDetails && (
                          <span className="text-[11px] text-slate-400 block mt-0.5">{pres.packageDetails}</span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {pres.route}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mechanism of Action */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  Mecanismo de Acción & Farmacodinamia
                </h4>
                <div className="bg-teal-50/50 border border-teal-200/80 rounded-xl p-4 text-sm text-slate-800 leading-relaxed">
                  {medication.mechanismOfAction}
                </div>
              </div>

              {/* Therapeutic Indications */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  Indicaciones Terapéuticas Aprobadas
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                  {medication.therapeuticIndications.map((ind, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0"></span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: DOSIS Y POSOLOGÍA */}
          {activeTab === 'dosage' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                <div className="p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Dosis Estándar en Adultos
                  </span>
                  <p className="text-sm font-medium text-slate-900 leading-relaxed">
                    {medication.dosageAndPosology.adult}
                  </p>
                </div>

                {medication.dosageAndPosology.pediatric && (
                  <div className="p-4 bg-slate-50/50">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1 flex items-center gap-1">
                      <Baby className="w-3.5 h-3.5" /> Dosis Pediátrica
                    </span>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">
                      {medication.dosageAndPosology.pediatric}
                    </p>
                  </div>
                )}

                {medication.dosageAndPosology.elderly && (
                  <div className="p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Adultos Mayores / Geriatría
                    </span>
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {medication.dosageAndPosology.elderly}
                    </p>
                  </div>
                )}

                {medication.dosageAndPosology.renalAdjustment && (
                  <div className="p-4 bg-amber-50/40">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
                      Ajuste en Insuficiencia Renal (ClCr / TFG)
                    </span>
                    <p className="text-sm text-amber-950 leading-relaxed">
                      {medication.dosageAndPosology.renalAdjustment}
                    </p>
                  </div>
                )}

                {medication.dosageAndPosology.hepaticAdjustment && (
                  <div className="p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Ajuste en Insuficiencia Hepática
                    </span>
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {medication.dosageAndPosology.hepaticAdjustment}
                    </p>
                  </div>
                )}

                {medication.dosageAndPosology.maxDailyDose && (
                  <div className="p-4 bg-rose-50/30">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block mb-1">
                      Dosis Máxima Diaria
                    </span>
                    <p className="text-sm font-semibold text-rose-950 font-mono">
                      {medication.dosageAndPosology.maxDailyDose}
                    </p>
                  </div>
                )}

                {medication.dosageAndPosology.administrationTips && (
                  <div className="p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Recomendaciones de Administración
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {medication.dosageAndPosology.administrationTips}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SEGURIDAD & EMBARAZO */}
          {activeTab === 'safety' && (
            <div className="space-y-5">
              {/* Pregnancy & Lactation cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Uso en el Embarazo
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPregnancyBadgeClass(medication.safety.pregnancyCategory)}`}>
                      Categoría {medication.safety.pregnancyCategory}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {medication.safety.pregnancyDetails || 'Consulte recomendaciones según trimestre de gestación.'}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Lactancia Materna
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      medication.safety.lactationSafety === 'Seguro'
                        ? 'bg-emerald-100 text-emerald-800'
                        : medication.safety.lactationSafety === 'Contraindicado'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {medication.safety.lactationSafety}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {medication.safety.lactationDetails || 'Paso a leche materna y seguridad neonatal documentada.'}
                  </p>
                </div>
              </div>

              {/* Contraindications */}
              <div>
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Contraindicaciones Absolutas y Relativas
                </h4>
                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 space-y-2">
                  {medication.safety.contraindications.map((contra, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-rose-950">
                      <span className="text-rose-500 font-bold shrink-0">✕</span>
                      <span>{contra}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Precautions */}
              <div>
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Precauciones Clínicas & Advertencias
                </h4>
                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 space-y-2">
                  {medication.safety.precautions.map((prec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-amber-950">
                      <span className="text-amber-600 font-bold shrink-0">⚠</span>
                      <span>{prec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EFECTOS ADVERSOS */}
          {activeTab === 'adverse' && (
            <div className="space-y-4">
              {/* Frequent */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-2">
                  Reacciones Frecuentes (&gt; 10%)
                </span>
                <div className="flex flex-wrap gap-2">
                  {medication.adverseEffects.frequent.map((eff, i) => (
                    <span key={i} className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg">
                      {eff}
                    </span>
                  ))}
                </div>
              </div>

              {/* Infrequent */}
              {medication.adverseEffects.infrequent && medication.adverseEffects.infrequent.length > 0 && (
                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                    Poco Frecuentes (1% a 10%)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {medication.adverseEffects.infrequent.map((eff, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                        {eff}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Severe */}
              <div className="border border-red-200 rounded-xl p-4 bg-red-50/40">
                <span className="text-xs font-bold uppercase tracking-wider text-red-800 block mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  Efectos Adversos Graves / Potencialmente Mortales
                </span>
                <ul className="space-y-1.5 text-sm text-red-950">
                  {medication.adverseEffects.severe.map((eff, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0"></span>
                      <span>{eff}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: INTERACCIONES */}
          {activeTab === 'interactions' && (
            <div className="space-y-4">
              {medication.drugInteractions.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-10 h-10 text-teal-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">
                    No hay interacciones de alta severidad registradas para este fármaco.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Verifique siempre con el verificador multidroga en caso de polifarmacia.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {medication.drugInteractions.map((inter, i) => (
                    <div 
                      key={i}
                      className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-900">
                          {inter.interactingDrug}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                          inter.severity === 'Alta'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : inter.severity === 'Moderada'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          Severidad: {inter.severity}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 space-y-1.5">
                        <p>
                          <span className="font-semibold text-slate-900">Efecto clínico: </span>
                          {inter.clinicalEffect}
                        </p>
                        <p className="bg-slate-50 p-2 rounded text-slate-800 border border-slate-100">
                          <span className="font-semibold text-teal-800">Conducta sugerida: </span>
                          {inter.management}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Actualizado: {new Date(medication.updatedAt).toLocaleDateString('es-ES')}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
