import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AlertCircle, ShoppingCart } from "lucide-react";
import { Progress } from "../ui/progress";

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

interface InventoryAlertsProps {
  items?: InventoryItem[];
  onOrderItem?: (itemId: string) => void;
}

const InventoryAlerts = ({
  items = [
    {
      id: "1",
      name: "Dental Composite",
      currentStock: 5,
      minStock: 10,
      maxStock: 50,
      unit: "tubes",
      category: "Restorative",
      lastOrdered: "2023-10-15",
      supplier: "Dental Supplies Co.",
    },
    {
      id: "2",
      name: "Disposable Gloves (M)",
      currentStock: 2,
      minStock: 5,
      maxStock: 20,
      unit: "boxes",
      category: "PPE",
      lastOrdered: "2023-11-01",
      supplier: "Medical Essentials",
    },
    {
      id: "3",
      name: "Anesthetic Solution",
      currentStock: 3,
      minStock: 8,
      maxStock: 30,
      unit: "vials",
      category: "Medication",
      lastOrdered: "2023-10-20",
      supplier: "Pharma Dental",
    },
    {
      id: "4",
      name: "Dental Floss",
      currentStock: 4,
      minStock: 10,
      maxStock: 40,
      unit: "packs",
      category: "Preventive",
      lastOrdered: "2023-09-28",
      supplier: "Oral Care Products",
    },
  ],
  onOrderItem = (itemId) => console.log(`Ordering item ${itemId}`),
}: InventoryAlertsProps) => {
  // Filter items that are below minimum stock level
  const lowStockItems = items.filter(
    (item) => item.currentStock < item.minStock,
  );

  // Calculate stock percentage for progress bar
  const calculateStockPercentage = (current: number, max: number) => {
    return Math.min(Math.round((current / max) * 100), 100);
  };

  // Determine severity based on stock level
  const getStockSeverity = (current: number, min: number) => {
    const ratio = current / min;
    if (ratio < 0.3) return "critical";
    if (ratio < 0.6) return "warning";
    return "normal";
  };

  return (
    <Card className="w-full h-full bg-white overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">
              Inventory Alerts
            </CardTitle>
            <CardDescription>Items that need to be reordered</CardDescription>
          </div>
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {lowStockItems.length} Low Stock
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {lowStockItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
            <div className="rounded-full bg-green-50 p-3 mb-3">
              <ShoppingCart className="h-6 w-6 text-green-500" />
            </div>
            <p>All inventory items are at adequate levels</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
            {lowStockItems.map((item) => {
              const stockPercentage = calculateStockPercentage(
                item.currentStock,
                item.maxStock,
              );
              const severity = getStockSeverity(
                item.currentStock,
                item.minStock,
              );

              return (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                    <Badge
                      variant={
                        severity === "critical"
                          ? "destructive"
                          : severity === "warning"
                            ? "outline"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {item.currentStock} / {item.minStock} {item.unit}
                    </Badge>
                  </div>

                  <div className="mb-2">
                    <Progress
                      value={stockPercentage}
                      className={`h-2 ${severity === "critical" ? "bg-red-100" : severity === "warning" ? "bg-amber-100" : "bg-slate-100"}`}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Last ordered: {item.lastOrdered || "N/A"}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => {
                        const quantity = prompt(
                          `Enter quantity to order for ${item.name}:`,
                        );
                        if (quantity && !isNaN(Number(quantity))) {
                          onOrderItem(item.id);
                          alert(
                            `Ordering ${quantity} ${item.unit} of ${item.name} from ${item.supplier}`,
                          );
                        }
                      }}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Update Stock
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryAlerts;
