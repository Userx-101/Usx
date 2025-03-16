import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  User,
  FileText,
  MapPin,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export interface AppointmentDetailsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  appointment?: {
    id: string;
    patientId: string;
    patientName: string;
    patientAvatar?: string;
    date: Date;
    startTime: string;
    endTime: string;
    procedureType: string;
    provider: string;
    room: string;
    notes: string;
    status: "scheduled" | "checked-in" | "completed" | "cancelled";
  };
  onSave?: (appointment: any) => void;
  onCancel?: (appointmentId: string) => void;
  onCheckIn?: (appointmentId: string) => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  open = true,
  onOpenChange,
  appointment = {
    id: "appt-123",
    patientId: "pat-456",
    patientName: "Sarah Johnson",
    patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    date: new Date(),
    startTime: "10:00",
    endTime: "11:00",
    procedureType: "Dental Cleaning",
    provider: "Dr. Emily Chen",
    room: "Room 3",
    notes:
      "Regular 6-month cleaning. Patient has sensitive gums, use gentle techniques.",
    status: "scheduled",
  },
  onSave = () => {},
  onCancel = () => {},
  onCheckIn = () => {},
}) => {
  const [date, setDate] = React.useState<Date | undefined>(appointment.date);
  const [status, setStatus] = React.useState(appointment.status);

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Scheduled
          </Badge>
        );
      case "checked-in":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Checked In
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Appointment Details
            </DialogTitle>
            {getStatusBadge(status)}
          </div>
        </DialogHeader>

        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-12 w-12">
            <img
              src={appointment.patientAvatar}
              alt={appointment.patientName}
            />
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{appointment.patientName}</h3>
            <p className="text-sm text-gray-500">
              Patient ID: {appointment.patientId}
            </p>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="patient">Patient Info</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="flex space-x-2">
                  <div className="relative w-full">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="startTime"
                      defaultValue={appointment.startTime}
                      className="pl-9"
                    />
                  </div>
                  <span className="flex items-center">to</span>
                  <Input id="endTime" defaultValue={appointment.endTime} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedure">Procedure</Label>
                <Select defaultValue={appointment.procedureType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select procedure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dental Cleaning">
                      Dental Cleaning
                    </SelectItem>
                    <SelectItem value="Filling">Filling</SelectItem>
                    <SelectItem value="Root Canal">Root Canal</SelectItem>
                    <SelectItem value="Crown">Crown</SelectItem>
                    <SelectItem value="Extraction">Extraction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Select defaultValue={appointment.provider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Emily Chen">
                      Dr. Emily Chen
                    </SelectItem>
                    <SelectItem value="Dr. Michael Rodriguez">
                      Dr. Michael Rodriguez
                    </SelectItem>
                    <SelectItem value="Dr. Sarah Johnson">
                      Dr. Sarah Johnson
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Select defaultValue={appointment.room}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Room 1">Room 1</SelectItem>
                    <SelectItem value="Room 2">Room 2</SelectItem>
                    <SelectItem value="Room 3">Room 3</SelectItem>
                    <SelectItem value="Room 4">Room 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="patient" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Contact Information</p>
                  <p className="text-sm text-gray-500">Phone: (555) 123-4567</p>
                  <p className="text-sm text-gray-500">
                    Email: sarah.johnson@example.com
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Insurance</p>
                  <p className="text-sm text-gray-500">Delta Dental - PPO</p>
                  <p className="text-sm text-gray-500">Policy #: DD78901234</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-gray-500">
                    123 Main Street, Apt 4B
                  </p>
                  <p className="text-sm text-gray-500">
                    San Francisco, CA 94105
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Medical Alerts</p>
                  <p className="text-sm text-gray-500">Penicillin allergy</p>
                  <p className="text-sm text-gray-500">Sensitive gums</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Appointment Notes</Label>
              <Textarea
                id="notes"
                defaultValue={appointment.notes}
                className="min-h-[150px]"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex space-x-2">
            {status === "scheduled" && (
              <Button
                variant="outline"
                className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200"
                onClick={() => {
                  setStatus("checked-in");
                  onCheckIn(appointment.id);
                }}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Check In
              </Button>
            )}
            {status !== "cancelled" && (
              <Button
                variant="outline"
                className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                onClick={() => {
                  setStatus("cancelled");
                  onCancel(appointment.id);
                }}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
          <Button onClick={() => onSave(appointment)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetails;
