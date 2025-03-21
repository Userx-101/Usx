import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  BarChart2,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Package,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  activePath?: string;
}

const Sidebar = ({
  collapsed = false,
  onToggleCollapse = () => {},
  activePath = "/",
}: SidebarProps) => {
  const navItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/" },
    { icon: Users, label: "Patients", path: "/patients" },
    { icon: Calendar, label: "Calendrier", path: "/calendar" },
    { icon: ClipboardList, label: "Plans de traitement", path: "/treatments" },
    { icon: BarChart2, label: "Analytiques", path: "/analytics" },
    { icon: MessageSquare, label: "Communication", path: "/communication" },
    { icon: Package, label: "Inventaire", path: "/inventory" },
    { icon: Settings, label: "Paramètres", path: "/settings" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect will be handled by the protected route
  };

  return (
    <aside
      className={cn(
        "h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-center">
        <Link to="/" className="flex items-center justify-center w-full">
          {collapsed ? (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              C
            </div>
          ) : (
            <div className="text-xl font-bold text-blue-600">Dentix</div>
          )}
        </Link>
      </div>

      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive =
              activePath === item.path ||
              (item.path !== "/" && activePath.startsWith(item.path));

            return (
              <li key={index}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center p-3 rounded-lg transition-colors",
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100",
                          collapsed ? "justify-center" : "space-x-3",
                        )}
                      >
                        <Icon
                          className={cn(
                            "flex-shrink-0",
                            collapsed ? "w-6 h-6" : "w-5 h-5",
                            isActive ? "text-blue-600" : "text-gray-500",
                          )}
                        />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-gray-200 p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/help"
                className={cn(
                  "flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer",
                  collapsed ? "justify-center" : "space-x-3",
                )}
              >
                <HelpCircle
                  className={cn(
                    "flex-shrink-0 text-gray-500",
                    collapsed ? "w-6 h-6" : "w-5 h-5",
                  )}
                />
                {!collapsed && <span>Aide & Support</span>}
              </Link>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Aide & Support</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className={cn(
                  "w-full flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer mt-2",
                  collapsed ? "justify-center" : "space-x-3",
                )}
              >
                <LogOut
                  className={cn(
                    "flex-shrink-0 text-gray-500",
                    collapsed ? "w-6 h-6" : "w-5 h-5",
                  )}
                />
                {!collapsed && <span>Déconnexion</span>}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Déconnexion</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
};

export default Sidebar;
