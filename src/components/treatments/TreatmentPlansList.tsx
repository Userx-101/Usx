import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TreatmentPlan {
  id: string;
  patientName: string;
  patientId: string;
  createdAt: string;
  status: "active" | "completed" | "pending";
  totalCost: number;
  procedures: number;
  nextAppointment?: string;
}

interface TreatmentPlansListProps {
  plans?: TreatmentPlan[];
  onSelectPlan?: (planId: string) => void;
  onCreatePlan?: () => void;
}

const TreatmentPlansList = ({
  plans = defaultPlans,
  onSelectPlan = () => {},
  onCreatePlan = () => {},
}: TreatmentPlansListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredPlans = plans.filter((plan) => {
    // Filter by search query
    const matchesSearch =
      plan.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.patientId.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && plan.status === "active") ||
      (activeTab === "pending" && plan.status === "pending") ||
      (activeTab === "completed" && plan.status === "completed");

    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: TreatmentPlan["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full h-full bg-white border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Treatment Plans
          </CardTitle>
          <Button onClick={onCreatePlan} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            New Plan
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search plans or patients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[750px] pr-4">
              {filteredPlans.length > 0 ? (
                <div className="space-y-3">
                  {filteredPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onClick={() => onSelectPlan(plan.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium">
                    No treatment plans found
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-xs">
                    {searchQuery
                      ? "Try adjusting your search or filters"
                      : "Create a new treatment plan to get started"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={onCreatePlan} className="mt-4">
                      <Plus className="mr-1 h-4 w-4" />
                      Create Treatment Plan
                    </Button>
                  )}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="active" className="mt-0">
            <ScrollArea className="h-[750px] pr-4">
              {filteredPlans.length > 0 ? (
                <div className="space-y-3">
                  {filteredPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onClick={() => onSelectPlan(plan.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium">
                    No active treatment plans
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    All active treatment plans will appear here
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="pending" className="mt-0">
            <ScrollArea className="h-[750px] pr-4">
              {filteredPlans.length > 0 ? (
                <div className="space-y-3">
                  {filteredPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onClick={() => onSelectPlan(plan.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Clock className="h-12 w-12 text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium">
                    No pending treatment plans
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    All pending treatment plans will appear here
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <ScrollArea className="h-[750px] pr-4">
              {filteredPlans.length > 0 ? (
                <div className="space-y-3">
                  {filteredPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onClick={() => onSelectPlan(plan.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <CheckCircle className="h-12 w-12 text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium">
                    No completed treatment plans
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    All completed treatment plans will appear here
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface PlanCardProps {
  plan: TreatmentPlan;
  onClick: () => void;
}

const PlanCard = ({ plan, onClick }: PlanCardProps) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
  };

  return (
    <div
      onClick={onClick}
      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{plan.patientName}</h3>
          <p className="text-sm text-gray-500">ID: {plan.patientId}</p>
        </div>
        <Badge className={statusColors[plan.status]}>
          {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-500 mr-1.5" />
          <span className="text-sm">
            {new Date(plan.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center">
          <FileText className="h-4 w-4 text-gray-500 mr-1.5" />
          <span className="text-sm">{plan.procedures} procedures</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 text-gray-500 mr-1.5" />
          <span className="text-sm">${plan.totalCost.toLocaleString()}</span>
        </div>
      </div>
      {plan.nextAppointment && (
        <div className="mt-3 pt-3 border-t flex items-center">
          <Clock className="h-4 w-4 text-gray-500 mr-1.5" />
          <span className="text-sm">Next: {plan.nextAppointment}</span>
        </div>
      )}
    </div>
  );
};

// Default mock data
const defaultPlans: TreatmentPlan[] = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    patientId: "P-10042",
    createdAt: "2023-06-15",
    status: "active",
    totalCost: 2850,
    procedures: 4,
    nextAppointment: "Jun 28, 2023 - 10:00 AM",
  },
  {
    id: "2",
    patientName: "Michael Chen",
    patientId: "P-10078",
    createdAt: "2023-06-10",
    status: "pending",
    totalCost: 1200,
    procedures: 2,
  },
  {
    id: "3",
    patientName: "Emily Rodriguez",
    patientId: "P-10015",
    createdAt: "2023-05-22",
    status: "completed",
    totalCost: 3500,
    procedures: 5,
  },
  {
    id: "4",
    patientName: "David Wilson",
    patientId: "P-10103",
    createdAt: "2023-06-12",
    status: "active",
    totalCost: 1800,
    procedures: 3,
    nextAppointment: "Jun 25, 2023 - 2:30 PM",
  },
  {
    id: "5",
    patientName: "Jessica Martinez",
    patientId: "P-10056",
    createdAt: "2023-06-05",
    status: "pending",
    totalCost: 950,
    procedures: 1,
  },
  {
    id: "6",
    patientName: "Robert Taylor",
    patientId: "P-10089",
    createdAt: "2023-05-18",
    status: "completed",
    totalCost: 4200,
    procedures: 6,
  },
  {
    id: "7",
    patientName: "Amanda Lee",
    patientId: "P-10124",
    createdAt: "2023-06-08",
    status: "active",
    totalCost: 2100,
    procedures: 3,
    nextAppointment: "Jun 22, 2023 - 9:15 AM",
  },
];

export default TreatmentPlansList;
