import React, { useState } from "react";
import CalendarToolbar from "./CalendarToolbar";
import AppointmentDetails from "./AppointmentDetails";
import { Card } from "../ui/card";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Initialize the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  initialView?: "day" | "week" | "month";
  initialDate?: Date;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  initialView = "week",
  initialDate = new Date(),
}) => {
  const [view, setView] = useState<"day" | "week" | "month">(initialView);
  const [date, setDate] = useState<Date>(initialDate);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [selectedRoom, setSelectedRoom] = useState("all");

  // Sample providers and rooms data
  const providers = [
    { id: "1", name: "Dr. Smith" },
    { id: "2", name: "Dr. Johnson" },
    { id: "3", name: "Dr. Williams" },
    { id: "4", name: "Dr. Martinez" },
  ];

  const rooms = [
    { id: "1", name: "Room 1" },
    { id: "2", name: "Room 2" },
    { id: "3", name: "Room 3" },
    { id: "4", name: "Room 4" },
  ];

  // Sample appointments data
  const appointments = [
    {
      id: 1,
      title: "Dental Cleaning",
      start: new Date(2023, 5, 15, 9, 0),
      end: new Date(2023, 5, 15, 10, 0),
      type: "Cleaning",
      provider: "Dr. Smith",
      room: "Room 1",
      notes: "Regular cleaning appointment",
      patient: {
        id: "101",
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      },
    },
    {
      id: 2,
      title: "Root Canal",
      start: new Date(2023, 5, 15, 11, 0),
      end: new Date(2023, 5, 15, 13, 0),
      type: "Procedure",
      provider: "Dr. Johnson",
      room: "Room 2",
      notes: "Patient reported severe pain",
      patient: {
        id: "102",
        name: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      },
    },
    {
      id: 3,
      title: "Consultation",
      start: new Date(2023, 5, 16, 14, 0),
      end: new Date(2023, 5, 16, 15, 0),
      type: "Consultation",
      provider: "Dr. Williams",
      room: "Room 3",
      notes: "Initial consultation for braces",
      patient: {
        id: "103",
        name: "Mike Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      },
    },
  ];

  const handleSelectAppointment = (appointment: any) => {
    setSelectedAppointment({
      id: appointment.id.toString(),
      patientId: appointment.patient.id,
      patientName: appointment.patient.name,
      patientAvatar: appointment.patient.avatar,
      date: appointment.start,
      startTime: new Date(appointment.start).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: new Date(appointment.end).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      procedureType: appointment.type,
      provider: appointment.provider,
      room: appointment.room,
      notes: appointment.notes,
      status: "scheduled",
    });
    setShowAppointmentDetails(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    // Create a new appointment template when a time slot is selected
    setSelectedAppointment({
      id: `new-${Date.now()}`,
      patientId: "",
      patientName: "Select Patient",
      patientAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder",
      date: slotInfo.start,
      startTime: new Date(slotInfo.start).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: new Date(slotInfo.end).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      procedureType: "Dental Cleaning",
      provider: "Dr. Smith",
      room: "Room 1",
      notes: "",
      status: "scheduled",
    });
    setShowAppointmentDetails(true);
  };

  const handleDragEvent = (event: any, start: Date, end: Date) => {
    // Handle appointment drag and drop
    console.log("Appointment moved:", event.id, "New time:", start, end);
    // In a real app, you would update the appointment in your database
  };

  const handleSaveAppointment = (appointment: any) => {
    console.log("Saving appointment:", appointment);
    setShowAppointmentDetails(false);
    // In a real app, you would save the appointment to your database
  };

  const handleCancelAppointment = (appointmentId: string) => {
    console.log("Cancelling appointment:", appointmentId);
    setShowAppointmentDetails(false);
    // In a real app, you would update the appointment status in your database
  };

  const handleCheckInAppointment = (appointmentId: string) => {
    console.log("Checking in appointment:", appointmentId);
    // In a real app, you would update the appointment status in your database
  };

  // Custom event styling for the calendar
  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#3182ce"; // Default blue

    // Color-code by appointment type
    if (event.type === "Cleaning") {
      backgroundColor = "#38a169"; // Green
    } else if (event.type === "Procedure") {
      backgroundColor = "#e53e3e"; // Red
    } else if (event.type === "Consultation") {
      backgroundColor = "#805ad5"; // Purple
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Card className="flex-grow flex flex-col overflow-hidden">
        <CalendarToolbar
          date={date}
          onDateChange={setDate}
          view={view}
          onViewChange={setView}
          providers={providers}
          onProviderChange={setSelectedProvider}
          rooms={rooms}
          onRoomChange={setSelectedRoom}
        />

        <div className="flex-grow overflow-hidden p-4">
          <Calendar
            localizer={localizer}
            events={appointments}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            view={view}
            date={date}
            onNavigate={setDate}
            onView={(newView: any) => setView(newView)}
            selectable
            onSelectEvent={handleSelectAppointment}
            onSelectSlot={handleSelectSlot}
            eventPropGetter={eventStyleGetter}
            resizable
            onEventDrop={(data) =>
              handleDragEvent(data.event, data.start, data.end)
            }
            onEventResize={(data) =>
              handleDragEvent(data.event, data.start, data.end)
            }
            popup
            components={{
              toolbar: () => null, // Hide default toolbar since we're using our custom one
            }}
          />
        </div>
      </Card>

      {showAppointmentDetails && selectedAppointment && (
        <AppointmentDetails
          open={showAppointmentDetails}
          onOpenChange={setShowAppointmentDetails}
          appointment={selectedAppointment}
          onSave={handleSaveAppointment}
          onCancel={handleCancelAppointment}
          onCheckIn={handleCheckInAppointment}
        />
      )}
    </div>
  );
};

export default CalendarView;
