import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  ArrowRight,
  Check,
  Building,
  Users,
  User,
} from "lucide-react";

interface OnboardingWizardProps {
  userId: string;
  userEmail: string;
}

const OnboardingWizard = ({ userId, userEmail }: OnboardingWizardProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [practiceName, setPracticeName] = useState("");
  const [practiceAddress, setPracticeAddress] = useState("");
  const [practicePhone, setPracticePhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("Dentiste");
  const [staffMembers, setStaffMembers] = useState<
    Array<{
      firstName: string;
      lastName: string;
      role: string;
      email: string;
      phone: string;
    }>
  >([]);
  const [currentStaffMember, setCurrentStaffMember] = useState({
    firstName: "",
    lastName: "",
    role: "Assistante dentaire",
    email: "",
    phone: "",
  });

  const handleAddStaffMember = () => {
    if (currentStaffMember.firstName && currentStaffMember.lastName) {
      setStaffMembers([...staffMembers, { ...currentStaffMember }]);
      setCurrentStaffMember({
        firstName: "",
        lastName: "",
        role: "Assistante dentaire",
        email: "",
        phone: "",
      });
    }
  };

  const handleRemoveStaffMember = (index: number) => {
    const updatedStaff = [...staffMembers];
    updatedStaff.splice(index, 1);
    setStaffMembers(updatedStaff);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Save practice information
      const { data: practiceData, error: practiceError } = await supabase
        .from("practice_settings")
        .insert({
          name: practiceName,
          address: practiceAddress,
          phone: practicePhone,
          owner_id: userId,
        })
        .select();

      if (practiceError) {
        console.error("Practice error:", practiceError);
        throw new Error(`Error saving practice: ${practiceError.message}`);
      }

      // Update user profile
      const { error: userError } = await supabase
        .from("users")
        .update({
          first_name: firstName,
          last_name: lastName,
          role: role,
        })
        .eq("id", userId);

      if (userError) {
        console.error("User error:", userError);
        throw new Error(`Error updating user: ${userError.message}`);
      }

      // Add staff members
      if (staffMembers.length > 0) {
        const staffToInsert = staffMembers.map((staff) => ({
          first_name: staff.firstName,
          last_name: staff.lastName,
          role: staff.role,
          email: staff.email,
          phone: staff.phone,
          status: "active",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.firstName}`,
        }));

        const { error: staffError } = await supabase
          .from("staff")
          .insert(staffToInsert);

        if (staffError) {
          console.error("Staff error:", staffError);
          throw new Error(`Error adding staff: ${staffError.message}`);
        }
      }

      // Set onboarding complete flag
      const { error: settingsError } = await supabase
        .from("user_settings")
        .upsert({
          user_id: userId,
          onboarding_completed: true,
          time_format: "24h",
          theme: "light",
          language: "fr",
          notification_email: true,
          notification_sms: false,
        });

      if (settingsError) {
        console.error("Settings error:", settingsError);
        throw new Error(`Error saving settings: ${settingsError.message}`);
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error during onboarding:", error);
      const errorMessage = error.message || "An unknown error occurred";
      alert(`Error during onboarding: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              D
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold">
            Bienvenue sur votre Système de Gestion de Cabinet Dentaire
          </CardTitle>
          <CardDescription className="text-center">
            Configurons votre cabinet en quelques étapes simples
          </CardDescription>

          <div className="flex justify-center mt-6 space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${step === 1 ? "bg-blue-600" : "bg-gray-300"}`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full ${step === 2 ? "bg-blue-600" : "bg-gray-300"}`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full ${step === 3 ? "bg-blue-600" : "bg-gray-300"}`}
            ></div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <Building className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-center mb-4">
                Informations du Cabinet
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="practiceName">Nom du Cabinet</Label>
                  <Input
                    id="practiceName"
                    placeholder="Cabinet Dentaire Dr. Martin"
                    value={practiceName}
                    onChange={(e) => setPracticeName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="practiceAddress">Adresse</Label>
                  <Textarea
                    id="practiceAddress"
                    placeholder="123 Rue Principale, 75001 Paris"
                    value={practiceAddress}
                    onChange={(e) => setPracticeAddress(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="practicePhone">Téléphone</Label>
                  <Input
                    id="practicePhone"
                    placeholder="01 23 45 67 89"
                    value={practicePhone}
                    onChange={(e) => setPracticePhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-center mb-4">
                Vos Informations
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      placeholder="Jean"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      placeholder="Martin"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={userEmail} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Dentiste">Dentiste</option>
                    <option value="Administrateur">Administrateur</option>
                    <option value="Propriétaire">Propriétaire</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-center mb-4">
                Personnel du Cabinet
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Ajoutez les membres de votre équipe (facultatif)
              </p>

              {staffMembers.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-medium">Personnel ajouté:</h4>
                  {staffMembers.map((staff, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">
                          {staff.firstName} {staff.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {staff.role}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveStaffMember(index)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border p-4 rounded-md space-y-4">
                <h4 className="text-sm font-medium">Ajouter un membre</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="staffFirstName">Prénom</Label>
                    <Input
                      id="staffFirstName"
                      value={currentStaffMember.firstName}
                      onChange={(e) =>
                        setCurrentStaffMember({
                          ...currentStaffMember,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffLastName">Nom</Label>
                    <Input
                      id="staffLastName"
                      value={currentStaffMember.lastName}
                      onChange={(e) =>
                        setCurrentStaffMember({
                          ...currentStaffMember,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staffRole">Rôle</Label>
                  <select
                    id="staffRole"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={currentStaffMember.role}
                    onChange={(e) =>
                      setCurrentStaffMember({
                        ...currentStaffMember,
                        role: e.target.value,
                      })
                    }
                  >
                    <option value="Dentiste">Dentiste</option>
                    <option value="Assistante dentaire">
                      Assistante dentaire
                    </option>
                    <option value="Réceptionniste">Réceptionniste</option>
                    <option value="Hygiéniste">Hygiéniste</option>
                    <option value="Administrateur">Administrateur</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="staffEmail">Email</Label>
                    <Input
                      id="staffEmail"
                      type="email"
                      value={currentStaffMember.email}
                      onChange={(e) =>
                        setCurrentStaffMember({
                          ...currentStaffMember,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffPhone">Téléphone</Label>
                    <Input
                      id="staffPhone"
                      value={currentStaffMember.phone}
                      onChange={(e) =>
                        setCurrentStaffMember({
                          ...currentStaffMember,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddStaffMember}
                  disabled={
                    !currentStaffMember.firstName ||
                    !currentStaffMember.lastName
                  }
                >
                  Ajouter
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              Retour
            </Button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <Button onClick={handleNext} disabled={step === 1 && !practiceName}>
              Suivant <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Configuration en cours...
                </>
              ) : (
                <>
                  Terminer <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
