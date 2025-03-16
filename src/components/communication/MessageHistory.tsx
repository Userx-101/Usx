import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  MessageSquare,
  Phone,
  Video,
  ArrowDown,
  Check,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: "patient" | "practice";
  read: boolean;
  type: "sms" | "email";
}

interface Patient {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface MessageHistoryProps {
  patients?: Patient[];
  selectedPatientId?: string;
  messages?: Message[];
}

const MessageHistory = ({
  patients = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      lastMessage: "Thank you for the reminder about my appointment tomorrow.",
      lastMessageTime: "10:30 AM",
      unreadCount: 2,
    },
    {
      id: "2",
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      lastMessage:
        "Is there anything I need to do to prepare for my root canal?",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      lastMessage: "I need to reschedule my cleaning appointment.",
      lastMessageTime: "Yesterday",
      unreadCount: 1,
    },
    {
      id: "4",
      name: "David Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      lastMessage: "Do you accept my new insurance plan?",
      lastMessageTime: "Monday",
      unreadCount: 0,
    },
    {
      id: "5",
      name: "Lisa Thompson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
      lastMessage: "My son has a toothache. Can we come in today?",
      lastMessageTime: "Monday",
      unreadCount: 0,
    },
  ],
  selectedPatientId = "1",
  messages = [
    {
      id: "1",
      content:
        "Hello Sarah, this is a reminder that you have an appointment scheduled for tomorrow at 2:00 PM with Dr. Martinez.",
      timestamp: "Yesterday, 9:15 AM",
      sender: "practice",
      read: true,
      type: "sms",
    },
    {
      id: "2",
      content: "Thank you for the reminder about my appointment tomorrow.",
      timestamp: "Yesterday, 10:30 AM",
      sender: "patient",
      read: true,
      type: "sms",
    },
    {
      id: "3",
      content:
        "You're welcome! Please remember to bring your insurance card and arrive 15 minutes early to complete any necessary paperwork.",
      timestamp: "Yesterday, 10:45 AM",
      sender: "practice",
      read: true,
      type: "sms",
    },
    {
      id: "4",
      content:
        "I have a question about the procedure. Will I be able to drive myself home afterward?",
      timestamp: "Today, 8:20 AM",
      sender: "patient",
      read: false,
      type: "sms",
    },
    {
      id: "5",
      content:
        "For the procedure you're having, you should be fine to drive yourself home. However, if you're feeling uncomfortable, it might be good to have someone accompany you just in case.",
      timestamp: "Today, 9:05 AM",
      sender: "practice",
      read: false,
      type: "sms",
    },
  ],
}: MessageHistoryProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [patientsList, setPatientsList] = useState(patients);
  const [currentSelectedPatientId, setCurrentSelectedPatientId] =
    useState(selectedPatientId);
  const [currentMessages, setCurrentMessages] = useState(messages);
  const [newMessage, setNewMessage] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    smsOnly: false,
    emailOnly: false,
    unreadOnly: false,
  });
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Handle patient selection
  const handlePatientSelect = (patientId: string) => {
    setCurrentSelectedPatientId(patientId);
    // Mark messages as read when selecting a patient
    const updatedMessages = currentMessages.map((msg) =>
      msg.sender === "patient" ? { ...msg, read: true } : msg,
    );
    setCurrentMessages(updatedMessages);

    // Update unread count for the selected patient
    setPatientsList((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === patientId ? { ...patient, unreadCount: 0 } : patient,
      ),
    );
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: `${currentMessages.length + 1}`,
      content: newMessage,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      sender: "practice" as const,
      read: true,
      type: "sms" as const,
    };

    setCurrentMessages([...currentMessages, newMsg]);
    setNewMessage("");

    // Scroll to bottom after sending message
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    toast({
      title: "Message sent",
      description: `Message sent to ${selectedPatient?.name}`,
    });
  };

  // Handle call button
  const handleCall = () => {
    toast({
      title: "Calling patient",
      description: `Initiating call to ${selectedPatient?.name}`,
    });
  };

  // Handle video call button
  const handleVideoCall = () => {
    toast({
      title: "Video call",
      description: `Starting video call with ${selectedPatient?.name}`,
    });
  };

  // Handle new message button
  const handleNewMessage = () => {
    toast({
      title: "New message",
      description: "Create a new message thread",
    });
  };

  // Handle template selection
  const handleSelectTemplate = (template: string) => {
    setNewMessage(template);
    setShowTemplates(false);
  };

  // Apply filters to patients
  const applyFilters = () => {
    let filtered = [...patients];

    if (filters.unreadOnly) {
      filtered = filtered.filter((patient) => patient.unreadCount > 0);
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setPatientsList(filtered);
    setFilterOpen(false);
  };

  // Filter patients based on search query
  const filteredPatients = patientsList.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Find the selected patient
  const selectedPatient =
    patientsList.find((patient) => patient.id === currentSelectedPatientId) ||
    patientsList[0];

  return (
    <Card className="h-full bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Message History</CardTitle>
        <div className="flex items-center space-x-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search messages..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Reset to all patients if search is cleared
                if (e.target.value === "") {
                  setPatientsList(patients);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyFilters();
                }
              }}
            />
          </div>
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Messages</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms-only"
                      checked={filters.smsOnly}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          smsOnly: checked === true,
                          emailOnly: false,
                        })
                      }
                    />
                    <Label htmlFor="sms-only">SMS only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-only"
                      checked={filters.emailOnly}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          emailOnly: checked === true,
                          smsOnly: false,
                        })
                      }
                    />
                    <Label htmlFor="email-only">Email only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="unread-only"
                      checked={filters.unreadOnly}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, unreadOnly: checked === true })
                      }
                    />
                    <Label htmlFor="unread-only">Unread only</Label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={applyFilters} size="sm">
                    <Check className="h-4 w-4 mr-2" /> Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <div className="grid grid-cols-3 h-[calc(100%-5rem)]">
        <div className="border-r">
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="px-4">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                </TabsTrigger>
                <TabsTrigger value="sent" className="flex-1">
                  Sent
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[calc(100vh-15rem)]">
              <TabsContent value="all" className="m-0">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`flex items-start p-4 hover:bg-gray-50 cursor-pointer ${patient.id === currentSelectedPatientId ? "bg-gray-50" : ""}`}
                    onClick={() => handlePatientSelect(patient.id)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <img src={patient.avatar} alt={patient.name} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium truncate">{patient.name}</h4>
                        <span className="text-xs text-gray-500">
                          {patient.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {patient.lastMessage}
                      </p>
                    </div>
                    {patient.unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-2 px-2 py-1 h-5"
                      >
                        {patient.unreadCount}
                      </Badge>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="unread" className="m-0">
                {filteredPatients
                  .filter((p) => p.unreadCount > 0)
                  .map((patient) => (
                    <div
                      key={patient.id}
                      className={`flex items-start p-4 hover:bg-gray-50 cursor-pointer ${patient.id === currentSelectedPatientId ? "bg-gray-50" : ""}`}
                      onClick={() => handlePatientSelect(patient.id)}
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <img src={patient.avatar} alt={patient.name} />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium truncate">
                            {patient.name}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {patient.lastMessageTime}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {patient.lastMessage}
                        </p>
                      </div>
                      {patient.unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-2 px-2 py-1 h-5"
                        >
                          {patient.unreadCount}
                        </Badge>
                      )}
                    </div>
                  ))}
              </TabsContent>

              <TabsContent value="sent" className="m-0">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`flex items-start p-4 hover:bg-gray-50 cursor-pointer ${patient.id === currentSelectedPatientId ? "bg-gray-50" : ""}`}
                    onClick={() => handlePatientSelect(patient.id)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <img src={patient.avatar} alt={patient.name} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium truncate">{patient.name}</h4>
                        <span className="text-xs text-gray-500">
                          {patient.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        You: {patient.lastMessage.substring(0, 20)}...
                      </p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        <div className="col-span-2 flex flex-col h-full">
          {selectedPatient && (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <img
                      src={selectedPatient.avatar}
                      alt={selectedPatient.name}
                    />
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedPatient.name}</h3>
                    <p className="text-xs text-gray-500">Patient #12345</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={handleCall}>
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleVideoCall}>
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNewMessage}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "practice" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.sender === "practice"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        <p>{message.content}</p>
                        <div
                          className={`text-xs mt-1 ${
                            message.sender === "practice"
                              ? "text-gray-500"
                              : "text-blue-100"
                          }`}
                        >
                          {message.timestamp} · {message.type.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Type a message..."
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>SMS will be sent to +1 (555) 123-4567</span>
                  <Popover open={showTemplates} onOpenChange={setShowTemplates}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        <ArrowDown className="h-3 w-3 mr-1" /> View Message
                        Templates
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Message Templates</h4>
                        <div className="space-y-2">
                          <div
                            className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                            onClick={() =>
                              handleSelectTemplate(
                                "Thank you for your recent visit. Please let us know if you have any questions.",
                              )
                            }
                          >
                            <p className="font-medium">Post-Visit Follow-up</p>
                            <p className="text-sm text-gray-600 truncate">
                              Thank you for your recent visit. Please let us
                              know if you have any questions.
                            </p>
                          </div>
                          <div
                            className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                            onClick={() =>
                              handleSelectTemplate(
                                "This is a reminder that you have an appointment scheduled for tomorrow at 2:00 PM with Dr. Martinez.",
                              )
                            }
                          >
                            <p className="font-medium">Appointment Reminder</p>
                            <p className="text-sm text-gray-600 truncate">
                              This is a reminder that you have an appointment
                              scheduled for tomorrow at 2:00 PM with Dr.
                              Martinez.
                            </p>
                          </div>
                          <div
                            className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                            onClick={() =>
                              handleSelectTemplate(
                                "Your prescription is ready for pickup at our office. Our hours are 9 AM - 5 PM Monday through Friday.",
                              )
                            }
                          >
                            <p className="font-medium">Prescription Ready</p>
                            <p className="text-sm text-gray-600 truncate">
                              Your prescription is ready for pickup at our
                              office. Our hours are 9 AM - 5 PM Monday through
                              Friday.
                            </p>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MessageHistory;
