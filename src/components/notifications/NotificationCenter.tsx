import React, { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/contexts/SettingsContext";

interface NotificationProps {
  id: string;
  type: "appointment" | "message" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
  initials?: string;
  timestamp?: Date;
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
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
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
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: "3",
    type: "system",
    title: "Low Inventory Alert",
    description: "Dental composite material is running low",
    time: "2 hours ago",
    read: true,
    initials: "SYS",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
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
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
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
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
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
  const [open, setOpen] = useState(false);
  const [localNotifications, setLocalNotifications] =
    useState<NotificationProps[]>(notifications);
  const { formatTime } = useSettings();

  // Format notification times based on user settings
  useEffect(() => {
    const formattedNotifications = notifications.map((notification) => {
      if (notification.timestamp) {
        const now = new Date();
        const diff = now.getTime() - notification.timestamp.getTime();

        let timeString;
        if (diff < 60 * 1000) {
          timeString = "Just now";
        } else if (diff < 60 * 60 * 1000) {
          const minutes = Math.floor(diff / (60 * 1000));
          timeString = `${minutes} min ago`;
        } else if (diff < 24 * 60 * 60 * 1000) {
          const hours = Math.floor(diff / (60 * 60 * 1000));
          timeString = `${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else {
          timeString = formatTime(notification.timestamp);
        }

        return { ...notification, time: timeString };
      }
      return notification;
    });

    setLocalNotifications(formattedNotifications);
  }, [notifications, formatTime]);

  // Auto-close dropdown when all notifications are read or dismissed
  useEffect(() => {
    if (open && localNotifications.length === 0) {
      setOpen(false);
    }
  }, [localNotifications, open]);

  const unreadCount = localNotifications.filter(
    (notification) => !notification.read,
  ).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      // Update in database if connected
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) {
        console.log("Database update failed, updating UI only");
      }

      // Update local state
      setLocalNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification,
        ),
      );
      onMarkAsRead(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Still update UI even if database fails
      setLocalNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification,
        ),
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Update in database if connected
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .in(
          "id",
          localNotifications.filter((n) => !n.read).map((n) => n.id),
        );

      if (error) {
        console.log("Database update failed, updating UI only");
      }

      // Update local state
      setLocalNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true })),
      );
      onMarkAllAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Still update UI even if database fails
      setLocalNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true })),
      );
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      // Delete from database if connected
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) {
        console.log("Database delete failed, updating UI only");
      }

      // Update local state
      setLocalNotifications((prev) =>
        prev.filter((notification) => notification.id !== id),
      );
      onDismiss(id);
    } catch (error) {
      console.error("Error dismissing notification:", error);
      // Still update UI even if database fails
      setLocalNotifications((prev) =>
        prev.filter((notification) => notification.id !== id),
      );
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />;
      case "message":
        return (
          <MessageSquare className="h-4 w-4 text-green-500 dark:text-green-400" />
        );
      case "system":
        return <Bell className="h-4 w-4 text-amber-500 dark:text-amber-400" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Open dropdown when clicking the notification icon
  const handleNotificationClick = () => {
    setOpen(true);
  };

  return (
    <div className="bg-background">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={handleNotificationClick}
          >
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
                    className={`mb-2 p-3 rounded-lg flex items-start gap-3 ${notification.read ? "bg-background" : "bg-muted dark:bg-slate-800"}`}
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
