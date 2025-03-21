export interface UserSettings {
  timeFormat: "12h" | "24h";
  theme: "light";
  language: "fr" | "en";
  notificationEmail: boolean;
  notificationSms: boolean;
}

export interface DbUserSettings {
  user_id: string;
  time_format: string;
  theme: string;
  language: string;
  notification_email: boolean;
  notification_sms: boolean;
  created_at: string;
  updated_at: string;
}
