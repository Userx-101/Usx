import React from "react";
import MetricCards from "./MetricCards";
import TodayAppointments from "./TodayAppointments";
import QuickActions from "./QuickActions";
import RecentPatients from "./RecentPatients";
import InventoryAlerts from "./InventoryAlerts";

interface DashboardOverviewProps {
  metrics?: {
    appointments: number;
    revenue: number;
    pendingTreatments: number;
    unreadMessages: number;
  };
}

const DashboardOverview = ({
  metrics = {
    appointments: 24,
    revenue: 3250,
    pendingTreatments: 18,
    unreadMessages: 7,
  },
}: DashboardOverviewProps) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Metrics Row */}
      <div className="mb-6">
        <MetricCards metrics={metrics} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Today's Appointments */}
        <div className="lg:col-span-2">
          <TodayAppointments />
        </div>

        {/* Right Column - Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Patients */}
        <div>
          <RecentPatients />
        </div>

        {/* Inventory Alerts */}
        <div>
          <InventoryAlerts />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
