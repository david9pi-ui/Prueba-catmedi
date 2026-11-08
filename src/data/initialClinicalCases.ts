import { ClinicalCaseProtocol } from '../types/pharmacy';

export const INITIAL_CLINICAL_CASES: ClinicalCaseProtocol[] = [
  {
    id: 'case-hta-primaria',
    title: 'Hipertensión Arterial Esencial (Grado 1 y 2)',
    category: 'Cardiovascular y Renal',
    clinicalSummary: 'Manejo farmacológico inicial y escalonado en pacientes adultos con cifras tensionales ≥ 140/90 mmHg confirmadas en consulta o MAPA/AMPA.',
    symptomsAndSigns: [
      'Asintomático en la mayoría de los casos ("asesino silencioso")',
      'Cefalea occipital matutina',
      'Tinnitus o acúfenos pulsátiles',
      'Presión arterial sistólica ≥ 140 mmHg y/o diastólica ≥ 90 mmHg',
    ],
    firstLineTherapy: [
      {
        drugName: 'Losartán Potásico (ARA-II)',
        dosage: '50 mg a 100 mg una vez al día por la mañana',
        duration: 'Tratamiento continuo crónico con control mensual',
        notes: 'De elección preferente en pacientes jóvenes, diabéticos con albuminuria o intolerantes a tos por IECA.',
        medicationId: 'med-losartan',
      },
      {
        drugName: 'Enalapril (IECA)',
        dosage: '10 mg a 20 mg cada 12 o 24 horas',
        duration: 'Tratamiento crónico',
        notes: 'Alternativa clásica de primera línea; vigilar tos seca en 10-15% de pacientes.',
      },
      {
        drugName: 'Amlodipino (Calcioantagonista DHP)',
        dosage: '5 mg a 10 mg una vez al día',
        duration: 'Tratamiento crónico',
        notes: 'Excelente en adultos mayores, hipertensión sistólica aislada o en combinación con ARA-II/IECA.',
      },
    ],
    secondLineTherapy: [
      {
        drugName: 'Hidroclorotiazida',
        dosage: '12.5 mg a 25 mg una vez al día',
        duration: 'Tratamiento crónico',
        notes: 'Adición sinérgica de segunda línea (combinación doble en un solo comprimido Losartán + HCTZ).',
      },
      {
        drugName: 'Espironolactona',
        dosage: '25 mg una vez al día',
        duration: 'Evaluación según respuesta',
        notes: 'Cuarto fármaco de elección en sospecha de hipertensión resistente o hiperaldosteronismo.',
      },
    ],
    contraindications: [
      'Embarazo activo (ARA-II e IECAs absolutamente contraindicados por fetotoxicidad grave)',
      'Estenosis bilateral de arterias renales',
      'Hiperpotasemia basal > 5.5 mEq/L',
    ],
    redFlags: [
      'Cifras de PA > 180/120 mmHg con cefalea intensa, escotomas o dolor torácico (Emergencia Hipertensiva: derivación inmediata a urgencias)',
      'Déficit neurológico focal agudo o sospecha de ACV',
      'Disnea súbita con crepitantes basales (Edema agudo de pulmón)',
    ],
    nonPharmacologicalMeasures: [
      'Dieta DASH con restricción estricta de sodio (< 2 g de sodio o 5 g de sal al día)',
      'Ejercicio aeróbico moderado mínimo 150 minutos semanales',
      'Cese del tabaquismo y moderación drástica del consumo de alcohol',
      'Pérdida ponderal (cada 1 kg de reducción reduce aprox. 1 mmHg de PA)',
    ],
    evidenceLevel: 'Guías Clínicas ACC/AHA y ESC/ESH 2024 (Nivel de Evidencia IA)',
  },
  {
    id: 'case-itu-cistitis',
    title: 'Infección del Tracto Urinario Baja (Cistitis Aguda no Complicada)',
    category: 'Infectología',
    clinicalSummary: 'Cuadro infeccioso bacteriano agudo de la mucosa vesical en mujeres no gestantes sin alteraciones anatómicas ni comorbilidades urológicas.',
    symptomsAndSigns: [
      'Disuria y ardor miccional intenso',
      'Polaquiuria y micción imperiosa (urgencia)',
      'Tenesmo vesical y molestia suprapúbica',
      'Orina turbia o hematuria terminal macroscópica',
      'AUSENCIA de fiebre alta (>38°C) o dolor lumbar/puñopercusión (signos de pielonefritis)',
    ],
    firstLineTherapy: [
      {
        drugName: 'Fosfomicina Trometamol',
        dosage: '3 g en monodosis oral disuelta en agua por la noche tras vaciar vejiga',
        duration: 'Dosis única (1 día)',
        notes: 'Primera línea por excelente adherencia y bajísima tasa de resistencia en E. coli.',
      },
      {
        drugName: 'Nitrofurantoína monohidrato / macrocristales',
        dosage: '100 mg cada 12 horas con las comidas',
        duration: '5 días',
        notes: 'Primera línea alternativa; no usar si la tasa de filtrado glomerular (TFG) es < 30 ml/min.',
      },
    ],
    secondLineTherapy: [
      {
        drugName: 'Amoxicilina + Ácido Clavulánico',
        dosage: '500/125 mg cada 8 horas o 875/125 mg cada 12 horas',
        duration: '5 a 7 días',
        notes: 'Indicada en casos con cultivo previo sensible o contraindicación a fosfomicina/nitrofurantoína.',
        medicationId: 'med-amoxicilina-clavulanico',
      },
      {
        drugName: 'Ciprofloxacino (Quinolona)',
        dosage: '250 mg a 500 mg cada 12 horas',
        duration: '3 días',
        notes: 'Reservar exclusivamente para intolerancia o resistencia comprobada; evitar como primera línea empírica.',
      },
    ],
    contraindications: [
      'Nitrofurantoína contraindicada en insuficiencia renal severa o tercer trimestre de gestación',
      'Evitar fluoroquinolonas empíricas rutinarias por altas tasas de resistencia comunitaria y riesgo de tendinopatías',
    ],
    redFlags: [
      'Aparición de fiebre alta con escalofríos o náuseas/vómitos persistentes (Sospecha de Pielonefritis)',
      'Dolor en fosa lumbar o puñopercusión positiva (PPL+)',
      'Síntomas refractarios tras 72 horas de inicio del tratamiento antibiótico',
    ],
    nonPharmacologicalMeasures: [
      'Hidratación hídrica abundante (mínimo 2 a 2.5 litros diarios de agua)',
      'Micción postcoital precoz',
      'Evitar la retención voluntaria prolongada de orina',
      'Higiene perineal anteroposterior estricta',
    ],
    evidenceLevel: 'Guía IDSA / AUA / Asociación Europea de Urología (EAU)',
  },
  {
    id: 'case-faringitis-estreptococica',
    title: 'Faringoamigdalitis Bacteriana Aguda (Streptococcus pyogenes)',
    category: 'Infectología y Otorrinolaringología',
    clinicalSummary: 'Infección orofaríngea confirmada por criterios de Centor modificados (≥3 puntos) o test rápido de antígeno estreptocócico / cultivo positivo.',
    symptomsAndSigns: [
      'Odinofagia súbita e intensa',
      'Fiebre > 38°C',
      'Exudado amigdalino blanquecino pultáceo',
      'Adenopatías cervicales anteriores sensibles',
      'AUSENCIA característica de tos, rinorrea, conjuntivitis o afonía (orientan a etiología viral)',
    ],
    firstLineTherapy: [
      {
        drugName: 'Amoxicilina oral',
        dosage: '500 mg cada 8 horas o 1000 mg cada 12 horas (en niños: 50 mg/kg/día c/12 o 24h)',
        duration: '10 días completos (crucial para erradicación y prevención de Fiebre Reumática)',
        notes: 'Fármaco de máxima elección por espectro estrecho y nula resistencia documentada en S. pyogenes.',
      },
      {
        drugName: 'Penicilina Benzatínica IM',
        dosage: '1.200.000 UI intramuscular profunda en dosis única (600.000 UI en niños < 27 kg)',
        duration: 'Monodosis',
        notes: 'De elección si se anticipa mala adherencia al tratamiento oral por 10 días.',
      },
    ],
    secondLineTherapy: [
      {
        drugName: 'Azitromicina (Alergia a Penicilinas)',
        dosage: '500 mg una vez al día por 3 a 5 días (en niños: 10-12 mg/kg/día)',
        duration: '3 a 5 días',
        notes: 'Opción en pacientes con anafilaxia o hipersensibilidad inmediata a betalactámicos.',
      },
      {
        drugName: 'Paracetamol / Ibuprofeno (Coadyuvante analgésico)',
        dosage: 'Paracetamol 500-1000 mg cada 8h o Ibuprofeno 400 mg cada 8h',
        duration: '3 a 5 días según dolor',
        notes: 'Manejo del dolor y control térmico durante las primeras 48 horas.',
        medicationId: 'med-paracetamol',
      },
    ],
    contraindications: [
      'NO usar antibióticos si los criterios de Centor son ≤ 1 (probabilidad de etiología viral > 90%)',
      'Contraindicación absoluta de penicilinas en pacientes con antecedente de shock anafiláctico o angioedema',
    ],
    redFlags: [
      'Trismus o incapacidad para abrir la boca (Sospecha de Absceso Periamigdalino)',
      'Estridor laríngeo, disnea o babeo continuo (Sospecha de Epiglotitis)',
      'Asimetría amigdalina severa con desviación de la úvula',
    ],
    nonPharmacologicalMeasures: [
      'Gárgaras con solución salina tibia o analgésicos tópicos orofaríngeos',
      'Reposo e hidratación adecuada con alimentos blandos y fríos/tibios',
      'Cambio del cepillo de dientes a las 48-72 horas de inicio del antibiótico',
    ],
    evidenceLevel: 'Criterios de Centor-McIsaac / Guías IDSA / CDC',
  },
  {
    id: 'case-diabetes-tipo2',
    title: 'Diabetes Mellitus Tipo 2 (Inicio Terapéutico y Control Glucémico)',
    category: 'Endocrinología y Metabolismo',
    clinicalSummary: 'Protocolo de inicio farmacológico tras diagnóstico confirmado con HbA1c ≥ 6.5%, glucemia basal en ayunas ≥ 126 mg/dl o glucemia al azar ≥ 200 mg/dl con síntomas.',
    symptomsAndSigns: [
      'Poliuria, polidipsia y polifagia',
      'Pérdida de peso inexplicable',
      'Visión borrosa fluctuante',
      'Astenia y cicatrización tórpida',
    ],
    firstLineTherapy: [
      {
        drugName: 'Metformina Clorhidrato',
        dosage: 'Iniciar con 500 mg u 850 mg una vez al día con la cena, titular hasta 1000 mg cada 12h',
        duration: 'Terapia continua indefinida',
        notes: 'Fármaco base indiscutido; no causa hipoglucemias y es neutro en peso corporal.',
        medicationId: 'med-metformina',
      },
      {
        drugName: 'Empagliflozina (iSGLT2) o Dapagliflozina',
        dosage: '10 mg una vez al día por la mañana',
        duration: 'Terapia continua',
        notes: 'Añadir preferentemente desde el inicio si el paciente tiene enfermedad cardiovascular establecida, insuficiencia cardíaca o enfermedad renal crónica con microalbuminuria.',
        medicationId: 'med-empagliflozina',
      },
    ],
    secondLineTherapy: [
      {
        drugName: 'Agonistas del receptor GLP-1 (Semaglutida / Liraglutida)',
        dosage: 'Titulación semanal progresiva según presentación',
        duration: 'Terapia continua',
        notes: 'Máxima potencia para pérdida de peso y protección frente a infarto y ACV.',
      },
      {
        drugName: 'Inhibidores de DPP-4 (Sitagliptina / Linagliptina)',
        dosage: 'Sitagliptina 100 mg/día o Linagliptina 5 mg/día',
        duration: 'Terapia continua',
        notes: 'Excelente perfil de seguridad, neutros en peso y aptos sin ajuste renal en el caso de linagliptina.',
      },
    ],
    contraindications: [
      'Metformina contraindicada si el filtrado glomerular estimado es < 30 ml/min/1.73m²',
      'Evitar iSGLT2 en pacientes con diabetes tipo 1 por riesgo de cetoacidosis euglucémica',
    ],
    redFlags: [
      'Glucemia > 300 mg/dl con respiración de Kussmaul, dolor abdominal y vómitos (Cetoacidosis Diabética o Síndrome Hiperosmolar)',
      'Alteración del nivel de conciencia o letargo extremo',
      'Úlceras con infección profunda en miembros inferiores (Pie Diabético Grado Wagner ≥2)',
    ],
    nonPharmacologicalMeasures: [
      'Terapia nutricional médica individualizada con reducción de hidratos de carbono refinados y azúcares simples',
      'Actividad física estructurada: entrenamiento aeróbico y de fuerza muscular regular',
      'Monitoreo periódico de hemoglobina glicosilada (HbA1c) cada 3 meses',
      'Inspección diaria de pies y calzado protector',
    ],
    evidenceLevel: 'Standards of Care in Diabetes ADA / EASD 2024',
  },
  {
    id: 'case-crisis-asmatica',
    title: 'Crisis Asmática Aguda (Exacerbación Leve a Moderada)',
    category: 'Respiratorio',
    clinicalSummary: 'Episodio agudo de broncoespasmo caracterizado por aumento progresivo de dificultad respiratoria, tos y sibilancias con caída del PEF.',
    symptomsAndSigns: [
      'Disnea de reposo o con habla entrecortada',
      'Sibilancias espiratorias difusas audibles a la auscultación',
      'Uso moderado de músculos intercostales accesorios',
      'Saturación de oxígeno basal (SpO2) entre 92% y 95%',
      'Frecuencia respiratoria 20 - 28 rpm',
    ],
    firstLineTherapy: [
      {
        drugName: 'Salbutamol MDI (Inhalador presurizado con cámara)',
        dosage: '4 a 10 disparos (100 mcg c/u) con aerocámara espaciadora cada 20 minutos durante la primera hora',
        duration: 'Fase de rescate inmediata (1 hora) y luego cada 4 a 6 horas según evolución',
        notes: 'La administración con aerocámara es tan o más eficaz que la nebulización tradicional y con menores efectos secundarios.',
        medicationId: 'med-salbutamol',
      },
      {
        drugName: 'Prednisona / Metilprednisolona oral',
        dosage: '40 a 50 mg por vía oral en dosis única diaria matutina',
        duration: '5 a 7 días (no requiere pauta descendente para cursos de menos de 10 días)',
        notes: 'Crucial para revertir la inflamación endobronquial y prevenir recaídas tempranas.',
      },
    ],
    secondLineTherapy: [
      {
        drugName: 'Bromuro de Ipratropio inhalado (SAMA)',
        dosage: '4 disparos cada 20 min en la primera hora combinados con salbutamol',
        duration: 'Primeras 1-2 horas en crisis moderadas/severas',
        notes: 'Bloqueo muscarínico sinérgico que mejora significativamente el flujo espiratorio pico.',
      },
      {
        drugName: 'Sulfato de Magnesio IV',
        dosage: '2 gramos en infusión endovenosa lenta durante 20 minutos',
        duration: 'Dosis única',
        notes: 'Reservado para exacerbaciones graves que no responden al tratamiento inicial de rescate.',
      },
    ],
    contraindications: [
      'NO administrar sedantes ni ansiolíticos (deprimen el centro respiratorio y enmascaran el paro inminente)',
      'Evitar mucolíticos o vaporizadores que pueden irritar la vía aérea hiperreactiva',
    ],
    redFlags: [
      'Tórax silente ("silencio auscultatorio") con desaparición de sibilancias por flujo de aire insuficiente (Paro respiratorio inminente)',
      'Incapacidad para pronunciar palabras completas, somnolencia, confusión o cianosis',
      'SpO2 < 90% con aire ambiente o pulso paradójico marcado',
    ],
    nonPharmacologicalMeasures: [
      'Posición sentada erguida con brazos apoyados hacia adelante',
      'Oxigenoterapia con cánula nasal para mantener SpO2 entre 93% y 95% (94-98% en pediatría)',
      'Tranquilizar activamente al paciente y evitar ambientes fríos o con alérgenos',
    ],
    evidenceLevel: 'Estrategia Global para el Asma (GINA 2024)',
  },
  {
    id: 'case-erge-dispepsia',
    title: 'Enfermedad por Reflujo Gastroesofágico (ERGE) y Pirosis',
    category: 'Gastroenterología',
    clinicalSummary: 'Manejo del reflujo sintomático típico (pirosis y regurgitación ácida) en ausencia de signos de alarma digestivos.',
    symptomsAndSigns: [
      'Sensación de quemazón retroesternal ascendente (pirosis)',
      'Regurgitación ácida o amarga a la boca',
      'Dolor epigástrico posprandial',
      'Tos nocturna irritativa o carraspeo faríngeo crónico ("asma por reflujo")',
    ],
    firstLineTherapy: [
      {
        drugName: 'Omeprazol (o Pantoprazol / Esomeprazol)',
        dosage: '20 mg a 40 mg una vez al día en ayunas estrictas (30-60 min antes del desayuno)',
        duration: 'Curso inicial empírico de 4 a 8 semanas',
        notes: 'Máxima eficacia en cicatrización mucosa esofágica y alivio sintomático completo.',
        medicationId: 'med-omeprazol',
      },
      {
        drugName: 'Alginato de Sodio + Bicarbonato (Gaviscon / similares)',
        dosage: '10 a 20 ml tras las comidas principales y antes de acostarse',
        duration: 'Uso a demanda para rescate sintomático rápido',
        notes: 'Forma una barrera mecánica o balsa flotante sobre el contenido gástrico evitando el reflujo retrógrado.',
      },
    ],
    secondLineTherapy: [
      {
        drugName: 'Famotidina (Antagonista receptor H2)',
        dosage: '20 mg a 40 mg antes de dormir',
        duration: 'Según escape ácido nocturno',
        notes: 'Útil como coadyuvante nocturno si persisten síntomas al acostarse a pesar del IBP matutino.',
      },
    ],
    contraindications: [
      'No prolongar esquemas con IBP indefinidamente sin reevaluación clínica periódica',
      'Omeprazol desaconsejado en pacientes tratados con Clopidogrel (optar por Pantoprazol)',
    ],
    redFlags: [
      'Disfagia progresiva (dificultad para deglutir sólidos o líquidos) u odinofagia',
      'Pérdida de peso involuntaria significativa',
      'Anemia ferropénica inexplicada, hematemesis o deposiciones melénicas (Endoscopia Digestiva Alta URGENTE)',
      'Aparición de síntomas por primera vez en mayores de 50 años',
    ],
    nonPharmacologicalMeasures: [
      'Elevar la cabecera de la cama 15-20 cm (no solo almohadas, sino elevación de las patas de la cama)',
      'Cenar al menos 2 a 3 horas antes de acostarse',
      'Evitar alimentos desencadenantes: café, chocolate, menta, alcohol, comidas copiosas con alto contenido graso y picantes',
      'Pérdida de peso en pacientes con sobrepeso u obesidad central',
    ],
    evidenceLevel: 'Guía Clínica ACG (American College of Gastroenterology) ERGE',
  },
  {
    id: 'case-dolor-inflamatorio',
    title: 'Dolor Musculoesquelético Agudo / Lumbalgia Mecánica',
    category: 'Dolor e Inflamación',
    clinicalSummary: 'Abordaje analgésico y funcional escalonado del dolor somático agudo de origen ligamentoso, articular o muscular sin afectación neurológica grave.',
    symptomsAndSigns: [
      'Dolor lumbar o articular de inicio brusco relacionado con esfuerzo físico o sobrecarga',
      'Contractura paravertebral refleja y limitación dolorosa de la movilidad',
      'Dolor que empeora con el movimiento y mejora con el reposo relativo',
      'Examen neurológico sensitivo y motor normal en extremidades',
    ],
    firstLineTherapy: [
      {
        drugName: 'Paracetamol',
        dosage: '1000 mg cada 8 horas (máx. 3-4 g/día)',
        duration: '3 a 7 días',
        notes: 'Base analgésica segura con excelente perfil cardiovascular y digestivo.',
        medicationId: 'med-paracetamol',
      },
      {
        drugName: 'Ibuprofeno',
        dosage: '400 mg a 600 mg cada 8 horas con las comidas principales',
        duration: 'Curso corto de 5 a 7 días máximo',
        notes: 'Añadir o alternar si existe un componente inflamatorio marcado y el paciente no presenta contraindicación cardiovascular o digestiva.',
        medicationId: 'med-ibuprofeno',
      },
    ],
    secondLineTherapy: [
      {
        drugName: 'Relajante muscular (Ciclobenzaprina / Tizanidina)',
        dosage: 'Ciclobenzaprina 5 mg a 10 mg por la noche antes de dormir',
        duration: 'Máximo 5 a 7 días',
        notes: 'Alivia el espasmo muscular incapacitante; advertir sobre sedación y somnolencia.',
      },
      {
        drugName: 'Tramadol a dosis bajas (Opioide débil)',
        dosage: '37.5 mg / Paracetamol 325 mg cada 8 horas',
        duration: '3 a 5 días para crisis de dolor severo refractario',
        notes: 'Reservar para rescate si el dolor impide completamente la bipedestación o movilización.',
      },
    ],
    contraindications: [
      'AINEs contraindicados en pacientes con úlcera activa, insuficiencia renal avanzada o infarto reciente',
      'No indicar reposo absoluto en cama por más de 48 horas (retrasa la recuperación y debilita la musculatura)',
    ],
    redFlags: [
      'Síndrome de Cauda Equina: anestesia en silla de montar, pérdida de control de esfínteres (retención o incontinencia urinaria/fecal) o debilidad bilateral progresiva (Emergencia neuroquirúrgica inmediata)',
      'Fiebre asociada o antecedente de neoplasia maligna previa',
      'Déficit motor radicular claro (pie péndulo, pérdida de fuerza en cuádriceps)',
    ],
    nonPharmacologicalMeasures: [
      'Mantenerse tan activo como el dolor lo permita; paseos cortos frecuentes',
      'Aplicación de calor local seco durante 15-20 minutos varias veces al día',
      'Evitar levantar cargas pesadas con flexión del tronco; mantener higiene postural',
    ],
    evidenceLevel: 'Guías NICE y American College of Physicians (ACP) para Lumbalgia Aguda',
  },
  {
    id: 'case-rinitis-urticaria',
    title: 'Rinitis Alérgica y Urticaria Aguda',
    category: 'Alergología e Inmunología',
    clinicalSummary: 'Tratamiento sintomático de la inflamación nasal alérgica y lesiones eritematosas pruriginosas habonosas evanescentes.',
    symptomsAndSigns: [
      'Estornudos en salvas o paroxismos',
      'Rinorrea serosa acuosa fluida',
      'Prurito nasal, ocular y de paladar',
      'Pápulas o habones eritematosos cutáneos con prurito intenso de resolución en <24 horas',
    ],
    firstLineTherapy: [
      {
        drugName: 'Loratadina (o Cetirizina / Desloratadina)',
        dosage: '10 mg una vez al día por vía oral',
        duration: 'Durante el periodo sintomático o estacional (2 a 4 semanas)',
        notes: 'Segunda generación: no sedante a dosis habituales, rápido inicio y toma única diaria.',
        medicationId: 'med-loratadina',
      },
      {
        drugName: 'Corticoide nasal tópico (Fluticasona / Mometasona)',
        dosage: '1 a 2 pulverizaciones en cada fosa nasal una vez al día',
        duration: 'Uso continuo diario mientras dure la temporada de alérgenos',
        notes: 'El tratamiento más eficaz disponible para la congestión nasal y síntomas inflamatorios locales.',
      },
    ],
    secondLineTherapy: [
      {
        drugName: 'Antihistamínicos de 2ª generación a dosis duplicada',
        dosage: 'Hasta 2 a 4 veces la dosis convencional bajo supervisión médica',
        duration: 'En urticaria refractaria según Guías EAACI/GA2LEN',
        notes: 'Estrategia de elección antes de recurrir a corticoides orales sistémicos.',
      },
    ],
    contraindications: [
      'Evitar el uso crónico de descongestionantes nasales tópicos (Oximetazolina) por más de 3-5 días por riesgo de rinitis medicamentosa de rebote grave',
    ],
    redFlags: [
      'Edema de labios, lengua, úvula o dificultad para tragar/respirar (Angioedema o Anafilaxia: aplicar Adrenalina intramuscular urgente)',
      'Hipotensión arterial o sensación de desmayo súbito',
    ],
    nonPharmacologicalMeasures: [
      'Lavados nasales frecuentes con suero salino fisiológico o hipertónico al 2.3%',
      'Cierre de ventanas en horas de máxima polinización matutina/vespertina',
      'Uso de gafas de sol en exteriores',
    ],
    evidenceLevel: 'Guía Internacional ARIA (Allergic Rhinitis and its Impact on Asthma)',
  },
];
