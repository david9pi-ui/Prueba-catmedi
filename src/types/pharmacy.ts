export type PregnancyCategory = 'A' | 'B' | 'C' | 'D' | 'X' | 'N/A';
export type LactationSafety = 'Seguro' | 'Precaución' | 'Contraindicado' | 'Sin datos';
export type AdministrationRoute = 
  | 'Oral' 
  | 'Intravenosa' 
  | 'Intramuscular' 
  | 'Subcutánea' 
  | 'Tópica' 
  | 'Inhalatoria' 
  | 'Oftálmica' 
  | 'Rectal' 
  | 'Sublingual'
  | 'Nasal';

export type PrescriptionType = 
  | 'Venta Libre (OTC)' 
  | 'Receta Médica Simple' 
  | 'Receta Retenida / Controlada' 
  | 'Uso Hospitalario Exclusivo';

export interface DrugPresentation {
  form: string;
  concentration: string;
  route: AdministrationRoute;
  packageDetails?: string;
}

export interface DosageAndPosology {
  adult: string;
  pediatric?: string;
  elderly?: string;
  renalAdjustment?: string;
  hepaticAdjustment?: string;
  maxDailyDose?: string;
  administrationTips?: string;
}

export interface SafetyProfile {
  pregnancyCategory: PregnancyCategory;
  pregnancyDetails?: string;
  lactationSafety: LactationSafety;
  lactationDetails?: string;
  blackBoxWarning?: string;
  contraindications: string[];
  precautions: string[];
}

export interface AdverseEffects {
  frequent: string[];
  infrequent?: string[];
  severe: string[];
}

export interface DrugInteractionItem {
  interactingDrug: string;
  severity: 'Alta' | 'Moderada' | 'Leve' | 'Beneficiosa';
  clinicalEffect: string;
  management: string;
}

export interface Medication {
  id: string;
  genericName: string;
  commercialNames: string[];
  photoUrl: string;
  description: string;
  classifications: string[]; // Multiple categories support
  atcCode?: string;
  presentations: DrugPresentation[];
  mechanismOfAction: string;
  therapeuticIndications: string[];
  dosageAndPosology: DosageAndPosology;
  safety: SafetyProfile;
  adverseEffects: AdverseEffects;
  drugInteractions: DrugInteractionItem[];
  prescriptionType: PrescriptionType;
  custom?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DrugClassification {
  id: string;
  name: string;
  slug: string;
  therapeuticArea: string;
  description: string;
  mechanismSummary: string;
  colorTheme: string; // tailwind color prefix, e.g. 'emerald', 'sky', 'indigo', 'rose', 'amber'
  iconName?: string;
}

export interface ClinicalTherapyStep {
  drugName: string;
  dosage: string;
  duration: string;
  notes: string;
  medicationId?: string;
}

export interface ClinicalCaseProtocol {
  id: string;
  title: string;
  category: string;
  clinicalSummary: string;
  symptomsAndSigns: string[];
  firstLineTherapy: ClinicalTherapyStep[];
  secondLineTherapy: ClinicalTherapyStep[];
  contraindications: string[];
  redFlags: string[];
  nonPharmacologicalMeasures: string[];
  evidenceLevel?: string;
  isCustom?: boolean;
}

export interface InteractionAnalysisResult {
  drugA: string;
  drugB: string;
  severity: 'Alta' | 'Moderada' | 'Leve' | 'Beneficiosa';
  mechanism: string;
  effect: string;
  recommendation: string;
}
