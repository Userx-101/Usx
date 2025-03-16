import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Send, Phone, Mail, FileText, Paperclip } from "lucide-react";

interface MessageComposerProps {
  patientId?: string;
  patientName?: string;
  onSend?: (message: {
    patientId: string;
    content: string;
    method: "sms" | "email";
    attachments?: File[];
  }) => void;
}

const MessageComposer = ({
  patientId = "P12345",
  patientName = "Sarah Johnson",
  onSend = () => {},
}: MessageComposerProps) => {
  const [messageContent, setMessageContent] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<"sms" | "email">("sms");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Mock templates
  const messageTemplates = [
    { id: "appt-reminder", name: "Appointment Reminder" },
    { id: "follow-up", name: "Treatment Follow-up" },
    { id: "billing", name: "Billing Reminder" },
    { id: "custom", name: "Custom Message" },
  ];

  const handleSend = () => {
    if (!messageContent.trim()) return;

    onSend({
      patientId,
      content: messageContent,
      method: selectedMethod,
      attachments,
    });

    // Reset form after sending
    setMessageContent("");
    setAttachments([]);
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);

    // Set predefined message based on template
    if (templateId === "appt-reminder") {
      setMessageContent(
        `Hi ${patientName}, this is a reminder about your upcoming dental appointment on [DATE] at [TIME]. Please reply to confirm or call us at (555) 123-4567 to reschedule.`,
      );
    } else if (templateId === "follow-up") {
      setMessageContent(
        `Hi ${patientName}, we hope you're feeling well after your recent dental procedure. Please let us know if you have any questions or concerns about your recovery.`,
      );
    } else if (templateId === "billing") {
      setMessageContent(
        `Hi ${patientName}, this is a reminder that you have an outstanding balance of $[AMOUNT] for your recent dental services. Please call our billing department at (555) 123-4567 to make a payment.`,
      );
    } else if (templateId === "custom") {
      setMessageContent("");
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Compose Message</CardTitle>
        <div className="flex items-center mt-2">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patientId}`}
              alt={patientName}
            />
            <AvatarFallback>
              {patientName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{patientName}</p>
            <p className="text-sm text-gray-500">Patient ID: {patientId}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue="sms"
          className="w-full"
          onValueChange={(value) => setSelectedMethod(value as "sms" | "email")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>SMS</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sms" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-sms">Message Template</Label>
              <Select
                value={selectedTemplate}
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger id="template-sms">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {messageTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message-content">Message</Label>
              <Textarea
                id="message-content"
                placeholder="Type your message here..."
                className="min-h-[120px]"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
              <p className="text-xs text-gray-500 text-right">
                {messageContent.length}/160 characters
              </p>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-email">Email Template</Label>
              <Select
                value={selectedTemplate}
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger id="template-email">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {messageTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input id="email-subject" placeholder="Email subject" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-content">Message</Label>
              <Textarea
                id="email-content"
                placeholder="Type your email content here..."
                className="min-h-[150px]"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="attachments"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Paperclip className="h-4 w-4" />
                <span>Attachments</span>
              </Label>
              <Input
                id="attachments"
                type="file"
                multiple
                className="hidden"
                onChange={handleAttachmentChange}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {attachments.length > 0 ? (
                  attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm"
                    >
                      <FileText className="h-3 w-3" />
                      <span className="truncate max-w-[150px]">
                        {file.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No attachments added</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline">Cancel</Button>
        <Button
          onClick={handleSend}
          disabled={!messageContent.trim()}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Send {selectedMethod === "sms" ? "SMS" : "Email"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MessageComposer;
