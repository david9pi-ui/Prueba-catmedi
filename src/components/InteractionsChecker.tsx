import React, { useState } from 'react';
import { Medication, InteractionAnalysisResult } from '../types/pharmacy';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  Pill,
  ArrowRight
} from 'lucide-react';

interface InteractionsCheckerProps {
  medications: Medication[];
  onViewMedicationDetail: (med: Medication) => void;
}

export const InteractionsChecker: React.FC<InteractionsCheckerProps> = ({
  medications,
  onViewMedicationDetail,
}) => {
  const [selectedDrugIds, setSelectedDrugIds] = useState<string[]>(['med-losartan', 'med-ibuprofeno']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInteractions, setAiInteractions] = useState<InteractionAnalysisResult[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedMedications = medications.filter((m) => selectedDrugIds.includes(m.id));

  const handleToggleDrug = (id: string) => {
    setSelectedDrugIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    // Reset AI results on selection change
    setAiInteractions(null);
  };

  const handleClearAll = () => {
    setSelectedDrugIds([]);
    setAiInteractions(null);
  };

  // Find local database interactions between selected drugs
  const findLocalInteractions = (): InteractionAnalysisResult[] => {
    const results: InteractionAnalysisResult[] = [];
    const checkedPairs = new Set<string>();

    for (let i = 0; i < selectedMedications.length; i++) {
      const medA = selectedMedications[i];
      for (let j = 0; j < selectedMedications.length; j++) {
        if (i === j) continue;
        const medB = selectedMedications[j];
        const pairKey = [medA.id, medB.id].sort().join('___');

        if (checkedPairs.has(pairKey)) continue;
        checkedPairs.add(pairKey);

        // Check if medA lists medB in its interactions
        const foundInA = medA.drugInteractions.find(
          (inter) =>
            medB.genericName.toLowerCase().includes(inter.interactingDrug.toLowerCase().split(' ')[0]) ||
            inter.interactingDrug.toLowerCase().includes(medB.genericName.toLowerCase().split(' ')[0]) ||
            medB.classifications.some((c) => inter.interactingDrug.toLowerCase().includes(c.toLowerCase()))
        );

        // Check if medB lists medA in its interactions
        const foundInB = medB.drugInteractions.find(
          (inter) =>
            medA.genericName.toLowerCase().includes(inter.interactingDrug.toLowerCase().split(' ')[0]) ||
            inter.interactingDrug.toLowerCase().includes(medA.genericName.toLowerCase().split(' ')[0]) ||
            medA.classifications.some((c) => inter.interactingDrug.toLowerCase().includes(c.toLowerCase()))
        );

        const match = foundInA || foundInB;
        if (match) {
          results.push({
            drugA: medA.genericName,
            drugB: medB.genericName,
            severity: match.severity,
            mechanism: 'Interacción documentada en vademécum clínico.',
            effect: match.clinicalEffect,
            recommendation: match.management,
          });
        }
      }
    }

    return results;
  };

  const localInteractions = findLocalInteractions();

  // Run deeper AI interaction analysis if requested
  const handleDeepAiAnalysis = async () => {
    if (selectedMedications.length < 2) return;
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drugNames: selectedMedications.map((m) => m.genericName),
        }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.interactions)) {
        setAiInteractions(data.interactions);
      } else if (data.useLocalFallback || !response.ok) {
        setAiInteractions(localInteractions);
      }
    } catch (e: any) {
      console.error(e);
      setAiInteractions(localInteractions);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const displayInteractions = aiInteractions !== null ? aiInteractions : localInteractions;

  const filteredMedsToSelect = medications.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.genericName.toLowerCase().includes(q) ||
      m.commercialNames.some((c) => c.toLowerCase().includes(q)) ||
      m.classifications.some((c) => c.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Seguridad Farmacológica & Polifarmacia
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Verificador de Interacciones Fármaco-Fármaco
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Seleccione dos o más medicamentos de la base de datos para evaluar sinergias, incompatibilidades farmacocinéticas (CYP450) y riesgos toxicológicos en la prescripción combinada.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Drug Selector */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-teal-600" />
              Seleccionar Medicamentos ({selectedDrugIds.length})
            </h3>
            {selectedDrugIds.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Quick Search in selector */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en vademécum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Meds List with Checkboxes */}
          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredMedsToSelect.map((med) => {
              const isSelected = selectedDrugIds.includes(med.id);
              return (
                <div
                  key={med.id}
                  onClick={() => handleToggleDrug(med.id)}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-teal-50 border-teal-300 text-teal-950 font-semibold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="block truncate">{med.genericName}</span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {med.classifications[0]}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 pointer-events-none"
                  />
                </div>
              );
            })}
          </div>

          {/* Evaluate Action */}
          <div className="pt-2">
            <button
              onClick={handleDeepAiAnalysis}
              disabled={selectedDrugIds.length < 2 || isAnalyzing}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analizando interacciones con IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Análisis Clínico Profundo</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-1.5">
              Se requiere al menos 2 medicamentos seleccionados.
            </p>
          </div>
        </div>

        {/* Right Col: Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Selected Drugs Chips */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Medicamentos en Evaluación:
            </span>
            {selectedMedications.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Seleccione fármacos en la columna izquierda para evaluar interacciones cruzadas.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedMedications.map((m) => (
                  <span
                    key={m.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    <span>{m.genericName}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleDrug(m.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Interactions Breakdown */}
          {selectedMedications.length < 2 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">
                Seleccione al menos dos medicamentos
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                La herramienta cruzará la farmacocinética y farmacodinamia de los fármacos seleccionados para alertar sobre riesgos de toxicidad o reducción de eficacia.
              </p>
            </div>
          ) : displayInteractions.length === 0 ? (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-base font-bold text-emerald-950">
                No se encontraron interacciones adversas mayores registradas
              </h3>
              <p className="text-xs text-emerald-800 max-w-lg mx-auto mt-1">
                La combinación de estos {selectedMedications.length} fármacos no presenta alertas críticas documentadas en el vademécum. Mantenga la vigilancia clínica estándar en pacientes con polifarmacia.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Interacciones Detectadas ({displayInteractions.length})
                </span>
                <span className="text-[11px] text-slate-500">
                  {aiInteractions !== null ? 'Evaluación farmacológica IA + Vademécum' : 'Matriz de vademécum'}
                </span>
              </div>

              {displayInteractions.map((item, idx) => {
                const isHigh = item.severity === 'Alta';
                const isMod = item.severity === 'Moderada';
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-xs ${
                      isHigh
                        ? 'bg-rose-50/80 border-rose-300'
                        : isMod
                        ? 'bg-amber-50/80 border-amber-300'
                        : 'bg-emerald-50/60 border-emerald-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        {isHigh ? (
                          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                        ) : isMod ? (
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                          {item.drugA} + {item.drugB}
                        </h4>
                      </div>

                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 self-start sm:self-auto ${
                          isHigh
                            ? 'bg-rose-600 text-white'
                            : isMod
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        Severidad {item.severity}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-800">
                      {item.mechanism && (
                        <p>
                          <span className="font-bold text-slate-900">Mecanismo: </span>
                          {item.mechanism}
                        </p>
                      )}

                      <p>
                        <span className="font-bold text-slate-900">Manifestación clínica: </span>
                        {item.effect}
                      </p>

                      <div className="mt-2.5 bg-white/90 p-3 rounded-xl border border-slate-200/80 text-slate-900">
                        <span className="font-bold text-teal-800 block mb-0.5">
                          Conducta y Recomendación Médica:
                        </span>
                        <span>{item.recommendation}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
