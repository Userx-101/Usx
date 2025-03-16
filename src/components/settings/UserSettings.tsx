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
import { Loader2, User, Lock, Bell, Monitor } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/auth/AuthProvider";
import UpdateProfile from "@/components/auth/UpdateProfile";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const UserSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                <Button type="submit" className="w-full">
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
                        defaultChecked
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

                <div className="space-y-2">
                  <Label>Notifications SMS</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sms-appointments"
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        defaultChecked
                      />
                      <label htmlFor="sms-appointments" className="text-sm">
                        Rappels de rendez-vous
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sms-treatments"
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <label htmlFor="sms-treatments" className="text-sm">
                        Mises à jour des plans de traitement
                      </label>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Enregistrer les préférences
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
                <div className="space-y-2">
                  <Label>Thème</Label>
                  <div className="flex items-center justify-between">
                    <span>Changer le thème de l'application</span>
                    <ThemeToggle />
                  </div>
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
