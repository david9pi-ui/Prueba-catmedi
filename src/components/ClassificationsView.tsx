import React, { useState } from 'react';
import { DrugClassification, Medication } from '../types/pharmacy';
import { 
  Layers, 
  Plus, 
  Search, 
  Pill, 
  Trash2, 
  Edit3, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ClassificationsViewProps {
  classifications: DrugClassification[];
  medications: Medication[];
  onSelectClassificationForFilter: (className: string) => void;
  onOpenNewClassModal: () => void;
  onEditClassification: (classification: DrugClassification) => void;
  onDeleteClassification: (id: string) => void;
  onViewMedicationDetail: (med: Medication) => void;
}

export const ClassificationsView: React.FC<ClassificationsViewProps> = ({
  classifications,
  medications,
  onSelectClassificationForFilter,
  onOpenNewClassModal,
  onEditClassification,
  onDeleteClassification,
  onViewMedicationDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassForDrawer, setSelectedClassForDrawer] = useState<DrugClassification | null>(null);

  const filteredClassifications = classifications.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.therapeuticArea.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.mechanismSummary.toLowerCase().includes(q)
    );
  });

  // Calculate drug count per classification
  const getDrugsInClass = (className: string) => {
    return medications.filter((m) => m.classifications.includes(className));
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-full">
              Familias & Grupos Terapéuticos
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Apartado de Clasificaciones Farmacológicas
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Organice y explore los fármacos agrupados por familias, mecanismos de acción bioquímicos y áreas terapéuticas. Puede asociar cada fármaco a múltiples grupos simultáneamente.
          </p>

          {/* Search bar inside header */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar clasificación, área terapéutica o mecanismo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              onClick={onOpenNewClassModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-500/30 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Clasificación</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Classifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClassifications.map((item) => {
          const drugsInClass = getDrugsInClass(item.name);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group"
            >
              {/* Card Header with Color Accent */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    {item.therapeuticArea}
                  </span>
                  
                  {/* Drug Count Badge */}
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {drugsInClass.length} {drugsInClass.length === 1 ? 'fármaco' : 'fármacos'}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Mechanism Summary Box */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-700">
                  <span className="font-semibold text-slate-900 block mb-0.5">
                    Mecanismo general del grupo:
                  </span>
                  <p className="line-clamp-2 leading-relaxed">
                    {item.mechanismSummary}
                  </p>
                </div>

                {/* Mini Drugs Pills Preview */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Fármacos en este grupo:
                  </span>
                  {drugsInClass.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">
                      Aún no hay fármacos asociados a esta clasificación.
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {drugsInClass.slice(0, 4).map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => onViewMedicationDetail(d)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                        >
                          <Pill className="w-2.5 h-2.5 text-teal-600" />
                          <span>{d.genericName.split(' ')[0]}</span>
                        </button>
                      ))}
                      {drugsInClass.length > 4 && (
                        <span className="text-[10px] text-indigo-600 font-semibold self-center">
                          +{drugsInClass.length - 4} más
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectClassificationForFilter(item.name)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition-colors cursor-pointer"
                >
                  <span>Filtrar en Vademécum</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditClassification(item)}
                    title="Editar Clasificación"
                    className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`¿Deseas eliminar la clasificación "${item.name}"? Los fármacos no se borrarán.`)) {
                        onDeleteClassification(item.id);
                      }
                    }}
                    title="Eliminar Clasificación"
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClassifications.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No se encontraron clasificaciones
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Intente con otros términos de búsqueda o cree una nueva categoría.
          </p>
        </div>
      )}
    </div>
  );
};
