import React, { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  FileText,
  Image,
  File,
  Upload,
  Download,
  Trash2,
  Eye,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/auth/AuthProvider";

interface PatientFilesProps {
  patientId: string;
}

interface PatientFile {
  id: string;
  file_name: string;
  file_type: string;
  file_category: string;
  file_path: string;
  description: string;
  created_at: string;
}

const PatientFiles = ({ patientId }: PatientFilesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<PatientFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<PatientFile | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [fileCategory, setFileCategory] = useState<string>("xray");
  const [fileDescription, setFileDescription] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    fetchPatientFiles();
  }, [patientId]);

  const fetchPatientFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("patient_files")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      console.error("Error fetching patient files:", error.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les fichiers du patient",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!fileToUpload || !user) return;

    try {
      setUploading(true);

      // 1. Upload file to storage
      const fileExt = fileToUpload.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `patients/${patientId}/${fileCategory}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("patient-files")
        .upload(filePath, fileToUpload);

      if (uploadError) throw uploadError;

      // 2. Create record in patient_files table
      const { error: dbError } = await supabase.from("patient_files").insert({
        patient_id: patientId,
        file_name: fileToUpload.name,
        file_type: fileToUpload.type,
        file_category: fileCategory,
        file_path: filePath,
        description: fileDescription,
        uploaded_by: user.id,
      });

      if (dbError) throw dbError;

      toast({
        title: "Fichier téléchargé",
        description: "Le fichier a été téléchargé avec succès",
      });

      // Reset form and refresh files
      setFileToUpload(null);
      setFileCategory("xray");
      setFileDescription("");
      setUploadDialogOpen(false);
      fetchPatientFiles();
    } catch (error: any) {
      console.error("Error uploading file:", error.message);
      toast({
        title: "Erreur",
        description: `Erreur lors du téléchargement: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = async (file: PatientFile) => {
    try {
      const { data, error } = await supabase.storage
        .from("patient-files")
        .download(file.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error("Error downloading file:", error.message);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier",
        variant: "destructive",
      });
    }
  };

  const deleteFile = async (file: PatientFile) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) return;

    try {
      // 1. Delete from storage
      const { error: storageError } = await supabase.storage
        .from("patient-files")
        .remove([file.file_path]);

      if (storageError) throw storageError;

      // 2. Delete from database
      const { error: dbError } = await supabase
        .from("patient_files")
        .delete()
        .eq("id", file.id);

      if (dbError) throw dbError;

      toast({
        title: "Fichier supprimé",
        description: "Le fichier a été supprimé avec succès",
      });

      fetchPatientFiles();
    } catch (error: any) {
      console.error("Error deleting file:", error.message);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le fichier",
        variant: "destructive",
      });
    }
  };

  const viewFile = async (file: PatientFile) => {
    setSelectedFile(file);
    setViewDialogOpen(true);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return <Image className="h-5 w-5" />;
    if (fileType.includes("pdf")) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "xray":
        return "Radiographie";
      case "invoice":
        return "Facture";
      case "prescription":
        return "Ordonnance";
      case "consent":
        return "Consentement";
      case "other":
        return "Autre";
      default:
        return category;
    }
  };

  const filteredFiles =
    activeTab === "all"
      ? files
      : files.filter((file) => file.file_category === activeTab);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Fichiers du Patient</h3>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Ajouter un Fichier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Télécharger un Fichier</DialogTitle>
              <DialogDescription>
                Ajoutez une radiographie, une facture ou un autre document au
                dossier du patient.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="file">Fichier</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={fileCategory} onValueChange={setFileCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xray">Radiographie</SelectItem>
                    <SelectItem value="invoice">Facture</SelectItem>
                    <SelectItem value="prescription">Ordonnance</SelectItem>
                    <SelectItem value="consent">Consentement</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description du fichier"
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setUploadDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={uploadFile}
                disabled={!fileToUpload || uploading}
              >
                {uploading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>{" "}
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" /> Télécharger
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="xray">Radiographies</TabsTrigger>
          <TabsTrigger value="invoice">Factures</TabsTrigger>
          <TabsTrigger value="prescription">Ordonnances</TabsTrigger>
          <TabsTrigger value="other">Autres</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Aucun fichier trouvé. Cliquez sur "Ajouter un Fichier" pour
                  télécharger des documents.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFiles.map((file) => (
                  <Card key={file.id} className="overflow-hidden">
                    <div className="flex items-center p-4">
                      <div className="mr-4 bg-muted rounded-md p-2">
                        {getFileIcon(file.file_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">
                            {file.file_name}
                          </h4>
                          <Badge variant="outline">
                            {getCategoryLabel(file.file_category)}
                          </Badge>
                        </div>
                        {file.description && (
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {file.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(file.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-1 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewFile(file)}
                          title="Voir"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => downloadFile(file)}
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFile(file)}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* File Viewer Dialog */}
      {selectedFile && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedFile.file_name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewDialogOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {selectedFile.file_type.includes("image") ? (
                <img
                  src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/patient-files/${selectedFile.file_path}`}
                  alt={selectedFile.file_name}
                  className="max-h-[60vh] mx-auto"
                />
              ) : selectedFile.file_type.includes("pdf") ? (
                <iframe
                  src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/patient-files/${selectedFile.file_path}`}
                  className="w-full h-[60vh]"
                  title={selectedFile.file_name}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <File className="h-16 w-16 text-muted-foreground mb-4" />
                  <p>Ce type de fichier ne peut pas être prévisualisé.</p>
                  <Button
                    onClick={() => downloadFile(selectedFile)}
                    className="mt-4"
                  >
                    <Download className="h-4 w-4 mr-2" /> Télécharger le fichier
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <div className="w-full flex justify-between items-center">
                <div>
                  <Badge variant="outline">
                    {getCategoryLabel(selectedFile.file_category)}
                  </Badge>
                  {selectedFile.description && (
                    <p className="text-sm mt-2">{selectedFile.description}</p>
                  )}
                </div>
                <Button
                  onClick={() => downloadFile(selectedFile)}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" /> Télécharger
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PatientFiles;
