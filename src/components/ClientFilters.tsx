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
import { Filter, X, RotateCcw, Calendar } from "lucide-react";

export interface ClientFilters {
  nom: string;
  ville: string;
  telephone: string;
  email: string;
  dateDebut: string;
  dateFin: string;
  hasFactures: string;
}

interface ClientFiltersProps {
  filters: ClientFilters;
  onFiltersChange: (filters: ClientFilters) => void;
  onReset: () => void;
}

export const ClientFiltersComponent = ({ 
  filters, 
  onFiltersChange, 
  onReset 
}: ClientFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof ClientFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
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
      {/* <PopoverContent className="w-80" align="end">
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
              <Label className="text-sm">Nom du client</Label>
              <Input
                placeholder="Filtrer par nom"
                value={filters.nom}
                onChange={(e) => updateFilter('nom', e.target.value)}
                className="h-9"
              />
            </div>

            <div>
              <Label className="text-sm">Ville</Label>
              <Input
                placeholder="Filtrer par ville"
                value={filters.ville}
                onChange={(e) => updateFilter('ville', e.target.value)}
                className="h-9"
              />
            </div>

            <div>
              <Label className="text-sm">Téléphone</Label>
              <Input
                placeholder="Filtrer par téléphone"
                value={filters.telephone}
                onChange={(e) => updateFilter('telephone', e.target.value)}
                className="h-9"
              />
            </div>

            <div>
              <Label className="text-sm">Email</Label>
              <Input
                placeholder="Filtrer par email"
                value={filters.email}
                onChange={(e) => updateFilter('email', e.target.value)}
                className="h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm">Date début</Label>
                <Input
                  type="date"
                  value={filters.dateDebut}
                  onChange={(e) => updateFilter('dateDebut', e.target.value)}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-sm">Date fin</Label>
                <Input
                  type="date"
                  value={filters.dateFin}
                  onChange={(e) => updateFilter('dateFin', e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm">Factures</Label>
              <Select
                value={filters.hasFactures}
                onValueChange={(value) => updateFilter('hasFactures', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Tous les clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="badoda">Tous les clients</SelectItem>
                  <SelectItem value="with-invoices">Avec factures</SelectItem>
                  <SelectItem value="without-invoices">Sans factures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent> */}
    </Popover>
  );
};