export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  insuranceProvider: string;
  insuranceId: string;
  status: string;
}

export interface DbPatient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  insurance_provider: string;
  insurance_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}
