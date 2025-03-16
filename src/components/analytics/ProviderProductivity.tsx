import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Clock,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
} from "lucide-react";

interface ProviderData {
  id: string;
  name: string;
  avatar: string;
  role: string;
  proceduresCompleted: number;
  proceduresTarget: number;
  revenueGenerated: number;
  revenueTarget: number;
  patientSatisfaction: number;
  appointmentsCompleted: number;
  appointmentsCancelled: number;
  averageDuration: number;
  performanceTrend: "up" | "down" | "stable";
}

interface ProviderProductivityProps {
  providers?: ProviderData[];
  timeRange?: "day" | "week" | "month" | "quarter" | "year";
}

const ProviderProductivity = ({
  providers = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      role: "Dentist",
      proceduresCompleted: 42,
      proceduresTarget: 50,
      revenueGenerated: 12500,
      revenueTarget: 15000,
      patientSatisfaction: 4.8,
      appointmentsCompleted: 38,
      appointmentsCancelled: 4,
      averageDuration: 45,
      performanceTrend: "up",
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      role: "Orthodontist",
      proceduresCompleted: 35,
      proceduresTarget: 40,
      revenueGenerated: 18200,
      revenueTarget: 20000,
      patientSatisfaction: 4.6,
      appointmentsCompleted: 32,
      appointmentsCancelled: 3,
      averageDuration: 60,
      performanceTrend: "stable",
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      role: "Periodontist",
      proceduresCompleted: 28,
      proceduresTarget: 35,
      revenueGenerated: 9800,
      revenueTarget: 12000,
      patientSatisfaction: 4.9,
      appointmentsCompleted: 26,
      appointmentsCancelled: 2,
      averageDuration: 50,
      performanceTrend: "up",
    },
  ],
  timeRange = "month",
}: ProviderProductivityProps) => {
  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">
              Provider Productivity
            </CardTitle>
            <CardDescription>
              Performance metrics for dental providers
            </CardDescription>
          </div>
          <Select defaultValue={timeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="procedures">Procedures</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="flex items-start p-4 border rounded-lg"
              >
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={provider.avatar} alt={provider.name} />
                  <AvatarFallback>
                    {provider.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {provider.role}
                      </p>
                    </div>
                    <Badge
                      variant={
                        provider.performanceTrend === "up"
                          ? "success"
                          : provider.performanceTrend === "down"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {provider.performanceTrend === "up"
                        ? "Improving"
                        : provider.performanceTrend === "down"
                          ? "Declining"
                          : "Stable"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <div className="flex items-center text-sm mb-1">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Procedures</span>
                      </div>
                      <Progress
                        value={
                          (provider.proceduresCompleted /
                            provider.proceduresTarget) *
                          100
                        }
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs mt-1">
                        <span>{provider.proceduresCompleted}</span>
                        <span className="text-muted-foreground">
                          Target: {provider.proceduresTarget}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center text-sm mb-1">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Revenue</span>
                      </div>
                      <Progress
                        value={
                          (provider.revenueGenerated / provider.revenueTarget) *
                          100
                        }
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs mt-1">
                        <span>
                          ${provider.revenueGenerated.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          Target: ${provider.revenueTarget.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center text-sm mb-1">
                        <Star className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Satisfaction</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg font-medium">
                          {provider.patientSatisfaction}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          /5
                        </span>
                        <div className="flex ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < Math.floor(provider.patientSatisfaction) ? "text-yellow-400" : "text-gray-200"}`}
                              fill={
                                i < Math.floor(provider.patientSatisfaction)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="procedures" className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.id} className="p-4 border rounded-lg">
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={provider.avatar} alt={provider.name} />
                    <AvatarFallback>
                      {provider.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {provider.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Procedures Completed</span>
                      <span className="text-sm font-medium">
                        {provider.proceduresCompleted}/
                        {provider.proceduresTarget}
                      </span>
                    </div>
                    <Progress
                      value={
                        (provider.proceduresCompleted /
                          provider.proceduresTarget) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-gray-50 rounded-md">
                      <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Appointments
                        </p>
                        <p className="font-medium">
                          {provider.appointmentsCompleted}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-md">
                      <Clock className="h-5 w-5 mr-2 text-orange-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Avg. Duration
                        </p>
                        <p className="font-medium">
                          {provider.averageDuration} min
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.id} className="p-4 border rounded-lg">
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={provider.avatar} alt={provider.name} />
                    <AvatarFallback>
                      {provider.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {provider.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Revenue Generated</span>
                      <span className="text-sm font-medium">
                        ${provider.revenueGenerated.toLocaleString()} / $
                        {provider.revenueTarget.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={
                        (provider.revenueGenerated / provider.revenueTarget) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                        <span className="text-sm">
                          Avg. Revenue per Procedure
                        </span>
                      </div>
                      <span className="font-medium">
                        $
                        {Math.round(
                          provider.revenueGenerated /
                            provider.proceduresCompleted,
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="satisfaction" className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.id} className="p-4 border rounded-lg">
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={provider.avatar} alt={provider.name} />
                    <AvatarFallback>
                      {provider.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {provider.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <span className="text-3xl font-bold">
                        {provider.patientSatisfaction}
                      </span>
                      <span className="text-lg text-muted-foreground">/5</span>
                    </div>

                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${i < Math.floor(provider.patientSatisfaction) ? "text-yellow-400" : "text-gray-200"}`}
                          fill={
                            i < Math.floor(provider.patientSatisfaction)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Appointments Completed
                      </p>
                      <p className="font-medium">
                        {provider.appointmentsCompleted}
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Appointments Cancelled
                      </p>
                      <p className="font-medium">
                        {provider.appointmentsCancelled}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">
                      Cancellation Rate
                    </p>
                    <Progress
                      value={
                        (provider.appointmentsCancelled /
                          (provider.appointmentsCompleted +
                            provider.appointmentsCancelled)) *
                        100
                      }
                      className="h-2"
                    />
                    <p className="text-xs mt-1">
                      {Math.round(
                        (provider.appointmentsCancelled /
                          (provider.appointmentsCompleted +
                            provider.appointmentsCancelled)) *
                          100,
                      )}
                      % of appointments cancelled
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProviderProductivity;
