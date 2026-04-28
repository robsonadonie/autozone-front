import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
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
import { Badge } from "@/components/ui/badge";
import { Filter, X, RotateCcw, Search } from "lucide-react";

export interface AdvancedFiltersState {
  search: string;
  couleur: string;
  pays: string;
  marque: string;
  modele: string;
  annee: string;
  dateCreation: string;
}

interface AdvancedFiltersProps {
  filters: AdvancedFiltersState;
  onFiltersChange: (filters: AdvancedFiltersState) => void;
  onReset: () => void;
  activeTab: string;
  marques?: Array<{ id: string; nom: string; pays: string }>;
  modeles?: Array<{ id: string; nom: string; marqueNom: string }>;
}

export const AdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  onReset,
  activeTab,
  marques = [],
  modeles = []
}: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof AdvancedFiltersState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'search') return count;
    return count + (value && value !== 'all' ? 1 : 0);
  }, 0);

  const uniquePays = [...new Set(marques.map(m => m.pays))].filter(Boolean);
  const filteredMarques = filters.pays && filters.pays !== 'all' 
    ? marques.filter(m => m.pays === filters.pays)
    : marques;
  const filteredModeles = filters.marque && filters.marque !== 'all'
    ? modeles.filter(m => m.marqueNom === filters.marque)
    : modeles;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      <div className="flex items-center justify-between ">
        {/* Barre de recherche principale */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`Rechercher...`}
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9 border-gray-300 outline-none"
          />
        </div>

        {/* Bouton filtres avancés */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="relative ml-4">
              <Filter className="h-4 w-4 mr-2" />
              Filtres avancés
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex justify-center items-center rounded-full p-0 text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Filtres avancés
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  className="h-8 px-2 text-gray-600 hover:text-gray-900"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              {/* Filtre Couleur (pour origines) */}
              {activeTab === 'origines' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Couleur du badge</Label>
                  <Select value={filters.couleur} onValueChange={(value) => updateFilter('couleur', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Toutes les couleurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les couleurs</SelectItem>
                      <SelectItem value="green">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                          Vert
                        </div>
                      </SelectItem>
                      <SelectItem value="blue">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                          Bleu
                        </div>
                      </SelectItem>
                      <SelectItem value="orange">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                          Orange
                        </div>
                      </SelectItem>
                      <SelectItem value="red">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                          Rouge
                        </div>
                      </SelectItem>
                      <SelectItem value="purple">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                          Violet
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Filtre Pays (pour marques) */}
              {activeTab === 'marques' && uniquePays.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Pays d'origine</Label>
                  <Select value={filters.pays} onValueChange={(value) => updateFilter('pays', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Tous les pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les pays</SelectItem>
                      {uniquePays.map(pays => (
                        <SelectItem key={pays} value={pays}>
                          <div className="flex items-center">
                            <div className="w-4 h-3 bg-gradient-to-r from-blue-500 to-red-500 rounded-sm mr-2"></div>
                            {pays}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Filtre Marque (pour modèles et séries) */}
              {(activeTab === 'modeles' || activeTab === 'series') && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Marque</Label>
                  <Select value={filters.marque} onValueChange={(value) => updateFilter('marque', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Toutes les marques" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les marques</SelectItem>
                      {filteredMarques.map((marque : any) => (
                        <SelectItem key={marque.id} value={marque.family_name}>
                          <div className="flex items-center">
                            <div className="w-6 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded text-white text-xs flex items-center justify-center mr-2 font-bold">
                              {marque.family_name.substring(0, 2).toUpperCase()}
                            </div>
                            {marque.family_name}
                            {marque.origine.pays && (
                              <span className="ml-2 text-xs text-gray-500">({marque.origine.pays})</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Filtre Modèle (pour séries) */}
              {activeTab === 'series' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Modèle</Label>
                  <Select value={filters.modele} onValueChange={(value) => updateFilter('modele', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Tous les modèles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les modèles</SelectItem>
                      {filteredModeles.map(modele => (
                        <SelectItem key={modele.id} value={modele.nom}>
                          <div className="flex items-center">
                            {/* <div className="w-6 h-4 bg-gradient-to-r from-green-600 to-blue-600 rounded text-white text-xs flex items-center justify-center mr-2">
                              #
                            </div> */}
                            {modele.nom}
                            <span className="ml-2 text-xs text-gray-500">({modele.marqueNom})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Filtre Année (pour modèles) */}
              {activeTab === 'modeles' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Année</Label>
                  <Input
                    placeholder="Ex: 2020"
                    value={filters.annee}
                    onChange={(e) => updateFilter('annee', e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}

              {/* Filtre Date de création */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Date de création</Label>
                <Input
                  type="date"
                  value={filters.dateCreation}
                  onChange={(e) => updateFilter('dateCreation', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tags des filtres actifs */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.couleur && filters.couleur !== 'all' && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Couleur: {filters.couleur}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => updateFilter('couleur', 'all')} />
            </Badge>
          )}
          {filters.pays && filters.pays !== 'all' && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Pays: {filters.pays}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => updateFilter('pays', 'all')} />
            </Badge>
          )}
          {filters.marque && filters.marque !== 'all' && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Marque: {filters.marque}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => updateFilter('marque', 'all')} />
            </Badge>
          )}
          {filters.modele && filters.modele !== 'all' && (
            <Badge variant="secondary" className="bg-teal-100 text-teal-800">
              Modèle: {filters.modele}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => updateFilter('modele', 'all')} />
            </Badge>
          )}
          {filters.annee && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Année: {filters.annee}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => updateFilter('annee', '')} />
            </Badge>
          )}
          {filters.dateCreation && (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Date: {filters.dateCreation}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => updateFilter('dateCreation', '')} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};