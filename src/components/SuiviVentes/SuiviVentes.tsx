import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Search, FileText, Download, Filter, SortAsc, SortDesc, 
  ChevronDown, ChevronUp, RefreshCw, Tag, ChevronRight, X, 
  ArrowUpDown, Info, Package, TrendingUp, TrendingDown
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DatePicker } from "@/components/SuiviVentes/DatePicker";
import { mockVentesData } from "@/components/SuiviVentes/mockData";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { 
  calculateSummary, 
  formatCurrency, 
  filterVentes, 
  sortVentes, 
  groupVentesByCategory,
  compareVentesByPeriod, 
  exportToCSV, 
  calculateAdvancedStats,
  formatPercentage
} from "@/components/SuiviVentes/utils";

export type VenteItem = {
  id: string;
  date: string;
  designation: string;
  marqueProduit: string;
  marqueVehicule: string;
  modele: string;
  serie: string;
  categorie: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
  prixAchat: number;
};

type SortField = keyof VenteItem;
type SortOrder = 'asc' | 'desc';

interface FilterState {
  startDate?: Date;
  endDate?: Date;
  category: string;
  marqueVehicule: string;
  marqueProduit: string;
  searchTerm: string;
  prixMin?: number;
  prixMax?: number;
}

const SuiviVentes = () => {
  const { toast } = useToast();
  
  // États pour les filtres
  const [filters, setFilters] = useState<FilterState>({
    startDate: undefined,
    endDate: undefined,
    category: "all",
    marqueVehicule: "all", 
    marqueProduit: "all",
    searchTerm: "",
  });

  // États pour le tri
  const [sortConfig, setSortConfig] = useState<{field: SortField; order: SortOrder}>({
    field: "date",
    order: "desc"
  });
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // États pour les données
  const [filteredVentes, setFilteredVentes] = useState<VenteItem[]>(mockVentesData);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // États pour l'interface
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAdvancedStatsOpen, setIsAdvancedStatsOpen] = useState(false);
  const [selectedVente, setSelectedVente] = useState<VenteItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Calcul des statistiques de ventes
  const { 
    totalVentes, 
    totalAchats, 
    totalArticles, 
    pourcentageVendeurs, 
    profit, 
    margeCommerciale, 
    tauxMarge 
  } = useMemo(() => calculateSummary(filteredVentes), [filteredVentes]);

  // Comparaison avec la période précédente
  const { 
    currentPeriod, 
    previousPeriod, 
    percentChange 
  } = useMemo(() => compareVentesByPeriod(
    mockVentesData,
    filters.startDate,
    filters.endDate
  ), [filters.startDate, filters.endDate]);
  
  // Statistiques avancées
  const advancedStats = useMemo(() => 
    calculateAdvancedStats(filteredVentes), 
  [filteredVentes]);

  // Récupérer les valeurs uniques pour les filtres
  const categories = useMemo(() => 
    Array.from(new Set(mockVentesData.map(vente => vente.categorie))), 
  []);
  
  const marquesProduit = useMemo(() => 
    Array.from(new Set(mockVentesData.map(vente => vente.marqueProduit))), 
  []);
  
  const marquesVehicule = useMemo(() => 
    Array.from(new Set(mockVentesData.map(vente => vente.marqueVehicule))), 
  []);

  // Calcul des données pour la pagination
  const paginatedVentes = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return filteredVentes.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredVentes, itemsPerPage]);
  
  const totalPages = Math.ceil(filteredVentes.length / itemsPerPage);

  // Effet pour appliquer les filtres
  useEffect(() => {
    applyFilters();
  }, [filters.category, filters.marqueVehicule, filters.marqueProduit]);

  // Fonction pour appliquer les filtres
  const applyFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = filterVentes(mockVentesData, filters);
      const sorted = sortVentes(filtered, sortConfig.field, sortConfig.order);
      setFilteredVentes(sorted);
      setCurrentPage(1);
      setIsLoading(false);
    }, 300); // Simulation de chargement
    
    toast({
      title: "Recherche effectuée",
      description: `Filtres appliqués avec succès.`,
    });
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      startDate: undefined,
      endDate: undefined,
      category: "all",
      marqueVehicule: "all",
      marqueProduit: "all",
      searchTerm: "",
    });
    
    setSortConfig({
      field: "date",
      order: "desc"
    });
    
    setTimeout(() => {
      setFilteredVentes(mockVentesData);
      setCurrentPage(1);
    }, 300);
    
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été réinitialisés.",
    });
  };

  // Fonction pour gérer le tri
  const handleSort = (field: SortField) => {
    const newOrder = sortConfig.field === field && sortConfig.order === 'asc' ? 'desc' : 'asc';
    setSortConfig({ field, order: newOrder });
    
    const sorted = sortVentes(filteredVentes, field, newOrder);
    setFilteredVentes(sorted);
    
    toast({
      title: "Tri appliqué",
      description: `Trié par ${field} en ordre ${newOrder === 'asc' ? 'croissant' : 'décroissant'}.`,
    });
  };

  // Fonction pour rafraîchir les données
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      applyFilters();
      setIsRefreshing(false);
      
      toast({
        title: "Données actualisées",
        description: "Les données ont été rafraîchies avec succès.",
      });
    }, 600);
  };

  // Fonction pour afficher les détails d'une vente
  const showVenteDetails = (vente: VenteItem) => {
    setSelectedVente(vente);
    setIsDetailModalOpen(true);
  };

  // Fonction pour annuler une vente
  const handleAnnulerVente = (id: string) => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setFilteredVentes(prev => prev.filter(vente => vente.id !== id));
      setIsLoading(false);
      
      toast({
        title: "Vente annulée",
        description: `La vente #${id} a été annulée.`,
        variant: "destructive",
      });
    }, 500);
  };

  // Fonction pour exporter les données
  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      exportToCSV(filteredVentes);
      
      toast({
        title: "Export réussi",
        description: "Les données ont été exportées au format CSV.",
      });
    } else {
      // Simuler l'export PDF
      setTimeout(() => {
        toast({
          title: "Export réussi",
          description: "Les données ont été exportées au format PDF.",
        });
      }, 500);
    }
    
    setShowExportOptions(false);
  };

  // Animations pour les composants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 0.1,
        duration: 0.3
      }
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <h1 className="text-2xl font-bold">Suivi des Ventes</h1>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu open={showExportOptions} onOpenChange={setShowExportOptions}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="h-4 w-4 mr-2" />
                Exporter PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAdvancedStatsOpen(true)}
          >
            <Info className="h-4 w-4 mr-2" />
            Statistiques avancées
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <StatCard 
                title="Total Ventes"
                value={formatCurrency(totalVentes)}
                change={{ 
                  value: `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(2)}% vs période précédente`, 
                  positive: percentChange >= 0 
                }}
                icon={<TrendingUp className={`h-6 w-6 ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`} />}
                className="border-0 p-0 shadow-none"
              />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <StatCard 
                title="Profit"
                value={formatCurrency(profit)}
                change={{ 
                  value: formatPercentage(tauxMarge) + " de marge", 
                  positive: tauxMarge > 0 
                }}
                icon={<TrendingUp className={`h-6 w-6 ${tauxMarge > 0 ? 'text-green-500' : 'text-red-500'}`} />}
                className="border-0 p-0 shadow-none"
              />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <StatCard 
                title="Articles Vendus"
                value={totalArticles}
                change={{ 
                  value: "Moy. " + (totalVentes / totalArticles).toFixed(2) + "€/article", 
                  positive: true 
                }}
                icon={<Package className="h-6 w-6 text-blue-500" />}
                className="border-0 p-0 shadow-none"
              />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <StatCard 
                title="Commissions"
                value={formatCurrency(pourcentageVendeurs)}
                change={{ 
                  value: formatPercentage(pourcentageVendeurs / totalVentes * 100) + " des ventes", 
                  positive: false 
                }}
                icon={<TrendingDown className="h-6 w-6 text-orange-500" />}
                className="border-0 p-0 shadow-none"
              />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg border shadow-sm p-4 md:p-6"
      >
        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher des ventes..." 
              className="pl-9"
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
              {Object.values(filters).some(val => 
                val !== undefined && val !== "" && val !== "all"
              ) && (
                <Badge variant="secondary" className="ml-2 bg-primary text-white">
                  {Object.values(filters).filter(val => 
                    val !== undefined && val !== "" && val !== "all"
                  ).length}
                </Badge>
              )}
            </Button>
            
            <Button onClick={applyFilters}>
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>
        </div>
        
        {/* Panneau de filtres avancés */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <Card className="p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium mb-1 block">Date début</label>
                    <DatePicker 
                      date={filters.startDate} 
                      setDate={(date) => setFilters(prev => ({ ...prev, startDate: date }))} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium mb-1 block">Date fin</label>
                    <DatePicker 
                      date={filters.endDate} 
                      setDate={(date) => setFilters(prev => ({ ...prev, endDate: date }))} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium mb-1 block">Catégorie</label>
                    <Select 
                      value={filters.category} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les catégories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium mb-1 block">Marque produit</label>
                    <Select 
                      value={filters.marqueProduit} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, marqueProduit: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les marques" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les marques</SelectItem>
                        {marquesProduit.map((marque) => (
                          <SelectItem key={marque} value={marque}>{marque}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium mb-1 block">Marque véhicule</label>
                    <Select 
                      value={filters.marqueVehicule} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, marqueVehicule: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les marques" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les marques</SelectItem>
                        {marquesVehicule.map((marque) => (
                          <SelectItem key={marque} value={marque}>{marque}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium mb-1 block">Fourchette de prix</label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        placeholder="Min €" 
                        min={0}
                        value={filters.prixMin || ''}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          prixMin: e.target.value ? Number(e.target.value) : undefined 
                        }))}
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input 
                        type="number" 
                        placeholder="Max €" 
                        min={0}
                        value={filters.prixMax || ''}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          prixMax: e.target.value ? Number(e.target.value) : undefined 
                        }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Réinitialiser
                  </Button>
                  <Button size="sm" onClick={applyFilters}>
                    Appliquer les filtres
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tableau principal */}
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead 
                    className="w-[100px] cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                      {sortConfig.field === 'date' && (
                        sortConfig.order === 'asc' ? 
                        <SortAsc className="ml-1 h-4 w-4" /> : 
                        <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('designation')}
                  >
                    <div className="flex items-center">
                      Désignation
                      {sortConfig.field === 'designation' && (
                        sortConfig.order === 'asc' ? 
                        <SortAsc className="ml-1 h-4 w-4" /> : 
                        <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('marqueProduit')}
                  >
                    <div className="flex items-center">
                      Marque Produit
                      {sortConfig.field === 'marqueProduit' && (
                        sortConfig.order === 'asc' ? 
                        <SortAsc className="ml-1 h-4 w-4" /> : 
                        <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('marqueVehicule')}
                  >
                    <div className="flex items-center">
                      Marque
                      {sortConfig.field === 'marqueVehicule' && (
                        sortConfig.order === 'asc' ? 
                        <SortAsc className="ml-1 h-4 w-4" /> : 
                        <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Modèle</TableHead>
                  <TableHead>Série</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('categorie')}
                  >
                    <div className="flex items-center">
                      Catégorie
                      {sortConfig.field === 'categorie' && (
                        sortConfig.order === 'asc' ? 
                        <SortAsc className="ml-1 h-4 w-4" /> : 
                        <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('quantite')}
                  >
                    <div className="flex items-center justify-end">
                      Quantité
                      {sortConfig.field === 'quantite' && (
                        sortConfig.order === 'asc' ? 
                        <SortAsc className="ml-1 h-4 w-4" /> : 
                        <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('prixUnitaire')}
                  >
                    <div className="flex items-center justify-end">
                      PU Vente
                      {sortConfig.field === 'prixUnitaire' && (
                        sortConfig.order === 'asc' ? 
                        <SortAsc className="ml-1 h-4 w-4" /> : 
                        <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center justify-end">
                      Total Vente HT
                      {sortConfig.field === 'total' && (
                        sortConfig.order === 'asc' ? 
                        <SortAsc className="ml-1 h-4 w-4" /> : 
                        <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loader
                  Array(5).fill(0).map((_, index) => (
                    <TableRow key={index} className="animate-pulse">
                      {Array(11).fill(0).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginatedVentes.length > 0 ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="contents"
                  >
                    {paginatedVentes.map((vente) => (
                      <motion.tr
                        key={vente.id}
                        variants={itemVariants}
                        className="border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => showVenteDetails(vente)}
                      >
                        <TableCell>
                          {format(new Date(vente.date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="block truncate">{vente.designation}</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{vente.designation}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>{vente.marqueProduit}</TableCell>
                        <TableCell>{vente.marqueVehicule}</TableCell>
                        <TableCell>{vente.modele}</TableCell>
                        <TableCell>{vente.serie}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            <Tag className="h-3 w-3 mr-1" />
                            {vente.categorie}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{vente.quantite}</TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(vente.prixUnitaire)}
                        </TableCell>
                        <TableCell className="text-right font-medium font-mono">
                          {formatCurrency(vente.total)}
                        </TableCell>
                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAnnulerVente(vente.id);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Annuler
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </motion.div>
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-4">
                        <Package className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Aucune vente trouvée</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={resetFilters}
                        >
                          Réinitialiser les filtres
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Pagination */}
        {filteredVentes.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredVentes.length)} sur {filteredVentes.length} résultats
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              
              <div className="flex items-center">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Logic to show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-9"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="10 par page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 par page</SelectItem>
                  <SelectItem value="10">10 par page</SelectItem>
                  <SelectItem value="25">25 par page</SelectItem>
                  <SelectItem value="50">50 par page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gray-50 p-4 rounded-lg border"
        >
          <Accordion type="single" collapsible defaultValue="resume">
            <AccordionItem value="resume">
              <AccordionTrigger className="text-lg font-medium py-2">
                Résumé
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-3 bg-white rounded-md border shadow-sm"
                  >
                    <div className="text-sm text-muted-foreground">Articles vendus</div>
                    <div className="text-xl font-bold">{totalArticles}</div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-3 bg-white rounded-md border shadow-sm"
                  >
                    <div className="text-sm text-muted-foreground">Total ventes</div>
                    <div className="text-xl font-bold text-blue-600">{formatCurrency(totalVentes)}</div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-3 bg-white rounded-md border shadow-sm"
                  >
                    <div className="text-sm text-muted-foreground">Total achats</div>
                    <div className="text-xl font-bold text-red-500">{formatCurrency(totalAchats)}</div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-3 bg-white rounded-md border shadow-sm"
                  >
                    <div className="text-sm text-muted-foreground">% Vendeurs</div>
                    <div className="text-xl font-bold">{formatCurrency(pourcentageVendeurs)}</div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-3 bg-white rounded-md border shadow-sm"
                  >
                    <div className="text-sm text-muted-foreground">Profits</div>
                    <div className="text-xl font-bold text-green-600">{formatCurrency(profit)}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Taux de marge: {formatPercentage(tauxMarge)}
                    </div>
                  </motion.div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={resetFilters}>Fermer</Button>
        </div>
      </motion.div>
      
      {/* Modal de détails */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détail de la vente</DialogTitle>
            <DialogDescription>
              Informations complètes sur la vente
            </DialogDescription>
          </DialogHeader>
          
          {selectedVente && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID de vente</p>
                  <p className="font-medium">{selectedVente.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{format(new Date(selectedVente.date), "dd MMMM yyyy", { locale: fr })}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quantité</p>
                  <p>{selectedVente.quantite}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="font-bold text-blue-600">{formatCurrency(selectedVente.total)}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Détails produit</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Désignation</p>
                    <p>{selectedVente.designation}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Marque produit</p>
                    <p>{selectedVente.marqueProduit}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
                    <p>
                      <Badge variant="outline" className="capitalize">
                        <Tag className="h-3 w-3 mr-1" />
                        {selectedVente.categorie}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prix unitaire</p>
                    <p>{formatCurrency(selectedVente.prixUnitaire)}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Véhicule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Marque</p>
                    <p>{selectedVente.marqueVehicule}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Modèle</p>
                    <p>{selectedVente.modele}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Série</p>
                    <p>{selectedVente.serie}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Analyse de la vente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prix d'achat</p>
                    <p>{formatCurrency(selectedVente.prixAchat)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Marge brute</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(selectedVente.total - (selectedVente.prixAchat * selectedVente.quantite))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Taux de marge</p>
                    <p className="font-medium">
                      {formatPercentage((selectedVente.total - (selectedVente.prixAchat * selectedVente.quantite)) / selectedVente.total * 100)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Fermer
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (selectedVente) {
                  handleAnnulerVente(selectedVente.id);
                  setIsDetailModalOpen(false);
                }
              }}
            >
              Annuler cette vente
            </Button>
            <Button onClick={() => {
              toast({
                title: "Impression en cours",
                description: "La fiche détaillée est en cours d'impression."
              });
              setIsDetailModalOpen(false);
            }}>
              <FileText className="h-4 w-4 mr-2" />
              Imprimer la fiche
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de statistiques avancées */}
      <Dialog open={isAdvancedStatsOpen} onOpenChange={setIsAdvancedStatsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Statistiques avancées</DialogTitle>
            <DialogDescription>
              Analyse approfondie des ventes sur la période sélectionnée
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Valeur moyenne par vente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(advancedStats.avgValuePerSale)}</div>
                  <p className="text-muted-foreground text-sm mt-2">
                    Basée sur {filteredVentes.length} ventes
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Total période courante</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(currentPeriod)}</div>
                  <div className="flex items-center text-sm mt-2">
                    <span className={percentChange >= 0 ? "text-green-600" : "text-red-600"}>
                      {percentChange >= 0 ? (
                        <TrendingUp className="inline h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="inline h-4 w-4 mr-1" />
                      )}
                      {percentChange > 0 && "+"}
                      {percentChange.toFixed(2)}%
                    </span>
                    <span className="text-muted-foreground ml-1">vs période précédente</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Taux de marge global</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatPercentage(tauxMarge)}</div>
                  <p className="text-muted-foreground text-sm mt-2">
                    Profit: {formatCurrency(profit)}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Articles les plus vendus</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {advancedStats.topSellingItems.map((item, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-medium text-sm mr-2">{index + 1}.</span>
                          <div>
                            <p className="font-medium">{item.designation}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.count} unités vendues
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(item.totalValue)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Meilleures marques</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {advancedStats.topBrands.map((brand, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-medium text-sm mr-2">{index + 1}.</span>
                          <div>
                            <p className="font-medium">{brand.brand}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(brand.total)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsAdvancedStatsOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuiviVentes;