import React, { useState } from "react";
import { Bell, Check, Clock, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface NotificationProps {
  id: string;
  type: "appointment" | "message" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
  initials?: string;
}

const defaultNotifications: NotificationProps[] = [
  {
    id: "1",
    type: "appointment",
    title: "Appointment Reminder",
    description: "Dr. Johnson has a patient scheduled in 30 minutes",
    time: "30 min ago",
    read: false,
    initials: "JD",
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    description: "Sarah Miller has a question about her upcoming procedure",
    time: "1 hour ago",
    read: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    initials: "SM",
  },
  {
    id: "3",
    type: "system",
    title: "Low Inventory Alert",
    description: "Dental composite material is running low",
    time: "2 hours ago",
    read: true,
    initials: "SYS",
  },
  {
    id: "4",
    type: "appointment",
    title: "Appointment Canceled",
    description: "Robert Davis canceled his 3:00 PM appointment",
    time: "3 hours ago",
    read: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    initials: "RD",
  },
  {
    id: "5",
    type: "message",
    title: "Treatment Plan Approval",
    description: "Emily Wilson approved her treatment plan",
    time: "5 hours ago",
    read: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    initials: "EW",
  },
];

interface NotificationCenterProps {
  notifications?: NotificationProps[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDismiss?: (id: string) => void;
}

const NotificationCenter = ({
  notifications = defaultNotifications,
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
  onDismiss = () => {},
}: NotificationCenterProps) => {
  const [open, setOpen] = useState(true);
  const [localNotifications, setLocalNotifications] =
    useState<NotificationProps[]>(notifications);

  const unreadCount = localNotifications.filter(
    (notification) => !notification.read,
  ).length;

  const handleMarkAsRead = (id: string) => {
    setLocalNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
    onMarkAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    setLocalNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
    onMarkAllAsRead();
  };

  const handleDismiss = (id: string) => {
    setLocalNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
    onDismiss(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "system":
        return <Bell className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-background">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[400px]">
          <div className="flex items-center justify-between p-4">
            <DropdownMenuLabel className="text-lg font-semibold">
              Notifications
            </DropdownMenuLabel>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                Mark all as read
              </Button>
            )}
          </div>
          <DropdownMenuSeparator />
          <ScrollArea className="h-[400px]">
            {localNotifications.length > 0 ? (
              <div className="p-2">
                {localNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`mb-2 p-3 rounded-lg flex items-start gap-3 ${notification.read ? "bg-background" : "bg-muted"}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {notification.avatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={notification.avatar} alt="Avatar" />
                          <AvatarFallback>
                            {notification.initials}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDismiss(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">No notifications</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You're all caught up!
                </p>
              </div>
            )}
          </ScrollArea>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-2 justify-center cursor-pointer">
            <span className="text-xs text-center">View all notifications</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationCenter;
