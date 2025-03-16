import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, FileText, Phone, User } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  avatar?: string;
  lastVisit: string;
  nextAppointment?: string;
  phone: string;
  status: "active" | "pending" | "completed";
}

interface RecentPatientsProps {
  patients?: Patient[];
  onViewProfile?: (patientId: string) => void;
  onScheduleAppointment?: (patientId: string) => void;
}

const RecentPatients = ({
  patients = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      lastVisit: "2023-10-15",
      nextAppointment: "2023-11-20",
      phone: "(555) 123-4567",
      status: "active",
    },
    {
      id: "2",
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      lastVisit: "2023-10-12",
      phone: "(555) 987-6543",
      status: "completed",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      lastVisit: "2023-10-10",
      nextAppointment: "2023-11-05",
      phone: "(555) 456-7890",
      status: "pending",
    },
    {
      id: "4",
      name: "David Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      lastVisit: "2023-10-05",
      phone: "(555) 234-5678",
      status: "active",
    },
  ],
  onViewProfile = (id) => console.log(`View profile for patient ${id}`),
  onScheduleAppointment = (id) =>
    console.log(`Schedule appointment for patient ${id}`),
}: RecentPatientsProps) => {
  // Format date to display in a more readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status badge color based on patient status
  const getStatusBadge = (status: Patient["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Recent Patients
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-start justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage src={patient.avatar} alt={patient.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900">{patient.name}</h3>
                  <div className="flex flex-col gap-1 mt-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>Last visit: {formatDate(patient.lastVisit)}</span>
                    </div>
                    {patient.nextAppointment && (
                      <div className="flex items-center gap-1">
                        <CalendarClock className="h-3 w-3" />
                        <span>Next: {formatDate(patient.nextAppointment)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(patient.status)}
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => {
                      onViewProfile(patient.id);
                      window.location.href = "/patients";
                    }}
                  >
                    Profile
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      onScheduleAppointment(patient.id);
                      window.location.href = "/calendar";
                    }}
                  >
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentPatients;
