import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import Header from "./Header";
import NotificationCenter from "../notifications/NotificationCenter";
import { useAuth } from "../auth/AuthProvider";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        activePath={location.pathname}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onNotificationClick={handleNotificationClick}
          notificationCount={3}
        />

        <div className="relative flex-1 overflow-auto p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 left-0 z-10 bg-white rounded-r-md border border-l-0 border-gray-200"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          <main className="h-full">{children || <Outlet />}</main>
        </div>
      </div>

      {showNotifications && (
        <div className="fixed top-20 right-4 z-50 w-[400px] shadow-lg rounded-lg">
          <NotificationCenter />
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
