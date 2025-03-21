import React, { useState } from "react";
import PatientSearch from "./PatientSearch";
import PatientDirectory from "./PatientDirectory";
import PatientDetails from "./PatientDetails";
import PatientForm from "./PatientForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  upcomingAppointment?: string;
  status: "active" | "inactive" | "new";
  avatarUrl?: string;
}

interface PatientSearchFilters {
  status?: string;
  insuranceProvider?: string;
  lastVisit?: string;
}

const PatientManagement = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<PatientSearchFilters>({});
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleSearch = (query: string, filters: PatientSearchFilters) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    // In a real application, this would trigger an API call to search patients
    console.log("Searching for:", query, "with filters:", filters);
  };

  const handleAddPatient = () => {
    setIsAddPatientOpen(true);
  };

  const handleAddPatientSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // In a real application, this would be an API call to create a patient
      console.log("Creating patient:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a new patient object with the form data
      const newPatient: Patient = {
        id: Math.random().toString(36).substring(2, 11),
        name: data.name,
        email: data.email,
        phone: data.phone,
        lastVisit: "Never",
        status: data.status,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name.replace(/ /g, "")}`,
      };

      // Close the dialog and show success message
      setIsAddPatientOpen(false);
      toast({
        title: "Patient ajouté",
        description: `${data.name} a été ajouté avec succès.`,
      });

      // Select the new patient
      setSelectedPatient(newPatient);
    } catch (error) {
      console.error("Error creating patient:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout du patient.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 h-full w-full flex flex-col">
      <div className="p-4">
        <PatientSearch onSearch={handleSearch} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 min-w-[300px] max-w-md overflow-hidden">
          <PatientDirectory
            onPatientSelect={handlePatientSelect}
            onAddPatient={handleAddPatient}
          />
        </div>

        <div className="flex-1 overflow-hidden p-4">
          {selectedPatient ? (
            <PatientDetails patientId={selectedPatient.id} />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-center p-8">
                <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Patient Selected
                </h3>
                <p className="text-gray-500 mb-6">
                  Select a patient from the directory to view their details, or
                  add a new patient to get started.
                </p>
                <button
                  onClick={handleAddPatient}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Patient
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau patient</DialogTitle>
          </DialogHeader>
          <PatientForm
            onSubmit={handleAddPatientSubmit}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientManagement;
