import React, { useState } from "react";
import TreatmentPlansList from "./TreatmentPlansList";
import TreatmentPlanBuilder from "./TreatmentPlanBuilder";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  procedures: any[];
  totalCost: number;
  insuranceVerification?: {
    covered: boolean;
    coveragePercent: number;
    patientResponsibility: number;
    notes: string;
  };
  notes: string;
  createdAt: Date;
  status: "draft" | "active" | "completed" | "cancelled";
}

interface TreatmentPlansProps {
  onBack?: () => void;
}

const TreatmentPlans: React.FC<TreatmentPlansProps> = ({
  onBack = () => {},
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setIsCreatingPlan(false);
  };

  const handleCreatePlan = () => {
    setSelectedPlanId(null);
    setIsCreatingPlan(true);
  };

  const handleSavePlan = (plan: TreatmentPlan) => {
    // If plan already exists, update it
    if (plans.some((p) => p.id === plan.id)) {
      setPlans(plans.map((p) => (p.id === plan.id ? plan : p)));
    } else {
      // Otherwise add new plan
      setPlans([...plans, plan]);
    }

    // Return to list view
    setIsCreatingPlan(false);
    setSelectedPlanId(null);
  };

  const handleSharePlan = (plan: TreatmentPlan) => {
    // In a real implementation, this would trigger sharing functionality
    console.log("Sharing plan with patient:", plan);

    // Make sure the plan is saved
    handleSavePlan(plan);
  };

  const handleBackToList = () => {
    setSelectedPlanId(null);
    setIsCreatingPlan(false);
  };

  // Find the selected plan if there is one
  const selectedPlan = selectedPlanId
    ? plans.find((p) => p.id === selectedPlanId)
    : undefined;

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      {/* Header with back button when viewing/creating a plan */}
      {(selectedPlanId || isCreatingPlan) && (
        <div className="p-4 bg-white border-b">
          <Button variant="ghost" onClick={handleBackToList} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Treatment Plans
          </Button>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {!selectedPlanId && !isCreatingPlan ? (
          // List view
          <div className="h-full">
            <TreatmentPlansList
              onSelectPlan={handleSelectPlan}
              onCreatePlan={handleCreatePlan}
            />
          </div>
        ) : isCreatingPlan ? (
          // Create new plan view
          <TreatmentPlanBuilder
            onSave={handleSavePlan}
            onShare={handleSharePlan}
          />
        ) : (
          // Edit existing plan view
          <TreatmentPlanBuilder
            existingPlan={selectedPlan}
            patientId={selectedPlan?.patientId}
            patientName={selectedPlan?.patientName}
            onSave={handleSavePlan}
            onShare={handleSharePlan}
          />
        )}
      </div>
    </div>
  );
};

export default TreatmentPlans;
