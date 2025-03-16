import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PatientSearchProps {
  onSearch?: (query: string, filters: PatientSearchFilters) => void;
  className?: string;
}

interface PatientSearchFilters {
  status?: string;
  insuranceProvider?: string;
  lastVisit?: string;
}

const PatientSearch = ({ onSearch, className = "" }: PatientSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<PatientSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch?.(searchQuery, activeFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const applyFilter = (type: keyof PatientSearchFilters, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const removeFilter = (type: keyof PatientSearchFilters) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[type];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  return (
    <div className={`w-full bg-white p-4 rounded-lg shadow-sm ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search patients by name, ID, phone number..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-gray-100" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Filter patients</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button onClick={handleSearch}>Search</Button>
      </div>

      {showFilters && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium">Filters</h3>
            {Object.keys(activeFilters).length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium mb-1 block">
                Patient Status
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                  >
                    {activeFilters.status || "Select status"}
                    <Filter className="h-3 w-3 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => applyFilter("status", "Active")}
                  >
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => applyFilter("status", "Inactive")}
                  >
                    Inactive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => applyFilter("status", "New")}
                  >
                    New
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">
                Insurance Provider
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                  >
                    {activeFilters.insuranceProvider || "Select provider"}
                    <Filter className="h-3 w-3 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() =>
                      applyFilter("insuranceProvider", "Delta Dental")
                    }
                  >
                    Delta Dental
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => applyFilter("insuranceProvider", "Cigna")}
                  >
                    Cigna
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => applyFilter("insuranceProvider", "Aetna")}
                  >
                    Aetna
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => applyFilter("insuranceProvider", "MetLife")}
                  >
                    MetLife
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => applyFilter("insuranceProvider", "None")}
                  >
                    None
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">
                Last Visit
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                  >
                    {activeFilters.lastVisit || "Select timeframe"}
                    <Filter className="h-3 w-3 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => applyFilter("lastVisit", "Last 30 days")}
                  >
                    Last 30 days
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => applyFilter("lastVisit", "Last 90 days")}
                  >
                    Last 90 days
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => applyFilter("lastVisit", "Last 6 months")}
                  >
                    Last 6 months
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => applyFilter("lastVisit", "Last year")}
                  >
                    Last year
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => applyFilter("lastVisit", "Over a year")}
                  >
                    Over a year
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {Object.keys(activeFilters).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(activeFilters).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                >
                  <span>{value}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() =>
                      removeFilter(key as keyof PatientSearchFilters)
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
