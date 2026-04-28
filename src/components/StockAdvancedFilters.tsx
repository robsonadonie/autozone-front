import React, { useEffect, useState } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store/store';
import { StockAsync } from '@/redux/Async/stockAsync';
import { LevelAsyncThunk } from '@/redux/Async/level.asyncThunk';
import { OrigineAsyncThunk } from '@/redux/Async/origine.async';
import { SerieAsyncThunk } from '@/redux/Async/serie.async';
import { MarkAsyncThunk } from '@/redux/Async/mark.async';
import { ModeleAsyncThunk } from '@/redux/Async/modele.async';
import { EntreStockAsync } from '@/redux/Async/EntreStockAsync';
import { ReferencesData } from '@/types/references';

interface StockFilters {
  search: string;
  categories: string[];
  suppliers: string[];
  // priceRange: [number, number];
  // stockRange: [number, number];
  status: string[];
  dateRange: { from?: Date; to?: Date } | undefined;
  location: string;
  // minStock: string;
  // maxStock: string;
  // sortBy: string;
  // sortOrder: 'asc' | 'desc';
  origines: string[];
  marques: string[];
  marquesProd: string[];
  modeles: string[];
  series: string[];
}

interface StockAdvancedFiltersProps {
  filters: StockFilters;
  total: any[],
  stock: any[],
  onFiltersChange: (filters: StockFilters) => void;
}
 







const statuses = [
  { id: 'en_stock', label: 'En stock' },
  { id: 'stock_bas', label: 'Stock bas' },
  { id: 'rupture', label: 'Rupture de stock' },
];

const locations = [
  'Entrepôt A', 'Entrepôt B', 'Entrepôt C', 'Magasin Principal',
  'Dépôt Nord', 'Dépôt Sud', 'Zone de réception', 'Zone d\'expédition'
];


export const StockAdvancedFilters: React.FC<StockAdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  total,
  stock
}) => {
  const categories = typeof (stock) != "string" ? [...new Set(stock.map(item => item.categorie))] : [];

  const dispatch = useDispatch<AppDispatch>()
  const AllOrigine = useSelector((state: RootState) => state.OrigineSlice)
  const Mark = useSelector((state: RootState) => state.MarkSlice)
  const MarkProd = useSelector((state: RootState) => state.MarkProductSlice)
  const Modele = useSelector((state: RootState) => state.ModeleSlice)
  const Serie = useSelector((state: RootState) => state.SerieSlice)
  const DataStock = useSelector((state: RootState) => state.StockSlice.data)

  let origine = DataStock.map((e) => e.family?.origine?.pays)
  let marks = DataStock.map((e) => e.marque_produit)



  const initialData: ReferencesData | any = {
    origines: [
      ...AllOrigine.data
    ],
    marquesProd: deleteDoublons([
      // Marques japonaises
      ...MarkProd.data,
    ]),
    marques: deleteDoublons([
      // Marques japonaises
      ...Mark.data,
    ]),
    modeles: deleteDoublons([
      ...Modele.data
    ]),
    series: deleteDoublons([
      ...Serie.data
    ]),
    categories: [
    ],
  };

  function deleteDoublons(f) {
    let rest = []
    for (let index = 0; index < f.length; index++) {

      if (!rest.find((i) => i.family_name == f[index].family_name)) {
        rest = [...rest, f[index]]
      }

    }

    return rest
  }

  function deleteDoublonsOrigine(f) {
    let rest = []
    for (let index = 0; index < f.length; index++) {

      if (!rest.includes(f[index])) {
        rest = [...rest, f[index]]
      }

    }

    return rest
  }
  deleteDoublonsOrigine(origine);


  useEffect(() => {
    dispatch(StockAsync())
    dispatch(LevelAsyncThunk())
    dispatch(OrigineAsyncThunk())
    dispatch(SerieAsyncThunk())
    dispatch(MarkAsyncThunk())
    dispatch(ModeleAsyncThunk())
    dispatch(EntreStockAsync())
  }, [])




  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof StockFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  // const handleCategoryChange = (category: string, checked: boolean) => {
  //   const newCategories = checked
  //     ? [...filters.categories, category]
  //     : filters.categories.filter(c => c !== category);
  //   updateFilter('categories', newCategories);
  // };

  const handleSupplierChange = (supplier: string, checked: boolean) => {
    const newSuppliers = checked
      ? [...filters.suppliers, supplier]
      : filters.suppliers.filter(s => s !== supplier);
    updateFilter('suppliers', newSuppliers);
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    updateFilter('status', newStatuses);
  };

  const handleOrigineChange = (origine: string, checked: boolean) => {
    const newOrigines = checked
      ? [...filters.origines, origine]
      : filters.origines.filter(o => o !== origine);
    updateFilter('origines', newOrigines);
  };

  const handleMarqueChange = (marque: string, checked: boolean) => {
    const newMarques = checked
      ? [...filters.marques, marque]
      : filters.marques.filter(m => m !== marque);
    updateFilter('marques', newMarques);
  };

  const handleModeleChange = (modele: string, checked: boolean) => {
    const newModeles = checked
      ? [...filters.modeles, modele]
      : filters.modeles.filter(m => m !== modele);
    updateFilter('modeles', newModeles);
  };





  const handleSerieChange = (serie: string, checked: boolean) => {
    const newSeries = checked
      ? [...filters.series, serie]
      : filters.series.filter(s => s !== serie);
    updateFilter('series', newSeries);
  };

  const resetFilters = () => {
    const resetState: StockFilters = {
      search: '',
      categories: [],
      suppliers: [],
      // priceRange: [0, 10000],
      // stockRange: [0, 1000],
      status: [],
      dateRange: undefined,
      location: '',
      // minStock: '',
      // maxStock: '',
      // sortBy: 'name',
      // sortOrder: 'asc',
      origines: [],
      marques: [],
      marquesProd: [],
      modeles: [],
      series: []
    };
    onFiltersChange(resetState);
  };

  const activeFiltersCount = [
    filters.search,
    filters.categories.length > 0,
    filters.suppliers.length > 0,
    filters.status.length > 0,
    filters.location,
    // filters.minStock,
    // filters.maxStock,
    filters.dateRange,
    filters.origines.length > 0,
    filters.marques.length > 0,
    filters.marquesProd.length > 0,
    filters.modeles.length > 0,
    filters.series.length > 0
  ].filter(Boolean).length;

  // Filtrer les marques selon les origines sélectionnées
  const filteredMarquesProd = filters.origines.length > 0
    ? initialData.marquesProd.filter(marque => filters.origines.includes(marque.origine.pays))
    : initialData.marquesProd;



  const filteredMarques = filters.origines?.length > 0
    ? initialData.marques.filter(marque => filters?.origines.includes(marque?.origine.pays))
    : initialData.marques;

  const filteredModeles = filters.marques.length > 0
    ? initialData.modeles.filter(modele => filters?.marques.includes(modele.parent.family_name))
    : initialData.modeles;

  const filteredSeries = filters.marques.length > 0
    ? initialData.series.filter(serie => filters.modeles.includes(serie.parent.family_name))
    : initialData.series;



    useEffect(()=>{
      // updateFilter("marques",initialData.marques.filter(marque => filters?.origines.includes(marque?.origine.pays)))


      
      // updateFilter("modeles",initialData.modeles.filter(modele => filters?.origines.includes(modele?.origine.pays)))

      
      
    },[filters.origines])
    
    

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative" style={{fontSize:'13px !important'}}>
          <Filter className=" mr-2" size={9} />
           Filtres avancés 
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {total.length}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres avancés
          </SheetTitle>
          <SheetDescription>
            Les filtres sont appliqués automatiquement en temps réel
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Recherche */}
          {/* <div className="space-y-2">
            <Label htmlFor="search">Recherche générale</Label>
            <Input
              id="search"
              type="search"
              placeholder="Rechercher par nom, référence, description..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div> */}

          {/* <Separator /> */}

          {/* Origines */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Origines</Label>
            {/* <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {deleteDoublonsOrigine(origine).map((origin, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Checkbox
                    id={`origine-${origin}`}
                    checked={filters.origines.includes(origin)}
                    onCheckedChange={(checked) => {
                      const newOrigines = checked
                        ? [...filters.origines, origin]
                        : filters.origines.filter(o => o !== origin);
                      updateFilter('origines', newOrigines);
                    }}
                  />
                  <Label
                    htmlFor={`origine-${origin}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {origin}
                  </Label>
                </div>
              ))}
            </div> */}
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {AllOrigine.data.map((origin, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Checkbox
                    id={`origine-${origin.id}`}
                    checked={filters.origines.includes(origin.pays)}
                    onCheckedChange={(checked) => {
                      const newOrigines = checked
                        ? [...filters.origines, origin.pays]
                        : filters.origines.filter(o => o !== origin.pays);
                      updateFilter('origines', newOrigines);
                    }}
                  />
                  <Label
                    htmlFor={`origine-${origin.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {origin.pays}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Marques */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Marques</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {filteredMarques.map((marque) => (
                <div key={marque.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`marque-${marque.id}`}
                    checked={filters.marques.includes(marque.family_name)}
                    onCheckedChange={(checked) => {
                      const newMarques = checked
                        ? [...filters.marques, marque.family_name]
                        : filters.marques.filter(m => m !== marque.family_name);
                      updateFilter('marques', newMarques);
                    }}
                  />
                  <Label
                    htmlFor={`marque-${marque.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {marque.family_name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Modèles */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Modèles</Label>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {filteredModeles.map((modele) => (
                <div key={modele.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`modele-${modele.id}`}
                    checked={filters.modeles.includes(modele.family_name)}
                    onCheckedChange={(checked) => {
                      const newModeles = checked
                        ? [...filters.modeles, modele.family_name]
                        : filters.modeles.filter(m => m !== modele.family_name);
                      updateFilter('modeles', newModeles);
                    }}
                  />
                  <Label
                    htmlFor={`modele-${modele.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {modele.family_name} ({modele.parent.family_name})
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Séries */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Séries</Label>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {filteredSeries.map((serie) => (
                <div key={serie.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`serie-${serie.id}`}
                    checked={filters.series.includes(serie.family_name)}
                    onCheckedChange={(checked) => {
                      const newSeries = checked
                        ? [...filters.series, serie.family_name]
                        : filters.series.filter(s => s !== serie.family_name);
                      updateFilter('series', newSeries);
                    }}
                  />
                  <Label
                    htmlFor={`serie-${serie.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {serie.family_name} ({serie.parent.family_name})
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />

          {/* Marques */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Marques produit</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {deleteDoublonsOrigine(marks).map((marqu, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Checkbox
                    id={`marque-${marqu}`}
                    checked={filters.marquesProd.includes(marqu)}
                    onCheckedChange={(checked) => {
                      const newMarquesProd = checked
                        ? [...filters.marquesProd, marqu]
                        : filters.marques.filter(m => m !== marqu);
                      updateFilter('marquesProd', newMarquesProd);
                    }}
                  />
                  <Label
                    htmlFor={`marque-${marqu}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {marqu}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Catégories */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Catégories</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => {
                      const newCategories = checked
                        ? [...filters.categories, category]
                        : filters.categories.filter(c => c !== category);
                      updateFilter('categories', newCategories);
                    }}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* <Separator /> */}

          {/* Fournisseurs */}
          {/* <div className="space-y-3">
            <Label className="text-sm font-medium">Fournisseurs</Label>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {suppliers.map((supplier) => (
                <div key={supplier} className="flex items-center space-x-2">
                  <Checkbox
                    id={`supplier-${supplier}`}
                    checked={filters.suppliers.includes(supplier)}
                    onCheckedChange={(checked) => {
                      const newSuppliers = checked
                        ? [...filters.suppliers, supplier]
                        : filters.suppliers.filter(s => s !== supplier);
                      updateFilter('suppliers', newSuppliers);
                    }}
                  />
                  <Label 
                    htmlFor={`supplier-${supplier}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {supplier}
                  </Label>
                </div>
              ))}
            </div>
          </div> */}

          <Separator />

          {/* Statut */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Statut</Label>
            <div className="space-y-2">
              {statuses.map((status) => (
                <div key={status.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.id}`}
                    checked={filters.status.includes(status.id)}
                    onCheckedChange={(checked) => {
                      const newStatuses = checked
                        ? [...filters.status, status.id]
                        : filters.status.filter(s => s !== status.id);
                      updateFilter('status', newStatuses);
                    }}
                  />
                  <Label
                    htmlFor={`status-${status.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* <Separator /> */}

          {/* Emplacement */}
          {/* <div className="space-y-2">
            <Label htmlFor="location">Emplacement</Label>
            <Select value={filters.location || 'all'} onValueChange={(value) => updateFilter('location', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un emplacement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les emplacements</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* <Separator /> */}

          {/* Plage de prix */}
          {/* <div className="space-y-3">
            <Label className="text-sm font-medium">
              Plage de prix: {filters.priceRange[0]}€ - {filters.priceRange[1]}€
            </Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              max={10000}
              min={0}
              step={50}
              className="w-full"
            />
          </div> */}

          {/* <Separator /> */}

          {/* Plage de stock */}
          {/* <div className="space-y-3">
            <Label className="text-sm font-medium">
              Quantité en stock: {filters.stockRange[0]} - {filters.stockRange[1]}
            </Label>
            <Slider
              value={filters.stockRange}
              onValueChange={(value) => updateFilter('stockRange', value)}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
          </div> */}

          {/* <Separator /> */}

          {/* Stock minimum et maximum */}
          {/* <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minStock">Stock minimum</Label>
              <Input
                id="minStock"
                type="number"
                placeholder="Min"
                value={filters.minStock}
                onChange={(e) => updateFilter('minStock', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStock">Stock maximum</Label>
              <Input
                id="maxStock"
                type="number"
                placeholder="Max"
                value={filters.maxStock}
                onChange={(e) => updateFilter('maxStock', e.target.value)}
              />
            </div>
          </div> */}

          {/* <Separator /> */}

          {/* Tri */}
          {/* <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sortBy">Trier par</Label>
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Ordre</Label>
              <Select value={filters.sortOrder} onValueChange={(value) => updateFilter('sortOrder', value as 'asc' | 'desc')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Croissant</SelectItem>
                  <SelectItem value="desc">Décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}
        </div>

        <SheetFooter className='sticky bottom-0'>
          <Button variant="outline" onClick={resetFilters} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser tous les filtres
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};