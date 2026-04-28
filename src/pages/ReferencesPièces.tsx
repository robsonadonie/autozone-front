// import { useState, useMemo } from "react";
// import { Package, Search, Plus, Eye, Edit, Trash2, TrendingUp, TrendingDown, AlertTriangle, Filter, X, Download } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { 
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
// import { Badge } from "@/components/ui/badge";
// import { motion } from "framer-motion";
// import { format } from "date-fns";
// import { DatePicker } from "@/components/SuiviVentes/DatePicker";
// import { formatCurrency } from "@/components/SuiviVentes/utils";
// import { PieceReferencesModal } from "@/components/PieceReferencesModal";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

// // Types
// interface StockItem {
//   id: string;
//   designation: string;
//   marque: string;
//   categorie: string;
//   quantiteStock: number;
//   quantiteMinimale: number;
//   prixAchat: number;
//   prixVente: number;
//   emplacement: string;
//   fournisseur: string;
//   dateDerniereEntree: string;
//   status: "disponible" | "rupture" | "alerte";
//   image?: string;
//   // Nouvelles propriétés ajoutées
//   codeBarres?: string;
//   codeItems?: string;
//   origine?: string;
//   marqueProduit?: string;
//   modele?: string;
//   serie?: string;
//   prixAffiche?: number;
//   dernierPrix?: number;
//   description?: string;
// }

// interface EntreeStock {
//   id: string;
//   date: string;
//   produitId: string;
//   designation: string;
//   quantite: number;
//   prixAchat: number;
//   fournisseur: string;
//   numeroFacture: string;
//   typeEntree: "achat" | "retour" | "ajustement";
//   commentaire?: string;
// }

// interface ProductFormData {
//   codeBarres: string;
//   codeItems: string;
//   designation: string;
//   origine: string;
//   marqueProduit: string;
//   marque: string;
//   modele: string;
//   serie: string;
//   categorie: string;
//   prixAffiche: number;
//   dernierPrix: number;
//   emplacement: string;
//   quantiteStock: number;
//   quantiteMinimale: number;
//   description: string;
// }

// // Données de référence pour le filtrage en cascade
// const referenceData = {
//   origines: [
//     { id: "1", nom: "Japonais", description: "Constructeurs automobiles japonais" },
//     { id: "2", nom: "Allemand", description: "Constructeurs automobiles allemands" },
//     { id: "3", nom: "Français", description: "Constructeurs automobiles français" },
//     { id: "4", nom: "Coréen", description: "Constructeurs automobiles coréens" },
//     { id: "5", nom: "Italien", description: "Constructeurs automobiles italiens" },
//     { id: "6", nom: "Américain", description: "Constructeurs automobiles américains" },
//     { id: "7", nom: "Suédois", description: "Constructeurs automobiles suédois" },
//     { id: "8", nom: "Britannique", description: "Constructeurs automobiles britanniques" },
//     { id: "9", nom: "Tchèque", description: "Constructeurs automobiles tchèques" },
//     { id: "10", nom: "Espagnol", description: "Constructeurs automobiles espagnols" },
  
//   ],
//   marquesProduit: [
//     // Marques japonaises
//     { id: "1", nom: "Toyota", origine: "Japonais", description: "Constructeur automobile japonais" },
//     { id: "2", nom: "Honda", origine: "Japonais", description: "Constructeur automobile japonais" },
//     { id: "3", nom: "Nissan", origine: "Japonais", description: "Constructeur automobile japonais" },
//     { id: "4", nom: "Mazda", origine: "Japonais", description: "Constructeur automobile japonais" },
//     { id: "5", nom: "Subaru", origine: "Japonais", description: "Constructeur automobile japonais" },
//     { id: "6", nom: "Mitsubishi", origine: "Japonais", description: "Constructeur automobile japonais" },
//     { id: "7", nom: "Lexus", origine: "Japonais", description: "Marque premium de Toyota" },
//     { id: "8", nom: "Infiniti", origine: "Japonais", description: "Marque premium de Nissan" },
//     { id: "9", nom: "Acura", origine: "Japonais", description: "Marque premium de Honda" },
    
//     // Marques allemandes
//     { id: "10", nom: "BMW", origine: "Allemand", description: "Constructeur automobile allemand" },
//     { id: "11", nom: "Mercedes-Benz", origine: "Allemand", description: "Constructeur automobile allemand" },
//     { id: "12", nom: "Audi", origine: "Allemand", description: "Constructeur automobile allemand" },
//     { id: "13", nom: "Volkswagen", origine: "Allemand", description: "Constructeur automobile allemand" },
//     { id: "14", nom: "Porsche", origine: "Allemand", description: "Constructeur automobile allemand" },
//     { id: "15", nom: "Opel", origine: "Allemand", description: "Constructeur automobile allemand" },
//     { id: "16", nom: "MINI", origine: "Allemand", description: "Marque du groupe BMW" },
    
//     // Marques françaises
//     { id: "17", nom: "Peugeot", origine: "Français", description: "Constructeur automobile français" },
//     { id: "18", nom: "Citroën", origine: "Français", description: "Constructeur automobile français" },
//     { id: "19", nom: "Renault", origine: "Français", description: "Constructeur automobile français" },
//     { id: "20", nom: "Dacia", origine: "Français", description: "Marque du groupe Renault" },
//     { id: "21", nom: "Alpine", origine: "Français", description: "Marque sportive du groupe Renault" },
//     { id: "22", nom: "DS", origine: "Français", description: "Marque premium de Citroën" },
    
//     // Marques coréennes
//     { id: "23", nom: "Hyundai", origine: "Coréen", description: "Constructeur automobile coréen" },
//     { id: "24", nom: "Kia", origine: "Coréen", description: "Constructeur automobile coréen" },
//     { id: "25", nom: "Genesis", origine: "Coréen", description: "Marque premium de Hyundai" },
    
//     // Marques italiennes
//     { id: "26", nom: "Fiat", origine: "Italien", description: "Constructeur automobile italien" },
//     { id: "27", nom: "Ferrari", origine: "Italien", description: "Constructeur automobile italien" },
//     { id: "28", nom: "Lamborghini", origine: "Italien", description: "Constructeur automobile italien" },
//     { id: "29", nom: "Alfa Romeo", origine: "Italien", description: "Constructeur automobile italien" },
//     { id: "30", nom: "Maserati", origine: "Italien", description: "Constructeur automobile italien" },
    
//     // Marques américaines
//     { id: "31", nom: "Ford", origine: "Américain", description: "Constructeur automobile américain" },
//     { id: "32", nom: "Chevrolet", origine: "Américain", description: "Marque du groupe General Motors" },
//     { id: "33", nom: "Cadillac", origine: "Américain", description: "Marque premium du groupe General Motors" },
//     { id: "34", nom: "Tesla", origine: "Américain", description: "Constructeur de véhicules électriques" },
//     { id: "35", nom: "Chrysler", origine: "Américain", description: "Constructeur automobile américain" },
//     { id: "36", nom: "Jeep", origine: "Américain", description: "Marque de SUV américaine" },
    
//     // Marques suédoises
//     { id: "37", nom: "Volvo", origine: "Suédois", description: "Constructeur automobile suédois" },
//     { id: "38", nom: "Saab", origine: "Suédois", description: "Ancien constructeur automobile suédois" },
    
//     // Marques britanniques
//     { id: "39", nom: "Land Rover", origine: "Britannique", description: "Constructeur de SUV britannique" },
//     { id: "40", nom: "Jaguar", origine: "Britannique", description: "Constructeur automobile britannique" },
//     { id: "41", nom: "Aston Martin", origine: "Britannique", description: "Constructeur automobile britannique" },
//     { id: "42", nom: "Bentley", origine: "Britannique", description: "Constructeur automobile britannique" },
//     { id: "43", nom: "Rolls-Royce", origine: "Britannique", description: "Constructeur automobile britannique" },
    
//     // Marques tchèques
//     { id: "44", nom: "Škoda", origine: "Tchèque", description: "Constructeur automobile tchèque" },
    
//     // Marques espagnoles
//     { id: "45", nom: "SEAT", origine: "Espagnol", description: "Constructeur automobile espagnol" },
//   ], 
//   modeles: [
//     // Modèles Toyota
//     { id: "1", nom: "Corolla", marque: "Toyota", description: "Berline compacte" },
//     { id: "2", nom: "Camry", marque: "Toyota", description: "Berline familiale" },
//     { id: "3", nom: "RAV4", marque: "Toyota", description: "SUV compact" },
//     { id: "4", nom: "Prius", marque: "Toyota", description: "Hybride" },
//     { id: "5", nom: "Yaris", marque: "Toyota", description: "Citadine" },
//     { id: "6", nom: "Highlander", marque: "Toyota", description: "SUV 7 places" },
    
//     // Modèles BMW
//     { id: "7", nom: "Série 3", marque: "BMW", description: "Berline compacte premium" },
//     { id: "8", nom: "Série 5", marque: "BMW", description: "Berline familiale premium" },
//     { id: "9", nom: "X3", marque: "BMW", description: "SUV compact premium" },
//     { id: "10", nom: "X5", marque: "BMW", description: "SUV familial premium" },
//     { id: "11", nom: "Série 1", marque: "BMW", description: "Compacte premium" },
    
//     // Modèles Mercedes-Benz
//     { id: "12", nom: "Classe A", marque: "Mercedes-Benz", description: "Compacte premium" },
//     { id: "13", nom: "Classe C", marque: "Mercedes-Benz", description: "Berline compacte premium" },
//     { id: "14", nom: "Classe E", marque: "Mercedes-Benz", description: "Berline familiale premium" },
//     { id: "15", nom: "GLC", marque: "Mercedes-Benz", description: "SUV compact premium" },
//     { id: "16", nom: "GLE", marque: "Mercedes-Benz", description: "SUV familial premium" },
    
//     // Modèles Peugeot
//     { id: "17", nom: "208", marque: "Peugeot", description: "Citadine" },
//     { id: "18", nom: "308", marque: "Peugeot", description: "Compacte" },
//     { id: "19", nom: "3008", marque: "Peugeot", description: "SUV compact" },
//     { id: "20", nom: "5008", marque: "Peugeot", description: "SUV 7 places" },
//     { id: "21", nom: "508", marque: "Peugeot", description: "Berline familiale" },
    
//     // Modèles Renault
//     { id: "22", nom: "Clio", marque: "Renault", description: "Citadine" },
//     { id: "23", nom: "Mégane", marque: "Renault", description: "Compacte" },
//     { id: "24", nom: "Kadjar", marque: "Renault", description: "SUV compact" },
//     { id: "25", nom: "Captur", marque: "Renault", description: "SUV urbain" },
//     { id: "26", nom: "Talisman", marque: "Renault", description: "Berline familiale" },
    
//     // Modèles Volkswagen
//     { id: "27", nom: "Golf", marque: "Volkswagen", description: "Compacte" },
//     { id: "28", nom: "Polo", marque: "Volkswagen", description: "Citadine" },
//     { id: "29", nom: "Tiguan", marque: "Volkswagen", description: "SUV compact" },
//     { id: "30", nom: "Passat", marque: "Volkswagen", description: "Berline familiale" },
//     { id: "31", nom: "Touareg", marque: "Volkswagen", description: "SUV premium" },
    
//     // Modèles Audi
//     { id: "32", nom: "A3", marque: "Audi", description: "Compacte premium" },
//     { id: "33", nom: "A4", marque: "Audi", description: "Berline compacte premium" },
//     { id: "34", nom: "A6", marque: "Audi", description: "Berline familiale premium" },
//     { id: "35", nom: "Q3", marque: "Audi", description: "SUV compact premium" },
//     { id: "36", nom: "Q5", marque: "Audi", description: "SUV familial premium" },
    
//     // Modèles Ford
//     { id: "37", nom: "Focus", marque: "Ford", description: "Compacte" },
//     { id: "38", nom: "Fiesta", marque: "Ford", description: "Citadine" },
//     { id: "39", nom: "Kuga", marque: "Ford", description: "SUV compact" },
//     { id: "40", nom: "Mondeo", marque: "Ford", description: "Berline familiale" },
//     { id: "41", nom: "EcoSport", marque: "Ford", description: "SUV urbain" },
//   ],
//   series: [
//     // Séries Toyota Corolla
//     { id: "1", nom: "Active", marque: "Toyota", description: "Finition de base" },
//     { id: "2", nom: "Dynamic", marque: "Toyota", description: "Finition intermédiaire" },
//     { id: "3", nom: "Exclusive", marque: "Toyota", description: "Finition haut de gamme" },
//     { id: "4", nom: "GR Sport", marque: "Toyota", description: "Finition sportive" },
    
//     // Séries BMW
//     { id: "5", nom: "Efficient Dynamics", marque: "BMW", description: "Version économique" },
//     { id: "6", nom: "M Sport", marque: "BMW", description: "Pack sport" },
//     { id: "7", nom: "Luxury", marque: "BMW", description: "Pack luxe" },
//     { id: "8", nom: "M Performance", marque: "BMW", description: "Performance sportive" },
//     { id: "9", nom: "xDrive", marque: "BMW", description: "Transmission intégrale" },
    
//     // Séries Mercedes-Benz
//     { id: "10", nom: "Style", marque: "Mercedes-Benz", description: "Finition de base" },
//     { id: "11", nom: "Progressive", marque: "Mercedes-Benz", description: "Finition intermédiaire" },
//     { id: "12", nom: "AMG Line", marque: "Mercedes-Benz", description: "Pack sportif AMG" },
//     { id: "13", nom: "Avantgarde", marque: "Mercedes-Benz", description: "Finition élégante" },
//     { id: "14", nom: "4MATIC", marque: "Mercedes-Benz", description: "Transmission intégrale" },
    
//     // Séries Peugeot
//     { id: "15", nom: "Active", marque: "Peugeot", description: "Finition de base" },
//     { id: "16", nom: "Allure", marque: "Peugeot", description: "Finition intermédiaire" },
//     { id: "17", nom: "GT Line", marque: "Peugeot", description: "Finition sportive" },
//     { id: "18", nom: "GT", marque: "Peugeot", description: "Version sportive" },
    
//     // Séries Renault
//     { id: "19", nom: "Life", marque: "Renault", description: "Finition de base" },
//     { id: "20", nom: "Zen", marque: "Renault", description: "Finition intermédiaire" },
//     { id: "21", nom: "Intens", marque: "Renault", description: "Finition haut de gamme" },
//     { id: "22", nom: "RS Line", marque: "Renault", description: "Finition sportive" },
    
//     // Séries Volkswagen
//     { id: "23", nom: "Trendline", marque: "Volkswagen", description: "Finition de base" },
//     { id: "24", nom: "Comfortline", marque: "Volkswagen", description: "Finition intermédiaire" },
//     { id: "25", nom: "Highline", marque: "Volkswagen", description: "Finition haut de gamme" },
//     { id: "26", nom: "R-Line", marque: "Volkswagen", description: "Pack sportif" },
//     { id: "27", nom: "GTI", marque: "Volkswagen", description: "Version sportive" },
    
//     // Séries Audi
//     { id: "28", nom: "Attraction", marque: "Audi", description: "Finition de base" },
//     { id: "29", nom: "Ambition", marque: "Audi", description: "Finition intermédiaire" },
//     { id: "30", nom: "S line", marque: "Audi", description: "Pack sportif" },
//     { id: "31", nom: "Competition", marque: "Audi", description: "Finition premium" },
//     { id: "32", nom: "quattro", marque: "Audi", description: "Transmission intégrale" },
//   ],
// };

// // Mock data
// const mockStockData: StockItem[] = [
//   {
//     id: "P-001",
//     designation: "VITRE AVANT GAUCHE CLAIRE",
//     marque: "XINYI",
//     categorie: "VITRE",
//     quantiteStock: 15,
//     quantiteMinimale: 5,
//     prixAchat: 80.00,
//     prixVente: 150.00,
//     emplacement: "A-01-15",
//     fournisseur: "FOURNISSEUR AUTO",
//     dateDerniereEntree: "2024-12-05",
//     status: "disponible",
//     codeBarres: "1234567890123",
//     codeItems: "ITM-001",
//     origine: "origine",
//     marqueProduit: "bosch",
//     modele: "308",
//     serie: "premium",
//     prixAffiche: 150.00,
//     dernierPrix: 145.00,
//     description: "Vitre avant gauche claire pour véhicule"
//   },
//   {
//     id: "P-002",
//     designation: "PLAQUETTE FREIN AVANT",
//     marque: "MOTORCRAFT",
//     categorie: "FREIN",
//     quantiteStock: 3,
//     quantiteMinimale: 10,
//     prixAchat: 25.00,
//     prixVente: 45.00,
//     emplacement: "B-03-22",
//     fournisseur: "PIECES FRANCE",
//     dateDerniereEntree: "2024-11-28",
//     status: "alerte",
//     codeBarres: "2345678901234",
//     codeItems: "ITM-002",
//     origine: "adaptable",
//     marqueProduit: "febi",
//     modele: "a3",
//     serie: "sportback",
//     prixAffiche: 45.00,
//     dernierPrix: 40.00,
//     description: "Plaquettes de frein avant haute performance"
//   },
//   {
//     id: "P-003",
//     designation: "FILTRE À HUILE",
//     marque: "BOSCH",
//     categorie: "ENTRETIEN",
//     quantiteStock: 0,
//     quantiteMinimale: 8,
//     prixAchat: 8.00,
//     prixVente: 12.50,
//     emplacement: "C-02-10",
//     fournisseur: "BOSCH FRANCE",
//     dateDerniereEntree: "2024-11-15",
//     status: "rupture",
//     codeBarres: "3456789012345",
//     codeItems: "ITM-003",
//     origine: "origine",
//     marqueProduit: "valeo",
//     modele: "megane",
//     serie: "expression",
//     prixAffiche: 12.50,
//     dernierPrix: 11.00,
//     description: "Filtre à huile pour moteurs essence et diesel"
//   },
//   {
//     id: "P-004",
//     designation: "AMORTISSEUR AVANT DROIT",
//     marque: "BILSTEIN",
//     categorie: "SUSPENSION",
//     quantiteStock: 8,
//     quantiteMinimale: 3,
//     prixAchat: 120.00,
//     prixVente: 200.00,
//     emplacement: "D-01-05",
//     fournisseur: "SUSPENSION PRO",
//     dateDerniereEntree: "2024-12-01",
//     status: "disponible",
//     codeBarres: "4567890123456",
//     codeItems: "ITM-004",
//     origine: "occasion",
//     marqueProduit: "peugeot",
//     modele: "308-occ",
//     serie: "reconditionne",
//     prixAffiche: 200.00,
//     dernierPrix: 190.00,
//     description: "Amortisseur avant droit reconditionné"
//   }
// ];

// const mockEntreesData: EntreeStock[] = [
//   {
//     id: "E-001",
//     date: "2024-12-10",
//     produitId: "P-001",
//     designation: "VITRE AVANT GAUCHE CLAIRE",
//     quantite: 10,
//     prixAchat: 80.00,
//     fournisseur: "FOURNISSEUR AUTO",
//     numeroFacture: "FA-2024-156",
//     typeEntree: "achat",
//     commentaire: "Commande régulière"
//   },
//   {
//     id: "E-002",
//     date: "2024-12-09",
//     produitId: "P-002",
//     designation: "PLAQUETTE FREIN AVANT",
//     quantite: 20,
//     prixAchat: 25.00,
//     fournisseur: "PIECES FRANCE",
//     numeroFacture: "PF-2024-892",
//     typeEntree: "achat"
//   },
//   {
//     id: "E-003",
//     date: "2024-12-08",
//     produitId: "P-004",
//     designation: "AMORTISSEUR AVANT DROIT",
//     quantite: 5,
//     prixAchat: 120.00,
//     fournisseur: "SUSPENSION PRO",
//     numeroFacture: "SP-2024-445",
//     typeEntree: "achat"
//   }
// ];

// const StockPage = () => {
//   const [activeTab, setActiveTab] = useState("stock");
//   const [stockData, setStockData] = useState<StockItem[]>(mockStockData);
//   const [entreesData, setEntreesData] = useState<EntreeStock[]>(mockEntreesData);
  
//   // États pour le stock
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const [showFilters, setShowFilters] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
  
//   // États pour les entrées
//   const [startDate, setStartDate] = useState<Date | undefined>(undefined);
//   const [endDate, setEndDate] = useState<Date | undefined>(undefined);
//   const [selectedFournisseur, setSelectedFournisseur] = useState("all");
//   const [selectedTypeEntree, setSelectedTypeEntree] = useState("all");
  
//   // États des modals
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [isCreateStockModalOpen, setIsCreateStockModalOpen] = useState(false);
//   const [isCreateEntreeModalOpen, setIsCreateEntreeModalOpen] = useState(false);
//   const [isEditStockModalOpen, setIsEditStockModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
//   const [selectedEntree, setSelectedEntree] = useState<EntreeStock | null>(null);
  
//   // Nouvel état pour la modal de références
//   const [isReferencesModalOpen, setIsReferencesModalOpen] = useState(false);
  
//   // États pour le formulaire de produit
//   const [productFormData, setProductFormData] = useState<ProductFormData>({
//     codeBarres: '',
//     codeItems: '',
//     designation: '',
//     origine: '',
//     marqueProduit: '',
//     marque: '',
//     modele: '',
//     serie: '',
//     categorie: '',
//     prixAffiche: 0,
//     dernierPrix: 0,
//     emplacement: '',
//     quantiteStock: 0,
//     quantiteMinimale: 0,
//     description: ''
//   });
  
//   const { toast } = useToast();
//   const itemsPerPage = 10;

//   // Statistiques du stock
//   const stockStatistics = useMemo(() => {
//     const totalProduits = stockData.length;
//     const produitsDisponibles = stockData.filter(item => item.status === "disponible").length;
//     const produitsEnAlerte = stockData.filter(item => item.status === "alerte").length;
//     const produitsEnRupture = stockData.filter(item => item.status === "rupture").length;
//     const valeurTotale = stockData.reduce((acc, item) => acc + (item.quantiteStock * item.prixAchat), 0);
    
//     return {
//       totalProduits,
//       produitsDisponibles,
//       produitsEnAlerte,
//       produitsEnRupture,
//       valeurTotale
//     };
//   }, [stockData]);

//   // Filtrage du stock
//   const filteredStock = useMemo(() => {
//     return stockData.filter(item => {
//       const matchesSearch = !searchTerm || 
//         item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.marque.toLowerCase().includes(searchTerm.toLowerCase());
      
//       const matchesCategory = selectedCategory === "all" || item.categorie === selectedCategory;
//       const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
      
//       return matchesSearch && matchesCategory && matchesStatus;
//     });
//   }, [stockData, searchTerm, selectedCategory, selectedStatus]);

//   // Filtrage des entrées
//   const filteredEntrees = useMemo(() => {
//     return entreesData.filter(entree => {
//       const entreeDate = new Date(entree.date);
//       const matchesDateRange = (!startDate || entreeDate >= startDate) && 
//                               (!endDate || entreeDate <= endDate);
      
//       const matchesFournisseur = selectedFournisseur === "all" || entree.fournisseur === selectedFournisseur;
//       const matchesType = selectedTypeEntree === "all" || entree.typeEntree === selectedTypeEntree;
      
//       return matchesDateRange && matchesFournisseur && matchesType;
//     });
//   }, [entreesData, startDate, endDate, selectedFournisseur, selectedTypeEntree]);

//   const paginatedStock = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredStock.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredStock, currentPage]);

//   const totalPages = Math.ceil(filteredStock.length / itemsPerPage);

//   // Données pour les selects
//   const categories = Array.from(new Set(stockData.map(item => item.categorie)));
//   const fournisseurs = Array.from(new Set(entreesData.map(entree => entree.fournisseur)));

//   const handleRowClick = (item: StockItem) => {
//     setSelectedItem(item);
//     setIsDetailModalOpen(true);
//   };

//   const handleEditItem = (e: React.MouseEvent, item: StockItem) => {
//     e.stopPropagation(); // Empêche le clic sur la ligne
//     setSelectedItem(item);
//     setIsEditStockModalOpen(true);
//   };

//   const handleCreateEntree = () => {
//     setIsCreateEntreeModalOpen(false);
//     toast({
//       title: "Entrée enregistrée",
//       description: "La nouvelle entrée de stock a été enregistrée avec succès."
//     });
//   };

//   // Fonctions pour obtenir les options filtrées
//   const getAvailableMarquesProduit = () => {
//     if (!productFormData.origine) return [];
//     return referenceData.marquesProduit[productFormData.origine as keyof typeof referenceData.marquesProduit] || [];
//   };

//   const getAvailableMarques = () => {
//     if (!productFormData.marqueProduit) return [];
//     return (referenceData.marques as any)[productFormData.marqueProduit as keyof typeof referenceData.marques] || [];
//   };

//   const getAvailableModeles = () => {
//     if (!productFormData.marque) return [];
//     return referenceData.modeles[productFormData.marque as keyof typeof referenceData.modeles] || [];
//   };

//   const getAvailableSeries = () => {
//     if (!productFormData.modele) return [];
//     return referenceData.series[productFormData.modele as keyof typeof referenceData.series] || [];
//   };

//   // Fonction pour réinitialiser les champs dépendants
//   const resetDependentFields = (level: 'origine' | 'marqueProduit' | 'marque' | 'modele') => {
//     const updates: Partial<ProductFormData> = {};
    
//     if (level === 'origine') {
//       updates.marqueProduit = '';
//       updates.marque = '';
//       updates.modele = '';
//       updates.serie = '';
//     } else if (level === 'marqueProduit') {
//       updates.marque = '';
//       updates.modele = '';
//       updates.serie = '';
//     } else if (level === 'marque') {
//       updates.modele = '';
//       updates.serie = '';
//     } else if (level === 'modele') {
//       updates.serie = '';
//     }
    
//     setProductFormData(prev => ({ ...prev, ...updates }));
//   };

//   const handleProductFormChange = (field: keyof ProductFormData, value: string | number) => {
//     setProductFormData(prev => ({ ...prev, [field]: value }));
    
//     // Réinitialiser les champs dépendants si nécessaire
//     if (field === 'origine') {
//       resetDependentFields('origine');
//     } else if (field === 'marqueProduit') {
//       resetDependentFields('marqueProduit');
//     } else if (field === 'marque') {
//       resetDependentFields('marque');
//     } else if (field === 'modele') {
//       resetDependentFields('modele');
//     }
//   };

//   const resetProductForm = () => {
//     setProductFormData({
//       codeBarres: '',
//       codeItems: '',
//       designation: '',
//       origine: '',
//       marqueProduit: '',
//       marque: '',
//       modele: '',
//       serie: '',
//       categorie: '',
//       prixAffiche: 0,
//       dernierPrix: 0,
//       emplacement: '',
//       quantiteStock: 0,
//       quantiteMinimale: 0,
//       description: ''
//     });
//   };

//   const handleCreateStock = () => {
//     // Validation basique
//     if (!productFormData.codeBarres || !productFormData.codeItems || !productFormData.designation || 
//         !productFormData.origine || !productFormData.marqueProduit || !productFormData.marque || 
//         !productFormData.modele || !productFormData.categorie) {
//       toast({
//         title: "Erreur",
//         description: "Veuillez remplir tous les champs obligatoires.",
//         variant: "destructive"
//       });
//       return;
//     }

//     const newPiece: StockItem = {
//       id: `P-${String(stockData.length + 1).padStart(3, '0')}`,
//       designation: productFormData.designation,
//       marque: productFormData.marque,
//       categorie: productFormData.categorie,
//       quantiteStock: productFormData.quantiteStock,
//       quantiteMinimale: productFormData.quantiteMinimale,
//       prixAchat: productFormData.dernierPrix,
//       prixVente: productFormData.prixAffiche,
//       emplacement: productFormData.emplacement,
//       fournisseur: '', // À définir plus tard
//       dateDerniereEntree: new Date().toISOString().split('T')[0],
//       status: productFormData.quantiteStock === 0 ? "rupture" : 
//               productFormData.quantiteStock <= productFormData.quantiteMinimale ? "alerte" : "disponible",
//       codeBarres: productFormData.codeBarres,
//       codeItems: productFormData.codeItems,
//       origine: productFormData.origine,
//       marqueProduit: productFormData.marqueProduit,
//       modele: productFormData.modele,
//       serie: productFormData.serie,
//       prixAffiche: productFormData.prixAffiche,
//       dernierPrix: productFormData.dernierPrix,
//       description: productFormData.description
//     };
    
//     setStockData(prev => [...prev, newPiece]);
//     setIsCreateStockModalOpen(false);
//     resetProductForm();
//     toast({
//       title: "Produit ajouté",
//       description: "Le nouveau produit a été ajouté au stock avec succès."
//     });
//   };

//   const handleUpdateStock = (pieceData: StockItem) => {
//     if (!selectedItem) return;
    
//     const updatedPiece: StockItem = {
//       ...selectedItem,
//       ...pieceData,
//       status: pieceData.quantiteStock === 0 ? "rupture" : 
//               pieceData.quantiteStock <= pieceData.quantiteMinimale ? "alerte" : "disponible",
//     };
    
//     setStockData(prev => prev.map(item => 
//       item.id === selectedItem.id ? updatedPiece : item
//     ));
//     setIsEditStockModalOpen(false);
//     setSelectedItem(null);
//     toast({
//       title: "Produit modifié",
//       description: "Le produit a été modifié avec succès."
//     });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "disponible": return "bg-green-100 text-green-700";
//       case "alerte": return "bg-orange-100 text-orange-700";
//       case "rupture": return "bg-red-100 text-red-700";
//       default: return "bg-gray-100 text-gray-700";
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "disponible": return <Package className="h-4 w-4" />;
//       case "alerte": return <AlertTriangle className="h-4 w-4" />;
//       case "rupture": return <TrendingDown className="h-4 w-4" />;
//       default: return <Package className="h-4 w-4" />;
//     }
//   };

//   const getTypeEntreeColor = (type: string) => {
//     switch (type) {
//       case "achat": return "bg-blue-100 text-blue-700";
//       case "retour": return "bg-green-100 text-green-700";
//       case "ajustement": return "bg-purple-100 text-purple-700";
//       default: return "bg-gray-100 text-gray-700";
//     }
//   };

//   return (
//     <div className="space-y-6 p-6">
//       {/* En-tête */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Gestion du Stock</h1>
//           <p className="text-gray-600 mt-1">Suivi des entrées et gestion complète de votre stock</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={() => setIsReferencesModalOpen(true)}>
//             <Package className="h-4 w-4 mr-2" />
//             Références Pièces
//           </Button>
//           <Button variant="outline">
//             <Download className="h-4 w-4 mr-2" />
//             Exporter
//           </Button>
//           <Button onClick={() => setIsCreateStockModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
//             <Plus className="h-4 w-4 mr-2" />
//             Nouveau produit
//           </Button>
//         </div>
//       </div>

//       {/* Onglets */}
//       <Tabs defaultValue="stock" value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="stock" className="flex items-center gap-2">
//             <Package className="h-4 w-4" />
//             Suivi du Stock
//           </TabsTrigger>
//           <TabsTrigger value="entrees" className="flex items-center gap-2">
//             <TrendingUp className="h-4 w-4" />
//             Entrées de Stock
//           </TabsTrigger>
//         </TabsList>

//         {/* Onglet Stock */}
//         <TabsContent value="stock" className="space-y-6">
//           {/* Cartes statistiques */}
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
//               <Card>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium text-gray-700">Total Produits</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-gray-900">{stockStatistics.totalProduits}</div>
//                   <p className="text-xs text-gray-600 mt-1">Références en stock</p>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
//               <Card className="border-green-200 bg-green-50/50">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium text-green-700">Disponibles</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-green-600">{stockStatistics.produitsDisponibles}</div>
//                   <p className="text-xs text-green-600 mt-1">Stock suffisant</p>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
//               <Card className="border-orange-200 bg-orange-50/50">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium text-orange-700">En Alerte</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-orange-700">{stockStatistics.produitsEnAlerte}</div>
//                   <p className="text-xs text-orange-700 mt-1">Stock faible</p>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
//               <Card className="border-red-200 bg-red-50/50">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium text-red-700">En Rupture</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-red-600">{stockStatistics.produitsEnRupture}</div>
//                   <p className="text-xs text-red-600 mt-1">Stock vide</p>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
//               <Card className="border-blue-200 bg-blue-50/50">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium text-blue-700">Valeur Totale</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-blue-600">{formatCurrency(stockStatistics.valeurTotale)}</div>
//                   <p className="text-xs text-blue-600 mt-1">Au prix d'achat</p>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>

//           {/* Filtres Stock */}
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <CardTitle>Filtres de recherche</CardTitle>
//                 <Button 
//                   variant="outline" 
//                   size="sm"
//                   onClick={() => setShowFilters(!showFilters)}
//                 >
//                   <Filter className="h-4 w-4 mr-2" />
//                   {showFilters ? "Masquer" : "Plus de filtres"}
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="text-sm font-medium mb-1 block">Recherche</label>
//                     <div className="relative">
//                       <Search className="absolute left-2.5 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         placeholder="Produit, marque..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="pl-9"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium mb-1 block">Catégorie</label>
//                     <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Toutes" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">Toutes les catégories</SelectItem>
//                         {categories.map(cat => (
//                           <SelectItem key={cat} value={cat}>{cat}</SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium mb-1 block">Statut</label>
//                     <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Tous" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">Tous les statuts</SelectItem>
//                         <SelectItem value="disponible">Disponible</SelectItem>
//                         <SelectItem value="alerte">En alerte</SelectItem>
//                         <SelectItem value="rupture">En rupture</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Tableau Stock */}
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <CardTitle>Stock ({filteredStock.length} produits)</CardTitle>
//                 <div className="text-sm text-gray-600">
//                   Page {currentPage} sur {totalPages}
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Code Barres</TableHead>
//                       <TableHead>Code Items</TableHead>
//                       <TableHead>Origine</TableHead>
//                       <TableHead>Marque Produit</TableHead>
//                       <TableHead>Marque</TableHead>
//                       <TableHead>Modèle</TableHead>
//                       <TableHead>Série</TableHead>
//                       <TableHead>Produit</TableHead>
//                       <TableHead>Catégorie</TableHead>
//                       <TableHead>Stock</TableHead>
//                       <TableHead>Statut</TableHead>
//                       <TableHead>Emplacement</TableHead>
//                       <TableHead>Prix Achat</TableHead>
//                       <TableHead>Prix Vente</TableHead>
//                       <TableHead>Marge</TableHead>
//                       <TableHead>Dernière entrée</TableHead>
//                       <TableHead className="text-center">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {paginatedStock.map((item) => (
//                       <TableRow 
//                         key={item.id} 
//                         className="hover:bg-gray-50 cursor-pointer"
//                         onClick={() => handleRowClick(item)}
//                       >
//                         <TableCell className="font-mono text-sm">{item.codeBarres || '-'}</TableCell>
//                         <TableCell className="font-mono text-sm">{item.codeItems || '-'}</TableCell>
//                         <TableCell>
//                           <Badge variant="outline">{item.origine || '-'}</Badge>
//                         </TableCell>
//                         <TableCell className="font-medium">{item.marqueProduit || '-'}</TableCell>
//                         <TableCell>{item.marque}</TableCell>
//                         <TableCell>{item.modele || '-'}</TableCell>
//                         <TableCell>{item.serie || '-'}</TableCell>
//                         <TableCell>
//                           <div>
//                             <div className="font-medium">{item.designation}</div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="outline">{item.categorie}</Badge>
//                         </TableCell>
//                         <TableCell>
//                           <div className="text-center">
//                             <div className="font-semibold">{item.quantiteStock}</div>
//                             <div className="text-xs text-gray-500">Min: {item.quantiteMinimale}</div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Badge className={`${getStatusColor(item.status)} flex items-center gap-1`}>
//                             {getStatusIcon(item.status)}
//                             {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="font-mono text-sm">{item.emplacement}</TableCell>
//                         <TableCell>{formatCurrency(item.prixAchat)}</TableCell>
//                         <TableCell>{formatCurrency(item.prixVente)}</TableCell>
//                         <TableCell>
//                           <span className="text-green-600 font-medium">
//                             {((item.prixVente - item.prixAchat) / item.prixAchat * 100).toFixed(1)}%
//                           </span>
//                         </TableCell>
//                         <TableCell>
//                           <div className="text-sm">
//                             {format(new Date(item.dateDerniereEntree), "dd/MM/yyyy")}
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-center">
//                           <div className="flex justify-center gap-1">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={(e) => handleEditItem(e, item)}
//                               className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
//                             >
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>

//               {totalPages > 1 && (
//                 <div className="flex items-center justify-between mt-4">
//                   <div className="text-sm text-gray-600">
//                     Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredStock.length)} sur {filteredStock.length} résultats
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                       disabled={currentPage === 1}
//                     >
//                       Précédent
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                       disabled={currentPage === totalPages}
//                     >
//                       Suivant
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Onglet Entrées */}
//         <TabsContent value="entrees" className="space-y-6">
//           {/* Bouton ajouter entrée */}
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold">Entrées de Stock</h2>
//             <Button onClick={() => setIsCreateEntreeModalOpen(true)} className="bg-green-600 hover:bg-green-700">
//               <Plus className="h-4 w-4 mr-2" />
//               Nouvelle entrée
//             </Button>
//           </div>

//           {/* Filtres Entrées */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Filtres des entrées</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">Date début</label>
//                   <DatePicker date={startDate} setDate={setStartDate} />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">Date fin</label>
//                   <DatePicker date={endDate} setDate={setEndDate} />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">Fournisseur</label>
//                   <Select value={selectedFournisseur} onValueChange={setSelectedFournisseur}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Tous" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">Tous les fournisseurs</SelectItem>
//                       {fournisseurs.map(fournisseur => (
//                         <SelectItem key={fournisseur} value={fournisseur}>{fournisseur}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">Type d'entrée</label>
//                   <Select value={selectedTypeEntree} onValueChange={setSelectedTypeEntree}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Tous" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">Tous les types</SelectItem>
//                       <SelectItem value="achat">Achat</SelectItem>
//                       <SelectItem value="retour">Retour</SelectItem>
//                       <SelectItem value="ajustement">Ajustement</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Tableau Entrées */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Historique des entrées ({filteredEntrees.length})</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Produit</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead>Quantité</TableHead>
//                     <TableHead>Prix unitaire</TableHead>
//                     <TableHead>Total</TableHead>
//                     <TableHead>Fournisseur</TableHead>
//                     <TableHead>N° Facture</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredEntrees.map((entree) => (
//                     <TableRow key={entree.id}>
//                       <TableCell>
//                         {format(new Date(entree.date), "dd/MM/yyyy")}
//                       </TableCell>
//                       <TableCell>
//                         <div className="font-medium">{entree.designation}</div>
//                       </TableCell>
//                       <TableCell>
//                         <Badge className={getTypeEntreeColor(entree.typeEntree)}>
//                           {entree.typeEntree.charAt(0).toUpperCase() + entree.typeEntree.slice(1)}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-center font-semibold">
//                         +{entree.quantite}
//                       </TableCell>
//                       <TableCell>
//                         {formatCurrency(entree.prixAchat)}
//                       </TableCell>
//                       <TableCell className="font-semibold">
//                         {formatCurrency(entree.quantite * entree.prixAchat)}
//                       </TableCell>
//                       <TableCell>{entree.fournisseur}</TableCell>
//                       <TableCell className="font-mono text-sm">
//                         {entree.numeroFacture}
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex gap-1">
//                           <Button variant="ghost" size="sm">
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                           <Button variant="ghost" size="sm">
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Modal détails produit */}
//       <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
//         <DialogContent className="max-w-4xl">
//           <DialogHeader>
//             <DialogTitle>Détails du produit</DialogTitle>
//           </DialogHeader>
//           {selectedItem && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-3 gap-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Code Barres</label>
//                     <p className="font-mono">{selectedItem.codeBarres || 'Non défini'}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Code Items</label>
//                     <p className="font-mono">{selectedItem.codeItems || 'Non défini'}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Origine</label>
//                     <Badge variant="outline">{selectedItem.origine || 'Non défini'}</Badge>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Marque Produit</label>
//                     <p className="font-semibold">{selectedItem.marqueProduit || 'Non défini'}</p>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Désignation</label>
//                     <p className="font-semibold">{selectedItem.designation}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Marque</label>
//                     <p>{selectedItem.marque}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Modèle</label>
//                     <p>{selectedItem.modele || 'Non défini'}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Série</label>
//                     <p>{selectedItem.serie || 'Non défini'}</p>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Catégorie</label>
//                     <Badge variant="outline">{selectedItem.categorie}</Badge>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Emplacement</label>
//                     <p className="font-mono">{selectedItem.emplacement}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Fournisseur</label>
//                     <p>{selectedItem.fournisseur}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Statut</label>
//                     <Badge className={getStatusColor(selectedItem.status)}>
//                       {selectedItem.status}
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Stock actuel</label>
//                     <p className="text-2xl font-bold">{selectedItem.quantiteStock}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Stock minimum</label>
//                     <p>{selectedItem.quantiteMinimale}</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
//                   <div className="text-center">
//                     <p className="text-sm text-gray-600">Prix d'achat</p>
//                     <p className="text-lg font-bold text-red-600">{formatCurrency(selectedItem.prixAchat)}</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-sm text-gray-600">Prix de vente</p>
//                     <p className="text-lg font-bold text-green-600">{formatCurrency(selectedItem.prixVente)}</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-sm text-gray-600">Marge</p>
//                     <p className="text-lg font-bold text-blue-600">
//                       {((selectedItem.prixVente - selectedItem.prixAchat) / selectedItem.prixAchat * 100).toFixed(1)}%
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
//               Fermer
//             </Button>
//             <Button onClick={() => {
//               setIsDetailModalOpen(false);
//               setIsEditStockModalOpen(true);
//             }}>
//               <Edit className="h-4 w-4 mr-2" />
//               Modifier
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Modal création produit */}
//       <Dialog open={isCreateStockModalOpen} onOpenChange={setIsCreateStockModalOpen}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Ajouter un nouveau produit</DialogTitle>
//             <DialogDescription>
//               Remplissez les informations du nouveau produit à ajouter au stock
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Colonne 1 */}
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="codeBarres">Code Barre *</Label>
//                 <Input
//                   id="codeBarres"
//                   value={productFormData.codeBarres}
//                   onChange={(e) => handleProductFormChange('codeBarres', e.target.value)}
//                   placeholder="1234567890123"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="codeItems">Code Items *</Label>
//                 <Input
//                   id="codeItems"
//                   value={productFormData.codeItems}
//                   onChange={(e) => handleProductFormChange('codeItems', e.target.value)}
//                   placeholder="Code unique de l'article"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="designation">Désignation *</Label>
//                 <Input
//                   id="designation"
//                   value={productFormData.designation}
//                   onChange={(e) => handleProductFormChange('designation', e.target.value)}
//                   placeholder="Nom du produit"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="origine">Origine *</Label>
//                 <Select
//                   value={productFormData.origine}
//                   onValueChange={(value) => handleProductFormChange('origine', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Sélectionner l'origine" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {referenceData.origines.map((origine) => (
//                       <SelectItem key={origine.id} value={origine.id}>
//                         {origine.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="marqueProduit">Marque Produit *</Label>
//                 <Select
//                   value={productFormData.marqueProduit}
//                   onValueChange={(value) => handleProductFormChange('marqueProduit', value)}
//                   disabled={!productFormData.origine}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Sélectionner la marque produit" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {getAvailableMarquesProduit().map((marque) => (
//                       <SelectItem key={marque.id} value={marque.id}>
//                         {marque.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="marque">Marque *</Label>
//                 <Select
//                   value={productFormData.marque}
//                   onValueChange={(value) => handleProductFormChange('marque', value)}
//                   disabled={!productFormData.marqueProduit}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Sélectionner la marque" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {getAvailableMarques().map((marque) => (
//                       <SelectItem key={marque.id} value={marque.id}>
//                         {marque.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="modele">Modèle *</Label>
//                 <Select
//                   value={productFormData.modele}
//                   onValueChange={(value) => handleProductFormChange('modele', value)}
//                   disabled={!productFormData.marque}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Sélectionner le modèle" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {getAvailableModeles().map((modele) => (
//                       <SelectItem key={modele.id} value={modele.id}>
//                         {modele.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Colonne 2 */}
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="serie">Série</Label>
//                 <Select
//                   value={productFormData.serie}
//                   onValueChange={(value) => handleProductFormChange('serie', value)}
//                   disabled={!productFormData.modele}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Sélectionner la série" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {getAvailableSeries().map((serie) => (
//                       <SelectItem key={serie.id} value={serie.id}>
//                         {serie.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="categorie">Catégorie *</Label>
//                 <Select
//                   value={productFormData.categorie}
//                   onValueChange={(value) => handleProductFormChange('categorie', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Sélectionner la catégorie" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="VITRE">VITRE</SelectItem>
//                     <SelectItem value="FREIN">FREIN</SelectItem>
//                     <SelectItem value="ENTRETIEN">ENTRETIEN</SelectItem>
//                     <SelectItem value="SUSPENSION">SUSPENSION</SelectItem>
//                     <SelectItem value="MOTEUR">MOTEUR</SelectItem>
//                     <SelectItem value="ÉLECTRICITÉ">ÉLECTRICITÉ</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="prixAffiche">Prix Affiché *</Label>
//                 <Input
//                   id="prixAffiche"
//                   type="number"
//                   step="0.01"
//                   value={productFormData.prixAffiche}
//                   onChange={(e) => handleProductFormChange('prixAffiche', parseFloat(e.target.value) || 0)}
//                   placeholder="0.00"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="dernierPrix">Dernier Prix *</Label>
//                 <Input
//                   id="dernierPrix"
//                   type="number"
//                   step="0.01"
//                   value={productFormData.dernierPrix}
//                   onChange={(e) => handleProductFormChange('dernierPrix', parseFloat(e.target.value) || 0)}
//                   placeholder="0.00"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="emplacement">Emplacement</Label>
//                 <Input
//                   id="emplacement"
//                   value={productFormData.emplacement}
//                   onChange={(e) => handleProductFormChange('emplacement', e.target.value)}
//                   placeholder="A-01-15"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="quantiteStock">Stock Actuel *</Label>
//                 <Input
//                   id="quantiteStock"
//                   type="number"
//                   value={productFormData.quantiteStock}
//                   onChange={(e) => handleProductFormChange('quantiteStock', parseInt(e.target.value) || 0)}
//                   placeholder="0"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="quantiteMinimale">Stock Minimum *</Label>
//                 <Input
//                   id="quantiteMinimale"
//                   type="number"
//                   value={productFormData.quantiteMinimale}
//                   onChange={(e) => handleProductFormChange('quantiteMinimale', parseInt(e.target.value) || 0)}
//                   placeholder="0"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="mt-4">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               value={productFormData.description}
//               onChange={(e) => handleProductFormChange('description', e.target.value)}
//               placeholder="Description détaillée du produit..."
//               rows={3}
//             />
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => {
//               setIsCreateStockModalOpen(false);
//               resetProductForm();
//             }}>
//               Annuler
//             </Button>
//             <Button onClick={handleCreateStock}>
//               Ajouter le produit
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Modal modification produit */}
//       <Dialog open={isEditStockModalOpen} onOpenChange={setIsEditStockModalOpen}>
//         <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Modifier le produit</DialogTitle>
//           </DialogHeader>
//           {selectedItem && (
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="designation">Désignation</Label>
//                 <Input
//                   id="designation"
//                   value={selectedItem.designation}
//                   onChange={(e) => setSelectedItem({...selectedItem, designation: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="marque">Marque</Label>
//                 <Input
//                   id="marque"
//                   value={selectedItem.marque}
//                   onChange={(e) => setSelectedItem({...selectedItem, marque: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="categorie">Catégorie</Label>
//                 <Input
//                   id="categorie"
//                   value={selectedItem.categorie}
//                   onChange={(e) => setSelectedItem({...selectedItem, categorie: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="quantiteStock">Stock Actuel</Label>
//                 <Input
//                   id="quantiteStock"
//                   type="number"
//                   value={selectedItem.quantiteStock}
//                   onChange={(e) => setSelectedItem({...selectedItem, quantiteStock: parseInt(e.target.value) || 0})}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="quantiteMinimale">Stock Minimum</Label>
//                 <Input
//                   id="quantiteMinimale"
//                   type="number"
//                   value={selectedItem.quantiteMinimale}
//                   onChange={(e) => setSelectedItem({...selectedItem, quantiteMinimale: parseInt(e.target.value) || 0})}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="prixAchat">Prix Achat</Label>
//                 <Input
//                   id="prixAchat"
//                   type="number"
//                   step="0.01"
//                   value={selectedItem.prixAchat}
//                   onChange={(e) => setSelectedItem({...selectedItem, prixAchat: parseFloat(e.target.value) || 0})}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="prixVente">Prix Vente</Label>
//                 <Input
//                   id="prixVente"
//                   type="number"
//                   step="0.01"
//                   value={selectedItem.prixVente}
//                   onChange={(e) => setSelectedItem({...selectedItem, prixVente: parseFloat(e.target.value) || 0})}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="emplacement">Emplacement</Label>
//                 <Input
//                   id="emplacement"
//                   value={selectedItem.emplacement}
//                   onChange={(e) => setSelectedItem({...selectedItem, emplacement: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   value={selectedItem.description || ''}
//                   onChange={(e) => setSelectedItem({...selectedItem, description: e.target.value})}
//                   rows={3}
//                 />
//               </div>
//               <DialogFooter>
//                 <Button variant="outline" onClick={() => {
//                   setIsEditStockModalOpen(false);
//                   setSelectedItem(null);
//                 }}>
//                   Annuler
//                 </Button>
//                 <Button onClick={() => {
//                   if (selectedItem) {
//                     handleUpdateStock(selectedItem);
//                   }
//                 }}>
//                   Enregistrer
//                 </Button>
//               </DialogFooter>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Modal création entrée */}
//       <Dialog open={isCreateEntreeModalOpen} onOpenChange={setIsCreateEntreeModalOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Nouvelle entrée de stock</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium mb-1 block">Date d'entrée</label>
//                 <DatePicker date={new Date()} setDate={() => {}} />
//               </div>
//               <div>
//                 <label className="text-sm font-medium mb-1 block">Type d'entrée</label>
//                 <Select>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Sélectionner..." />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="achat">Achat</SelectItem>
//                     <SelectItem value="retour">Retour</SelectItem>
//                     <SelectItem value="ajustement">Ajustement</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div>
//               <label className="text-sm font-medium mb-1 block">Produit</label>
//               <Select>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Sélectionner un produit..." />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {stockData.map(item => (
//                     <SelectItem key={item.id} value={item.id}>
//                       {item.designation} - {item.marque}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium mb-1 block">Quantité</label>
//                 <Input type="number" placeholder="0" min="1" />
//               </div>
//               <div>
//                 <label className="text-sm font-medium mb-1 block">Prix d'achat unitaire (€)</label>
//                 <Input type="number" placeholder="0.00" step="0.01" min="0" />
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium mb-1 block">Fournisseur</label>
//                 <Input placeholder="Nom du fournisseur" />
//               </div>
//               <div>
//                 <label className="text-sm font-medium mb-1 block">N° Facture</label>
//                 <Input placeholder="Numéro de facture" />
//               </div>
//             </div>
//             <div>
//               <label className="text-sm font-medium mb-1 block">Commentaire (optionnel)</label>
//               <Input placeholder="Notes sur cette entrée..." />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsCreateEntreeModalOpen(false)}>
//               Annuler
//             </Button>
//             <Button onClick={handleCreateEntree}>
//               Enregistrer l'entrée
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Modal Références Pièces */}
//       <PieceReferencesModal
//         open={isReferencesModalOpen}
//         onOpenChange={setIsReferencesModalOpen}
//       />
//     </div>
//   );
// };

// export default StockPage;