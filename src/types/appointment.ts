export interface AppointmentType {
  id: string;
  patientName: string;
  patientAvatar?: string;
  time: string;
  duration: string;
  procedure: string;
  status:
    | "scheduled"
    | "checked-in"
    | "in-progress"
    | "completed"
    | "cancelled";
}

export interface DbAppointment {
  id: string;
  patient_id: string;
  title: string;
  start_time: string;
  end_time: string;
  procedure: string;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}
