import React from "react";
import {
  Bell,
  Search,
  User,
  ChevronDown,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import NotificationCenter from "@/components/notifications/NotificationCenter";

interface HeaderProps {
  practiceName?: string;
  userAvatar?: string;
  userName?: string;
  userRole?: string;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onSearchSubmit?: (query: string) => void;
  notificationCount?: number;
}

const Header = ({
  practiceName = "DENTOGRAM",
  userAvatar = "",
  userName = "Dr. Sarah Johnson",
  userRole = "Dentiste",
  onNotificationClick = () => {},
  onProfileClick = () => {},
  onSearchSubmit = () => {},
  notificationCount = 3,
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showNotifications, setShowNotifications] = React.useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
      // Navigate to patients page with search query
      navigate(`/patients?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  const handleProfileClick = () => {
    navigate("/settings");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleHelpClick = () => {
    navigate("/help");
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    onNotificationClick();
  };

  return (
    <header className="bg-background border-b border-border h-20 px-6 flex items-center justify-between w-full">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-primary mr-8">{practiceName}</h1>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Input
            type="text"
            placeholder="Rechercher patients, rendez-vous..."
            className="w-80 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground bg-transparent border-none p-0 cursor-pointer"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />

        <NotificationCenter />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 h-10 px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userName
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">{userName}</span>
                <span className="text-xs text-muted-foreground">
                  {userRole}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleHelpClick}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Aide & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
