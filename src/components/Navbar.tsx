import React from 'react';
import { 
  Pill, 
  Layers, 
  Stethoscope, 
  ShieldAlert, 
  Calculator, 
  Plus, 
  Download, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export type ActiveTab = 'vademecum' | 'classifications' | 'clinical-guide' | 'interactions' | 'calculator';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  medCount: number;
  classCount: number;
  caseCount: number;
  onOpenNewMedModal: () => void;
  onOpenNewClassModal: () => void;
  onOpenNewCaseModal: () => void;
  onOpenBackupModal: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  medCount,
  classCount,
  caseCount,
  onOpenNewMedModal,
  onOpenNewClassModal,
  onOpenNewCaseModal,
  onOpenBackupModal,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner with branding and global actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                  Pharm<span className="text-teal-600">Index</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                  Pro Clínico
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Vademécum & Guía Farmacológica para Profesionales de la Salud
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Contextual Add Button */}
            {activeTab === 'vademecum' && (
              <button
                onClick={onOpenNewMedModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 active:scale-95 transition-all shadow-sm shadow-teal-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nuevo Medicamento</span>
                <span className="sm:hidden">Medicamento</span>
              </button>
            )}

            {activeTab === 'classifications' && (
              <button
                onClick={onOpenNewClassModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Clasificación</span>
              </button>
            )}

            {activeTab === 'clinical-guide' && (
              <button
                onClick={onOpenNewCaseModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Caso Clínico</span>
              </button>
            )}

            {/* Backup & Tools Dropdown/Action */}
            <button
              onClick={onOpenBackupModal}
              title="Respaldar o Importar Base de Datos"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Respaldar</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('¿Deseas restaurar la base de datos a sus valores clínicos predeterminados? Se mantendrán los medicamentos iniciales.')) {
                  onResetData();
                }
              }}
              title="Restaurar base de datos a estado inicial"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab('vademecum')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'vademecum'
                ? 'bg-teal-50 text-teal-700 font-semibold shadow-xs border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Pill className={`w-4 h-4 ${activeTab === 'vademecum' ? 'text-teal-600' : 'text-slate-400'}`} />
            <span>Vademécum</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'vademecum' ? 'bg-teal-200 text-teal-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {medCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('classifications')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'classifications'
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs border-b-2 border-indigo-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Layers className={`w-4 h-4 ${activeTab === 'classifications' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>Clasificaciones Farmacológicas</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'classifications' ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {classCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('clinical-guide')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'clinical-guide'
                ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Stethoscope className={`w-4 h-4 ${activeTab === 'clinical-guide' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>Qué Tomar en Cada Caso</span>
            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-200 text-emerald-900">
              <Sparkles className="w-2.5 h-2.5 text-emerald-700" />
              {caseCount} Guías
            </span>
          </button>

          <button
            onClick={() => setActiveTab('interactions')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'interactions'
                ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs border-b-2 border-rose-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <ShieldAlert className={`w-4 h-4 ${activeTab === 'interactions' ? 'text-rose-600' : 'text-slate-400'}`} />
            <span>Interacciones Clínicas</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-amber-50 text-amber-700 font-semibold shadow-xs border-b-2 border-amber-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Calculator className={`w-4 h-4 ${activeTab === 'calculator' ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>Calculadora Posológica</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
