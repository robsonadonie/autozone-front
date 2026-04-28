import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X, RotateCcw } from "lucide-react";

export interface SupplierFilters {
  status: string;
  city: string;
  country: string;
  categories: string[];
  paymentTerms: string;
  minOrders: string;
  hasOrders: string;
}

interface SupplierFiltersProps {
  filters: SupplierFilters;
  onFiltersChange: (filters: SupplierFilters) => void;
  onReset: () => void;
}

const categories = [
  "Électronique", "Informatique", "Mobilier", "Fournitures", "Outillage", 
  "Textile", "Alimentaire", "Chimie", "Automobile", "Construction"
];

export const SupplierFiltersComponent = ({ 
  filters, 
  onFiltersChange, 
  onReset 
}: SupplierFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof SupplierFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const addCategory = (category: string) => {
    if (!filters.categories.includes(category)) {
      updateFilter('categories', [...filters.categories, category]);
    }
  };

  const removeCategory = (category: string) => {
    updateFilter('categories', filters.categories.filter(c => c !== category));
  };

  const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'categories') {
      return count + (value as string[]).length;
    }
    return count + (value ? 1 : 0);
  }, 0);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filtres avancés</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 px-2"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-sm">Statut</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => updateFilter('status', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Ville</Label>
              <Input
                placeholder="Filtrer par ville"
                value={filters.city}
                onChange={(e) => updateFilter('city', e.target.value)}
                className="h-9"
              />
            </div>

            <div>
              <Label className="text-sm">Pays</Label>
              <Select
                value={filters.country}
                onValueChange={(value) => updateFilter('country', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Tous les pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les pays</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Belgique">Belgique</SelectItem>
                  <SelectItem value="Suisse">Suisse</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Conditions de paiement</Label>
              <Select
                value={filters.paymentTerms}
                onValueChange={(value) => updateFilter('paymentTerms', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Toutes les conditions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les conditions</SelectItem>
                  <SelectItem value="Comptant">Comptant</SelectItem>
                  <SelectItem value="15 jours">15 jours</SelectItem>
                  <SelectItem value="30 jours">30 jours</SelectItem>
                  <SelectItem value="45 jours">45 jours</SelectItem>
                  <SelectItem value="60 jours">60 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Commandes</Label>
              <Select
                value={filters.hasOrders}
                onValueChange={(value) => updateFilter('hasOrders', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Tous les fournisseurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les fournisseurs</SelectItem>
                  <SelectItem value="with-orders">Avec commandes</SelectItem>
                  <SelectItem value="without-orders">Sans commandes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Catégories</Label>
              <Select onValueChange={addCategory}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Ajouter une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {filters.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.categories.map(category => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                        onClick={() => removeCategory(category)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};