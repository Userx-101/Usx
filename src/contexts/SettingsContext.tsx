import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { dataService } from "@/lib/dataService";
import { useAuth } from "@/components/auth/AuthProvider";
import { useTheme } from "@/components/ui/theme-provider";

interface UserSettings {
  timeFormat: "12h" | "24h";
  theme: "light" | "dark" | "system";
  language: "fr" | "en";
  notificationEmail: boolean;
  notificationSms: boolean;
  fontSize?: "small" | "medium" | "large";
  accentColor?: string;
}

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  formatTime: (date: Date | string) => string;
  formatDate: (date: Date | string) => string;
}

const defaultSettings: UserSettings = {
  timeFormat: "24h",
  theme: "light",
  language: "fr",
  notificationEmail: true,
  notificationSms: true,
  fontSize: "medium",
  accentColor: "blue",
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  formatTime: () => "",
  formatDate: () => "",
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const { user } = useAuth();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  // Apply theme when settings change
  useEffect(() => {
    if (settings.theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme, setTheme]);

  const loadUserSettings = async () => {
    if (!user) return;

    try {
      const dbSettings = await dataService.userSettings.get(user.id);

      if (dbSettings) {
        const loadedSettings = {
          timeFormat: dbSettings.time_format as "12h" | "24h",
          theme: (dbSettings.theme || "light") as "light" | "dark" | "system",
          language: dbSettings.language as "fr" | "en",
          notificationEmail: dbSettings.notification_email,
          notificationSms: dbSettings.notification_sms,
          fontSize: (dbSettings.font_size || "medium") as
            | "small"
            | "medium"
            | "large",
          accentColor: dbSettings.accent_color || "blue",
        };

        setSettings(loadedSettings);

        // Apply theme immediately after loading
        if (loadedSettings.theme) {
          setTheme(loadedSettings.theme);
        }
      }
    } catch (error) {
      console.error("Error loading user settings:", error);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);

      // Apply theme immediately if it was changed
      if (newSettings.theme) {
        setTheme(newSettings.theme);
      }

      await dataService.userSettings.update(user.id, {
        time_format: updatedSettings.timeFormat,
        theme: updatedSettings.theme,
        language: updatedSettings.language,
        notification_email: updatedSettings.notificationEmail,
        notification_sms: updatedSettings.notificationSms,
        font_size: updatedSettings.fontSize,
        accent_color: updatedSettings.accentColor,
      });
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
  };

  const formatTime = (date: Date | string) => {
    if (!date) return "";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) return "";

    try {
      if (settings.timeFormat === "12h") {
        return dateObj.toLocaleTimeString(
          settings.language === "fr" ? "fr-FR" : "en-US",
          {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          },
        );
      } else {
        return dateObj.toLocaleTimeString(
          settings.language === "fr" ? "fr-FR" : "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          },
        );
      }
    } catch (error) {
      console.error("Error formatting time:", error);
      return dateObj.toLocaleTimeString();
    }
  };

  const formatDate = (date: Date | string) => {
    if (!date) return "";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) return "";

    try {
      return dateObj.toLocaleDateString(
        settings.language === "fr" ? "fr-FR" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      );
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateObj.toLocaleDateString();
    }
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, formatTime, formatDate }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
