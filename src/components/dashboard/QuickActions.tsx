import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  Clock,
} from "lucide-react";

interface QuickActionProps {
  actions?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    color?: string;
  }>;
}

const QuickActions = ({ actions }: QuickActionProps) => {
  const navigate = useNavigate();

  const defaultActions = [
    {
      icon: <PlusCircle className="h-5 w-5" />,
      label: "Add New Patient",
      onClick: () => navigate("/patients"),
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Schedule Appointment",
      onClick: () => navigate("/calendar"),
      color: "bg-green-100 text-green-700",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Create Treatment Plan",
      onClick: () => navigate("/treatments"),
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Send Message",
      onClick: () => navigate("/communication"),
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "View Patient Directory",
      onClick: () => navigate("/patients"),
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Check-in Patient",
      onClick: () => navigate("/calendar"),
      color: "bg-red-100 text-red-700",
    },
  ];

  const displayActions = actions || defaultActions;

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {displayActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`flex items-center justify-start gap-2 h-16 ${action.color} hover:opacity-90 transition-opacity`}
              onClick={action.onClick}
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
