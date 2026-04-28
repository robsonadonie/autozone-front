
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initialProducts } from "./ProductTable";

interface ProductFilterProps {
  onFilterChange: (filters: any) => void;
}

const ProductFilter = ({ onFilterChange }: ProductFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [status, setStatus] = useState("");
  
  // Extract unique categories and suppliers for filter dropdowns
  const categories = Array.from(new Set(initialProducts.map(p => p.category)));
  const suppliers = Array.from(new Set(initialProducts.map(p => p.supplier)));

  useEffect(() => {
    // Pass search query immediately
    onFilterChange({ search: searchQuery });
  }, [searchQuery, onFilterChange]);

  const handleApplyFilters = () => {
    onFilterChange({
      category,
      supplier,
      status
    });
  };

  const handleResetFilters = () => {
    setCategory("");
    setSupplier("");
    setStatus("");
    onFilterChange({
      category: "",
      supplier: "",
      status: ""
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplier">Fournisseur</Label>
              <Select value={supplier} onValueChange={setSupplier}>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Tous les fournisseurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les fournisseurs</SelectItem>
                  {suppliers.map((sup) => (
                    <SelectItem key={sup} value={sup}>{sup}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut du stock</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Bas</SelectItem>
                  <SelectItem value="out">Rupture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 col-span-1 md:col-span-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleResetFilters}
              >
                <X className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleApplyFilters}
              >
                <Filter className="h-4 w-4" />
                Appliquer les filtres
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    
    </Card>
  );
};

export default ProductFilter;
