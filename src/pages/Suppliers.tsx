

// import SupplierTable from "@/components/suppliers/SupplierTable";

// const Suppliers = () => {
//   return (
//     <div className="space-y-3">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
//         <p className="text-muted-foreground">Gérez vos fournisseurs et leurs informations</p>
//       </div>

//       <SupplierTable />
//     </div>
//   );
// };

// export default Suppliers;
import { useState, useMemo } from "react";
import { Search, Plus, ArrowUpDown, MoreHorizontal, Download, Mail, Phone, MapPin, Globe, FileText, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatCard } from "@/components/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplierForm } from "@/components/SupplierForm";
// import { SupplierFiltersComponent, SupplierFilters } from "@/components/SupplierFilters";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { SupplierFilters, SupplierFiltersComponent } from "@/components/SupplierFilters";

// Interface étendue pour les fournisseurs
interface ExtendedSupplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  website: string;
  siret: string;
  tva: string;
  status: string;
  paymentTerms: string;
  deliveryTime: string;
  minOrder: string;
  categories: string[];
  notes: string;
  orders: number;
  total: string;
  lastOrder: string;
  rating: number;
}

// Données étendues des fournisseurs
const extendedSuppliersData: ExtendedSupplier[] = [
  { 
    id: 1, 
    name: "TechWorld Solutions", 
    contact: "Jean Dupont", 
    email: "contact@techworld.com", 
    phone: "+33 1 23 45 67 89",
    address: "15 Avenue des Technologies",
    city: "Paris",
    postalCode: "75001",
    country: "France",
    website: "https://techworld.com",
    siret: "12345678901234",
    tva: "FR12345678901",
    status: "Actif",
    paymentTerms: "30 jours",
    deliveryTime: "1-2 semaines",
    minOrder: "500",
    categories: ["Électronique", "Informatique"],
    notes: "Fournisseur principal pour les équipements IT",
    orders: 12,
    total: "43,250.00 €",
    lastOrder: "15/03/2024",
    rating: 4.5
  },
  { 
    id: 2, 
    name: "EuroFurn SARL", 
    contact: "Marie Martin", 
    email: "info@eurofurn.fr", 
    phone: "+33 1 98 76 54 32",
    address: "8 Rue de l'Industrie",
    city: "Lyon",
    postalCode: "69000",
    country: "France",
    website: "https://eurofurn.fr",
    siret: "98765432109876",
    tva: "FR98765432109",
    status: "Actif",
    paymentTerms: "45 jours",
    deliveryTime: "2-3 semaines",
    minOrder: "1000",
    categories: ["Mobilier", "Fournitures"],
    notes: "Spécialisé en mobilier de bureau",
    orders: 8,
    total: "28,750.50 €",
    lastOrder: "10/03/2024",
    rating: 4.2
  },
  { 
    id: 3, 
    name: "GreenSupply Co", 
    contact: "Pierre Bernard", 
    email: "service@greensupply.be", 
    phone: "+32 2 345 67 89",
    address: "25 Green Street",
    city: "Bruxelles",
    postalCode: "1000",
    country: "Belgique",
    website: "https://greensupply.be",
    siret: "BE987654321",
    tva: "BE0987654321",
    status: "Inactif",
    paymentTerms: "30 jours",
    deliveryTime: "1 semaine",
    minOrder: "200",
    categories: ["Fournitures", "Textile"],
    notes: "En cours de négociation tarifaire",
    orders: 0,
    total: "0.00 €",
    lastOrder: "-",
    rating: 3.8
  },
  { 
    id: 4, 
    name: "AutoParts Express", 
    contact: "Sophie Petit", 
    email: "contact@autoparts.com", 
    phone: "+33 4 23 45 67 90",
    address: "120 Zone Industrielle",
    city: "Marseille",
    postalCode: "13000",
    country: "France",
    website: "https://autoparts.com",
    siret: "11223344556677",
    tva: "FR11223344556",
    status: "Actif",
    paymentTerms: "15 jours",
    deliveryTime: "3-5 jours",
    minOrder: "100",
    categories: ["Automobile", "Outillage"],
    notes: "Livraison express disponible",
    orders: 5,
    total: "12,450.75 €",
    lastOrder: "20/03/2024",
    rating: 4.7
  },
  { 
    id: 5, 
    name: "ChemLab Industries", 
    contact: "Thomas Leroy", 
    email: "info@chemlab.ch", 
    phone: "+41 22 345 67 90",
    address: "50 Innovation Park",
    city: "Genève",
    postalCode: "1200",
    country: "Suisse",
    website: "https://chemlab.ch",
    siret: "CHE123456789",
    tva: "CHE123456789TVA",
    status: "Actif",
    paymentTerms: "60 jours",
    deliveryTime: "1-3 semaines",
    minOrder: "2000",
    categories: ["Chimie", "Construction"],
    notes: "Produits spécialisés haute qualité",
    orders: 7,
    total: "19,875.25 €",
    lastOrder: "12/03/2024",
    rating: 4.9
  },
];

const ordersData = [
  { id: "PO-458", supplier: "TechWorld Solutions", date: "04/04/2023", amount: "3,780.50 €", status: "Reçue", products: 15 },
  { id: "PO-457", supplier: "EuroFurn SARL", date: "03/04/2023", amount: "1,875.25 €", status: "En attente", products: 8 },
  { id: "PO-456", supplier: "TechWorld Solutions", date: "02/04/2023", amount: "2,450.00 €", status: "Reçue", products: 12 },
  { id: "PO-455", supplier: "ChemLab Industries", date: "30/03/2023", amount: "950.75 €", status: "En transit", products: 5 },
  { id: "PO-454", supplier: "AutoParts Express", date: "29/03/2023", amount: "3,200.00 €", status: "Reçue", products: 25 },
];

type SortField = 'name' | 'contact' | 'city' | 'orders' | 'total' | 'lastOrder' | 'rating';
type SortDirection = 'asc' | 'desc';

const Suppliers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<ExtendedSupplier | null>(null);
  const [deleteSupplier, setDeleteSupplier] = useState<ExtendedSupplier | null>(null);
  const [suppliers, setSuppliers] = useState<ExtendedSupplier[]>(extendedSuppliersData);
  
  const [filters, setFilters] = useState<SupplierFilters>({
    status: "",
    city: "",
    country: "",
    categories: [],
    paymentTerms: "",
    minOrders: "",
    hasOrders: ""
  });

  // Fonction de tri
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtrage et tri des fournisseurs
  const filteredAndSortedSuppliers = useMemo(() => {
    let filtered = suppliers.filter(supplier => {
      const matchesSearch = 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !filters.status || supplier.status === filters.status;
      const matchesCity = !filters.city || supplier.city.toLowerCase().includes(filters.city.toLowerCase());
      const matchesCountry = !filters.country || supplier.country === filters.country;
      const matchesPaymentTerms = !filters.paymentTerms || supplier.paymentTerms === filters.paymentTerms;
      const matchesHasOrders = !filters.hasOrders || 
        (filters.hasOrders === 'with-orders' && supplier.orders > 0) ||
        (filters.hasOrders === 'without-orders' && supplier.orders === 0);
      const matchesCategories = filters.categories.length === 0 || 
        filters.categories.some(cat => supplier.categories.includes(cat));

      return matchesSearch && matchesStatus && matchesCity && matchesCountry && 
             matchesPaymentTerms && matchesHasOrders && matchesCategories;
    });

    // Tri
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'total') {
        aValue = parseFloat(a.total.replace(/[€\s,]/g, '').replace('.', ''));
        bValue = parseFloat(b.total.replace(/[€\s,]/g, '').replace('.', ''));
      } else if (sortField === 'lastOrder') {
        aValue = a.lastOrder === '-' ? new Date(0) : new Date(a.lastOrder.split('/').reverse().join('-'));
        bValue = b.lastOrder === '-' ? new Date(0) : new Date(b.lastOrder.split('/').reverse().join('-'));
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [suppliers, searchTerm, sortField, sortDirection, filters]);

  // Statistiques
  const stats = useMemo(() => {
    const active = suppliers.filter(s => s.status === "Actif").length;
    const inactive = suppliers.filter(s => s.status === "Inactif").length;
    const totalOrders = suppliers.reduce((sum, s) => sum + s.orders, 0);
    const totalValue = suppliers.reduce((sum, s) => {
      const value = parseFloat(s.total.replace(/[€\s,]/g, '').replace('.', ''));
      return sum + value;
    }, 0);
    const avgRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length;

    return { active, inactive, totalOrders, totalValue, avgRating };
  }, [suppliers]);

  // Export des données
  const handleExport = () => {
    const csvContent = [
      ['Nom', 'Contact', 'Email', 'Téléphone', 'Ville', 'Pays', 'Statut', 'Commandes', 'Total'].join(','),
      ...filteredAndSortedSuppliers.map(supplier => [
        supplier.name,
        supplier.contact,
        supplier.email,
        supplier.phone,
        supplier.city,
        supplier.country,
        supplier.status,
        supplier.orders,
        supplier.total
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fournisseurs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Export réussi",
      description: "Les données ont été exportées au format CSV.",
    });
  };

  // Gestion du formulaire
  const handleSubmitSupplier = (supplierData: any) => {
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => 
        s.id === editingSupplier.id 
          ? { ...supplierData, id: editingSupplier.id, orders: editingSupplier.orders, total: editingSupplier.total, lastOrder: editingSupplier.lastOrder, rating: editingSupplier.rating }
          : s
      ));
      toast({
        title: "Fournisseur modifié",
        description: "Les informations ont été mises à jour avec succès.",
      });
    } else {
      const newSupplier = {
        ...supplierData,
        id: Math.max(...suppliers.map(s => s.id)) + 1,
        orders: 0,
        total: "0.00 €",
        lastOrder: "-",
        rating: 0
      };
      setSuppliers([...suppliers, newSupplier]);
      toast({
        title: "Fournisseur créé",
        description: "Le nouveau fournisseur a été ajouté avec succès.",
      });
    }
    setEditingSupplier(null);
    setIsFormOpen(false);
  };

  // Suppression d'un fournisseur
  const handleDeleteSupplier = () => {
    if (deleteSupplier) {
      setSuppliers(suppliers.filter(s => s.id !== deleteSupplier.id));
      toast({
        title: "Fournisseur supprimé",
        description: "Le fournisseur a été supprimé avec succès.",
        variant: "destructive"
      });
      setDeleteSupplier(null);
    }
  };

  // Reset des filtres
  const resetFilters = () => {
    setFilters({
      status: "",
      city: "",
      country: "",
      categories: [],
      paymentTerms: "",
      minOrders: "",
      hasOrders: ""
    });
    setSearchTerm("");
  };

  return (
    <div className="space-y-3 px-3">
      <div className="flex justify-between items-center">
        <h1  className="text-2xl font-bold  tracking-tight " style={{ fontSize: "18px" }}>Fournisseurs</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Exporter
          </Button>
          <Button size="sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Nouveau fournisseur
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard 
          title="Fournisseurs actifs" 
          value={stats.active}
          className="bg-emerald-50 border-emerald-200"
        />
        <StatCard 
          title="Fournisseurs inactifs" 
          value={stats.inactive}
          className="bg-red-50 border-red-200"
        />
        <StatCard 
          title="Commandes totales" 
          value={stats.totalOrders}
          className="bg-blue-50 border-blue-200"
        />
        <StatCard 
          title="Valeur totale" 
          value={`${stats.totalValue.toLocaleString('fr-FR')} €`}
          className="bg-purple-50 border-purple-200"
        />
        <StatCard 
          title="Note moyenne" 
          value={`${stats.avgRating.toFixed(1)}/5`}
          className="bg-amber-50 border-amber-200"
        />
      </div>

      <Tabs defaultValue="suppliers" className="w-full">
        <TabsList className="mb-3">
          <TabsTrigger value="suppliers">Fournisseurs ({filteredAndSortedSuppliers.length})</TabsTrigger>
          <TabsTrigger value="orders">Commandes ({ordersData.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers">
          {/* Search and Filter */}
          <Card className="mb-3">
            <CardContent className="p-3">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-auto flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Rechercher par nom, contact, email, ville..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                  <SupplierFiltersComponent
                    filters={filters}
                    onFiltersChange={setFilters}
                    onReset={resetFilters}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <ArrowUpDown className="h-4 w-4 mr-2" /> 
                        Trier par {sortField === 'name' ? 'Nom' : 
                                  sortField === 'contact' ? 'Contact' : 
                                  sortField === 'city' ? 'Ville' : 
                                  sortField === 'orders' ? 'Commandes' : 
                                  sortField === 'total' ? 'Total' : 
                                  sortField === 'lastOrder' ? 'Dernière commande' : 'Note'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuItem onClick={() => handleSort('name')}>
                        Nom {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('contact')}>
                        Contact {sortField === 'contact' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('city')}>
                        Ville {sortField === 'city' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('orders')}>
                        Commandes {sortField === 'orders' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('total')}>
                        Total {sortField === 'total' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('lastOrder')}>
                        Dernière commande {sortField === 'lastOrder' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('rating')}>
                        Note {sortField === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suppliers Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Fournisseur</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Localisation</TableHead>
                    <TableHead className="font-semibold">Catégories</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="font-semibold">Commandes</TableHead>
                    <TableHead className="font-semibold">Total</TableHead>
                    <TableHead className="font-semibold">Note</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{supplier.name}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {supplier.website && (
                              <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                <span className="truncate max-w-[120px]">{supplier.website.replace('https://', '')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{supplier.contact}</div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[140px]">{supplier.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="h-3 w-3" />
                            <span>{supplier.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span>{supplier.city}, {supplier.country}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {supplier.categories.slice(0, 2).map(category => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                          {supplier.categories.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{supplier.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={supplier.status === "Actif" ? "default" : supplier.status === "Inactif" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {supplier.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">{supplier.orders}</div>
                          <div className="text-xs text-gray-500">{supplier.lastOrder}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{supplier.total}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{supplier.rating}</span>
                          <span className="text-amber-400">★</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingSupplier(supplier);
                                setIsFormOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Nouvelle commande
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => setDeleteSupplier(supplier)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Commandes fournisseurs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">N° de commande</TableHead>
                    <TableHead className="font-semibold">Fournisseur</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Produits</TableHead>
                    <TableHead className="font-semibold">Montant</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersData.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-blue-600">{order.id}</TableCell>
                      <TableCell className="font-medium">{order.supplier}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.products} articles</TableCell>
                      <TableCell className="font-medium">{order.amount}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === "Reçue" ? "default" : 
                            order.status === "En transit" ? "secondary" : 
                            "destructive"
                          }
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Annuler
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Formulaire d'ajout/modification */}
      <SupplierForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSupplier(null);
        }}
        onSubmit={handleSubmitSupplier}
        initialData={editingSupplier}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!deleteSupplier} onOpenChange={() => setDeleteSupplier(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le fournisseur</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le fournisseur "{deleteSupplier?.name}" ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSupplier} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Suppliers;
