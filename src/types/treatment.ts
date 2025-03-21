export interface Procedure {
  id: string;
  name: string;
  code: string;
  cost: number;
  description: string;
  duration: number;
  category: string;
}

export interface InsuranceVerification {
  covered: boolean;
  coveragePercent: number;
  patientResponsibility: number;
  notes: string;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  procedures: Procedure[];
  totalCost: number;
  insuranceVerification?: InsuranceVerification;
  notes: string;
  createdAt: Date;
  status: "draft" | "active" | "completed" | "cancelled";
}

export interface DbTreatmentPlan {
  id: string;
  patient_id: string;
  name: string;
  total_cost: number;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DbTreatmentProcedure {
  id: string;
  treatment_plan_id: string;
  name: string;
  code: string;
  cost: number;
  description: string;
  duration: number;
  category: string;
  created_at: string;
  updated_at: string;
}
