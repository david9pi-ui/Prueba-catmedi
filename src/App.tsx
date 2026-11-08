import React, { useState, useEffect, useMemo } from 'react';
import { 
  Medication, 
  DrugClassification, 
  ClinicalCaseProtocol,
  PregnancyCategory,
  AdministrationRoute
} from './types/pharmacy';
import { 
  loadMedications, 
  saveMedications, 
  loadClassifications, 
  saveClassifications, 
  loadClinicalCases, 
  saveClinicalCases,
  resetAllData 
} from './utils/storage';
import { Navbar, ActiveTab } from './components/Navbar';
import { MedicationCard } from './components/MedicationCard';
import { MedicationDetailModal } from './components/MedicationDetailModal';
import { MedicationFormModal } from './components/MedicationFormModal';
import { ClassificationsView } from './components/ClassificationsView';
import { ClassificationFormModal } from './components/ClassificationFormModal';
import { ClinicalCasesView } from './components/ClinicalCasesView';
import { ClinicalCaseFormModal } from './components/ClinicalCaseFormModal';
import { InteractionsChecker } from './components/InteractionsChecker';
import { DosageCalculatorModal } from './components/DosageCalculatorModal';
import { ImportExportModal } from './components/ImportExportModal';
import { 
  Search, 
  Filter, 
  Plus, 
  LayoutGrid, 
  Table as TableIcon, 
  Pill, 
  AlertTriangle,
  Layers,
  Baby,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // Global State
  const [activeTab, setActiveTab] = useState<ActiveTab>('vademecum');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [classifications, setClassifications] = useState<DrugClassification[]>([]);
  const [clinicalCases, setClinicalCases] = useState<ClinicalCaseProtocol[]>([]);

  // Search & Filters in Vademecum
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassificationFilter, setSelectedClassificationFilter] = useState('Todas');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('Todas');
  const [selectedPregnancyFilter, setSelectedPregnancyFilter] = useState('Todas');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals State
  const [viewingMedication, setViewingMedication] = useState<Medication | null>(null);
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClassification, setEditingClassification] = useState<DrugClassification | null>(null);

  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<ClinicalCaseProtocol | null>(null);

  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    reloadAllData();
  }, []);

  const reloadAllData = () => {
    setMedications(loadMedications());
    setClassifications(loadClassifications());
    setClinicalCases(loadClinicalCases());
  };

  // Save changes to localStorage
  const handleSaveMedication = (med: Medication) => {
    let updated: Medication[];
    const exists = medications.some((m) => m.id === med.id);
    if (exists) {
      updated = medications.map((m) => (m.id === med.id ? med : m));
    } else {
      updated = [med, ...medications];
    }
    setMedications(updated);
    saveMedications(updated);
  };

  const handleDeleteMedication = (id: string) => {
    const updated = medications.filter((m) => m.id !== id);
    setMedications(updated);
    saveMedications(updated);
    if (viewingMedication?.id === id) {
      setViewingMedication(null);
    }
  };

  const handleSaveClassification = (cls: DrugClassification) => {
    let updated: DrugClassification[];
    const exists = classifications.some((c) => c.id === cls.id);
    if (exists) {
      updated = classifications.map((c) => (c.id === cls.id ? cls : c));
    } else {
      updated = [...classifications, cls];
    }
    setClassifications(updated);
    saveClassifications(updated);
  };

  const handleDeleteClassification = (id: string) => {
    const updated = classifications.filter((c) => c.id !== id);
    setClassifications(updated);
    saveClassifications(updated);
  };

  const handleSaveClinicalCase = (c: ClinicalCaseProtocol) => {
    let updated: ClinicalCaseProtocol[];
    const exists = clinicalCases.some((item) => item.id === c.id);
    if (exists) {
      updated = clinicalCases.map((item) => (item.id === c.id ? c : item));
    } else {
      updated = [c, ...clinicalCases];
    }
    setClinicalCases(updated);
    saveClinicalCases(updated);
  };

  const handleDeleteClinicalCase = (id: string) => {
    const updated = clinicalCases.filter((item) => item.id !== id);
    setClinicalCases(updated);
    saveClinicalCases(updated);
  };

  const handleResetData = () => {
    const res = resetAllData();
    setMedications(res.medications);
    setClassifications(res.classifications);
    setClinicalCases(res.cases);
  };

  // Jump from Classification to filtered Vademecum
  const handleFilterByClassificationFromGroup = (className: string) => {
    setSelectedClassificationFilter(className);
    setActiveTab('vademecum');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered Medications logic
  const filteredMedications = useMemo(() => {
    return medications.filter((med) => {
      // Classification filter
      if (selectedClassificationFilter !== 'Todas') {
        if (!med.classifications.includes(selectedClassificationFilter)) {
          return false;
        }
      }

      // Route filter
      if (selectedRouteFilter !== 'Todas') {
        const hasRoute = med.presentations.some((p) => p.route === selectedRouteFilter);
        if (!hasRoute) return false;
      }

      // Pregnancy filter
      if (selectedPregnancyFilter !== 'Todas') {
        if (med.safety.pregnancyCategory !== selectedPregnancyFilter) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inGeneric = med.genericName.toLowerCase().includes(q);
        const inCommercial = med.commercialNames.some((c) => c.toLowerCase().includes(q));
        const inDesc = med.description.toLowerCase().includes(q);
        const inMechanism = med.mechanismOfAction.toLowerCase().includes(q);
        const inIndications = med.therapeuticIndications.some((ind) => ind.toLowerCase().includes(q));
        const inClass = med.classifications.some((c) => c.toLowerCase().includes(q));
        const inAtc = med.atcCode?.toLowerCase().includes(q);

        return inGeneric || inCommercial || inDesc || inMechanism || inIndications || inClass || inAtc;
      }

      return true;
    });
  }, [medications, searchQuery, selectedClassificationFilter, selectedRouteFilter, selectedPregnancyFilter]);

  // Unique list of classifications for filter dropdown
  const classificationOptions = useMemo(() => {
    const set = new Set<string>();
    classifications.forEach((c) => set.add(c.name));
    medications.forEach((m) => m.classifications.forEach((c) => set.add(c)));
    return ['Todas', ...Array.from(set)];
  }, [classifications, medications]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'calculator') {
            setIsCalculatorOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        medCount={medications.length}
        classCount={classifications.length}
        caseCount={clinicalCases.length}
        onOpenNewMedModal={() => {
          setEditingMedication(null);
          setIsMedModalOpen(true);
        }}
        onOpenNewClassModal={() => {
          setEditingClassification(null);
          setIsClassModalOpen(true);
        }}
        onOpenNewCaseModal={() => {
          setEditingCase(null);
          setIsCaseModalOpen(true);
        }}
        onOpenBackupModal={() => setIsBackupOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: VADEMÉCUM (CATÁLOGO DE FÁRMACOS) */}
        {activeTab === 'vademecum' && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar fármaco por nombre genérico, comercial, indicación clínica, mecanismo o ATC..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* View Mode Toggle & Add Button */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      title="Vista en Tarjetas"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'grid' ? 'bg-white text-teal-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('table')}
                      title="Vista en Tabla Clínica"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'table' ? 'bg-white text-teal-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <TableIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setEditingMedication(null);
                      setIsMedModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Medicamento</span>
                  </button>
                </div>
              </div>

              {/* Filter Pills / Dropdowns */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <span className="font-semibold text-slate-500 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" /> Filtros:
                </span>

                {/* Classification Filter Dropdown */}
                <select
                  value={selectedClassificationFilter}
                  onChange={(e) => setSelectedClassificationFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Todas">Clasificación: Todas ({medications.length})</option>
                  {classificationOptions.filter((c) => c !== 'Todas').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* Route Filter Dropdown */}
                <select
                  value={selectedRouteFilter}
                  onChange={(e) => setSelectedRouteFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Todas">Vía: Todas</option>
                  <option value="Oral">Vía Oral</option>
                  <option value="Intravenosa">Vía Intravenosa</option>
                  <option value="Inhalatoria">Vía Inhalatoria</option>
                  <option value="Tópica">Vía Tópica</option>
                  <option value="Rectal">Vía Rectal</option>
                  <option value="Sublingual">Vía Sublingual</option>
                </select>

                {/* Pregnancy Risk Filter */}
                <select
                  value={selectedPregnancyFilter}
                  onChange={(e) => setSelectedPregnancyFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Todas">Embarazo: Todas</option>
                  <option value="A">Cat. A (Estudios seguros)</option>
                  <option value="B">Cat. B (Seguro)</option>
                  <option value="C">Cat. C (Precaución)</option>
                  <option value="D">Cat. D (Riesgo)</option>
                  <option value="X">Cat. X (Contraindicado)</option>
                </select>

                {/* Reset Filters button */}
                {(selectedClassificationFilter !== 'Todas' || selectedRouteFilter !== 'Todas' || selectedPregnancyFilter !== 'Todas' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedClassificationFilter('Todas');
                      setSelectedRouteFilter('Todas');
                      setSelectedPregnancyFilter('Todas');
                      setSearchQuery('');
                    }}
                    className="text-xs text-teal-700 hover:text-teal-900 font-semibold cursor-pointer underline ml-auto"
                  >
                    Restablecer filtros
                  </button>
                )}
              </div>
            </div>

            {/* Results Count & Current Active Filters Banner */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Mostrando <strong>{filteredMedications.length}</strong> de <strong>{medications.length}</strong> medicamentos
                {selectedClassificationFilter !== 'Todas' && ` en "${selectedClassificationFilter}"`}
              </span>
            </div>

            {/* GRID VIEW */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMedications.map((med) => (
                  <MedicationCard
                    key={med.id}
                    medication={med}
                    onViewDetails={(m) => setViewingMedication(m)}
                    onEdit={(m) => {
                      setEditingMedication(m);
                      setIsMedModalOpen(true);
                    }}
                    onDelete={handleDeleteMedication}
                    onSelectCategory={(cat) => setSelectedClassificationFilter(cat)}
                  />
                ))}
              </div>
            )}

            {/* DENSE TABLE VIEW */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Fármaco (DCI)</th>
                        <th className="py-3 px-4">Clasificación</th>
                        <th className="py-3 px-4">Presentación</th>
                        <th className="py-3 px-4">Dosis Habitual</th>
                        <th className="py-3 px-4">Embarazo</th>
                        <th className="py-3 px-4">Prescripción</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {filteredMedications.map((med) => (
                        <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <button
                              onClick={() => setViewingMedication(med)}
                              className="text-left hover:text-teal-700 cursor-pointer"
                            >
                              {med.genericName}
                              {med.commercialNames.length > 0 && (
                                <span className="block text-[10px] text-slate-500 font-normal">
                                  {med.commercialNames[0]}
                                </span>
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[11px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                              {med.classifications[0]}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px]">
                            {med.presentations[0]?.form} ({med.presentations[0]?.concentration})
                          </td>
                          <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate" title={med.dosageAndPosology.adult}>
                            {med.dosageAndPosology.adult}
                          </td>
                          <td className="py-3 px-4 font-bold">
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-100">
                              Cat. {med.safety.pregnancyCategory}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[11px] text-slate-600">
                            {med.prescriptionType}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => setViewingMedication(med)}
                              className="px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded cursor-pointer mr-1"
                            >
                              Ficha
                            </button>
                            <button
                              onClick={() => {
                                setEditingMedication(med);
                                setIsMedModalOpen(true);
                              }}
                              className="px-2 py-1 text-xs text-slate-500 hover:text-teal-700 cursor-pointer"
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredMedications.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  No se encontraron medicamentos
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Ningún medicamento coincide con los filtros aplicados. Intente limpiar los términos de búsqueda o agregue un nuevo fármaco.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedClassificationFilter('Todas');
                      setSelectedRouteFilter('Todas');
                      setSelectedPregnancyFilter('Todas');
                      setSearchQuery('');
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Limpiar Filtros
                  </button>
                  <button
                    onClick={() => {
                      setEditingMedication(null);
                      setIsMedModalOpen(true);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer"
                  >
                    + Agregar Medicamento
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CLASIFICACIONES FARMACOLÓGICAS */}
        {activeTab === 'classifications' && (
          <ClassificationsView
            classifications={classifications}
            medications={medications}
            onSelectClassificationForFilter={handleFilterByClassificationFromGroup}
            onOpenNewClassModal={() => {
              setEditingClassification(null);
              setIsClassModalOpen(true);
            }}
            onEditClassification={(c) => {
              setEditingClassification(c);
              setIsClassModalOpen(true);
            }}
            onDeleteClassification={handleDeleteClassification}
            onViewMedicationDetail={(m) => setViewingMedication(m)}
          />
        )}

        {/* TAB 3: QUÉ TOMAR EN CADA CASO (GUÍAS CLÍNICAS) */}
        {activeTab === 'clinical-guide' && (
          <ClinicalCasesView
            cases={clinicalCases}
            medications={medications}
            onOpenNewCaseModal={() => {
              setEditingCase(null);
              setIsCaseModalOpen(true);
            }}
            onEditCase={(c) => {
              setEditingCase(c);
              setIsCaseModalOpen(true);
            }}
            onDeleteCase={handleDeleteClinicalCase}
            onViewMedicationDetail={(m) => setViewingMedication(m)}
            onNavigateToVademecum={() => setActiveTab('vademecum')}
          />
        )}

        {/* TAB 4: INTERACCIONES FARMACOLÓGICAS */}
        {activeTab === 'interactions' && (
          <InteractionsChecker
            medications={medications}
            onViewMedicationDetail={(m) => setViewingMedication(m)}
          />
        )}
      </main>

      {/* Global Modals */}
      {viewingMedication && (
        <MedicationDetailModal
          medication={viewingMedication}
          onClose={() => setViewingMedication(null)}
          onEdit={(m) => {
            setViewingMedication(null);
            setEditingMedication(m);
            setIsMedModalOpen(true);
          }}
          onSelectCategory={(cat) => {
            setViewingMedication(null);
            setSelectedClassificationFilter(cat);
            setActiveTab('vademecum');
          }}
        />
      )}

      {isMedModalOpen && (
        <MedicationFormModal
          initialData={editingMedication}
          availableClassifications={classifications}
          onSave={handleSaveMedication}
          onClose={() => {
            setIsMedModalOpen(false);
            setEditingMedication(null);
          }}
        />
      )}

      {isClassModalOpen && (
        <ClassificationFormModal
          initialData={editingClassification}
          onSave={handleSaveClassification}
          onClose={() => {
            setIsClassModalOpen(false);
            setEditingClassification(null);
          }}
        />
      )}

      {isCaseModalOpen && (
        <ClinicalCaseFormModal
          initialData={editingCase}
          onSave={handleSaveClinicalCase}
          onClose={() => {
            setIsCaseModalOpen(false);
            setEditingCase(null);
          }}
        />
      )}

      {isCalculatorOpen && (
        <DosageCalculatorModal onClose={() => setIsCalculatorOpen(false)} />
      )}

      {isBackupOpen && (
        <ImportExportModal
          onClose={() => setIsBackupOpen(false)}
          onDataReload={reloadAllData}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">PharmIndex Pro</span>
            <span>—</span>
            <span>Vademécum Clínico & Guía Farmacológica Interactiva</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Uso exclusivo para profesionales de la salud</span>
            <span>•</span>
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="hover:text-teal-700 underline cursor-pointer"
            >
              Calculadora
            </button>
            <span>•</span>
            <button
              onClick={() => setIsBackupOpen(true)}
              className="hover:text-teal-700 underline cursor-pointer"
            >
              Respaldar Datos
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
