import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Filter,
} from "lucide-react";
import { format } from "date-fns";

interface CalendarToolbarProps {
  date?: Date;
  onDateChange?: (date: Date) => void;
  view?: "day" | "week" | "month";
  onViewChange?: (view: "day" | "week" | "month") => void;
  providers?: Array<{ id: string; name: string }>;
  onProviderChange?: (providerId: string) => void;
  rooms?: Array<{ id: string; name: string }>;
  onRoomChange?: (roomId: string) => void;
}

const CalendarToolbar = ({
  date = new Date(),
  onDateChange = () => {},
  view = "week",
  onViewChange = () => {},
  providers = [
    { id: "1", name: "Dr. Smith" },
    { id: "2", name: "Dr. Johnson" },
    { id: "3", name: "Dr. Williams" },
  ],
  onProviderChange = () => {},
  rooms = [
    { id: "1", name: "Room 1" },
    { id: "2", name: "Room 2" },
    { id: "3", name: "Room 3" },
  ],
  onRoomChange = () => {},
}: CalendarToolbarProps) => {
  const handlePrevious = () => {
    const newDate = new Date(date);
    if (view === "day") {
      newDate.setDate(date.getDate() - 1);
    } else if (view === "week") {
      newDate.setDate(date.getDate() - 7);
    } else {
      newDate.setMonth(date.getMonth() - 1);
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    if (view === "day") {
      newDate.setDate(date.getDate() + 1);
    } else if (view === "week") {
      newDate.setDate(date.getDate() + 7);
    } else {
      newDate.setMonth(date.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getDateDisplay = () => {
    if (view === "day") {
      return format(date, "MMMM d, yyyy");
    } else if (view === "week") {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${format(startOfWeek, "MMM d")} - ${format(endOfWeek, "MMM d, yyyy")}`;
    } else {
      return format(date, "MMMM yyyy");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={handleToday}>
          Today
        </Button>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="w-40 text-center font-medium">{getDateDisplay()}</div>
          <Button variant="ghost" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Tabs
          defaultValue={view}
          onValueChange={(value) =>
            onViewChange(value as "day" | "week" | "month")
          }
        >
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Select
            defaultValue={providers[0].id}
            onValueChange={onProviderChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue={rooms[0].id} onValueChange={onRoomChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CalendarToolbar;
