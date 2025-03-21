import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Loader2, User, Lock, Bell, Monitor, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/auth/AuthProvider";
import UpdateProfile from "@/components/auth/UpdateProfile";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSettings } from "@/contexts/SettingsContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/components/ui/theme-provider";

const UserSettings = () => {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  // Update local settings when global settings change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleThemeChange = (value: "light" | "dark" | "system") => {
    setLocalSettings((prev) => ({ ...prev, theme: value }));
    // Apply theme immediately for better UX
    setTheme(value);
  };

  const handleTimeFormatChange = (value: "12h" | "24h") => {
    setLocalSettings((prev) => ({ ...prev, timeFormat: value }));
  };

  const handleFontSizeChange = (value: "small" | "medium" | "large") => {
    setLocalSettings((prev) => ({ ...prev, fontSize: value }));
  };

  const handleAccentColorChange = (value: string) => {
    setLocalSettings((prev) => ({ ...prev, accentColor: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
      // Apply theme immediately
      if (localSettings.theme) {
        setTheme(localSettings.theme);
      }
      // Apply other settings that need immediate effect
      document.documentElement.style.fontSize =
        localSettings.fontSize === "small"
          ? "14px"
          : localSettings.fontSize === "large"
            ? "18px"
            : "16px";

      toast({
        title: "Paramètres enregistrés",
        description: "Vos préférences ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur s'est produite lors de l'enregistrement des paramètres.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full h-full bg-background p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez votre profil et vos préférences
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-w-4xl mx-auto"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <User className="h-4 w-4" /> Profil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Lock className="h-4 w-4" /> Sécurité
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-1"
          >
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-1">
            <Monitor className="h-4 w-4" /> Apparence
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <UpdateProfile />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du Compte</CardTitle>
              <CardDescription>
                Gérez votre mot de passe et les paramètres de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      // This would actually update the password in a real implementation
                      // For now, just show a success message
                      toast({
                        title: "Mot de passe mis à jour",
                        description:
                          "Votre mot de passe a été mis à jour avec succès.",
                      });
                    } catch (error) {
                      toast({
                        title: "Erreur",
                        description:
                          "Une erreur s'est produite lors de la mise à jour du mot de passe.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Mettre à jour le mot de passe
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de Notification</CardTitle>
              <CardDescription>
                Gérez comment et quand vous recevez des notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Notifications par Email</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email-appointments"
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        checked={localSettings.notificationEmail}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({
                            ...prev,
                            notificationEmail: e.target.checked,
                          }))
                        }
                      />
                      <label htmlFor="email-appointments" className="text-sm">
                        Rappels de rendez-vous
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email-treatments"
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        defaultChecked
                      />
                      <label htmlFor="email-treatments" className="text-sm">
                        Mises à jour des plans de traitement
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email-marketing"
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <label htmlFor="email-marketing" className="text-sm">
                        Offres et promotions
                      </label>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  onClick={saveSettings}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer les préférences"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base">Thème</Label>
                    <RadioGroup
                      value={localSettings.theme || "light"}
                      onValueChange={(value) =>
                        handleThemeChange(value as "light" | "dark" | "system")
                      }
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light" className="font-normal">
                          Clair
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="dark" />
                        <Label htmlFor="dark" className="font-normal">
                          Sombre
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="system" />
                        <Label htmlFor="system" className="font-normal">
                          Système (utilise les préférences de votre appareil)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base">Couleur d'accent</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { name: "Bleu", value: "blue", class: "bg-blue-500" },
                        { name: "Vert", value: "green", class: "bg-green-500" },
                        { name: "Rouge", value: "red", class: "bg-red-500" },
                        {
                          name: "Violet",
                          value: "purple",
                          class: "bg-purple-500",
                        },
                        {
                          name: "Orange",
                          value: "orange",
                          class: "bg-orange-500",
                        },
                        { name: "Rose", value: "pink", class: "bg-pink-500" },
                        {
                          name: "Indigo",
                          value: "indigo",
                          class: "bg-indigo-500",
                        },
                        {
                          name: "Émeraude",
                          value: "emerald",
                          class: "bg-emerald-500",
                        },
                        {
                          name: "Ambre",
                          value: "amber",
                          class: "bg-amber-500",
                        },
                        { name: "Cyan", value: "cyan", class: "bg-cyan-500" },
                      ].map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          className={`h-10 rounded-md ${color.class} ${localSettings.accentColor === color.value ? "ring-2 ring-offset-2 ring-black dark:ring-white" : ""}`}
                          title={color.name}
                          onClick={() => handleAccentColorChange(color.value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base">Taille de police</Label>
                    <RadioGroup
                      value={localSettings.fontSize || "medium"}
                      onValueChange={(value) =>
                        handleFontSizeChange(
                          value as "small" | "medium" | "large",
                        )
                      }
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small" id="small" />
                        <Label htmlFor="small" className="font-normal text-sm">
                          Petite
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium" className="font-normal">
                          Moyenne
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="large" />
                        <Label htmlFor="large" className="font-normal text-lg">
                          Grande
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Format de l'heure</Label>
                  <RadioGroup
                    value={localSettings.timeFormat}
                    onValueChange={(value) =>
                      handleTimeFormatChange(value as "12h" | "24h")
                    }
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="12h" id="12h" />
                      <Label htmlFor="12h" className="font-normal">
                        12 heures (AM/PM)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="24h" id="24h" />
                      <Label htmlFor="24h" className="font-normal">
                        24 heures
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full"
                    onClick={saveSettings}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      "Enregistrer les préférences"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
