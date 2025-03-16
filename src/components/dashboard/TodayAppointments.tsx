import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";

interface AppointmentProps {
  appointments?: AppointmentType[];
}

interface AppointmentType {
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

const defaultAppointments: AppointmentType[] = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    time: "9:00",
    duration: "30 min",
    procedure: "Nettoyage de routine",
    status: "scheduled",
  },
  {
    id: "2",
    patientName: "Michael Chen",
    patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    time: "10:15",
    duration: "45 min",
    procedure: "Obturation (Dent #18)",
    status: "checked-in",
  },
  {
    id: "3",
    patientName: "Emily Rodriguez",
    patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    time: "11:30",
    duration: "60 min",
    procedure: "Traitement de canal",
    status: "in-progress",
  },
  {
    id: "4",
    patientName: "David Wilson",
    patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    time: "13:00",
    duration: "30 min",
    procedure: "Radiographie et consultation",
    status: "scheduled",
  },
  {
    id: "5",
    patientName: "Jessica Taylor",
    patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    time: "14:30",
    duration: "45 min",
    procedure: "Pose de couronne",
    status: "scheduled",
  },
  {
    id: "6",
    patientName: "Robert Brown",
    patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    time: "15:45",
    duration: "30 min",
    procedure: "Examen de suivi",
    status: "scheduled",
  },
];

const getStatusBadge = (status: AppointmentType["status"]) => {
  switch (status) {
    case "scheduled":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Planifié
        </Badge>
      );
    case "checked-in":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Enregistré
        </Badge>
      );
    case "in-progress":
      return (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200"
        >
          En cours
        </Badge>
      );
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Terminé
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Annulé
        </Badge>
      );
    default:
      return <Badge variant="outline">Inconnu</Badge>;
  }
};

const TodayAppointments = ({
  appointments = defaultAppointments,
}: AppointmentProps) => {
  const navigate = useNavigate();

  const handleCheckIn = async (appointmentId: string) => {
    try {
      // Update appointment status in database
      const { error } = await supabase
        .from("appointments")
        .update({ status: "checked-in" })
        .eq("id", appointmentId);

      if (error) throw error;

      // Update local state instead of reloading the page
      const updatedAppointments = appointments.map((appointment) => {
        if (appointment.id === appointmentId) {
          return { ...appointment, status: "checked-in" };
        }
        return appointment;
      });

      // Force component re-render
      window.dispatchEvent(
        new CustomEvent("appointment-updated", {
          detail: { appointments: updatedAppointments },
        }),
      );
    } catch (error) {
      console.error("Error checking in patient:", error);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      // Update appointment status in database
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId);

      if (error) throw error;

      // Update local state instead of reloading the page
      const updatedAppointments = appointments.map((appointment) => {
        if (appointment.id === appointmentId) {
          return { ...appointment, status: "cancelled" };
        }
        return appointment;
      });

      // Force component re-render
      window.dispatchEvent(
        new CustomEvent("appointment-updated", {
          detail: { appointments: updatedAppointments },
        }),
      );
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-600" />
          Rendez-vous d'aujourd'hui
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={appointment.patientAvatar}
                    alt={appointment.patientName}
                  />
                  <AvatarFallback>
                    {appointment.patientName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{appointment.patientName}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    {appointment.time} ({appointment.duration})
                  </div>
                  <p className="text-sm text-gray-600">
                    {appointment.procedure}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(appointment.status)}
                <div className="flex space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleCheckIn(appointment.id)}
                          disabled={
                            appointment.status === "checked-in" ||
                            appointment.status === "in-progress" ||
                            appointment.status === "completed" ||
                            appointment.status === "cancelled"
                          }
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enregistrer le patient</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleCancel(appointment.id)}
                          disabled={
                            appointment.status === "cancelled" ||
                            appointment.status === "completed"
                          }
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Annuler le rendez-vous</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            className="text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50"
            onClick={() => navigate("/calendar")}
          >
            Voir tous les rendez-vous
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayAppointments;
