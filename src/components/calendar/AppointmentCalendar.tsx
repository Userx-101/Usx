import React, { useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Setup the localizer for the calendar
const localizer = momentLocalizer(moment);

// Define appointment types with colors
const appointmentTypes = {
  checkup: {
    label: "Check-up",
    color: "bg-blue-100 border-blue-400 text-blue-700",
  },
  cleaning: {
    label: "Cleaning",
    color: "bg-green-100 border-green-400 text-green-700",
  },
  filling: {
    label: "Filling",
    color: "bg-amber-100 border-amber-400 text-amber-700",
  },
  rootCanal: {
    label: "Root Canal",
    color: "bg-red-100 border-red-400 text-red-700",
  },
  extraction: {
    label: "Extraction",
    color: "bg-purple-100 border-purple-400 text-purple-700",
  },
  consultation: {
    label: "Consultation",
    color: "bg-indigo-100 border-indigo-400 text-indigo-700",
  },
};

// Sample appointment data
const defaultAppointments = [
  {
    id: 1,
    title: "Sarah Johnson - Cleaning",
    start: moment().set({ hour: 9, minute: 0 }).toDate(),
    end: moment().set({ hour: 10, minute: 0 }).toDate(),
    patient: {
      id: "P001",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      phone: "(555) 123-4567",
    },
    type: "cleaning",
    provider: "Dr. Smith",
    room: "Room 1",
    notes: "Regular 6-month cleaning",
  },
  {
    id: 2,
    title: "Michael Brown - Root Canal",
    start: moment().set({ hour: 11, minute: 0 }).toDate(),
    end: moment().set({ hour: 13, minute: 0 }).toDate(),
    patient: {
      id: "P002",
      name: "Michael Brown",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      phone: "(555) 234-5678",
    },
    type: "rootCanal",
    provider: "Dr. Johnson",
    room: "Room 3",
    notes: "Follow-up from last week",
  },
  {
    id: 3,
    title: "Emily Davis - Check-up",
    start: moment().add(1, "days").set({ hour: 10, minute: 0 }).toDate(),
    end: moment().add(1, "days").set({ hour: 11, minute: 0 }).toDate(),
    patient: {
      id: "P003",
      name: "Emily Davis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      phone: "(555) 345-6789",
    },
    type: "checkup",
    provider: "Dr. Smith",
    room: "Room 2",
    notes: "Annual check-up",
  },
  {
    id: 4,
    title: "Robert Wilson - Filling",
    start: moment().add(1, "days").set({ hour: 14, minute: 0 }).toDate(),
    end: moment().add(1, "days").set({ hour: 15, minute: 30 }).toDate(),
    patient: {
      id: "P004",
      name: "Robert Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
      phone: "(555) 456-7890",
    },
    type: "filling",
    provider: "Dr. Johnson",
    room: "Room 1",
    notes: "Cavity on lower right molar",
  },
  {
    id: 5,
    title: "Jennifer Lee - Extraction",
    start: moment().add(2, "days").set({ hour: 9, minute: 30 }).toDate(),
    end: moment().add(2, "days").set({ hour: 10, minute: 30 }).toDate(),
    patient: {
      id: "P005",
      name: "Jennifer Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer",
      phone: "(555) 567-8901",
    },
    type: "extraction",
    provider: "Dr. Martinez",
    room: "Room 4",
    notes: "Wisdom tooth extraction",
  },
];

interface AppointmentEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  patient: {
    id: string;
    name: string;
    avatar: string;
    phone: string;
  };
  type: keyof typeof appointmentTypes;
  provider: string;
  room: string;
  notes: string;
}

interface AppointmentCalendarProps {
  appointments?: AppointmentEvent[];
  onSelectAppointment?: (appointment: AppointmentEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  onDragEvent?: (event: AppointmentEvent, start: Date, end: Date) => void;
  view?: string;
  date?: Date;
}

const AppointmentCalendar = ({
  appointments = defaultAppointments,
  onSelectAppointment = () => {},
  onSelectSlot = () => {},
  onDragEvent = () => {},
  view = "week",
  date = new Date(),
}: AppointmentCalendarProps) => {
  const [currentView, setCurrentView] = useState(view);
  const [currentDate, setCurrentDate] = useState(date);

  // Custom event component to render appointments with styling based on type
  const EventComponent = ({ event }: { event: AppointmentEvent }) => {
    const typeStyle = appointmentTypes[event.type].color;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "rounded p-1 overflow-hidden border text-sm h-full",
                typeStyle,
              )}
            >
              <div className="font-medium truncate">{event.patient.name}</div>
              <div className="flex items-center gap-1 text-xs">
                <span>{appointmentTypes[event.type].label}</span>
                <span>•</span>
                <span>{event.room}</span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="p-0 overflow-hidden">
            <Card className="w-64">
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <img src={event.patient.avatar} alt={event.patient.name} />
                  </Avatar>
                  <div>
                    <div className="font-medium">{event.patient.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {event.patient.phone}
                    </div>
                  </div>
                </div>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", typeStyle)}
                    >
                      {appointmentTypes[event.type].label}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider:</span>
                    <span>{event.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room:</span>
                    <span>{event.room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span>
                      {moment(event.start).format("h:mm A")} -{" "}
                      {moment(event.end).format("h:mm A")}
                    </span>
                  </div>
                  {event.notes && (
                    <div className="mt-2">
                      <span className="text-muted-foreground">Notes:</span>
                      <p className="text-xs mt-1">{event.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="h-full w-full bg-white rounded-md border">
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        views={{
          month: true,
          week: true,
          day: true,
          agenda: true,
        }}
        view={currentView as any}
        date={currentDate}
        onView={(newView) => setCurrentView(newView)}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        selectable
        onSelectEvent={onSelectAppointment}
        onSelectSlot={onSelectSlot}
        onEventDrop={({ event, start, end }) => {
          onDragEvent(event as AppointmentEvent, start as Date, end as Date);
        }}
        components={{
          event: EventComponent,
        }}
        eventPropGetter={(event) => ({
          className: "cursor-pointer",
        })}
        dayPropGetter={(date) => {
          const today = moment().startOf("day");
          const isToday = moment(date).isSame(today, "day");
          return {
            className: cn(isToday && "bg-blue-50", "transition-colors"),
          };
        }}
        timeslots={2}
        step={30}
        defaultView={Views.WEEK}
        min={moment().set({ hour: 8, minute: 0 }).toDate()}
        max={moment().set({ hour: 18, minute: 0 }).toDate()}
      />
    </div>
  );
};

export default AppointmentCalendar;
