import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { Users, Plus, Pencil, Trash2, Search } from "lucide-react";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
  specialization?: string;
  status: "active" | "inactive";
}

const defaultStaff: StaffMember[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    role: "Dentiste",
    email: "sarah.johnson@example.com",
    phone: "01 23 45 67 89",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    specialization: "Orthodontie",
    status: "active",
  },
  {
    id: "2",
    firstName: "Michel",
    lastName: "Dupont",
    role: "Dentiste",
    email: "michel.dupont@example.com",
    phone: "01 23 45 67 90",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michel",
    specialization: "Chirurgie buccale",
    status: "active",
  },
  {
    id: "3",
    firstName: "Emma",
    lastName: "Martin",
    role: "Assistante dentaire",
    email: "emma.martin@example.com",
    phone: "01 23 45 67 91",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    status: "active",
  },
];

const StaffManagement = () => {
  const [staff, setStaff] = useState<StaffMember[]>(defaultStaff);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    phone: "",
    specialization: "",
    status: "active",
  });

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      const { data, error } = await supabase.from("staff").select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        setStaff(data as StaffMember[]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du personnel:", error);
    }
  };

  const handleAddStaff = async () => {
    try {
      const { data, error } = await supabase
        .from("staff")
        .insert([
          {
            first_name: newStaff.firstName,
            last_name: newStaff.lastName,
            role: newStaff.role,
            email: newStaff.email,
            phone: newStaff.phone,
            specialization: newStaff.specialization,
            status: newStaff.status,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newStaff.firstName}`,
          },
        ])
        .select();

      if (error) throw error;

      if (data) {
        setStaff([...staff, data[0] as unknown as StaffMember]);
        setIsAddDialogOpen(false);
        setNewStaff({
          firstName: "",
          lastName: "",
          role: "",
          email: "",
          phone: "",
          specialization: "",
          status: "active",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un membre du personnel:", error);
    }
  };

  const handleEditStaff = async () => {
    if (!currentStaff) return;

    try {
      const { data, error } = await supabase
        .from("staff")
        .update({
          first_name: currentStaff.firstName,
          last_name: currentStaff.lastName,
          role: currentStaff.role,
          email: currentStaff.email,
          phone: currentStaff.phone,
          specialization: currentStaff.specialization,
          status: currentStaff.status,
        })
        .eq("id", currentStaff.id)
        .select();

      if (error) throw error;

      if (data) {
        setStaff(
          staff.map((member) =>
            member.id === currentStaff.id
              ? (data[0] as unknown as StaffMember)
              : member,
          ),
        );
        setIsEditDialogOpen(false);
        setCurrentStaff(null);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la modification d'un membre du personnel:",
        error,
      );
    }
  };

  const handleDeleteStaff = async () => {
    if (!currentStaff) return;

    try {
      const { error } = await supabase
        .from("staff")
        .delete()
        .eq("id", currentStaff.id);

      if (error) throw error;

      setStaff(staff.filter((member) => member.id !== currentStaff.id));
      setIsDeleteDialogOpen(false);
      setCurrentStaff(null);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression d'un membre du personnel:",
        error,
      );
    }
  };

  const openEditDialog = (member: StaffMember) => {
    setCurrentStaff(member);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (member: StaffMember) => {
    setCurrentStaff(member);
    setIsDeleteDialogOpen(true);
  };

  const filteredStaff = staff.filter((member) =>
    `${member.firstName} ${member.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full h-full bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion du Personnel</h1>
          <p className="text-muted-foreground">
            Gérez les dentistes, assistants et autres membres du personnel
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" /> Ajouter un Membre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Membre</DialogTitle>
              <DialogDescription>
                Entrez les informations du nouveau membre du personnel
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={newStaff.firstName}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={newStaff.lastName}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, lastName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select
                  value={newStaff.role}
                  onValueChange={(value) =>
                    setNewStaff({ ...newStaff, role: value })
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dentiste">Dentiste</SelectItem>
                    <SelectItem value="Assistante dentaire">
                      Assistante dentaire
                    </SelectItem>
                    <SelectItem value="Réceptionniste">
                      Réceptionniste
                    </SelectItem>
                    <SelectItem value="Hygiéniste">Hygiéniste</SelectItem>
                    <SelectItem value="Administrateur">
                      Administrateur
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newStaff.role === "Dentiste" && (
                <div className="space-y-2">
                  <Label htmlFor="specialization">Spécialisation</Label>
                  <Input
                    id="specialization"
                    value={newStaff.specialization}
                    onChange={(e) =>
                      setNewStaff({
                        ...newStaff,
                        specialization: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStaff.email}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={newStaff.phone}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={newStaff.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setNewStaff({ ...newStaff, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleAddStaff}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="text-lg font-medium">
            {staff.length} membres du personnel
          </span>
        </div>
        <div className="relative w-[300px]">
          <Input
            placeholder="Rechercher par nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membre</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Spécialisation</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.firstName[0]}
                            {member.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {member.firstName} {member.lastName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.specialization || "-"}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {member.status === "active" ? "Actif" : "Inactif"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(member)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(member)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Aucun membre du personnel trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le Membre</DialogTitle>
            <DialogDescription>
              Modifiez les informations du membre du personnel
            </DialogDescription>
          </DialogHeader>
          {currentStaff && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName">Prénom</Label>
                  <Input
                    id="edit-firstName"
                    value={currentStaff.firstName}
                    onChange={(e) =>
                      setCurrentStaff({
                        ...currentStaff,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">Nom</Label>
                  <Input
                    id="edit-lastName"
                    value={currentStaff.lastName}
                    onChange={(e) =>
                      setCurrentStaff({
                        ...currentStaff,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Rôle</Label>
                <Select
                  value={currentStaff.role}
                  onValueChange={(value) =>
                    setCurrentStaff({ ...currentStaff, role: value })
                  }
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dentiste">Dentiste</SelectItem>
                    <SelectItem value="Assistante dentaire">
                      Assistante dentaire
                    </SelectItem>
                    <SelectItem value="Réceptionniste">
                      Réceptionniste
                    </SelectItem>
                    <SelectItem value="Hygiéniste">Hygiéniste</SelectItem>
                    <SelectItem value="Administrateur">
                      Administrateur
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {currentStaff.role === "Dentiste" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-specialization">Spécialisation</Label>
                  <Input
                    id="edit-specialization"
                    value={currentStaff.specialization}
                    onChange={(e) =>
                      setCurrentStaff({
                        ...currentStaff,
                        specialization: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={currentStaff.email}
                    onChange={(e) =>
                      setCurrentStaff({
                        ...currentStaff,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Téléphone</Label>
                  <Input
                    id="edit-phone"
                    value={currentStaff.phone}
                    onChange={(e) =>
                      setCurrentStaff({
                        ...currentStaff,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Statut</Label>
                <Select
                  value={currentStaff.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setCurrentStaff({ ...currentStaff, status: value })
                  }
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleEditStaff}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera
              définitivement
              {currentStaff &&
                ` ${currentStaff.firstName} ${currentStaff.lastName}`}{" "}
              de la liste du personnel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStaff}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffManagement;
