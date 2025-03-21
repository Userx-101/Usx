import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import MessageComposer from "./MessageComposer";
import MessageHistory from "./MessageHistory";
import ReminderSettings from "./ReminderSettings";
import { MessageSquare, Clock, Bell } from "lucide-react";

interface CommunicationPortalProps {
  patientId?: string;
  patientName?: string;
  activeTab?: "compose" | "history" | "reminders";
}

const CommunicationPortal = ({
  patientId = "",
  patientName = "",
  activeTab = "compose",
}: CommunicationPortalProps) => {
  const [currentTab, setCurrentTab] = useState<string>(activeTab);

  // Mock function for handling message sending
  const handleSendMessage = (message: {
    patientId: string;
    content: string;
    method: "sms" | "email";
    attachments?: File[];
  }) => {
    console.log("Message sent:", message);
    // In a real app, this would send the message via an API call
  };

  // Mock function for saving reminder settings
  const handleSaveReminderSettings = (settings: any) => {
    console.log("Reminder settings saved:", settings);
    // In a real app, this would save settings via an API call
  };

  return (
    <div className="w-full h-full p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Staff Communication Portal
        </h1>
        <p className="text-gray-500 mt-1">
          Send messages to staff, view conversation history, and manage
          reminders
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Compose Message
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Message History
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Reminder Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <MessageComposer
                recipientId={patientId || "S12345"}
                recipientName={patientName || "Dr. Johnson"}
                onSend={handleSendMessage}
              />
            </div>
            <div>
              <Card className="bg-white shadow-md h-full">
                <CardHeader>
                  <CardTitle>Message Templates</CardTitle>
                  <CardDescription>
                    Frequently used message templates for common communications
                  </CardDescription>
                </CardHeader>
                <div className="p-6 space-y-4">
                  <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-medium">Appointment Reminder</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Reminder about upcoming dental appointment with time and
                      date details
                    </p>
                  </div>
                  <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-medium">Treatment Follow-up</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Check-in message after a procedure to ensure patient
                      recovery
                    </p>
                  </div>
                  <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-medium">Billing Reminder</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Notification about outstanding balance and payment options
                    </p>
                  </div>
                  <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-medium">Prescription Information</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Details about prescribed medication and usage instructions
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <MessageHistory selectedPatientId={patientId || "1"} />
        </TabsContent>

        <TabsContent value="reminders" className="mt-0">
          <ReminderSettings onSave={handleSaveReminderSettings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationPortal;
