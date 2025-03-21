import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, ChevronRight } from "lucide-react";

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

interface PatientDirectoryProps {
  patients?: Patient[];
  onPatientSelect?: (patient: Patient) => void;
  onAddPatient?: () => void;
}

const PatientDirectory = ({
  patients = defaultPatients,
  onPatientSelect = () => {},
  onAddPatient = () => {},
}: PatientDirectoryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery),
  );

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatientId(patient.id);
    onPatientSelect(patient);
  };

  const handleAddPatientClick = () => {
    onAddPatient();
  };

  return (
    <div className="flex flex-col h-full w-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Patients</h2>
          <Button size="sm" onClick={handleAddPatientClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No patients found
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <Card
                key={patient.id}
                className={`mb-2 cursor-pointer hover:bg-gray-50 transition-colors ${selectedPatientId === patient.id ? "bg-blue-50 border-blue-200" : ""}`}
                onClick={() => handlePatientClick(patient)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                      <AvatarFallback>
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{patient.name}</p>
                        <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <p className="truncate">{patient.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Last visit: {patient.lastVisit}
                    </div>
                    <Badge
                      variant={
                        patient.status === "active"
                          ? "default"
                          : patient.status === "new"
                            ? "outline"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {patient.status.charAt(0).toUpperCase() +
                        patient.status.slice(1)}
                    </Badge>
                  </div>
                  {patient.upcomingAppointment && (
                    <div className="mt-1 text-xs text-blue-600">
                      Upcoming: {patient.upcomingAppointment}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

// Default mock data
const defaultPatients: Patient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 123-4567",
    lastVisit: "May 15, 2023",
    upcomingAppointment: "Jun 20, 2023 - 10:00 AM",
    status: "active",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.c@example.com",
    phone: "(555) 987-6543",
    lastVisit: "Apr 28, 2023",
    status: "active",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    phone: "(555) 234-5678",
    lastVisit: "May 3, 2023",
    upcomingAppointment: "Jun 15, 2023 - 2:30 PM",
    status: "active",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.k@example.com",
    phone: "(555) 345-6789",
    lastVisit: "Mar 12, 2023",
    status: "inactive",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
  },
  {
    id: "5",
    name: "Jessica Patel",
    email: "jessica.p@example.com",
    phone: "(555) 456-7890",
    lastVisit: "Never",
    upcomingAppointment: "Jun 5, 2023 - 9:00 AM",
    status: "new",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jessica",
  },
  {
    id: "6",
    name: "Robert Wilson",
    email: "robert.w@example.com",
    phone: "(555) 567-8901",
    lastVisit: "May 20, 2023",
    status: "active",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
  },
  {
    id: "7",
    name: "Amanda Lee",
    email: "amanda.l@example.com",
    phone: "(555) 678-9012",
    lastVisit: "Apr 5, 2023",
    status: "active",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=amanda",
  },
  {
    id: "8",
    name: "Thomas Garcia",
    email: "thomas.g@example.com",
    phone: "(555) 789-0123",
    lastVisit: "Never",
    upcomingAppointment: "Jun 8, 2023 - 11:30 AM",
    status: "new",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=thomas",
  },
  {
    id: "9",
    name: "Olivia Martinez",
    email: "olivia.m@example.com",
    phone: "(555) 890-1234",
    lastVisit: "Feb 15, 2023",
    status: "inactive",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=olivia",
  },
  {
    id: "10",
    name: "William Taylor",
    email: "william.t@example.com",
    phone: "(555) 901-2345",
    lastVisit: "May 10, 2023",
    upcomingAppointment: "Jun 25, 2023 - 3:00 PM",
    status: "active",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=william",
  },
];

export default PatientDirectory;
