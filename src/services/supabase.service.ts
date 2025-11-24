
import { Injectable } from '@angular/core';
import { PatientData } from '../models/patient-data.model';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly supabaseUrl = 'https://nkfhburtmexhnltxhkyu.supabase.co';
  private readonly supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZmhidXJ0bWV4aG5sdHhoa3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTMyMDIsImV4cCI6MjA3OTU2OTIwMn0.kHSkKtfeBzyOgRAgumTXhPsVZAXv7hM4eLWeK0aWbCg';
  private readonly tableName = 'pir_sensor_data';

  async getLatestPatientData(): Promise<PatientData | null> {
    const endpoint = `${this.supabaseUrl}/rest/v1/${this.tableName}?select=*&order=id.desc&limit=1`;

    try {
      const response = await fetch(endpoint, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Accept': 'application/vnd.pgrst.object+json' // To get a single object instead of an array
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      
      const data: PatientData = await response.json();
      return data;
    } catch (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }
  }
}
