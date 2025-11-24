
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { PatientData } from '../models/patient-data.model';

// This is a placeholder for the environment variable.
// In a real Applet environment, process.env.API_KEY would be available.
declare var process: any;

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    // This check is to prevent errors in environments where process might not be defined.
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }
  
  async generateDailyReport(data: PatientData): Promise<string> {
    if (!this.ai) {
      return Promise.resolve('El servicio de IA no está configurado. Por favor, asegúrese de que la clave API esté disponible.');
    }
    
    // Parse movement history if it's a stringified JSON array
    let movementSummary = data.movementhistory;
    try {
      const historyArray = JSON.parse(data.movementhistory);
      if (Array.isArray(historyArray)) {
        movementSummary = historyArray.join(', ');
      }
    } catch (e) {
      // It's not a JSON string, use as is.
    }

    const prompt = `
      Actúa como un asistente de cuidado comprensivo y tranquilizador.
      Genera un breve informe del día para un familiar sobre su ser querido, basándote en los siguientes datos.
      Usa un tono positivo y profesional. No inventes información. Sé conciso.
      
      Datos del día:
      - Pasos caminados: ${data.dailystepcount}
      - Niveles de actividad registrados: ${movementSummary}
      - ¿Se detectó alguna caída?: ${data.falldetected ? 'Sí' : 'No'}
      - Última ubicación registrada: ${data.currentroom}

      Basado en estos datos, escribe el resumen del día. Si se detectó una caída, menciónalo con seriedad pero sin alarmar innecesariamente.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'No se pudo generar el informe en este momento. Por favor, intente más tarde.';
    }
  }
}
