import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Calendar, MessageSquare, Bell, Save } from "lucide-react";

interface ReminderSettingProps {
  onSave?: (settings: ReminderSettings) => void;
}

interface ReminderSettings {
  appointmentReminders: {
    enabled: boolean;
    timing: string;
    method: string;
    message: string;
  };
  followUpReminders: {
    enabled: boolean;
    daysAfter: number;
    method: string;
    message: string;
  };
  treatmentPlanReminders: {
    enabled: boolean;
    daysBeforeDue: number;
    method: string;
    message: string;
  };
}

const ReminderSettings: React.FC<ReminderSettingProps> = ({ onSave }) => {
  const [settings, setSettings] = useState<ReminderSettings>({
    appointmentReminders: {
      enabled: true,
      timing: "24",
      method: "sms",
      message:
        "Reminder: You have an appointment at Smile Dental tomorrow at {time}. Reply C to confirm or R to reschedule.",
    },
    followUpReminders: {
      enabled: true,
      daysAfter: 7,
      method: "email",
      message:
        "How are you feeling after your recent dental procedure? Please let us know if you have any concerns.",
    },
    treatmentPlanReminders: {
      enabled: true,
      daysBeforeDue: 14,
      method: "sms",
      message:
        "Your scheduled treatment for {procedure} is due in {days} days. Please contact us to confirm your appointment.",
    },
  });

  const handleSave = () => {
    if (onSave) {
      onSave(settings);
    }
    // In a real app, this would save to the database
    alert("Reminder settings saved successfully!");
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Automated Reminder Settings</h2>
          <p className="text-gray-500">
            Configure patient communication reminders and notifications
          </p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save size={16} />
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar size={16} />
            Appointment Reminders
          </TabsTrigger>
          <TabsTrigger value="followups" className="flex items-center gap-2">
            <MessageSquare size={16} />
            Follow-up Messages
          </TabsTrigger>
          <TabsTrigger value="treatments" className="flex items-center gap-2">
            <Bell size={16} />
            Treatment Plan Reminders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Reminder Settings</CardTitle>
              <CardDescription>
                Configure when and how patients receive appointment reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="appointment-enabled" className="font-medium">
                  Enable Appointment Reminders
                </Label>
                <Switch
                  id="appointment-enabled"
                  checked={settings.appointmentReminders.enabled}
                  onCheckedChange={(checked) => {
                    setSettings({
                      ...settings,
                      appointmentReminders: {
                        ...settings.appointmentReminders,
                        enabled: checked,
                      },
                    });
                  }}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="appointment-timing">Send Reminder</Label>
                  <Select
                    value={settings.appointmentReminders.timing}
                    onValueChange={(value) => {
                      setSettings({
                        ...settings,
                        appointmentReminders: {
                          ...settings.appointmentReminders,
                          timing: value,
                        },
                      });
                    }}
                  >
                    <SelectTrigger id="appointment-timing">
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 hours before</SelectItem>
                      <SelectItem value="48">48 hours before</SelectItem>
                      <SelectItem value="72">72 hours before</SelectItem>
                      <SelectItem value="week">1 week before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointment-method">Reminder Method</Label>
                  <Select
                    value={settings.appointmentReminders.method}
                    onValueChange={(value) => {
                      setSettings({
                        ...settings,
                        appointmentReminders: {
                          ...settings.appointmentReminders,
                          method: value,
                        },
                      });
                    }}
                  >
                    <SelectTrigger id="appointment-method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="both">Both SMS & Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointment-message">Reminder Message</Label>
                <Input
                  id="appointment-message"
                  value={settings.appointmentReminders.message}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      appointmentReminders: {
                        ...settings.appointmentReminders,
                        message: e.target.value,
                      },
                    });
                  }}
                />
                <p className="text-xs text-gray-500">
                  Use {"{time}"}, {"{date}"}, {"{doctor}"} as placeholders
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followups">
          <Card>
            <CardHeader>
              <CardTitle>Follow-up Message Settings</CardTitle>
              <CardDescription>
                Configure automated follow-up messages after appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="followup-enabled" className="font-medium">
                  Enable Follow-up Messages
                </Label>
                <Switch
                  id="followup-enabled"
                  checked={settings.followUpReminders.enabled}
                  onCheckedChange={(checked) => {
                    setSettings({
                      ...settings,
                      followUpReminders: {
                        ...settings.followUpReminders,
                        enabled: checked,
                      },
                    });
                  }}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="followup-days">Send Follow-up</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="followup-days"
                      type="number"
                      min="1"
                      max="30"
                      value={settings.followUpReminders.daysAfter}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          followUpReminders: {
                            ...settings.followUpReminders,
                            daysAfter: parseInt(e.target.value) || 1,
                          },
                        });
                      }}
                      className="w-20"
                    />
                    <span>days after appointment</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="followup-method">Message Method</Label>
                  <Select
                    value={settings.followUpReminders.method}
                    onValueChange={(value) => {
                      setSettings({
                        ...settings,
                        followUpReminders: {
                          ...settings.followUpReminders,
                          method: value,
                        },
                      });
                    }}
                  >
                    <SelectTrigger id="followup-method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="both">Both SMS & Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="followup-message">Follow-up Message</Label>
                <Input
                  id="followup-message"
                  value={settings.followUpReminders.message}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      followUpReminders: {
                        ...settings.followUpReminders,
                        message: e.target.value,
                      },
                    });
                  }}
                />
                <p className="text-xs text-gray-500">
                  Use {"{procedure}"}, {"{date}"}, {"{doctor}"} as placeholders
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatments">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Plan Reminder Settings</CardTitle>
              <CardDescription>
                Configure reminders for upcoming treatment plan procedures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="treatment-enabled" className="font-medium">
                  Enable Treatment Plan Reminders
                </Label>
                <Switch
                  id="treatment-enabled"
                  checked={settings.treatmentPlanReminders.enabled}
                  onCheckedChange={(checked) => {
                    setSettings({
                      ...settings,
                      treatmentPlanReminders: {
                        ...settings.treatmentPlanReminders,
                        enabled: checked,
                      },
                    });
                  }}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="treatment-days">Send Reminder</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="treatment-days"
                      type="number"
                      min="1"
                      max="30"
                      value={settings.treatmentPlanReminders.daysBeforeDue}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          treatmentPlanReminders: {
                            ...settings.treatmentPlanReminders,
                            daysBeforeDue: parseInt(e.target.value) || 1,
                          },
                        });
                      }}
                      className="w-20"
                    />
                    <span>days before due date</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatment-method">Reminder Method</Label>
                  <Select
                    value={settings.treatmentPlanReminders.method}
                    onValueChange={(value) => {
                      setSettings({
                        ...settings,
                        treatmentPlanReminders: {
                          ...settings.treatmentPlanReminders,
                          method: value,
                        },
                      });
                    }}
                  >
                    <SelectTrigger id="treatment-method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="both">Both SMS & Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment-message">Reminder Message</Label>
                <Input
                  id="treatment-message"
                  value={settings.treatmentPlanReminders.message}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      treatmentPlanReminders: {
                        ...settings.treatmentPlanReminders,
                        message: e.target.value,
                      },
                    });
                  }}
                />
                <p className="text-xs text-gray-500">
                  Use {"{procedure}"}, {"{days}"}, {"{date}"} as placeholders
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReminderSettings;
