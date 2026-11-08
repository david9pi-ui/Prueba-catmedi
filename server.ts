import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI client with required User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: AI Clinical Therapeutic Guidance ("Qué tomar en cada caso")
app.post('/api/clinical-consult', async (req: Request, res: Response) => {
  try {
    const { condition, patientInfo, availableDrugs, allergies, kidneyLiverStatus } = req.body;

    if (!condition) {
      return res.status(400).json({ error: 'La patología o motivo de consulta es obligatorio.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'El servicio de IA no está configurado (falta GEMINI_API_KEY). Usando motor clínico de referencia local.',
        useLocalFallback: true,
      });
    }

    const prompt = `
Eres un farmacólogo clínico y médico consultor sénior para una aplicación de referencia profesional de la salud (PharmIndex Pro).
El usuario es un profesional de la salud que consulta: "¿Qué tomar / prescribir en este caso clínico?".

Información del caso:
- Motivo de consulta / Patología: ${condition}
- Perfil del paciente: ${patientInfo || 'Adulto estándar'}
- Alergias reportadas: ${allergies || 'Ninguna conocida'}
- Función renal/hepática: ${kidneyLiverStatus || 'Normal / No especificada'}
- Fármacos disponibles en el vademécum de la institución:
${JSON.stringify(availableDrugs?.map((d: any) => ({ name: d.genericName, class: d.classifications, presentation: d.presentations })) || [])}

Proporciona una guía farmacológica clínica estructurada, rigurosa y basada en evidencia internacional (Guías Clínicas, OMS, FDA, EMA).
Devuelve EXCLUSIVAMENTE un objeto JSON válido con la siguiente estructura:
{
  "title": "Protocolo de Tratamiento para [Nombre de Patología]",
  "summary": "Resumen fisiopatológico y objetivo terapéutico en 2-3 frases.",
  "firstLine": [
    {
      "genericName": "Nombre genérico del fármaco preferido",
      "dosage": "Dosis y frecuencia estándar recomendada",
      "duration": "Duración habitual del tratamiento",
      "rationale": "Mecanismo y justificación clínica de primera línea"
    }
  ],
  "secondLine": [
    {
      "genericName": "Nombre de la alternativa",
      "dosage": "Dosis y posología",
      "duration": "Duración",
      "rationale": "Indicación de uso (ej. alergia a betalactámicos, insuficiencia renal, intolerancia)"
    }
  ],
  "contraindicated": [
    "Fármacos o familias absolutamente desaconsejadas en este caso con su motivo"
  ],
  "criticalWarnings": [
    "Alertas de seguridad, signos de alarma (red flags) y necesidad de derivación hospitalaria"
  ],
  "nonPharmacological": [
    "Medidas higiénico-dietéticas y no farmacológicas complementarias"
  ]
}
No agregues texto explicativo fuera del JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text?.trim() || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonText);
    } catch {
      // Clean markdown code blocks if present
      const cleanJson = jsonText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      parsedResult = JSON.parse(cleanJson);
    }

    return res.json({
      success: true,
      guidance: parsedResult,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error in /api/clinical-consult:', error);
    return res.status(500).json({
      error: 'Error al generar la consulta clínica con IA: ' + (error?.message || 'Error desconocido'),
      useLocalFallback: true,
    });
  }
});

// Endpoint: Interacciones avanzadas entre múltiples fármacos
app.post('/api/analyze-interactions', async (req: Request, res: Response) => {
  try {
    const { drugNames } = req.body;

    if (!Array.isArray(drugNames) || drugNames.length < 2) {
      return res.status(400).json({ error: 'Se requieren al menos 2 medicamentos para evaluar interacciones.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'El servicio de IA no está configurado (falta GEMINI_API_KEY). Usando base de interacciones local.',
        useLocalFallback: true,
      });
    }

    const prompt = `
Como farmacólogo clínico experto, analiza las interacciones farmacológicas potenciales al prescribir juntos los siguientes medicamentos: ${drugNames.join(', ')}.

Devuelve EXCLUSIVAMENTE un array JSON de interacciones encontradas:
[
  {
    "drugA": "Nombre fármaco 1",
    "drugB": "Nombre fármaco 2",
    "severity": "Alta" | "Moderada" | "Baja" | "Beneficiosa",
    "mechanism": "Mecanismo farmacocinético o farmacodinámico (ej. inhibición CYP3A4, sinergismo de toxicidad, etc.)",
    "effect": "Manifestación clínica esperada en el paciente",
    "recommendation": "Conducta médica recomendada (ej. evitar combinación, monitorear INR, ajustar dosis)"
  }
]
Si no existen interacciones clínicamente significativas, devuelve un array vacío: [].
No incluyas texto fuera del JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text?.trim() || '[]';
    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonText);
    } catch {
      const cleanJson = jsonText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      parsedResult = JSON.parse(cleanJson);
    }

    return res.json({
      success: true,
      interactions: parsedResult,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-interactions:', error);
    return res.status(500).json({
      error: 'Error al evaluar interacciones con IA: ' + (error?.message || 'Error desconocido'),
      useLocalFallback: true,
    });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
