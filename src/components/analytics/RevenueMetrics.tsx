import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart,
  LineChart,
  PieChart,
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react";

interface RevenueMetricsProps {
  data?: {
    totalRevenue: number;
    comparisonPercentage: number;
    byProcedure: Array<{ name: string; value: number; color: string }>;
    byProvider: Array<{ name: string; value: number }>;
    byMonth: Array<{ month: string; revenue: number }>;
  };
}

const RevenueMetrics = ({
  data = {
    totalRevenue: 124500,
    comparisonPercentage: 12.5,
    byProcedure: [
      { name: "Cleanings", value: 32500, color: "#4f46e5" },
      { name: "Fillings", value: 28000, color: "#8b5cf6" },
      { name: "Root Canals", value: 21000, color: "#ec4899" },
      { name: "Crowns", value: 18500, color: "#f97316" },
      { name: "Extractions", value: 14500, color: "#14b8a6" },
      { name: "Other", value: 10000, color: "#6b7280" },
    ],
    byProvider: [
      { name: "Dr. Smith", value: 42000 },
      { name: "Dr. Johnson", value: 38500 },
      { name: "Dr. Williams", value: 26000 },
      { name: "Dr. Brown", value: 18000 },
    ],
    byMonth: [
      { month: "Jan", revenue: 9200 },
      { month: "Feb", revenue: 8700 },
      { month: "Mar", revenue: 9500 },
      { month: "Apr", revenue: 10200 },
      { month: "May", revenue: 11500 },
      { month: "Jun", revenue: 12400 },
      { month: "Jul", revenue: 11800 },
      { month: "Aug", revenue: 12100 },
      { month: "Sep", revenue: 12800 },
      { month: "Oct", revenue: 13500 },
      { month: "Nov", revenue: 12800 },
      { month: "Dec", revenue: 0 },
    ],
  },
}: RevenueMetricsProps) => {
  const [timeRange, setTimeRange] = useState("year");
  const [viewType, setViewType] = useState("overview");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Revenue Metrics</CardTitle>
          <CardDescription>Financial performance analysis</CardDescription>
        </div>
        <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="quarter">Quarter</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Revenue
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {formatCurrency(data.totalRevenue)}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      YoY Growth
                    </p>
                    <h3 className="text-2xl font-bold mt-1 flex items-center">
                      {data.comparisonPercentage}%
                      <TrendingUp className="h-5 w-5 text-green-600 ml-2" />
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Avg. Monthly
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {formatCurrency(data.totalRevenue / 12)}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* View Type Tabs */}
          <Tabs value={viewType} onValueChange={setViewType} className="w-full">
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="overview" className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="byProcedure" className="flex items-center">
                <PieChart className="h-4 w-4 mr-2" />
                By Procedure
              </TabsTrigger>
              <TabsTrigger value="byProvider" className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                By Provider
              </TabsTrigger>
              <TabsTrigger value="trend" className="flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Trend
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab Content */}
            <TabsContent value="overview" className="space-y-4">
              <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 rounded-lg">
                <div className="text-center">
                  <BarChart className="h-16 w-16 mx-auto text-slate-400" />
                  <p className="mt-2 text-sm text-slate-500">
                    Revenue Overview Chart
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Showing data for {timeRange} period
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* By Procedure Tab Content */}
            <TabsContent value="byProcedure" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-16 w-16 mx-auto text-slate-400" />
                    <p className="mt-2 text-sm text-slate-500">
                      Revenue by Procedure Chart
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {data.byProcedure.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div className="flex items-center">
                        <div
                          className="h-4 w-4 rounded-full mr-3"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <div className="font-medium">
                        {formatCurrency(item.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* By Provider Tab Content */}
            <TabsContent value="byProvider" className="space-y-4">
              <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 rounded-lg">
                <div className="text-center">
                  <BarChart className="h-16 w-16 mx-auto text-slate-400" />
                  <p className="mt-2 text-sm text-slate-500">
                    Revenue by Provider Chart
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.byProvider.map((provider, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{provider.name}</h4>
                        <p className="text-2xl font-bold mt-1">
                          {formatCurrency(provider.value)}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="h-2 bg-blue-100">
                      <div
                        className="h-full bg-blue-600"
                        style={{
                          width: `${(provider.value / data.totalRevenue) * 100}%`,
                        }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Trend Tab Content */}
            <TabsContent value="trend" className="space-y-4">
              <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 rounded-lg">
                <div className="text-center">
                  <LineChart className="h-16 w-16 mx-auto text-slate-400" />
                  <p className="mt-2 text-sm text-slate-500">
                    Monthly Revenue Trend Chart
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {data.byMonth.map((month, index) => (
                  <div key={index} className="text-center">
                    <div className="h-24 flex items-end justify-center pb-2">
                      <div
                        className="w-12 bg-blue-500 rounded-t-md"
                        style={{
                          height: `${(month.revenue / Math.max(...data.byMonth.map((m) => m.revenue))) * 100}%`,
                          minHeight: month.revenue > 0 ? "4px" : "0",
                        }}
                      />
                    </div>
                    <p className="text-xs font-medium">{month.month}</p>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(month.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueMetrics;
