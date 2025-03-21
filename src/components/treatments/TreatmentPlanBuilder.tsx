import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  Save,
  Send,
  FileText,
  DollarSign,
  Shield,
  Calendar,
  Edit,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { dataService } from "@/lib/dataService";
import { useToast } from "@/components/ui/use-toast";

interface Procedure {
  id: string;
  name: string;
  code: string;
  cost: number;
  description: string;
  duration: number;
  category: string;
}

interface InsuranceVerification {
  covered: boolean;
  coveragePercent: number;
  patientResponsibility: number;
  notes: string;
}

interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  procedures: Procedure[];
  totalCost: number;
  insuranceVerification?: InsuranceVerification;
  notes: string;
  createdAt: Date;
  status: "draft" | "active" | "completed" | "cancelled";
}

interface TreatmentPlanBuilderProps {
  patientId?: string;
  patientName?: string;
  existingPlan?: TreatmentPlan;
  onSave?: (plan: TreatmentPlan) => void;
  onShare?: (plan: TreatmentPlan) => void;
}

const defaultProcedureTemplates: Procedure[] = [
  {
    id: "proc-1",
    name: "Comprehensive Oral Evaluation",
    code: "D0150",
    cost: 120,
    description:
      "Thorough evaluation and recording of the extraoral and intraoral hard and soft tissues.",
    duration: 30,
    category: "Diagnostic",
  },
  {
    id: "proc-2",
    name: "Periodic Oral Evaluation",
    code: "D0120",
    cost: 65,
    description:
      "An evaluation performed on a patient of record to determine any changes in the patient's dental and medical health status.",
    duration: 20,
    category: "Diagnostic",
  },
  {
    id: "proc-3",
    name: "Full Mouth X-rays",
    code: "D0210",
    cost: 150,
    description:
      "A radiographic survey of the whole mouth, usually consisting of 14-22 periapical and posterior bitewing images.",
    duration: 30,
    category: "Diagnostic",
  },
  {
    id: "proc-4",
    name: "Prophylaxis - Adult",
    code: "D1110",
    cost: 110,
    description:
      "Removal of plaque, calculus and stains from the tooth structures in the permanent and transitional dentition.",
    duration: 45,
    category: "Preventive",
  },
  {
    id: "proc-5",
    name: "Amalgam Filling - One Surface",
    code: "D2140",
    cost: 175,
    description:
      "A restoration used to treat dental caries or other defects, involving one surface of a posterior tooth.",
    duration: 30,
    category: "Restorative",
  },
  {
    id: "proc-6",
    name: "Composite Filling - One Surface, Anterior",
    code: "D2330",
    cost: 195,
    description:
      "A tooth-colored restoration used to treat dental caries or other defects, involving one surface of an anterior tooth.",
    duration: 30,
    category: "Restorative",
  },
  {
    id: "proc-7",
    name: "Crown - Porcelain/Ceramic",
    code: "D2740",
    cost: 1200,
    description:
      "A restoration that covers the entire external portion of the tooth down to the gingiva.",
    duration: 90,
    category: "Restorative",
  },
  {
    id: "proc-8",
    name: "Root Canal - Anterior",
    code: "D3310",
    cost: 850,
    description:
      "Endodontic therapy on an anterior tooth with final restoration.",
    duration: 60,
    category: "Endodontic",
  },
];

const TreatmentPlanBuilder: React.FC<TreatmentPlanBuilderProps> = ({
  patientId = "pat-123",
  patientName = "John Doe",
  existingPlan,
  onSave = () => {},
  onShare = () => {},
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("procedures");
  const [selectedProcedures, setSelectedProcedures] = useState<Procedure[]>(
    existingPlan?.procedures || [],
  );
  const [notes, setNotes] = useState(existingPlan?.notes || "");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [insuranceVerification, setInsuranceVerification] =
    useState<InsuranceVerification>(
      existingPlan?.insuranceVerification || {
        covered: true,
        coveragePercent: 80,
        patientResponsibility: 0,
        notes: "",
      },
    );
  const [procedureTemplates, setProcedureTemplates] = useState<Procedure[]>(
    defaultProcedureTemplates,
  );
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    // Load procedure templates from database
    const loadProcedureTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from("procedure_templates")
          .select("*");

        if (error) throw error;

        if (data && data.length > 0) {
          // Map database fields to our Procedure type
          const templates: Procedure[] = data.map((item) => ({
            id: item.id,
            name: item.name,
            code: item.code,
            cost: item.cost,
            description: item.description,
            duration: item.duration,
            category: item.category,
          }));
          setProcedureTemplates(templates);
        } else {
          // If no templates in database, initialize with defaults
          const initialTemplates = defaultProcedureTemplates.map(
            (template) => ({
              ...template,
              id: template.id.startsWith("proc-")
                ? template.id
                : `proc-${template.id}`,
            }),
          );

          // Save default templates to database
          for (const template of initialTemplates) {
            await supabase.from("procedure_templates").insert({
              id: template.id,
              name: template.name,
              code: template.code,
              cost: template.cost,
              description: template.description,
              duration: template.duration,
              category: template.category,
            });
          }

          setProcedureTemplates(initialTemplates);
        }
      } catch (error) {
        console.error("Error loading procedure templates:", error);
        // Fall back to default templates if database fetch fails
        setProcedureTemplates(defaultProcedureTemplates);
      }
    };

    loadProcedureTemplates();

    // If we have an existing plan, load its procedures from the database
    if (existingPlan?.id) {
      loadTreatmentProcedures(existingPlan.id);
    }
  }, [existingPlan?.id]);

  const loadTreatmentProcedures = async (planId: string) => {
    try {
      const procedures = await dataService.treatmentPlans.getProcedures(planId);
      if (procedures && procedures.length > 0) {
        setSelectedProcedures(
          procedures.map((proc) => ({
            id: proc.id,
            name: proc.name,
            code: proc.code,
            cost: proc.cost,
            description: proc.description,
            duration: proc.duration,
            category: proc.category,
          })),
        );
      }
    } catch (error) {
      console.error("Error loading treatment procedures:", error);
    }
  };

  const filteredProcedures = procedureTemplates.filter((proc) => {
    const matchesCategory =
      filterCategory === "all" || proc.category === filterCategory;
    const matchesSearch =
      proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openEditDialog = (procedure: Procedure) => {
    setEditingProcedure({ ...procedure });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProcedure = async () => {
    if (!editingProcedure) return;

    try {
      // Update in database
      const { error } = await supabase
        .from("procedure_templates")
        .update({
          name: editingProcedure.name,
          code: editingProcedure.code,
          cost: editingProcedure.cost,
          description: editingProcedure.description,
          duration: editingProcedure.duration,
          category: editingProcedure.category,
          updated_at: new Date(),
        })
        .eq("id", editingProcedure.id);

      if (error) throw error;

      // Update local state
      setProcedureTemplates(
        procedureTemplates.map((proc) =>
          proc.id === editingProcedure.id ? editingProcedure : proc,
        ),
      );

      // Also update any selected procedures with this template
      setSelectedProcedures(
        selectedProcedures.map((proc) =>
          proc.id === editingProcedure.id ? editingProcedure : proc,
        ),
      );

      setIsEditDialogOpen(false);
      setEditingProcedure(null);

      toast({
        title: "Procédure mise à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error("Error updating procedure:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur s'est produite lors de la mise à jour de la procédure.",
        variant: "destructive",
      });
    }
  };

  const addProcedure = (procedure: Procedure) => {
    setSelectedProcedures([...selectedProcedures, procedure]);
  };

  const removeProcedure = (procedureId: string) => {
    setSelectedProcedures(
      selectedProcedures.filter((p) => p.id !== procedureId),
    );
  };

  const calculateTotalCost = () => {
    return selectedProcedures.reduce((sum, proc) => sum + proc.cost, 0);
  };

  const calculatePatientResponsibility = () => {
    const totalCost = calculateTotalCost();
    return totalCost * (1 - insuranceVerification.coveragePercent / 100);
  };

  const handleSave = async () => {
    try {
      const planId = existingPlan?.id || `plan-${Date.now()}`;

      // Save the treatment plan to the database
      const planData = {
        id: planId,
        patient_id: patientId,
        name: `Plan for ${patientName}`,
        total_cost: calculateTotalCost(),
        notes: notes,
        status: existingPlan?.status || "draft",
      };

      // Create or update the treatment plan
      if (existingPlan?.id) {
        await dataService.update("treatment_plans", existingPlan.id, planData);
      } else {
        await dataService.create("treatment_plans", planData);
      }

      // Save the procedures
      await dataService.treatmentPlans.saveProcedures(
        planId,
        selectedProcedures,
      );

      // Create the plan object to return to the caller
      const plan: TreatmentPlan = {
        id: planId,
        patientId,
        patientName,
        procedures: selectedProcedures,
        totalCost: calculateTotalCost(),
        insuranceVerification,
        notes,
        createdAt: existingPlan?.createdAt || new Date(),
        status: existingPlan?.status || "draft",
      };

      onSave(plan);

      toast({
        title: "Plan de traitement enregistré",
        description: "Le plan de traitement a été enregistré avec succès.",
      });
    } catch (error) {
      console.error("Error saving treatment plan:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur s'est produite lors de l'enregistrement du plan de traitement.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      // First save the plan
      await handleSave();

      const plan: TreatmentPlan = {
        id: existingPlan?.id || `plan-${Date.now()}`,
        patientId,
        patientName,
        procedures: selectedProcedures,
        totalCost: calculateTotalCost(),
        insuranceVerification,
        notes,
        createdAt: existingPlan?.createdAt || new Date(),
        status: existingPlan?.status || "draft",
      };

      onShare(plan);

      toast({
        title: "Plan de traitement partagé",
        description: "Le plan de traitement a été partagé avec le patient.",
      });
    } catch (error) {
      console.error("Error sharing treatment plan:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur s'est produite lors du partage du plan de traitement.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full h-full bg-white p-6 overflow-auto">
      {/* Edit Procedure Dialog */}
      {isEditDialogOpen && editingProcedure && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Modifier la procédure</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="proc-name">Nom</Label>
                <Input
                  id="proc-name"
                  value={editingProcedure.name}
                  onChange={(e) =>
                    setEditingProcedure({
                      ...editingProcedure,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="proc-code">Code</Label>
                <Input
                  id="proc-code"
                  value={editingProcedure.code}
                  onChange={(e) =>
                    setEditingProcedure({
                      ...editingProcedure,
                      code: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="proc-cost">Coût ($)</Label>
                <Input
                  id="proc-cost"
                  type="number"
                  value={editingProcedure.cost}
                  onChange={(e) =>
                    setEditingProcedure({
                      ...editingProcedure,
                      cost: parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="proc-duration">Durée (min)</Label>
                <Input
                  id="proc-duration"
                  type="number"
                  value={editingProcedure.duration}
                  onChange={(e) =>
                    setEditingProcedure({
                      ...editingProcedure,
                      duration: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="proc-category">Catégorie</Label>
                <Select
                  value={editingProcedure.category}
                  onValueChange={(value) =>
                    setEditingProcedure({
                      ...editingProcedure,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                    <SelectItem value="Preventive">Préventif</SelectItem>
                    <SelectItem value="Restorative">Restauration</SelectItem>
                    <SelectItem value="Endodontic">Endodontie</SelectItem>
                    <SelectItem value="Periodontic">Parodontie</SelectItem>
                    <SelectItem value="Prosthodontic">Prothèse</SelectItem>
                    <SelectItem value="Oral Surgery">Chirurgie</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="proc-description">Description</Label>
                <Textarea
                  id="proc-description"
                  value={editingProcedure.description}
                  onChange={(e) =>
                    setEditingProcedure({
                      ...editingProcedure,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleUpdateProcedure}>Enregistrer</Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Treatment Plan Builder</h1>
          <p className="text-gray-500">Patient: {patientName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Plan
          </Button>
          <Button onClick={handleShare}>
            <Send className="mr-2 h-4 w-4" />
            Share with Patient
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="procedures">
            <FileText className="mr-2 h-4 w-4" />
            Procedures
          </TabsTrigger>
          <TabsTrigger value="cost">
            <DollarSign className="mr-2 h-4 w-4" />
            Cost Estimate
          </TabsTrigger>
          <TabsTrigger value="insurance">
            <Shield className="mr-2 h-4 w-4" />
            Insurance Verification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="procedures" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Procedure Templates</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <Input
                    placeholder="Search procedures..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                      <SelectItem value="Preventive">Preventive</SelectItem>
                      <SelectItem value="Restorative">Restorative</SelectItem>
                      <SelectItem value="Endodontic">Endodontic</SelectItem>
                      <SelectItem value="Periodontic">Periodontic</SelectItem>
                      <SelectItem value="Prosthodontic">
                        Prosthodontic
                      </SelectItem>
                      <SelectItem value="Oral Surgery">Oral Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                {filteredProcedures.length > 0 ? (
                  <div className="space-y-2">
                    {filteredProcedures.map((procedure) => (
                      <Card key={procedure.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{procedure.name}</h3>
                              <Badge variant="outline">{procedure.code}</Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {procedure.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm">${procedure.cost}</span>
                              <span className="text-sm flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {procedure.duration} min
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditDialog(procedure)}
                              className="h-8 w-8 p-0"
                              title="Edit procedure"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => addProcedure(procedure)}
                              className="h-8 w-8 p-0"
                              title="Add to plan"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No procedures found matching your criteria
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Procedures</CardTitle>
                <p className="text-sm text-gray-500">
                  {selectedProcedures.length} procedure(s) selected
                </p>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                {selectedProcedures.length > 0 ? (
                  <div className="space-y-2">
                    {selectedProcedures.map((procedure) => (
                      <Card key={procedure.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{procedure.name}</h3>
                              <Badge variant="outline">{procedure.code}</Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm font-medium">
                                ${procedure.cost}
                              </span>
                              <span className="text-sm">
                                {procedure.duration} min
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeProcedure(procedure.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No procedures selected yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Treatment Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes about this treatment plan..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Estimate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Procedure Costs</h3>
                  {selectedProcedures.length > 0 ? (
                    <div className="space-y-2">
                      {selectedProcedures.map((procedure) => (
                        <div
                          key={procedure.id}
                          className="flex justify-between py-2 border-b last:border-0"
                        >
                          <div>
                            <span>{procedure.name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              {procedure.code}
                            </span>
                          </div>
                          <span className="font-medium">${procedure.cost}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No procedures selected yet</p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Total Cost:</span>
                  <span className="text-xl font-bold">
                    ${calculateTotalCost()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">
                    Estimated Insurance Coverage:
                  </span>
                  <span className="font-medium text-green-600">
                    $
                    {(
                      calculateTotalCost() *
                      (insuranceVerification.coveragePercent / 100)
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-t pt-4">
                  <span className="text-lg font-bold">
                    Patient Responsibility:
                  </span>
                  <span className="text-xl font-bold">
                    ${calculatePatientResponsibility().toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="covered"
                    checked={insuranceVerification.covered}
                    onCheckedChange={(checked) =>
                      setInsuranceVerification({
                        ...insuranceVerification,
                        covered: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="covered">
                    Procedures covered by insurance
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverage-percent">Coverage Percentage</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="coverage-percent"
                      type="number"
                      min="0"
                      max="100"
                      value={insuranceVerification.coveragePercent}
                      onChange={(e) =>
                        setInsuranceVerification({
                          ...insuranceVerification,
                          coveragePercent: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-24"
                    />
                    <span>%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insurance-notes">Insurance Notes</Label>
                  <Textarea
                    id="insurance-notes"
                    placeholder="Add notes about insurance coverage..."
                    value={insuranceVerification.notes}
                    onChange={(e) =>
                      setInsuranceVerification({
                        ...insuranceVerification,
                        notes: e.target.value,
                      })
                    }
                    className="min-h-[120px]"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg mt-4">
                  <h3 className="font-medium mb-2">Coverage Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Treatment Cost:</span>
                      <span className="font-medium">
                        ${calculateTotalCost()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Insurance Coverage:</span>
                      <span className="font-medium text-green-600">
                        $
                        {(
                          calculateTotalCost() *
                          (insuranceVerification.coveragePercent / 100)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t mt-2">
                      <span className="font-bold">Patient Responsibility:</span>
                      <span className="font-bold">
                        ${calculatePatientResponsibility().toFixed(2)}
                      </span>
                    </div>
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

export default TreatmentPlanBuilder;
