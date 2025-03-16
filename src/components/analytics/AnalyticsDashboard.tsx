import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  BarChart,
  PieChart,
  LineChart,
  ArrowUpRight,
  Users,
} from "lucide-react";

import AppointmentMetrics from "./AppointmentMetrics";
import RevenueMetrics from "./RevenueMetrics";
import InventoryStatus from "./InventoryStatus";

interface AnalyticsDashboardProps {
  timeRange?: "day" | "week" | "month" | "quarter" | "year";
  startDate?: Date;
  endDate?: Date;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  timeRange = "month",
  startDate = new Date(new Date().setDate(new Date().getDate() - 30)),
  endDate = new Date(),
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState(timeRange);
  const [selectedView, setSelectedView] = React.useState("overview");

  // Placeholder component for ProviderProductivity
  const ProviderProductivity = () => (
    <Card className="h-full bg-white">
      <CardHeader>
        <CardTitle>Productivité des Praticiens</CardTitle>
        <CardDescription>
          Métriques de performance par praticien
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-[300px]">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Les données de productivité des praticiens seront affichées ici
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tableau de Bord Analytique</h1>
          <p className="text-muted-foreground">
            Surveillez les performances et les métriques de la clinique
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner la période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette Semaine</SelectItem>
              <SelectItem value="month">Ce Mois</SelectItem>
              <SelectItem value="quarter">Ce Trimestre</SelectItem>
              <SelectItem value="year">Cette Année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-1">
            <Calendar className="h-4 w-4" /> Plage de Dates
          </Button>
          <Button variant="outline" className="gap-1">
            <ArrowUpRight className="h-4 w-4" /> Exporter
          </Button>
        </div>
      </div>

      <Tabs
        value={selectedView}
        onValueChange={setSelectedView}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" /> Aperçu
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> Rendez-vous
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" /> Revenus
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-1">
            <PieChart className="h-4 w-4" /> Inventaire
          </TabsTrigger>
          <TabsTrigger value="providers" className="flex items-center gap-1">
            <Users className="h-4 w-4" /> Praticiens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AppointmentMetrics />
            <RevenueMetrics />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InventoryStatus />
            <ProviderProductivity />
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card className="w-full bg-white">
            <CardHeader>
              <CardTitle>Analyse des Rendez-vous</CardTitle>
              <CardDescription>
                Métriques détaillées et tendances des rendez-vous
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <AppointmentMetrics />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="w-full bg-white">
            <CardHeader>
              <CardTitle>Analyse des Revenus</CardTitle>
              <CardDescription>
                Métriques détaillées des revenus et performance financière
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <RevenueMetrics />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card className="w-full bg-white">
            <CardHeader>
              <CardTitle>Analyse de l'Inventaire</CardTitle>
              <CardDescription>
                État détaillé de l'inventaire et gestion des fournitures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <InventoryStatus />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <Card className="w-full bg-white">
            <CardHeader>
              <CardTitle>Analyse des Praticiens</CardTitle>
              <CardDescription>
                Métriques détaillées de productivité et de performance des
                praticiens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <ProviderProductivity />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
