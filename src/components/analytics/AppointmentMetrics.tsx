import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface AppointmentMetricsProps {
  timeRange?: string;
  appointmentData?: any[];
  completionRate?: number;
  cancellationRate?: number;
  noShowRate?: number;
}

const defaultAppointmentData = [
  { name: "Mon", completed: 12, cancelled: 2, noShow: 1 },
  { name: "Tue", completed: 15, cancelled: 1, noShow: 2 },
  { name: "Wed", completed: 18, cancelled: 3, noShow: 0 },
  { name: "Thu", completed: 14, cancelled: 2, noShow: 1 },
  { name: "Fri", completed: 20, cancelled: 1, noShow: 2 },
  { name: "Sat", completed: 8, cancelled: 0, noShow: 0 },
  { name: "Sun", completed: 0, cancelled: 0, noShow: 0 },
];

const defaultPieData = [
  { name: "Completed", value: 87, color: "#4ade80" },
  { name: "Cancelled", value: 9, color: "#f97316" },
  { name: "No-Show", value: 4, color: "#ef4444" },
];

const AppointmentMetrics: React.FC<AppointmentMetricsProps> = ({
  timeRange = "week",
  appointmentData = defaultAppointmentData,
  completionRate = 87,
  cancellationRate = 9,
  noShowRate = 4,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const pieData = defaultPieData;

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Appointment Metrics</CardTitle>
            <CardDescription>
              Track appointment completion, cancellations, and no-shows
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue={timeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[140px] justify-start">
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
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-[200px] grid-cols-2 mb-4">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={appointmentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" name="Completed" fill="#4ade80" />
                  <Bar dataKey="cancelled" name="Cancelled" fill="#f97316" />
                  <Bar dataKey="noShow" name="No-Show" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col justify-center space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-lg font-bold text-green-500">
                    {completionRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="text-sm font-medium">Cancellation Rate</span>
                  <span className="text-lg font-bold text-orange-500">
                    {cancellationRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="text-sm font-medium">No-Show Rate</span>
                  <span className="text-lg font-bold text-red-500">
                    {noShowRate}%
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AppointmentMetrics;
