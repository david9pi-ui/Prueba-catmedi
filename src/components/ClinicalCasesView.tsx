import React, { useState } from 'react';
import { ClinicalCaseProtocol, Medication } from '../types/pharmacy';
import { 
  Stethoscope, 
  Search, 
  Plus, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Pill, 
  FileText, 
  AlertOctagon,
  ArrowRight,
  Send,
  Loader2,
  Trash2,
  Edit3
} from 'lucide-react';

interface ClinicalCasesViewProps {
  cases: ClinicalCaseProtocol[];
  medications: Medication[];
  onOpenNewCaseModal: () => void;
  onEditCase: (item: ClinicalCaseProtocol) => void;
  onDeleteCase: (id: string) => void;
  onViewMedicationDetail: (med: Medication) => void;
  onNavigateToVademecum: () => void;
}

export const ClinicalCasesView: React.FC<ClinicalCasesViewProps> = ({
  cases,
  medications,
  onOpenNewCaseModal,
  onEditCase,
  onDeleteCase,
  onViewMedicationDetail,
  onNavigateToVademecum,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'protocols' | 'ai-consult'>('protocols');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(cases[0]?.id || null);

  // AI Consult State
  const [consultCondition, setConsultCondition] = useState('');
  const [consultPatientInfo, setConsultPatientInfo] = useState('Adulto 45 años, sin comorbilidades previas');
  const [consultAllergies, setConsultAllergies] = useState('Ninguna conocida');
  const [consultKidneyStatus, setConsultKidneyStatus] = useState('Normal (TFG > 90 ml/min)');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Extract unique categories
  const categories = ['Todas', ...Array.from(new Set(cases.map((c) => c.category)))];

  const filteredCases = cases.filter((c) => {
    const matchesCategory = selectedCategory === 'Todas' || c.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(q) ||
      c.clinicalSummary.toLowerCase().includes(q) ||
      c.symptomsAndSigns.some((s) => s.toLowerCase().includes(q)) ||
      c.firstLineTherapy.some((t) => t.drugName.toLowerCase().includes(q)) ||
      c.secondLineTherapy.some((t) => t.drugName.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Find medication in library by name
  const findMedicationByName = (name: string): Medication | undefined => {
    const lower = name.toLowerCase();
    return medications.find(
      (m) =>
        lower.includes(m.genericName.toLowerCase().split(' ')[0]) ||
        m.genericName.toLowerCase().includes(lower) ||
        m.commercialNames.some((c) => lower.includes(c.toLowerCase()))
    );
  };

  // Handle AI Consultation submission
  const handleRunAiConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultCondition.trim()) return;

    setIsLoadingAi(true);
    setAiError(null);
    setAiResult(null);

    try {
      const response = await fetch('/api/clinical-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          condition: consultCondition,
          patientInfo: consultPatientInfo,
          allergies: consultAllergies,
          kidneyLiverStatus: consultKidneyStatus,
          availableDrugs: medications.map((m) => ({
            genericName: m.genericName,
            classifications: m.classifications,
            presentations: m.presentations.map((p) => `${p.form} ${p.concentration}`),
          })),
        }),
      });

      const data = await response.json();

      if (data.success && data.guidance) {
        setAiResult(data.guidance);
      } else if (data.useLocalFallback || !response.ok) {
        // Fallback: search closest matching established protocol
        const match = cases.find((c) =>
          c.title.toLowerCase().includes(consultCondition.toLowerCase()) ||
          consultCondition.toLowerCase().includes(c.title.toLowerCase())
        );

        if (match) {
          setAiResult({
            title: match.title,
            summary: match.clinicalSummary,
            firstLine: match.firstLineTherapy.map((t) => ({
              genericName: t.drugName,
              dosage: t.dosage,
              duration: t.duration,
              rationale: t.notes,
            })),
            secondLine: match.secondLineTherapy.map((t) => ({
              genericName: t.drugName,
              dosage: t.dosage,
              duration: t.duration,
              rationale: t.notes,
            })),
            contraindicated: match.contraindications,
            criticalWarnings: match.redFlags,
            nonPharmacological: match.nonPharmacologicalMeasures,
          });
        } else {
          setAiError(
            'El servicio de IA no devolvió respuesta y no se encontró protocolo local exacto. Revise el vademécum o intente con términos como "Hipertensión", "Infección urinaria", "Asma", "Dolor", "Reflujo".'
          );
        }
      }
    } catch (err: any) {
      console.error(err);
      setAiError('Error de conexión al consultar el asistente clínico: ' + err.message);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5" />
              Guía de Prescripción Terapéutica
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ¿Qué Tomar en Cada Caso?
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Consulte rápidamente esquemas de tratamiento validados de primera y segunda línea por patología, criterios de derivación, signos de alarma (red flags) e interacciones con el catálogo de fármacos.
          </p>

          {/* Subtabs Switcher */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSubTab('protocols')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'protocols'
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Protocolos Clínicos Establecidos ({cases.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('ai-consult')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'ai-consult'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Consultor Clínico Inteligente (IA)</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: PROTOCOLOS ESTABLECIDOS */}
      {activeSubTab === 'protocols' && (
        <div className="space-y-5">
          {/* Controls: Search, Categories & Add Case */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por patología, síntoma (ej. dolor, tos, fiebre, ardor)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
              />
            </div>

            {/* Category filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white font-semibold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenNewCaseModal}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Protocolo</span>
            </button>
          </div>

          {/* List of Protocols (Expandable Accordion Cards) */}
          <div className="space-y-4">
            {filteredCases.map((protocol) => {
              const isExpanded = expandedCaseId === protocol.id;
              return (
                <div
                  key={protocol.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-400 transition-all overflow-hidden"
                >
                  {/* Card Header (Click to expand) */}
                  <div
                    onClick={() => setExpandedCaseId(isExpanded ? null : protocol.id)}
                    className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-md">
                          {protocol.category}
                        </span>
                        {protocol.evidenceLevel && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {protocol.evidenceLevel}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {protocol.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                        {protocol.clinicalSummary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        {isExpanded ? 'Ocultar detalles' : 'Ver qué tomar'}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Protocol Details */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 border-t border-slate-100 space-y-6 bg-slate-50/30">
                      {/* Symptoms & Presentation */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Cuadro Clínico y Síntomas Guía
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {protocol.symptomsAndSigns.map((sym, i) => (
                            <span
                              key={i}
                              className="text-xs bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-lg"
                            >
                              • {sym}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 1ª Línea de Tratamiento (Highlighted) */}
                      <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <h4 className="font-bold text-sm text-emerald-950 uppercase tracking-wide">
                            Tratamiento de 1ª Línea Recomendado
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {protocol.firstLineTherapy.map((step, idx) => {
                            const linkedDrug = findMedicationByName(step.drugName);
                            return (
                              <div
                                key={idx}
                                className="bg-white rounded-xl p-3.5 border border-emerald-200/80 shadow-2xs space-y-1.5"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-bold text-sm text-slate-900 block">
                                    {step.drugName}
                                  </span>
                                  {linkedDrug && (
                                    <button
                                      type="button"
                                      onClick={() => onViewMedicationDetail(linkedDrug)}
                                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded transition-colors cursor-pointer shrink-0"
                                    >
                                      <Pill className="w-3 h-3 text-teal-600" />
                                      <span>Ver Ficha</span>
                                    </button>
                                  )}
                                </div>

                                <div className="text-xs text-slate-700 font-mono bg-slate-50 p-2 rounded">
                                  <p><span className="font-semibold text-slate-900">Dosis:</span> {step.dosage}</p>
                                  <p><span className="font-semibold text-slate-900">Duración:</span> {step.duration}</p>
                                </div>

                                {step.notes && (
                                  <p className="text-[11px] text-slate-600 italic">
                                    {step.notes}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2ª Línea & Alternativas */}
                      {protocol.secondLineTherapy.length > 0 && (
                        <div className="bg-sky-50/40 border border-sky-200 rounded-2xl p-4 sm:p-5">
                          <h4 className="font-bold text-sm text-sky-950 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-sky-600" />
                            Segunda Línea & Alternativas (Alergias o Intolerancias)
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {protocol.secondLineTherapy.map((step, idx) => {
                              const linkedDrug = findMedicationByName(step.drugName);
                              return (
                                <div
                                  key={idx}
                                  className="bg-white rounded-xl p-3.5 border border-sky-200/80 shadow-2xs space-y-1.5"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="font-bold text-sm text-slate-900 block">
                                      {step.drugName}
                                    </span>
                                    {linkedDrug && (
                                      <button
                                        type="button"
                                        onClick={() => onViewMedicationDetail(linkedDrug)}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded transition-colors cursor-pointer shrink-0"
                                      >
                                        <Pill className="w-3 h-3 text-teal-600" />
                                        <span>Ver Ficha</span>
                                      </button>
                                    )}
                                  </div>

                                  <div className="text-xs text-slate-700 font-mono bg-slate-50 p-2 rounded">
                                    <p><span className="font-semibold text-slate-900">Dosis:</span> {step.dosage}</p>
                                    <p><span className="font-semibold text-slate-900">Duración:</span> {step.duration}</p>
                                  </div>

                                  {step.notes && (
                                    <p className="text-[11px] text-slate-600">
                                      {step.notes}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Red flags & Contraindications Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Red Flags */}
                        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4">
                          <h5 className="font-bold text-xs uppercase tracking-wider text-rose-900 flex items-center gap-1.5 mb-2">
                            <AlertOctagon className="w-4 h-4 text-rose-600" />
                            Banderas Rojas ("Red Flags") y Derivación Urgente
                          </h5>
                          <ul className="space-y-1.5 text-xs text-rose-950">
                            {protocol.redFlags.map((rf, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-rose-600 font-bold shrink-0">⚠</span>
                                <span>{rf}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Contraindications */}
                        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                          <h5 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            Contraindicaciones Específicas
                          </h5>
                          <ul className="space-y-1.5 text-xs text-amber-950">
                            {protocol.contraindications.map((ci, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-600 font-bold shrink-0">✕</span>
                                <span>{ci}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Non-Pharmacological Measures */}
                      {protocol.nonPharmacologicalMeasures.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                            Medidas No Farmacológicas & Estilo de Vida
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                            {protocol.nonPharmacologicalMeasures.map((npm, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
                                <span>{npm}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Card Footer actions */}
                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={onNavigateToVademecum}
                          className="text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Buscar más fármacos en vademécum</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onEditCase(protocol)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-slate-100 cursor-pointer"
                            title="Editar protocolo"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {protocol.isCustom && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('¿Deseas eliminar este protocolo personalizado?')) {
                                  onDeleteCase(protocol.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Eliminar protocolo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredCases.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  No se encontraron protocolos para esta búsqueda
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pruebe con la pestaña "Consultor Clínico Inteligente (IA)" para consultar cualquier patología personalizada.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: CONSULTOR CLÍNICO INTELIGENTE (IA) */}
      {activeSubTab === 'ai-consult' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Consulta Clínica Personalizada para Profesionales de la Salud
                </h3>
                <p className="text-xs text-slate-500">
                  Describa el cuadro clínico del paciente y obtenga recomendaciones farmacológicas basadas en evidencia y en el vademécum de la institución.
                </p>
              </div>
            </div>

            <form onSubmit={handleRunAiConsult} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Patología, Diagnóstico o Síntomas Principales *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Faringitis bacteriana aguda, Neumonía típica, Cólico nefrítico, Asma exacerbado..."
                  value={consultCondition}
                  onChange={(e) => setConsultCondition(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Perfil del Paciente
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Adulto mayor 72 años, diabético"
                    value={consultPatientInfo}
                    onChange={(e) => setConsultPatientInfo(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alergias Medicamentosas
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Alergia a Penicilinas / AINEs"
                    value={consultAllergies}
                    onChange={(e) => setConsultAllergies(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Función Renal / Hepática
                  </label>
                  <input
                    type="text"
                    placeholder="ej. ClCr 40 ml/min o Normal"
                    value={consultKidneyStatus}
                    onChange={(e) => setConsultKidneyStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isLoadingAi || !consultCondition.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoadingAi ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analizando caso y fármacos...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Consultar Esquema Terapéutico</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* AI Result Card */}
          {aiError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{aiError}</span>
            </div>
          )}

          {aiResult && (
            <div className="bg-white rounded-2xl border border-emerald-300 p-6 shadow-md space-y-6 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Propuesta Terapéutica Clínica
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    {aiResult.title || consultCondition}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {aiResult.summary}
                  </p>
                </div>
              </div>

              {/* 1st Line */}
              {aiResult.firstLine && aiResult.firstLine.length > 0 && (
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Fármacos de Primera Elección
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {aiResult.firstLine.map((item: any, i: number) => {
                      const drug = findMedicationByName(item.genericName);
                      return (
                        <div key={i} className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-slate-900">{item.genericName}</span>
                            {drug && (
                              <button
                                onClick={() => onViewMedicationDetail(drug)}
                                className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 hover:bg-teal-100 cursor-pointer"
                              >
                                Ficha Vademécum
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-700 font-mono"><span className="font-semibold">Dosis:</span> {item.dosage}</p>
                          <p className="text-xs text-slate-700 font-mono"><span className="font-semibold">Duración:</span> {item.duration}</p>
                          <p className="text-[11px] text-slate-600 mt-1 italic">{item.rationale}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2nd Line */}
              {aiResult.secondLine && aiResult.secondLine.length > 0 && (
                <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    Alternativas / Segunda Línea
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {aiResult.secondLine.map((item: any, i: number) => (
                      <div key={i} className="bg-white p-3 rounded-lg border border-sky-200 shadow-2xs">
                        <span className="font-bold text-sm text-slate-900 block mb-1">{item.genericName}</span>
                        <p className="text-xs text-slate-700 font-mono"><span className="font-semibold">Dosis:</span> {item.dosage}</p>
                        <p className="text-xs text-slate-700 font-mono"><span className="font-semibold">Duración:</span> {item.duration}</p>
                        <p className="text-[11px] text-slate-600 mt-1">{item.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alerts & Contraindications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aiResult.criticalWarnings && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5">
                    <h5 className="text-xs font-bold uppercase text-rose-900 mb-1.5 flex items-center gap-1">
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                      Signos de Alarma y Advertencias
                    </h5>
                    <ul className="text-xs text-rose-950 space-y-1">
                      {aiResult.criticalWarnings.map((w: string, i: number) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiResult.contraindicated && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                    <h5 className="text-xs font-bold uppercase text-amber-900 mb-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Contraindicaciones en este Perfil
                    </h5>
                    <ul className="text-xs text-amber-950 space-y-1">
                      {aiResult.contraindicated.map((c: string, i: number) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
