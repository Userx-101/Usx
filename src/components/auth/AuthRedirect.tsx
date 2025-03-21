import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import OnboardingWizard from "../onboarding/OnboardingWizard";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState<{
    id: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          navigate("/signin");
          return;
        }

        const userId = session.user.id;
        const userEmail = session.user.email || "";

        // Check if user has completed onboarding
        const { data: settings, error: settingsError } = await supabase
          .from("user_settings")
          .select("onboarding_completed")
          .eq("user_id", userId)
          .single();

        if (settingsError && settingsError.code !== "PGRST116") {
          console.error("Error checking user settings:", settingsError);
          // Continue with onboarding even if there's an error checking settings
        }

        // If no settings or onboarding not completed, show onboarding
        if (!settings || settings.onboarding_completed !== true) {
          setUserData({ id: userId, email: userEmail });
          setShowOnboarding(true);
          setLoading(false);
          return;
        }

        // Otherwise redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Auth redirect error:", error);
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding && userData) {
    return <OnboardingWizard userId={userData.id} userEmail={userData.email} />;
  }

  return null;
};

export default AuthRedirect;
