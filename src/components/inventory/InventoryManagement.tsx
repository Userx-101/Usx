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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { Package, Plus, Pencil, Trash2, AlertCircle } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  category: string;
  lastOrdered?: string;
  supplier?: string;
}

const defaultItems: InventoryItem[] = [
  {
    id: "1",
    name: "Composite Dentaire",
    currentStock: 15,
    minStock: 10,
    maxStock: 100,
    unit: "unités",
    category: "Matériaux de restauration",
    lastOrdered: "2023-10-15",
    supplier: "Fournitures Dentaires Co.",
  },
  {
    id: "2",
    name: "Anesthésique Dentaire",
    currentStock: 8,
    minStock: 10,
    maxStock: 50,
    unit: "boîtes",
    category: "Médicaments",
    lastOrdered: "2023-09-22",
    supplier: "MedDental Inc.",
  },
  {
    id: "3",
    name: "Gants Jetables",
    currentStock: 5,
    minStock: 20,
    maxStock: 200,
    unit: "boîtes",
    category: "EPI",
    lastOrdered: "2023-10-05",
    supplier: "PremierSecours Médical",
  },
];

const InventoryManagement = () => {
  const [items, setItems] = useState<InventoryItem[]>(defaultItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: "",
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: "",
    category: "",
    supplier: "",
  });

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const { data, error } = await supabase.from("inventory").select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        setItems(data as InventoryItem[]);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des articles d'inventaire:",
        error,
      );
    }
  };

  const handleAddItem = async () => {
    try {
      const { data, error } = await supabase
        .from("inventory")
        .insert([
          {
            name: newItem.name,
            current_stock: newItem.currentStock,
            min_stock: newItem.minStock,
            max_stock: newItem.maxStock,
            unit: newItem.unit,
            category: newItem.category,
            supplier: newItem.supplier,
            last_ordered: new Date().toISOString().split("T")[0],
          },
        ])
        .select();

      if (error) throw error;

      if (data) {
        setItems([...items, data[0] as unknown as InventoryItem]);
        setIsAddDialogOpen(false);
        setNewItem({
          name: "",
          currentStock: 0,
          minStock: 0,
          maxStock: 0,
          unit: "",
          category: "",
          supplier: "",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un article:", error);
    }
  };

  const handleEditItem = async () => {
    if (!currentItem) return;

    try {
      const { data, error } = await supabase
        .from("inventory")
        .update({
          name: currentItem.name,
          current_stock: currentItem.currentStock,
          min_stock: currentItem.minStock,
          max_stock: currentItem.maxStock,
          unit: currentItem.unit,
          category: currentItem.category,
          supplier: currentItem.supplier,
        })
        .eq("id", currentItem.id)
        .select();

      if (error) throw error;

      if (data) {
        setItems(
          items.map((item) =>
            item.id === currentItem.id
              ? (data[0] as unknown as InventoryItem)
              : item,
          ),
        );
        setIsEditDialogOpen(false);
        setCurrentItem(null);
      }
    } catch (error) {
      console.error("Erreur lors de la modification d'un article:", error);
    }
  };

  const handleDeleteItem = async () => {
    if (!currentItem) return;

    try {
      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", currentItem.id);

      if (error) throw error;

      setItems(items.filter((item) => item.id !== currentItem.id));
      setIsDeleteDialogOpen(false);
      setCurrentItem(null);
    } catch (error) {
      console.error("Erreur lors de la suppression d'un article:", error);
    }
  };

  const openEditDialog = (item: InventoryItem) => {
    setCurrentItem(item);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (item: InventoryItem) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "low-stock" && item.currentStock <= item.minStock);

    return matchesSearch && matchesTab;
  });

  return (
    <div className="w-full h-full bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion de l'Inventaire</h1>
          <p className="text-muted-foreground">
            Gérez les fournitures et le matériel de la clinique
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" /> Ajouter un Article
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un Nouvel Article</DialogTitle>
              <DialogDescription>
                Entrez les détails du nouvel article d'inventaire
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'Article</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Input
                    id="category"
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentStock">Stock Actuel</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    value={newItem.currentStock}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        currentStock: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Stock Minimum</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={newItem.minStock}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        minStock: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStock">Stock Maximum</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    value={newItem.maxStock}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        maxStock: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Unité</Label>
                  <Input
                    id="unit"
                    value={newItem.unit}
                    onChange={(e) =>
                      setNewItem({ ...newItem, unit: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Fournisseur</Label>
                  <Input
                    id="supplier"
                    value={newItem.supplier}
                    onChange={(e) =>
                      setNewItem({ ...newItem, supplier: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleAddItem}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between mb-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-[400px]"
        >
          <TabsList>
            <TabsTrigger value="all">Tous les Articles</TabsTrigger>
            <TabsTrigger value="low-stock">Stock Faible</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-[300px]">
          <Input
            placeholder="Rechercher des articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom de l'Article</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Stock Actuel</TableHead>
                <TableHead>Stock Min/Max</TableHead>
                <TableHead>Unité</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead>Dernière Commande</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {item.currentStock <= item.minStock && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <span
                        className={`${item.currentStock <= item.minStock ? "text-red-500 font-medium" : ""}`}
                      >
                        {item.currentStock}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.minStock} / {item.maxStock}
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{item.lastOrdered}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    Aucun article trouvé
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
            <DialogTitle>Modifier l'Article</DialogTitle>
            <DialogDescription>
              Modifiez les détails de l'article d'inventaire
            </DialogDescription>
          </DialogHeader>
          {currentItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nom de l'Article</Label>
                  <Input
                    id="edit-name"
                    value={currentItem.name}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Catégorie</Label>
                  <Input
                    id="edit-category"
                    value={currentItem.category}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        category: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-currentStock">Stock Actuel</Label>
                  <Input
                    id="edit-currentStock"
                    type="number"
                    value={currentItem.currentStock}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        currentStock: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minStock">Stock Minimum</Label>
                  <Input
                    id="edit-minStock"
                    type="number"
                    value={currentItem.minStock}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        minStock: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-maxStock">Stock Maximum</Label>
                  <Input
                    id="edit-maxStock"
                    type="number"
                    value={currentItem.maxStock}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        maxStock: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-unit">Unité</Label>
                  <Input
                    id="edit-unit"
                    value={currentItem.unit}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        unit: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-supplier">Fournisseur</Label>
                  <Input
                    id="edit-supplier"
                    value={currentItem.supplier}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        supplier: e.target.value,
                      })
                    }
                  />
                </div>
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
            <Button onClick={handleEditItem}>Enregistrer</Button>
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
              définitivement l'article {currentItem?.name} de l'inventaire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteItem}
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

export default InventoryManagement;
