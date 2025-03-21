import React, { useState, useEffect, useCallback } from "react";
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
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import InventoryForm from "./InventoryForm";

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  const fetchInventoryItems = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("inventory").select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        // Map database fields to our InventoryItem type
        const inventoryItems: InventoryItem[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          currentStock: item.current_stock,
          minStock: item.min_stock,
          maxStock: item.max_stock,
          unit: item.unit,
          category: item.category,
          lastOrdered: item.last_ordered,
          supplier: item.supplier,
        }));
        setItems(inventoryItems);
      } else if (data && data.length === 0) {
        // If no items in database, initialize with defaults
        for (const item of defaultItems) {
          await supabase.from("inventory").insert({
            id: item.id,
            name: item.name,
            current_stock: item.currentStock,
            min_stock: item.minStock,
            max_stock: item.maxStock,
            unit: item.unit,
            category: item.category,
            supplier: item.supplier,
            last_ordered: item.lastOrdered,
          });
        }
        setItems(defaultItems);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des articles d'inventaire:",
        error,
      );
    }
  }, []);

  useEffect(() => {
    fetchInventoryItems();

    // Set up realtime subscription for inventory changes
    const inventorySubscription = supabase
      .channel("inventory-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory" },
        (payload) => {
          fetchInventoryItems();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(inventorySubscription);
    };
  }, [fetchInventoryItems]);

  const handleSaveItem = async (savedItem: InventoryItem) => {
    try {
      if (formMode === "add") {
        // Create new item in database
        const { error } = await supabase.from("inventory").insert({
          name: savedItem.name,
          current_stock: savedItem.currentStock,
          min_stock: savedItem.minStock,
          max_stock: savedItem.maxStock,
          unit: savedItem.unit,
          category: savedItem.category,
          supplier: savedItem.supplier,
          last_ordered: savedItem.lastOrdered,
        });

        if (error) throw error;
      } else {
        // Update existing item
        const { error } = await supabase
          .from("inventory")
          .update({
            name: savedItem.name,
            current_stock: savedItem.currentStock,
            min_stock: savedItem.minStock,
            max_stock: savedItem.maxStock,
            unit: savedItem.unit,
            category: savedItem.category,
            supplier: savedItem.supplier,
            last_ordered: savedItem.lastOrdered,
            updated_at: new Date(),
          })
          .eq("id", savedItem.id);

        if (error) throw error;
      }

      // Update will happen via realtime subscription
      setIsFormOpen(false);
      setCurrentItem(null);
    } catch (error) {
      console.error("Error saving inventory item:", error);
    }
  };

  const openAddForm = () => {
    setFormMode("add");
    setCurrentItem(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item: InventoryItem) => {
    setFormMode("edit");
    setCurrentItem(item);
    setIsFormOpen(true);
  };

  const handleUpdateStock = (item: InventoryItem) => {
    const quantity = prompt(`Enter new stock quantity for ${item.name}:`);
    if (quantity && !isNaN(Number(quantity))) {
      const newQuantity = Number(quantity);
      const updatedItem = {
        ...item,
        currentStock: newQuantity,
        lastOrdered: new Date().toISOString().split("T")[0],
      };

      // Update in database - ensure ID is properly handled
      supabase
        .from("inventory")
        .update({
          current_stock: newQuantity,
          last_ordered: new Date().toISOString().split("T")[0],
          updated_at: new Date(),
        })
        .eq("id", item.id.toString())
        .then(({ error }) => {
          if (error) {
            console.error("Error updating stock:", error);
            alert(`Error updating stock: ${error.message}`);
          } else {
            // Update UI
            setItems(items.map((i) => (i.id === item.id ? updatedItem : i)));
            alert(`Stock updated for ${item.name} to ${quantity} ${item.unit}`);
          }
        });
    }
  };

  const openDeleteDialog = (item: InventoryItem) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
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
        <Button className="gap-1" onClick={openAddForm}>
          <Plus className="h-4 w-4" /> Ajouter un Article
        </Button>
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
                          onClick={() => handleUpdateStock(item)}
                          title="Update Stock"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditForm(item)}
                          title="Edit Item"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(item)}
                          title="Delete Item"
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

      {/* Inventory Form Dialog */}
      <InventoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        item={currentItem}
        onSave={handleSaveItem}
        mode={formMode}
      />

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
