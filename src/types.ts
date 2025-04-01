export interface Crime {
  id: string;
  latitude: number;
  longitude: number;
  type: string;
  description: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ReportFormData {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
}