import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarClock,
  DollarSign,
  ClipboardList,
  MessageSquare,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
}

const MetricCard = ({
  title,
  value,
  icon,
  trend,
  bgColor = "bg-white",
}: MetricCardProps) => {
  return (
    <Card className={`${bgColor} shadow-sm`}>
      <CardContent className="flex items-center p-6">
        <div className="mr-4 rounded-full bg-primary/10 p-2">{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {trend && (
            <p
              className={`text-xs ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% from last week
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricCardsProps {
  metrics?: {
    appointments: number;
    revenue: number;
    pendingTreatments: number;
    unreadMessages: number;
  };
}

const MetricCards = ({
  metrics = {
    appointments: 24,
    revenue: 3250,
    pendingTreatments: 18,
    unreadMessages: 7,
  },
}: MetricCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 bg-gray-50">
      <MetricCard
        title="Today's Appointments"
        value={metrics.appointments}
        icon={<CalendarClock className="h-5 w-5 text-primary" />}
        trend={{ value: 12, isPositive: true }}
      />
      <MetricCard
        title="Today's Revenue"
        value={`$${metrics.revenue.toLocaleString()}`}
        icon={<DollarSign className="h-5 w-5 text-primary" />}
        trend={{ value: 8, isPositive: true }}
      />
      <MetricCard
        title="Pending Treatments"
        value={metrics.pendingTreatments}
        icon={<ClipboardList className="h-5 w-5 text-primary" />}
        trend={{ value: 5, isPositive: false }}
      />
      <MetricCard
        title="Unread Messages"
        value={metrics.unreadMessages}
        icon={<MessageSquare className="h-5 w-5 text-primary" />}
      />
    </div>
  );
};

export default MetricCards;
