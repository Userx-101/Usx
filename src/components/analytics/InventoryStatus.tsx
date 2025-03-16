import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowUpRight, Package } from "lucide-react";

interface InventoryItemProps {
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  category: string;
  lastOrdered?: string;
  supplier?: string;
}

const InventoryItem = ({
  name = "Composite Dentaire",
  currentStock = 15,
  minStock = 10,
  maxStock = 100,
  unit = "unités",
  category = "Matériaux de restauration",
  lastOrdered = "2023-10-15",
  supplier = "Fournitures Dentaires Co.",
}: InventoryItemProps) => {
  const stockPercentage = Math.min(
    Math.round((currentStock / maxStock) * 100),
    100,
  );
  const isLowStock = currentStock <= minStock;

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">{name}</h4>
          {isLowStock && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              <AlertCircle className="w-3 h-3 mr-1" />
              Stock Faible
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">{category}</div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Progress value={stockPercentage} className="h-2 w-24" />
          <span className="text-sm">
            {currentStock}/{maxStock} {unit}
          </span>
        </div>
      </div>
      <div className="flex-1 text-sm">
        <div>Dernière commande: {lastOrdered}</div>
        <div className="text-xs text-gray-500">{supplier}</div>
      </div>
    </div>
  );
};

interface InventoryStatusProps {
  items?: InventoryItemProps[];
  lowStockCount?: number;
  totalItems?: number;
  reorderNeeded?: number;
}

const InventoryStatus = ({
  items = [
    {
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
      name: "Gants Jetables",
      currentStock: 5,
      minStock: 20,
      maxStock: 200,
      unit: "boîtes",
      category: "EPI",
      lastOrdered: "2023-10-05",
      supplier: "PremierSecours Médical",
    },
    {
      name: "Matériau d'Empreinte Dentaire",
      currentStock: 12,
      minStock: 8,
      maxStock: 40,
      unit: "kits",
      category: "Matériaux d'Empreinte",
      lastOrdered: "2023-10-10",
      supplier: "Fournitures Dentaires Co.",
    },
    {
      name: "Pochettes de Stérilisation",
      currentStock: 30,
      minStock: 25,
      maxStock: 100,
      unit: "paquets",
      category: "Stérilisation",
      lastOrdered: "2023-09-15",
      supplier: "PremierSecours Médical",
    },
  ],
  lowStockCount = 2,
  totalItems = 120,
  reorderNeeded = 8,
}: InventoryStatusProps) => {
  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">
              État de l'Inventaire
            </CardTitle>
            <CardDescription>Suivez les niveaux de fournitures</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Package className="h-4 w-4" /> Gérer l'Inventaire
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Total des Articles
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{totalItems}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">
                    Stock Faible
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{lowStockCount}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">
                    À Réapprovisionner
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{reorderNeeded}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="low-stock" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="low-stock">Stock Faible</TabsTrigger>
            <TabsTrigger value="all-items">Tous les Articles</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
          </TabsList>

          <TabsContent value="low-stock" className="mt-0">
            <div className="rounded-md border">
              {items
                .filter((item) => item.currentStock <= item.minStock)
                .map((item, index) => (
                  <InventoryItem key={index} {...item} />
                ))}
            </div>
            {items.filter((item) => item.currentStock <= item.minStock)
              .length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun article n'est actuellement en stock faible
              </div>
            )}
          </TabsContent>

          <TabsContent value="all-items" className="mt-0">
            <div className="rounded-md border">
              {items.map((item, index) => (
                <InventoryItem key={index} {...item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <div className="grid grid-cols-2 gap-4">
              {Array.from(new Set(items.map((item) => item.category))).map(
                (category, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold">
                        {
                          items.filter((item) => item.category === category)
                            .length
                        }{" "}
                        articles
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-red-600">
                          {
                            items.filter(
                              (item) =>
                                item.category === category &&
                                item.currentStock <= item.minStock,
                            ).length
                          }{" "}
                          stock faible
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          Voir <ArrowUpRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InventoryStatus;
