import React, { useState } from 'react';
import { 
  Medication, 
  DrugClassification, 
  AdministrationRoute, 
  PregnancyCategory, 
  LactationSafety, 
  PrescriptionType,
  DrugPresentation,
  DrugInteractionItem
} from '../types/pharmacy';
import { 
  X, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  AlertTriangle,
  Pill,
  Sparkles
} from 'lucide-react';

interface MedicationFormModalProps {
  initialData?: Medication | null;
  availableClassifications: DrugClassification[];
  onSave: (medication: Medication) => void;
  onClose: () => void;
}

const DEFAULT_PHOTO_PRESETS = [
  { label: 'Cápsulas / Comprimidos', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80' },
  { label: 'Blíster / Pastillas', url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80' },
  { label: 'Vial / Inyectable', url: 'https://images.unsplash.com/photo-1576071804486-b8bc221068f7?w=600&auto=format&fit=crop&q=80' },
  { label: 'Farmacia / Frasco', url: 'https://images.unsplash.com/photo-1550572017-ed233519895c?w=600&auto=format&fit=crop&q=80' },
  { label: 'Inhalador / Spray', url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80' },
  { label: 'Tabletas Redondas', url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&auto=format&fit=crop&q=80' },
];

const ROUTES: AdministrationRoute[] = [
  'Oral',
  'Intravenosa',
  'Intramuscular',
  'Subcutánea',
  'Tópica',
  'Inhalatoria',
  'Oftálmica',
  'Rectal',
  'Sublingual',
  'Nasal',
];

export const MedicationFormModal: React.FC<MedicationFormModalProps> = ({
  initialData,
  availableClassifications,
  onSave,
  onClose,
}) => {
  // Form State
  const [genericName, setGenericName] = useState(initialData?.genericName || '');
  const [commercialNamesStr, setCommercialNamesStr] = useState(initialData?.commercialNames.join(', ') || '');
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || DEFAULT_PHOTO_PRESETS[0].url);
  const [description, setDescription] = useState(initialData?.description || '');
  const [selectedClasses, setSelectedClasses] = useState<string[]>(initialData?.classifications || []);
  const [newCustomClass, setNewCustomClass] = useState('');
  const [atcCode, setAtcCode] = useState(initialData?.atcCode || '');
  
  // Presentations
  const [presentations, setPresentations] = useState<DrugPresentation[]>(
    initialData?.presentations || [
      { form: 'Comprimidos', concentration: '500 mg', route: 'Oral' },
    ]
  );

  // Mechanism & Indications
  const [mechanismOfAction, setMechanismOfAction] = useState(initialData?.mechanismOfAction || '');
  const [indicationsStr, setIndicationsStr] = useState(initialData?.therapeuticIndications.join('\n') || '');

  // Posology
  const [adultDose, setAdultDose] = useState(initialData?.dosageAndPosology.adult || '');
  const [pediatricDose, setPediatricDose] = useState(initialData?.dosageAndPosology.pediatric || '');
  const [elderlyDose, setElderlyDose] = useState(initialData?.dosageAndPosology.elderly || '');
  const [renalAdjustment, setRenalAdjustment] = useState(initialData?.dosageAndPosology.renalAdjustment || '');
  const [hepaticAdjustment, setHepaticAdjustment] = useState(initialData?.dosageAndPosology.hepaticAdjustment || '');
  const [maxDailyDose, setMaxDailyDose] = useState(initialData?.dosageAndPosology.maxDailyDose || '');
  const [administrationTips, setAdministrationTips] = useState(initialData?.dosageAndPosology.administrationTips || '');

  // Safety
  const [pregnancyCategory, setPregnancyCategory] = useState<PregnancyCategory>(initialData?.safety.pregnancyCategory || 'B');
  const [pregnancyDetails, setPregnancyDetails] = useState(initialData?.safety.pregnancyDetails || '');
  const [lactationSafety, setLactationSafety] = useState<LactationSafety>(initialData?.safety.lactationSafety || 'Seguro');
  const [lactationDetails, setLactationDetails] = useState(initialData?.safety.lactationDetails || '');
  const [blackBoxWarning, setBlackBoxWarning] = useState(initialData?.safety.blackBoxWarning || '');
  const [contraindicationsStr, setContraindicationsStr] = useState(initialData?.safety.contraindications.join('\n') || '');
  const [precautionsStr, setPrecautionsStr] = useState(initialData?.safety.precautions.join('\n') || '');

  // Adverse Effects
  const [frequentAdverseStr, setFrequentAdverseStr] = useState(initialData?.adverseEffects.frequent.join(', ') || '');
  const [severeAdverseStr, setSevereAdverseStr] = useState(initialData?.adverseEffects.severe.join('\n') || '');

  // Drug Interactions
  const [drugInteractions, setDrugInteractions] = useState<DrugInteractionItem[]>(
    initialData?.drugInteractions || []
  );

  const [prescriptionType, setPrescriptionType] = useState<PrescriptionType>(
    initialData?.prescriptionType || 'Receta Médica Simple'
  );

  // New interaction input state
  const [newInterDrug, setNewInterDrug] = useState('');
  const [newInterSev, setNewInterSev] = useState<'Alta' | 'Moderada' | 'Leve' | 'Beneficiosa'>('Alta');
  const [newInterEffect, setNewInterEffect] = useState('');
  const [newInterMgmt, setNewInterMgmt] = useState('');

  // Handle image upload from computer (FileReader to base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleClass = (name: string) => {
    setSelectedClasses(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleAddNewClass = () => {
    if (newCustomClass.trim() && !selectedClasses.includes(newCustomClass.trim())) {
      setSelectedClasses(prev => [...prev, newCustomClass.trim()]);
      setNewCustomClass('');
    }
  };

  // Add presentation
  const handleAddPresentation = () => {
    setPresentations(prev => [
      ...prev,
      { form: 'Comprimidos', concentration: '100 mg', route: 'Oral' }
    ]);
  };

  const handleUpdatePresentation = (index: number, field: keyof DrugPresentation, value: any) => {
    setPresentations(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemovePresentation = (index: number) => {
    setPresentations(prev => prev.filter((_, i) => i !== index));
  };

  // Add interaction
  const handleAddInteraction = () => {
    if (!newInterDrug.trim()) return;
    setDrugInteractions(prev => [
      ...prev,
      {
        interactingDrug: newInterDrug.trim(),
        severity: newInterSev,
        clinicalEffect: newInterEffect.trim() || 'Interacción documentada',
        management: newInterMgmt.trim() || 'Monitorear estrechamente',
      }
    ]);
    setNewInterDrug('');
    setNewInterEffect('');
    setNewInterMgmt('');
  };

  const handleRemoveInteraction = (index: number) => {
    setDrugInteractions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!genericName.trim()) {
      alert('Por favor introduce el nombre genérico del fármaco.');
      return;
    }

    if (selectedClasses.length === 0) {
      alert('Por favor selecciona o agrega al menos una clasificación farmacológica.');
      return;
    }

    const commercialNames = commercialNamesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const therapeuticIndications = indicationsStr
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const contraindications = contraindicationsStr
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const precautions = precautionsStr
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const frequentAdverse = frequentAdverseStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const severeAdverse = severeAdverseStr
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const updatedMed: Medication = {
      id: initialData?.id || `med-${Date.now()}`,
      genericName: genericName.trim(),
      commercialNames,
      photoUrl: photoUrl.trim() || DEFAULT_PHOTO_PRESETS[0].url,
      description: description.trim() || 'Sin descripción detallada.',
      classifications: selectedClasses,
      atcCode: atcCode.trim() || undefined,
      presentations: presentations.length > 0 ? presentations : [{ form: 'Comprimidos', concentration: 'Estándar', route: 'Oral' }],
      mechanismOfAction: mechanismOfAction.trim() || 'Mecanismo no especificado.',
      therapeuticIndications: therapeuticIndications.length > 0 ? therapeuticIndications : ['Indicación clínica general'],
      dosageAndPosology: {
        adult: adultDose.trim() || 'Según criterio médico',
        pediatric: pediatricDose.trim() || undefined,
        elderly: elderlyDose.trim() || undefined,
        renalAdjustment: renalAdjustment.trim() || undefined,
        hepaticAdjustment: hepaticAdjustment.trim() || undefined,
        maxDailyDose: maxDailyDose.trim() || undefined,
        administrationTips: administrationTips.trim() || undefined,
      },
      safety: {
        pregnancyCategory,
        pregnancyDetails: pregnancyDetails.trim() || undefined,
        lactationSafety,
        lactationDetails: lactationDetails.trim() || undefined,
        blackBoxWarning: blackBoxWarning.trim() || undefined,
        contraindications: contraindications.length > 0 ? contraindications : ['Hipersensibilidad al principio activo'],
        precautions: precautions.length > 0 ? precautions : ['Monitorear tolerancia clínica'],
      },
      adverseEffects: {
        frequent: frequentAdverse.length > 0 ? frequentAdverse : ['Náuseas leves'],
        severe: severeAdverse.length > 0 ? severeAdverse : ['Reacciones de hipersensibilidad'],
      },
      drugInteractions,
      prescriptionType,
      custom: true,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedMed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/20 text-teal-400 rounded-lg">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {initialData ? 'Editar Medicamento Clínico' : 'Agregar Nuevo Medicamento al Vademécum'}
              </h2>
              <p className="text-xs text-slate-400">
                Complete los campos farmacológicos requeridos para la base de datos interactiva
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

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* SECTION 1: IDENTIFICACIÓN Y FOTO */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 pb-1 border-b border-teal-100 flex items-center gap-1.5">
              1. Identificación y Presentación Visual
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre Genérico (DCI) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Enalapril Maleato"
                  value={genericName}
                  onChange={(e) => setGenericName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombres Comerciales (separados por coma)
                </label>
                <input
                  type="text"
                  placeholder="ej. Vasotec, Renitec, Glioten"
                  value={commercialNamesStr}
                  onChange={(e) => setCommercialNamesStr(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Código ATC (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. C09AA02"
                  value={atcCode}
                  onChange={(e) => setAtcCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tipo de Prescripción
                </label>
                <select
                  value={prescriptionType}
                  onChange={(e) => setPrescriptionType(e.target.value as PrescriptionType)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Venta Libre (OTC)">Venta Libre (OTC)</option>
                  <option value="Receta Médica Simple">Receta Médica Simple</option>
                  <option value="Receta Retenida / Controlada">Receta Retenida / Controlada</option>
                  <option value="Uso Hospitalario Exclusivo">Uso Hospitalario Exclusivo</option>
                </select>
              </div>
            </div>

            {/* Photo / Image Selection */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-teal-600" />
                Fotografía del Medicamento (URL, archivo local o preset)
              </label>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Preview Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-300 shrink-0 shadow-2xs">
                  {photoUrl ? (
                    <img 
                      src={photoUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Pill className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="url"
                    placeholder="https://... URL de la imagen del fármaco"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-medium text-slate-700 cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Subir foto desde equipo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageFileChange} 
                        className="hidden" 
                      />
                    </label>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <span>O elegir preset:</span>
                      {DEFAULT_PHOTO_PRESETS.slice(0, 3).map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPhotoUrl(p.url)}
                          className="px-2 py-0.5 rounded bg-slate-200 hover:bg-teal-100 hover:text-teal-800 text-[10px] transition-colors cursor-pointer"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Descripción Farmacológica General *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Resumen del fármaco, familia y uso principal..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* SECTION 2: CLASIFICACIONES FARMACÉUTICAS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 pb-1 border-b border-teal-100">
              2. Clasificaciones y Familias Farmacológicas (Permite múltiples) *
            </h3>

            <div className="flex flex-wrap gap-2">
              {availableClassifications.map((cat) => {
                const isSelected = selectedClasses.includes(cat.name);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleToggleClass(cat.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-2xs font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Add custom classification inline */}
            <div className="flex items-center gap-2 max-w-md pt-2">
              <input
                type="text"
                placeholder="Nueva clasificación personalizada..."
                value={newCustomClass}
                onChange={(e) => setNewCustomClass(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNewClass();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleAddNewClass}
                className="px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg hover:bg-slate-700 cursor-pointer"
              >
                + Añadir
              </button>
            </div>
          </div>

          {/* SECTION 3: PRESENTACIONES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-teal-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700">
                3. Formas Farmacéuticas & Concentraciones
              </h3>
              <button
                type="button"
                onClick={handleAddPresentation}
                className="text-xs text-teal-700 font-semibold hover:text-teal-800 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar otra presentación
              </button>
            </div>

            <div className="space-y-2">
              {presentations.map((pres, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Forma (ej. Comprimidos, Vial IV)"
                    value={pres.form}
                    onChange={(e) => handleUpdatePresentation(idx, 'form', e.target.value)}
                    className="w-full sm:w-1/3 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Concentración (ej. 500 mg, 1g / 2ml)"
                    value={pres.concentration}
                    onChange={(e) => handleUpdatePresentation(idx, 'concentration', e.target.value)}
                    className="w-full sm:w-1/3 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                  />
                  <select
                    value={pres.route}
                    onChange={(e) => handleUpdatePresentation(idx, 'route', e.target.value as AdministrationRoute)}
                    className="w-full sm:w-1/4 px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    {ROUTES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {presentations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePresentation(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: MECANISMO E INDICACIONES */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 pb-1 border-b border-teal-100">
              4. Farmacodinamia e Indicaciones Terapéuticas
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mecanismo de Acción Celular y Molecular *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Explique diana enzimática, receptores, canales o cascada de señalización..."
                value={mechanismOfAction}
                onChange={(e) => setMechanismOfAction(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Indicaciones Terapéuticas (una por línea) *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Hipertensión arterial esencial&#10;Nefropatía diabética incipiente&#10;Insuficiencia cardíaca crónica"
                value={indicationsStr}
                onChange={(e) => setIndicationsStr(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* SECTION 5: DOSIS Y POSOLOGÍA */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 pb-1 border-b border-teal-100">
              5. Posología y Pautas de Dosificación
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dosis en Adultos *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. 50 mg a 100 mg cada 24 horas"
                  value={adultDose}
                  onChange={(e) => setAdultDose(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dosis Pediátrica
                </label>
                <input
                  type="text"
                  placeholder="ej. 0.7 mg/kg/día una vez al día"
                  value={pediatricDose}
                  onChange={(e) => setPediatricDose(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ajuste Renal (ClCr / TFG)
                </label>
                <input
                  type="text"
                  placeholder="ej. ClCr < 30: máx 50mg/d"
                  value={renalAdjustment}
                  onChange={(e) => setRenalAdjustment(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ajuste Hepático
                </label>
                <input
                  type="text"
                  placeholder="ej. Iniciar con 25mg/día"
                  value={hepaticAdjustment}
                  onChange={(e) => setHepaticAdjustment(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dosis Máxima Diaria
                </label>
                <input
                  type="text"
                  placeholder="ej. 100 mg al día"
                  value={maxDailyDose}
                  onChange={(e) => setMaxDailyDose(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono font-semibold text-rose-800"
                />
              </div>
            </div>
          </div>

          {/* SECTION 6: SEGURIDAD Y ADVERTENCIAS */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 pb-1 border-b border-teal-100">
              6. Seguridad, Embarazo y Advertencias
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Categoría en Embarazo FDA
                </label>
                <select
                  value={pregnancyCategory}
                  onChange={(e) => setPregnancyCategory(e.target.value as PregnancyCategory)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                >
                  <option value="A">Categoría A (Seguro en estudios humanos)</option>
                  <option value="B">Categoría B (Sin riesgo demostrado en animales)</option>
                  <option value="C">Categoría C (Riesgo no descartable)</option>
                  <option value="D">Categoría D (Evidencia de riesgo fetal humano)</option>
                  <option value="X">Categoría X (Contraindicación absoluta)</option>
                  <option value="N/A">N/A (No clasificado)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seguridad en Lactancia Materna
                </label>
                <select
                  value={lactationSafety}
                  onChange={(e) => setLactationSafety(e.target.value as LactationSafety)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Seguro">Seguro / Compatible</option>
                  <option value="Precaución">Precaución / Monitoreo</option>
                  <option value="Contraindicado">Contraindicado</option>
                  <option value="Sin datos">Sin datos concluyentes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Alerta de Caja Negra / Advertencia Máxima de Seguridad (Opcional)
              </label>
              <input
                type="text"
                placeholder="ej. Riesgo de toxicidad fetal grave si se administra en 2º o 3er trimestre"
                value={blackBoxWarning}
                onChange={(e) => setBlackBoxWarning(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-amber-300 bg-amber-50/50 text-amber-950 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contraindicaciones (una por línea)
                </label>
                <textarea
                  rows={2}
                  placeholder="Estenosis bilateral renal&#10;Antecedente de angioedema"
                  value={contraindicationsStr}
                  onChange={(e) => setContraindicationsStr(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Precauciones Clínicas (una por línea)
                </label>
                <textarea
                  rows={2}
                  placeholder="Vigilar potasio sérico&#10;Hipotensión en depletados de volumen"
                  value={precautionsStr}
                  onChange={(e) => setPrecautionsStr(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 7: INTERACCIONES */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 pb-1 border-b border-teal-100">
              7. Interacciones Farmacológicas Relevantes
            </h3>

            {drugInteractions.length > 0 && (
              <div className="space-y-2 mb-3">
                {drugInteractions.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{item.interactingDrug}</span>
                      <span className={`ml-2 px-1.5 py-0.2 rounded font-bold ${
                        item.severity === 'Alta' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.severity}
                      </span>
                      <p className="text-slate-600 mt-0.5">{item.clinicalEffect}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveInteraction(i)}
                      className="p-1 text-rose-500 hover:bg-rose-100 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Add Interaction Form */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-700 block">Agregar Interacción Específica:</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Fármaco con el que interactúa"
                  value={newInterDrug}
                  onChange={(e) => setNewInterDrug(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
                <select
                  value={newInterSev}
                  onChange={(e) => setNewInterSev(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="Alta">Alta (Peligrosa)</option>
                  <option value="Moderada">Moderada</option>
                  <option value="Leve">Leve</option>
                  <option value="Beneficiosa">Beneficiosa (Sinergia)</option>
                </select>
                <input
                  type="text"
                  placeholder="Efecto (ej. Aumento de toxicidad)"
                  value={newInterEffect}
                  onChange={(e) => setNewInterEffect(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddInteraction}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Medicamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
