import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Edit,
  FileText,
  Phone,
  Mail,
  MapPin,
  Plus,
  User,
  Clock,
} from "lucide-react";

interface PatientDetailsProps {
  patientId?: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  insuranceProvider: string;
  insuranceId: string;
  medicalHistory: MedicalHistoryItem[];
  appointments: Appointment[];
  treatmentPlans: TreatmentPlan[];
}

interface MedicalHistoryItem {
  id: string;
  date: string;
  condition: string;
  notes: string;
  provider: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  provider: string;
  notes: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
}

interface TreatmentPlan {
  id: string;
  name: string;
  createdDate: string;
  status: "active" | "completed" | "pending";
  procedures: Procedure[];
  totalCost: number;
  insuranceCoverage: number;
}

interface Procedure {
  id: string;
  name: string;
  code: string;
  cost: number;
  completed: boolean;
  scheduledDate?: string;
}

const PatientDetails = ({ patientId = "12345" }: PatientDetailsProps) => {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // Mock patient data
  const patient: Patient = {
    id: patientId,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, CA 94123",
    dateOfBirth: "1985-06-15",
    insuranceProvider: "Delta Dental",
    insuranceId: "DD98765432",
    medicalHistory: [
      {
        id: "mh1",
        date: "2023-03-10",
        condition: "Root Canal",
        notes: "Successful procedure on lower right molar",
        provider: "Dr. Smith",
      },
      {
        id: "mh2",
        date: "2022-11-05",
        condition: "Cavity Filling",
        notes: "Two small cavities filled on upper left side",
        provider: "Dr. Johnson",
      },
      {
        id: "mh3",
        date: "2022-05-20",
        condition: "Regular Cleaning",
        notes: "Routine cleaning and examination",
        provider: "Dr. Williams",
      },
    ],
    appointments: [
      {
        id: "apt1",
        date: "2023-06-15",
        time: "10:00 AM",
        type: "Cleaning",
        provider: "Dr. Williams",
        notes: "Regular 6-month cleaning",
        status: "completed",
      },
      {
        id: "apt2",
        date: "2023-12-10",
        time: "2:30 PM",
        type: "Checkup",
        provider: "Dr. Smith",
        notes: "Annual examination",
        status: "scheduled",
      },
      {
        id: "apt3",
        date: "2024-01-05",
        time: "11:15 AM",
        type: "Filling",
        provider: "Dr. Johnson",
        notes: "Cavity filling on upper right molar",
        status: "scheduled",
      },
    ],
    treatmentPlans: [
      {
        id: "tp1",
        name: "Orthodontic Treatment",
        createdDate: "2023-05-10",
        status: "active",
        procedures: [
          {
            id: "proc1",
            name: "Initial Braces Fitting",
            code: "D8080",
            cost: 1500,
            completed: true,
            scheduledDate: "2023-05-20",
          },
          {
            id: "proc2",
            name: "Adjustment",
            code: "D8670",
            cost: 200,
            completed: true,
            scheduledDate: "2023-06-20",
          },
          {
            id: "proc3",
            name: "Adjustment",
            code: "D8670",
            cost: 200,
            completed: false,
            scheduledDate: "2023-07-20",
          },
        ],
        totalCost: 3500,
        insuranceCoverage: 2000,
      },
      {
        id: "tp2",
        name: "Preventive Care",
        createdDate: "2023-01-15",
        status: "active",
        procedures: [
          {
            id: "proc4",
            name: "Cleaning",
            code: "D1110",
            cost: 120,
            completed: true,
            scheduledDate: "2023-01-25",
          },
          {
            id: "proc5",
            name: "X-Rays",
            code: "D0210",
            cost: 150,
            completed: true,
            scheduledDate: "2023-01-25",
          },
          {
            id: "proc6",
            name: "Cleaning",
            code: "D1110",
            cost: 120,
            completed: false,
            scheduledDate: "2023-07-25",
          },
        ],
        totalCost: 390,
        insuranceCoverage: 390,
      },
    ],
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full overflow-hidden flex flex-col">
      {/* Patient Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`}
              alt={patient.name}
            />
            <AvatarFallback>
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{patient.name}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" /> ID: {patient.id}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />{" "}
                {calculateAge(patient.dateOfBirth)} years
              </span>
            </div>
            <div className="flex mt-2 space-x-2">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Active Patient
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Insurance Verified
              </Badge>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="flex items-center">
          <Edit className="h-4 w-4 mr-2" /> Edit Profile
        </Button>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        defaultValue="info"
        className="flex-1 overflow-hidden flex flex-col"
      >
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="info">Personal Info</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="treatment">Treatment Plans</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="info" className="flex-1 overflow-auto">
          <ScrollArea className="h-full pr-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p>{patient.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p>{patient.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p>{patient.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Insurance Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Provider</p>
                    <p>{patient.insuranceProvider}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Policy ID</p>
                    <p>{patient.insuranceId}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Coverage</p>
                  <p>Preventive: 100%, Basic: 80%, Major: 50%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Annual Maximum</p>
                  <p>$2,000</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" /> View Full Policy Details
                </Button>
              </CardFooter>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Date of Birth</p>
                  <p>{formatDate(patient.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Emergency Contact</p>
                  <p>Michael Johnson (Spouse) - (555) 987-6543</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Allergies</p>
                  <p>Penicillin, Latex</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Notes</p>
                  <p>
                    Patient prefers afternoon appointments. Has dental anxiety -
                    consider nitrous oxide for procedures.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>

        {/* Medical History Tab */}
        <TabsContent value="medical" className="flex-1 overflow-auto">
          <ScrollArea className="h-full pr-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Medical History</h3>
              <Button size="sm" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" /> Add Record
              </Button>
            </div>

            {patient.medicalHistory.map((item) => (
              <Card key={item.id} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">
                      {item.condition}
                    </CardTitle>
                    <Badge variant="outline">{formatDate(item.date)}</Badge>
                  </div>
                  <CardDescription>{item.provider}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{item.notes}</p>
                </CardContent>
              </Card>
            ))}

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Current Medications</h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <p className="font-medium">Amoxicillin</p>
                        <p className="text-sm text-gray-500">500mg, 3x daily</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <p className="font-medium">Ibuprofen</p>
                        <p className="text-sm text-gray-500">
                          800mg, as needed for pain
                        </p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="flex-1 overflow-auto">
          <ScrollArea className="h-full pr-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Appointments</h3>
              <Dialog
                open={isScheduleDialogOpen}
                onOpenChange={setIsScheduleDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" /> Schedule Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Schedule New Appointment</DialogTitle>
                    <DialogDescription>
                      Create a new appointment for {patient.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="appointment-type">Appointment Type</Label>
                      <Select>
                        <SelectTrigger id="appointment-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cleaning">Cleaning</SelectItem>
                          <SelectItem value="checkup">Checkup</SelectItem>
                          <SelectItem value="filling">Filling</SelectItem>
                          <SelectItem value="root-canal">Root Canal</SelectItem>
                          <SelectItem value="extraction">Extraction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="border rounded-md p-3"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Time</Label>
                      <Select>
                        <SelectTrigger id="time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="13:00">1:00 PM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="provider">Provider</Label>
                      <Select>
                        <SelectTrigger id="provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                          <SelectItem value="dr-johnson">
                            Dr. Johnson
                          </SelectItem>
                          <SelectItem value="dr-williams">
                            Dr. Williams
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any special instructions or notes"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Schedule Appointment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider">
                Upcoming Appointments
              </h4>
              {patient.appointments
                .filter((apt) => apt.status === "scheduled")
                .map((appointment) => (
                  <Card key={appointment.id} className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">
                          {appointment.type}
                        </CardTitle>
                        <Badge
                          variant={
                            appointment.status === "scheduled"
                              ? "default"
                              : appointment.status === "completed"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>{appointment.provider}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          {formatDate(appointment.date)} at {appointment.time}
                        </span>
                      </div>
                      {appointment.notes && (
                        <p className="mt-2 text-sm text-gray-600">
                          {appointment.notes}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2 pt-0">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

              <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider mt-6">
                Past Appointments
              </h4>
              {patient.appointments
                .filter((apt) => apt.status === "completed")
                .map((appointment) => (
                  <Card key={appointment.id} className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">
                          {appointment.type}
                        </CardTitle>
                        <Badge variant="outline" className="bg-gray-100">
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>{appointment.provider}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          {formatDate(appointment.date)} at {appointment.time}
                        </span>
                      </div>
                      {appointment.notes && (
                        <p className="mt-2 text-sm text-gray-600">
                          {appointment.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Treatment Plans Tab */}
        <TabsContent value="treatment" className="flex-1 overflow-auto">
          <ScrollArea className="h-full pr-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Treatment Plans</h3>
              <Button size="sm" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" /> New Treatment Plan
              </Button>
            </div>

            {patient.treatmentPlans.map((plan) => (
              <Card key={plan.id} className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>
                        Created on {formatDate(plan.createdDate)}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        plan.status === "active"
                          ? "default"
                          : plan.status === "completed"
                            ? "outline"
                            : "secondary"
                      }
                      className={
                        plan.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : ""
                      }
                    >
                      {plan.status.charAt(0).toUpperCase() +
                        plan.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Procedures</h4>
                      <div className="space-y-2">
                        {plan.procedures.map((procedure) => (
                          <div
                            key={procedure.id}
                            className="flex items-center justify-between py-2 border-b last:border-0"
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-3 h-3 rounded-full mr-3 ${procedure.completed ? "bg-green-500" : "bg-gray-300"}`}
                              ></div>
                              <div>
                                <p className="font-medium">{procedure.name}</p>
                                <p className="text-sm text-gray-500">
                                  {procedure.code} - ${procedure.cost}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {procedure.scheduledDate
                                ? formatDate(procedure.scheduledDate)
                                : "Not scheduled"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Total Cost:</span>
                        <span>${plan.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Insurance Coverage:</span>
                        <span>${plan.insuranceCoverage.toFixed(2)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Patient Responsibility:</span>
                        <span>
                          $
                          {(plan.totalCost - plan.insuranceCoverage).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Edit Plan
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      Share with Patient
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetails;
