import { Medication, DrugClassification, ClinicalCaseProtocol } from '../types/pharmacy';
import { INITIAL_MEDICATIONS } from '../data/initialMedications';
import { INITIAL_CLASSIFICATIONS } from '../data/initialClassifications';
import { INITIAL_CLINICAL_CASES } from '../data/initialClinicalCases';

const STORAGE_KEYS = {
  MEDICATIONS: 'pharmindex_medications_v1',
  CLASSIFICATIONS: 'pharmindex_classifications_v1',
  CLINICAL_CASES: 'pharmindex_clinical_cases_v1',
};

export function loadMedications(): Medication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    if (!raw) {
      saveMedications(INITIAL_MEDICATIONS);
      return INITIAL_MEDICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MEDICATIONS;
  } catch (e) {
    console.error('Error loading medications from storage', e);
    return INITIAL_MEDICATIONS;
  }
}

export function saveMedications(meds: Medication[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
  } catch (e) {
    console.error('Error saving medications to storage', e);
  }
}

export function loadClassifications(): DrugClassification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASSIFICATIONS);
    if (!raw) {
      saveClassifications(INITIAL_CLASSIFICATIONS);
      return INITIAL_CLASSIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CLASSIFICATIONS;
  } catch (e) {
    console.error('Error loading classifications', e);
    return INITIAL_CLASSIFICATIONS;
  }
}

export function saveClassifications(classes: DrugClassification[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLASSIFICATIONS, JSON.stringify(classes));
  } catch (e) {
    console.error('Error saving classifications', e);
  }
}

export function loadClinicalCases(): ClinicalCaseProtocol[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLINICAL_CASES);
    if (!raw) {
      saveClinicalCases(INITIAL_CLINICAL_CASES);
      return INITIAL_CLINICAL_CASES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CLINICAL_CASES;
  } catch (e) {
    console.error('Error loading clinical cases', e);
    return INITIAL_CLINICAL_CASES;
  }
}

export function saveClinicalCases(cases: ClinicalCaseProtocol[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLINICAL_CASES, JSON.stringify(cases));
  } catch (e) {
    console.error('Error saving clinical cases', e);
  }
}

export function resetAllData(): {
  medications: Medication[];
  classifications: DrugClassification[];
  cases: ClinicalCaseProtocol[];
} {
  saveMedications(INITIAL_MEDICATIONS);
  saveClassifications(INITIAL_CLASSIFICATIONS);
  saveClinicalCases(INITIAL_CLINICAL_CASES);
  return {
    medications: INITIAL_MEDICATIONS,
    classifications: INITIAL_CLASSIFICATIONS,
    cases: INITIAL_CLINICAL_CASES,
  };
}

export function exportDatabaseJSON(): string {
  const data = {
    appName: 'PharmIndex Pro',
    exportedAt: new Date().toISOString(),
    version: '1.0',
    medications: loadMedications(),
    classifications: loadClassifications(),
    clinicalCases: loadClinicalCases(),
  };
  return JSON.stringify(data, null, 2);
}

export function importDatabaseJSON(jsonStr: string): {
  success: boolean;
  message: string;
  medCount?: number;
  classCount?: number;
} {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'El archivo JSON no tiene un formato válido.' };
    }

    if (Array.isArray(parsed.medications)) {
      saveMedications(parsed.medications);
    }
    if (Array.isArray(parsed.classifications)) {
      saveClassifications(parsed.classifications);
    }
    if (Array.isArray(parsed.clinicalCases)) {
      saveClinicalCases(parsed.clinicalCases);
    }

    return {
      success: true,
      message: 'Base de datos importada exitosamente.',
      medCount: parsed.medications?.length,
      classCount: parsed.classifications?.length,
    };
  } catch (e: any) {
    return { success: false, message: 'Error al procesar el archivo: ' + (e?.message || 'Error de parseo') };
  }
}
