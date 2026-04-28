import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Download, Upload, Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { StockAdvancedFilters } from '@/components/StockAdvancedFilters';

interface StockItem {
  id: string;
  name: string;
  category: string;
  supplier: string;
  quantity: number;
  minQuantity: number;
  price: number;
  location: string;
  lastUpdate: string;
  status: string;
}

interface StockFilters {
  search: string;
  categories: string[];
  suppliers: string[];
  priceRange: [number, number];
  stockRange: [number, number];
  status: string[];
  dateRange: { from?: Date; to?: Date } | undefined;
  location: string;
  minStock: string;
  maxStock: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  origines: string[];
  marques: string[];
  modeles: string[];
  series: string[];
}

const mockStockData: StockItem[] = [
  {
    id: "1",
    name: "Laptop Dell XPS 13",
    category: "Informatique",
    supplier: "TechCorp",
    quantity: 25,
    minQuantity: 10,
    price: 1250.00,
    location: "Entrepôt A",
    lastUpdate: "2024-01-15",
    status: "en_stock"
  },
  {
    id: "2",
    name: "Chaise de bureau ergonomique",
    category: "Mobilier",
    supplier: "OfficeSupply",
    quantity: 5,
    minQuantity: 8,
    price: 299.99,
    location: "Entrepôt B",
    lastUpdate: "2024-01-14",
    status: "stock_bas"
  },
  {
    id: "3",
    name: "Imprimante laser HP",
    category: "Électronique",
    supplier: "ElectroPlus",
    quantity: 0,
    minQuantity: 5,
    price: 199.99,
    location: "Entrepôt A",
    lastUpdate: "2024-01-13",
    status: "rupture"
  },
  {
    id: "4",
    name: "Câble HDMI 2m",
    category: "Accessoires",
    supplier: "TechSolutions",
    quantity: 150,
    minQuantity: 50,
    price: 15.99,
    location: "Magasin Principal",
    lastUpdate: "2024-01-12",
    status: "en_stock"
  },
  {
    id: "5",
    name: "Disque dur externe 1TB",
    category: "Informatique",
    supplier: "CompuWorld",
    quantity: 12,
    minQuantity: 15,
    price: 89.99,
    location: "Entrepôt C",
    lastUpdate: "2024-01-11",
    status: "stock_bas"
  }
];

const StockPage = () => {
  const [stockData, setStockData] = useState<StockItem[]>(mockStockData);
  const [quickSearch, setQuickSearch] = useState('');
  const [filters, setFilters] = useState<StockFilters>({
    search: '',
    categories: [],
    suppliers: [],
    priceRange: [0, 10000],
    stockRange: [0, 1000],
    status: [],
    dateRange: undefined,
    location: '',
    minStock: '',
    maxStock: '',
    sortBy: 'name',
    sortOrder: 'asc',
    origines: [],
    marques: [],
    modeles: [],
    series: []
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'en_stock': { label: 'En stock', variant: 'default' as const },
      'stock_bas': { label: 'Stock bas', variant: 'secondary' as const },
      'rupture': { label: 'Rupture', variant: 'destructive' as const },
      'commande': { label: 'En commande', variant: 'outline' as const },
      'discontinu': { label: 'Discontinué', variant: 'secondary' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['en_stock'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const applyFilters = (data: StockItem[]): StockItem[] => {
    let filtered = [...data];

    // Recherche rapide
    if (quickSearch) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(quickSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(quickSearch.toLowerCase()) ||
        item.supplier.toLowerCase().includes(quickSearch.toLowerCase())
      );
    }

    // Recherche avancée
    if (filters.search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.supplier.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtres par catégorie
    if (filters.categories.length > 0) {
      filtered = filtered.filter(item => filters.categories.includes(item.category));
    }

    // Filtres par fournisseur
    if (filters.suppliers.length > 0) {
      filtered = filtered.filter(item => filters.suppliers.includes(item.supplier));
    }

    // Filtres par statut
    if (filters.status.length > 0) {
      filtered = filtered.filter(item => filters.status.includes(item.status));
    }

    // Filtre par emplacement
    if (filters.location && filters.location !== '') {
      filtered = filtered.filter(item => item.location === filters.location);
    }

    // Filtre par plage de prix
    filtered = filtered.filter(item => 
      item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
    );

    // Filtre par plage de stock
    filtered = filtered.filter(item => 
      item.quantity >= filters.stockRange[0] && item.quantity <= filters.stockRange[1]
    );

    // Stock minimum
    if (filters.minStock) {
      filtered = filtered.filter(item => item.quantity >= parseInt(filters.minStock));
    }

    // Stock maximum
    if (filters.maxStock) {
      filtered = filtered.filter(item => item.quantity <= parseInt(filters.maxStock));
    }

    // Note: Les filtres origine, marque, modèle et série pourraient être appliqués ici
    // si les données de stock contenaient ces informations

    // Tri
    filtered.sort((a, b) => {
      let aValue: any = a[filters.sortBy as keyof StockItem];
      let bValue: any = b[filters.sortBy as keyof StockItem];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (filters.sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    return filtered;
  };

  const filteredData = applyFilters(stockData);

  const handleFiltersChange = (newFilters: StockFilters) => {
    setFilters(newFilters);
  };

  // Calculs des statistiques
  const totalItems = stockData.length;
  const inStock = stockData.filter(item => item.status === 'en_stock').length;
  const lowStock = stockData.filter(item => item.status === 'stock_bas').length;
  const outOfStock = stockData.filter(item => item.status === 'rupture').length;
  const totalValue = stockData.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion du Stock</h1>
          <p className="text-gray-600">Surveillez et gérez votre inventaire</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un article
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Stock</p>
                <p className="text-2xl font-bold text-green-600">{inStock}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Bas</p>
                <p className="text-2xl font-bold text-orange-700">{lowStock}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ruptures</p>
                <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valeur Totale</p>
                <p className="text-2xl font-bold">{totalValue.toLocaleString('fr-FR')}€</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Recherche rapide..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <StockAdvancedFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau du stock */}
      <Card>
        <CardHeader>
          <CardTitle>Stock ({filteredData.length} articles)</CardTitle>
          <CardDescription>
            Liste complète de votre inventaire avec filtres appliqués
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Prix unitaire</TableHead>
                <TableHead>Valeur totale</TableHead>
                <TableHead>Emplacement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière MAJ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={item.quantity <= item.minQuantity ? 'text-red-600 font-semibold' : ''}>
                        {item.quantity}
                      </span>
                      <span className="text-sm text-gray-500">/ {item.minQuantity} min</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.price.toFixed(2)}€</TableCell>
                  <TableCell className="font-semibold">
                    {(item.quantity * item.price).toFixed(2)}€
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{new Date(item.lastUpdate).toLocaleDateString('fr-FR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockPage;