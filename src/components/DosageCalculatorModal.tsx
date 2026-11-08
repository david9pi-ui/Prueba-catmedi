import React, { useState } from 'react';
import { X, Calculator, Baby, Activity, AlertCircle, RefreshCw } from 'lucide-react';

interface DosageCalculatorModalProps {
  onClose: () => void;
}

export const DosageCalculatorModal: React.FC<DosageCalculatorModalProps> = ({ onClose }) => {
  const [calcTab, setCalcTab] = useState<'weight-dose' | 'renal-clcr'>('weight-dose');

  // Weight-based dosing state
  const [weightKg, setWeightKg] = useState<number>(18);
  const [targetDoseMgKg, setTargetDoseMgKg] = useState<number>(50); // e.g. 50 mg/kg/day
  const [doseType, setDoseType] = useState<'per-day' | 'per-dose'>('per-day');
  const [frequencyIntervalHours, setFrequencyIntervalHours] = useState<number>(8); // every 8h = 3 times a day
  const [concMg, setConcMg] = useState<number>(250); // 250 mg in 5 ml
  const [concMl, setConcMl] = useState<number>(5);

  // Renal Clearance Cockcroft-Gault state
  const [age, setAge] = useState<number>(65);
  const [patientWeight, setPatientWeight] = useState<number>(70);
  const [serumCreatinine, setSerumCreatinine] = useState<number>(1.4);
  const [sex, setSex] = useState<'male' | 'female'>('male');

  // Calculations for Weight-based dose
  const dosesPerDay = 24 / frequencyIntervalHours;
  let totalDailyMg = 0;
  let mgPerDose = 0;

  if (doseType === 'per-day') {
    totalDailyMg = weightKg * targetDoseMgKg;
    mgPerDose = totalDailyMg / dosesPerDay;
  } else {
    mgPerDose = weightKg * targetDoseMgKg;
    totalDailyMg = mgPerDose * dosesPerDay;
  }

  // Calculate ml per dose
  const mlPerDose = concMg > 0 ? (mgPerDose * concMl) / concMg : 0;

  // Cockcroft-Gault Formula:
  // ClCr = ((140 - Age) * Weight) / (72 * Creatinine) * (0.85 if female)
  let clcr = 0;
  if (serumCreatinine > 0) {
    const rawClCr = ((140 - age) * patientWeight) / (72 * serumCreatinine);
    clcr = sex === 'female' ? rawClCr * 0.85 : rawClCr;
  }

  const getRenalCategory = (val: number) => {
    if (val >= 90) return { label: 'Normal (≥90 ml/min)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val >= 60) return { label: 'Deterioro Leve (60-89 ml/min)', color: 'text-sky-700 bg-sky-50 border-sky-200' };
    if (val >= 30) return { label: 'Deterioro Moderado (30-59 ml/min) - Ajuste Frecuente', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (val >= 15) return { label: 'Deterioro Grave (15-29 ml/min) - Requiere Ajuste Severo', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'Falla Renal Terminal (<15 ml/min o diálisis)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const renalCategory = getRenalCategory(clcr);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Calculadora Posológica & Ajuste Renal Clínico
              </h2>
              <p className="text-xs text-slate-400">
                Herramientas rápidas para cálculo de dosis pediátrica y aclaramiento de creatinina
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

        {/* Sub-tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4">
          <button
            onClick={() => setCalcTab('weight-dose')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${
              calcTab === 'weight-dose'
                ? 'border-amber-600 text-amber-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Baby className="w-4 h-4" />
            <span>Cálculo de Dosis por Peso (mg/kg)</span>
          </button>

          <button
            onClick={() => setCalcTab('renal-clcr')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${
              calcTab === 'renal-clcr'
                ? 'border-amber-600 text-amber-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Aclaramiento Cockcroft-Gault (ClCr)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-800">
          {/* TAB 1: Weight based dosing */}
          {calcTab === 'weight-dose' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Peso del Paciente (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dosis Prescrita
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      value={targetDoseMgKg}
                      onChange={(e) => setTargetDoseMgKg(parseFloat(e.target.value) || 0)}
                      className="w-2/3 px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-amber-500"
                    />
                    <select
                      value={doseType}
                      onChange={(e) => setDoseType(e.target.value as any)}
                      className="w-1/3 px-2 py-2 text-xs rounded-lg border border-slate-300"
                    >
                      <option value="per-day">mg/kg/día</option>
                      <option value="per-dose">mg/kg/dosis</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Intervalo de Administración
                  </label>
                  <select
                    value={frequencyIntervalHours}
                    onChange={(e) => setFrequencyIntervalHours(parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  >
                    <option value={6}>Cada 6 horas (4 veces al día)</option>
                    <option value={8}>Cada 8 horas (3 veces al día)</option>
                    <option value={12}>Cada 12 horas (2 veces al día)</option>
                    <option value={24}>Cada 24 horas (1 vez al día)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Concentración de Suspensión / Jarabe
                  </label>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <input
                      type="number"
                      min="1"
                      value={concMg}
                      onChange={(e) => setConcMg(parseFloat(e.target.value) || 1)}
                      className="w-24 px-2.5 py-2 text-sm rounded-lg border border-slate-300 font-mono"
                    />
                    <span>mg en</span>
                    <input
                      type="number"
                      min="1"
                      value={concMl}
                      onChange={(e) => setConcMl(parseFloat(e.target.value) || 1)}
                      className="w-16 px-2.5 py-2 text-sm rounded-lg border border-slate-300 font-mono"
                    />
                    <span>ml</span>
                  </div>
                </div>
              </div>

              {/* Calculated Result Card */}
              <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                  Resultado de la Posología:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-[11px] text-slate-500 block">Dosis por Toma:</span>
                    <span className="text-xl font-extrabold text-slate-900 font-mono">
                      {mgPerDose.toFixed(1)} <span className="text-xs font-medium text-slate-500">mg</span>
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-[11px] text-slate-500 block">Volumen por Toma:</span>
                    <span className="text-xl font-extrabold text-amber-700 font-mono">
                      {mlPerDose.toFixed(1)} <span className="text-xs font-medium text-slate-500">ml</span>
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-[11px] text-slate-500 block">Dosis Total Diaria:</span>
                    <span className="text-xl font-extrabold text-slate-900 font-mono">
                      {totalDailyMg.toFixed(1)} <span className="text-xs font-medium text-slate-500">mg/día</span>
                    </span>
                  </div>
                </div>

                <div className="text-xs text-amber-950 bg-white/70 p-2.5 rounded-lg border border-amber-200/60">
                  <span className="font-semibold">Indicación en receta: </span>
                  <span>
                    Administrar <strong>{mlPerDose.toFixed(1)} ml</strong> ({mgPerDose.toFixed(0)} mg) vía oral cada {frequencyIntervalHours} horas.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Cockcroft-Gault Creatinine Clearance */}
          {calcTab === 'renal-clcr' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Edad (años)
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="115"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Peso Real (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="20"
                    value={patientWeight}
                    onChange={(e) => setPatientWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Creatinina Sérica (mg/dl)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    value={serumCreatinine}
                    onChange={(e) => setSerumCreatinine(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sexo Biológico
                  </label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                  >
                    <option value="male">Masculino (Factor 1.0)</option>
                    <option value="female">Femenino (Factor 0.85)</option>
                  </select>
                </div>
              </div>

              {/* Clearance Result Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Aclaramiento de Creatinina Estimado:
                </span>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-3xl font-extrabold text-slate-900 font-mono">
                      {clcr.toFixed(1)}{' '}
                      <span className="text-sm font-semibold text-slate-500">ml/min</span>
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      Fórmula Cockcroft-Gault estándar
                    </span>
                  </div>

                  <span className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${renalCategory.color}`}>
                    {renalCategory.label}
                  </span>
                </div>

                <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <p className="font-semibold text-slate-800">
                    Implicación en Vademécum:
                  </p>
                  <p>
                    {clcr < 30
                      ? 'Muchos fármacos requieren ajuste significativo de dosis o contraindicación (ej. Metformina contraindicada si TFG < 30, AINEs contraindicados, ajuste en Amoxicilina/Clavulánico y Enalapril).'
                      : clcr < 60
                      ? 'Monitoree creatinina periódicamente; ajuste fármacos con eliminación predominantemente renal.'
                      : 'Función renal adecuada para posología convencional sin ajuste requerido.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer"
          >
            Cerrar Calculadora
          </button>
        </div>
      </div>
    </div>
  );
};
