import { useState, useMemo, useEffect, useRef } from "react";
import { Package, Search, Plus, Eye, Edit, Trash2, TrendingUp, TrendingDown, AlertTriangle, Filter, X, Download, Upload, RefreshCw, BarChart3, Archive, Car, Truck, ArrowUpDown, ShoppingCart, PlusCircle, RefreshCcw, PrinterIcon, EditIcon, ListCheck, PlusIcon, UploadCloudIcon, NotepadText, Check, CheckCircle, XIcon, Trash, UploadIcon } from "lucide-react";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import axios from "axios"
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DatePicker } from "@/components/SuiviVentes/DatePicker";
import { formatCurrency } from "@/components/SuiviVentes/utils";
import { PieceReferencesModal } from "@/components/PieceReferencesModal";
import { PieceForm } from "@/components/PieceForm";
import { PieceFormData, convertFormDataToPiece } from "@/models/piece";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { AddStockAsync, DelStockAsync, StockAsync } from "@/redux/Async/stockAsync";
import { StatCard } from "@/components/StatCard";
import PopupFilter from "@/components/ui/popupfilter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LevelAsyncThunk } from "@/redux/Async/level.asyncThunk";
import { OrigineAsyncThunk } from "@/redux/Async/origine.async";
import { SerieAsyncThunk } from "@/redux/Async/serie.async";
import { MarkAsyncThunk } from "@/redux/Async/mark.async";
import { ModeleAsyncThunk } from "@/redux/Async/modele.async";
import { AddMarkProductAsyncThunk } from "@/redux/Async/productMark.async";
import CountUp from "react-countup";
import { StatCard2 } from "@/components/StatCard2";
import { AddEntreStockAsync, EntreStockAsync } from "@/redux/Async/EntreStockAsync";
import { StockAdvancedFilters } from "@/components/StockAdvancedFilters";
import { Client } from "@/types/client";
import { AddVentesAsync, VentesAsync } from "@/redux/Async/VentesAsync";
import { ClientSelector } from "@/components/ClientSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { changeMsg } from "@/redux/slice/VentesSlice";
import PrintMore from "@/components/toPrintMoreArticles";
import { AddMoreInvoicesAsync, InvoicesAsync } from "@/redux/Async/InvoicesASync";
import { useReactToPrint } from "react-to-print";
import ToPrint from "@/components/toPrint";
import ToPrints from "@/components/toPrints";
import { changeStatus } from "@/redux/slice/InvoicesSlice";
import { changeStatusStock } from "@/redux/slice/StockSlice";
import { importExcelAsync } from "@/redux/Async/importExcelAsync";
import { changeStatusExcel } from "@/redux/slice/importExcelSlice";
import { jwtDecode } from "jwt-decode";
import { OneUserAsync } from "@/redux/Async/userAuthAsync";
import generateInvoiceNumber from "@/types/num-invoices";
import { APP_URL } from "../../process.env";
import { changeStatusExport } from "@/redux/slice/ExportSlice";
import { ExportAsyncThunk } from "@/redux/Async/ExportAsync";
// import { APP_URL } from "process.env";

// Types
interface StockItem {
  id: number;
  designation: string;
  marque: string;
  categorie: string;
  dernier_prix: number;
  prix_affiche: number;
  prixAchat: number;
  prixVente: number;
  emplacement: string;
  fournisseur: string;
  dateDerniereEntree: string;
  status: "disponible" | "rupture" | "alerte";
  image?: string;
  // Nouvelles propriétés ajoutées
  code_barre?: string;
  // codeItems?: string;
  code_items?: string;
  origine?: string;
  marqueProduit?: string;
  modele?: string;
  serie?: string;
}
interface ProductFormData {
  code_barre: string;
  codeItems: string;
  designation: string;
  origine: string;
  marqueProduit: string;
  marque: string;
  modele: string;
  serie: string;
  categorie: string;
  prixAffiche: number;
  dernierPrix: number;
  emplacement: string;
  quantite: number;
  quantiteMinimale: number;
  description: string;
}
type VenteItem = {
  id: string;
  date: string;
  designation: string;
  marqueProduit: string;
  marqueVehicule: string;
  modele: string;
  TVA: number,
  total_TTC: number,
  total_HT: number,
  serie: string;
  categorie: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
  prixAchat: number;
  statut: "active" | "cancelled";
  client?: Client;
  stock: {
    designation: string,
    id: number,
    family: {
      family_name: string,
      parent: {
        family_name: string,
        parent: {
          family_name: string,
          parent: {
            family_name: string,
          }
        }
      }
    },
    marque: string,
    modele: string,
    serie: string,
    categorie: string,
    createdAt: Date,
    prix_unitaire: number
  }
};
interface EntreeStock {
  id: string;
  date: string;
  produitId: string;
  designation: string;
  quantite: number;
  prixAchat: number;
  fournisseur: string;
  numeroFacture: string;
  typeEntree: "achat" | "retour" | "ajustement";
  commentaire?: string;
}


const mockEntreesData: EntreeStock[] = [
  {
    id: "E-001",
    date: "2024-12-10",
    produitId: "P-001",
    designation: "VITRE AVANT GAUCHE CLAIRE",
    quantite: 10,
    prixAchat: 80.00,
    fournisseur: "FOURNISSEUR AUTO",
    numeroFacture: "FA-2024-156",
    typeEntree: "achat",
    commentaire: "Commande régulière"
  },
  {
    id: "E-002",
    date: "2024-12-09",
    produitId: "P-002",
    designation: "PLAQUETTE FREIN AVANT",
    quantite: 20,
    prixAchat: 25.00,
    fournisseur: "PIECES FRANCE",
    numeroFacture: "PF-2024-892",
    typeEntree: "achat"
  },
  {
    id: "E-003",
    date: "2024-12-08",
    produitId: "P-004",
    designation: "AMORTISSEUR AVANT DROIT",
    quantite: 5,
    prixAchat: 120.00,
    fournisseur: "SUSPENSION PRO",
    numeroFacture: "SP-2024-445",
    typeEntree: "achat"
  }
];

const Stocks = () => {
  const AllInvoices = useSelector((state: RootState) => state.InvoicesSlice)

  const dispatch = useDispatch<AppDispatch>()
  const AddInvoices = useSelector((state: RootState) => state.AddInvoicesSlice)

  const [invoiceNumber, setInvoiceNumber] = useState("");
  useEffect(() => {
    dispatch(InvoicesAsync())
    const lastNumber = (AllInvoices?.data.length != 0 ? (AllInvoices?.data[0]?.list[0]?.numFacture)?.split("-")[2] : undefined); // tu peux remplacer par un vrai numéro depuis une base
    const newInvoice = generateInvoiceNumber(lastNumber);
    setInvoiceNumber(newInvoice);
  }, []);


  useEffect(() => {
    dispatch(InvoicesAsync())
  }, [AddInvoices.loading]);
  useEffect(() => {
    const lastNumber = (AllInvoices?.data.length != 0 ? (AllInvoices?.data[0]?.list[0]?.numFacture)?.split("-")[2] : undefined);
    const newInvoice = generateInvoiceNumber(lastNumber);
    setInvoiceNumber(newInvoice);
  }, [AllInvoices?.data.length]);

  const OneUser = useSelector((state: RootState) => state.OneUserSlice) as any
  const [decoded, setDecoded] = useState({
    id: 0,
    email: "",
    status: "1",
    createdAt: "",
    role: "",
    person: {
      id: 0,
      name: "",
      createdAt: "",
      deletedAt: null,
    }
  }) as any;



  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setDecoded(decoded as any)
    }
  }, [])

  useEffect(() => {
    dispatch(OneUserAsync(decoded.id))
  }, [decoded.id])
  useEffect(() => {
    dispatch(OneUserAsync(decoded.id))
  }, [])

  function formatNumber(value) {
    if (!value) return '';
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(value);
  }


  const tva = useRef() as any
  const ttc = useRef() as any
  const ht = useRef() as any
  useEffect(() => {
    dispatch(StockAsync())
    dispatch(LevelAsyncThunk())
    dispatch(OrigineAsyncThunk())
    dispatch(SerieAsyncThunk())
    dispatch(MarkAsyncThunk())
    dispatch(ModeleAsyncThunk())
    dispatch(EntreStockAsync())
  }, [])

  const [isCreateInvoice, setIsCreateInvoice] = useState(false);
  const [stockSelected, SetstockSelected] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const AllOrigine = useSelector((state: RootState) => state.OrigineSlice)
  const AddStock = useSelector((state: RootState) => state.AddStockSlice)
  const Mark = useSelector((state: RootState) => state.MarkSlice)
  const MarkProd = useSelector((state: RootState) => state.MarkProductSlice)
  const Modele = useSelector((state: RootState) => state.ModeleSlice)
  const Serie = useSelector((state: RootState) => state.SerieSlice)

  const [filters2, setFilters2] = useState<any>({
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
    marquesProd: [],
    modeles: [],
    series: []
  });

  const [excelUpload, setExcelExpload] = useState(null)


  const importExcel = () => {
    const formData = new FormData()
    formData.set("admin", "1")
    formData.set("file", ExcelFile)

    dispatch(importExcelAsync(formData as any))


  };
  const [simpleClient, setSimpleClient] = useState(false)

  const handleFiltersChange = (newFilters: any) => {
    setFilters2(newFilters);
  };
  const AddVentesStock = useSelector((state: RootState) => state.AddVentesSlice)
  const importExcelFile = useSelector((state: RootState) => state.importExcelFile)
  const [createFacture, setCreateFacture] = useState([]);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef })
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [nouvelleVente, setNouvelleVente]: any = useState({
    quantite: 1,
    prix_unitaire: '',
    status: "",
    mode_paiement: "",
    TVA: parseFloat(tva?.current?.value),
    total_HT: ht?.current?.value,
    total_TTC: ttc?.current?.value,
    admin: OneUser.data?.person?.id,
    client: selectedClient?.id,
    stock: 0
  })
  const [ExcelFile, setExcelFile] = useState(null)
  const [add, setAdd] = useState(false)
  const [uploaded, setUploaded] = useState("")
  const uploadFile = (e: any) => {
    if (e.target.files[0]) {
      setUploaded(e.target.files[0].name)
      setExcelFile(e.target.files[0])
    } else {

      setUploaded("")
    }

  }
  const [Choose, setChoose] = useState(1)
  const [file, setFile] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExportFile, setIsExportFile] = useState(false);
  const [deleteStock, setDeleteStock] = useState(null);


  const EntreStock = useSelector((state: RootState) => state.EntreStockSlice)
  const AddEntreStock = useSelector((state: RootState) => state.AddEntreStockSlice)
  const resetForms = () => {
    setNouvelleVente({
      quantite: "",
      prix_unitaire: "",
      status: "",
      mode_paiement: "",
      TVA: 0 as any,
      total_HT: 0,
      total_TTC: 0,
      admin: OneUser.data?.person?.id,
      client: selectedClient?.id,
      stock: 5
    })
  }
  const handleDeleteStock = () => {

    dispatch(DelStockAsync(deleteStock.id))

  }
  const CreateMoreInvoices = () => {



    let newInvoice = []
    AddVentesStock.venteIds.map((facture) => {
      const newInvoices = {
        designation: facture.stock.designation,
        client: facture.client.id,
        tva: facture.TVA,
        quantite: facture.quantite,
        prix_ht: (facture.total_HT / facture.quantite),
        total_ht: facture.total_HT,
        total_ttc: facture.total_TTC,
        mode_paiment: facture.mode_paiement,
        numFacture: invoiceNumber,
        stock: facture.id,
        admin: OneUser.data?.person?.id
      }
      newInvoice.push(newInvoices)
    })


    dispatch(AddMoreInvoicesAsync(newInvoice as any))
  }


  useEffect(() => {
    if (!isCreateInvoice) {
      dispatch(changeMsg([]))
    }
  }, [isCreateInvoice])
  const [fileRefused, setFileRefused] = useState(false)

  const downloadFileSimple = (fileUrl) => {
    const link = document.createElement('a');
    link.href = APP_URL + fileUrl;
    link.download = '';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  };

  useEffect(() => {
    if (!importExcelFile.loading && importExcelFile.fileReturned?.lignes_ignorees && importExcelFile.fileReturned?.lignes_ignorees != 0) {
      dispatch(VentesAsync())
      dispatch(StockAsync())
      setIsCreateStockExcel(false)
      setFileRefused(true)

      const fileUrl = importExcelFile.fileReturned?.fichier_vide;
      downloadFileSimple(fileUrl)
      setExcelFile(null)
      setUploaded("")
    } else {

      setTimeout(() => {
        setIsCreateStockExcel(false)
        toast({
          title: "Facture crée",
          description: "Les nouveaux stocks sont été enregistrés avec succès."
        });
        dispatch(VentesAsync())
      }, 3000);
      setUploaded("")
      dispatch(StockAsync())
    }
  }, [importExcelFile.loading])
  useEffect(() => {
    if (!fileRefused) {
      dispatch(changeStatusExcel(""))
    }
  }, [fileRefused])


  useEffect(() => {
    if (!AddInvoices.loading && AddInvoices.status == "ok") {
      setIsCreateInvoice(false)
      dispatch(VentesAsync())
      dispatch(StockAsync())
      setIsCreateInvoice(false)
      toast({
        title: "Facture crée",
        description: "Le nouveau facture a été enregistré avec succès."
      });
      dispatch(changeStatus(""))
    }
  }, [AddInvoices.loading])
  useEffect(() => {
    dispatch(InvoicesAsync())
    if (!AddVentesStock.loading && AddVentesStock.venteIds.length != 0) {
      dispatch(StockAsync())
      dispatch(EntreStockAsync())
      setIsCreateModalOpen(false)
      setIsCreateInvoice(true)
      dispatch(VentesAsync())
      toast({
        title: "Vente créée",
        description: "La nouvelle vente a été enregistrée avec succès."
      });
      setCreateFacture(AddVentesStock.venteIds)
      setSelectedClient(null)

    }
  }, [AddVentesStock.loading, AddEntreStock.loading])

  const referenceData = {
    origines: [
      ...AllOrigine.data
    ],
    marquesProduit: [
      ...MarkProd.data
    ],
    marques: [
      ...Mark.data
    ],
    modeles: [...Modele.data],
    series: [...Serie.data],
  };


  function refresh() {
    dispatch(StockAsync())
    dispatch(LevelAsyncThunk())
    dispatch(OrigineAsyncThunk())
    dispatch(SerieAsyncThunk())
    dispatch(MarkAsyncThunk())
    dispatch(ModeleAsyncThunk())
    dispatch(EntreStockAsync())
  }


  const [productFormData, setProductFormData] = useState<ProductFormData | any>({
    code_barre: '',
    codeItems: '',
    designation: '',
    origine: '',
    marqueProduit: '',
    marque: '',
    modele: '',
    serie: '',
    categorie: '',
    prixAffiche: 0,
    prix_achat: 0,
    dernierPrix: 0,
    emplacement: '',
    quantiteStock: 0,
    quantiteMinimale: 0,
    description: ''
  });
  const resetDependentFields = (level: 'origine' | 'marqueProduit' | 'marque' | 'modele' | 'quantite') => {
    const updates: Partial<ProductFormData> = {};

    if (level === 'origine') {
      updates.marqueProduit = '';
      updates.marque = '';
      updates.modele = '';
      updates.serie = '';
    } else if (level === 'marqueProduit') {
      updates.marque = '';
      updates.modele = '';
      updates.serie = '';
    } else if (level === 'marque') {
      updates.modele = '';
      updates.serie = '';
    } else if (level === 'modele') {
      updates.serie = '';
    }

    setProductFormData(prev => ({ ...prev, ...updates }));
  };

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState<keyof VenteItem>("date") as any;

  const handleSort = (field: keyof VenteItem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleProductFormChange = (field: keyof ProductFormData, value: string | number) => {
    setProductFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'origine') {
      resetDependentFields('origine');
    } else if (field === 'marque') {
      resetDependentFields('marque');
    } else if (field === 'modele') {
      resetDependentFields('modele');
    } else if (field === 'quantite') {
      resetDependentFields('quantite');
    }
  };
  const UpStockSlice = useSelector((state: RootState) => state.UpStockSlice)



  const DataStock = useSelector((state: RootState) => state.StockSlice.data)
  const load = useSelector((state: RootState) => state.StockSlice)




  const [mockStockData, setMockStockData] = useState(DataStock)
  const [addTVA, setAddTVA] = useState(false)



  const getAvailableMarquesProduit = () => {

    return referenceData.marquesProduit.filter((item) => item.origine.pays == (referenceData.origines.find((item) => item.id == productFormData.origine))?.pays) || [];
  };


  const getAvailableMarques = () => {
    if (!productFormData.origine) return [];

    return referenceData.marques.filter((item) => item.origine.pays == (referenceData.origines.find((item) => item.id == productFormData.origine))?.pays) || [];
  };


  const getAvailableModeles = () => {
    if (!productFormData.marque) return [];
    return referenceData.modeles.filter((item) => item.parent?.family_name == (referenceData.marques.find((item) => item.id == productFormData.marque))?.family_name) || [];
  };

  const getAvailableSeries = () => {
    if (!productFormData.modele) return [];
    return referenceData.series.filter((item) => item.parent?.family_name == (referenceData.modeles.find((item) => item.id == productFormData.modele))?.family_name) || [];
  };




  const [activeTab, setActiveTab] = useState("stock");
  const [stockData, setStockData] = useState<StockItem[]>(mockStockData);
  const [entreesData, setEntreesData] = useState<EntreeStock[]>(EntreStock.data);

  const CreateVente = (e) => {
    e.preventDefault()

    if (nouvelleVente.client) {

      const newVente = { ...nouvelleVente, TVA: (isNaN((parseFloat(tva?.current?.value as any | 0))) ? 0 : (parseFloat(tva?.current?.value as any | 0))), total_HT: parseFloat(ht?.current?.value as any), total_TTC: parseFloat(ttc?.current?.value as any), stock: stockSelected.id, dataClient: { ...selectedClient, status: simpleClient ? "fidele" : "simple" }, admin: decoded?.id }




      dispatch(AddVentesAsync(newVente as any))
      resetForms()
    } else {
      toast({
        title: "Message",
        description: `Veuillez séléctionner le client`,
        variant: "destructive",
      });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedFournisseur, setSelectedFournisseur] = useState("all");
  const [selectedTypeEntree, setSelectedTypeEntree] = useState("all");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateStockModalOpen, setIsCreateStockModalOpen] = useState(false);
  const [isCreateStockExcel, setIsCreateStockExcel] = useState(false);
  const [isCreateEntreeModalOpen, setIsCreateEntreeModalOpen] = useState(false);
  const [isCreateEntreeModalOpen2, setIsCreateEntreeModalOpen2] = useState(false);
  const [isEditStockModalOpen, setIsEditStockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | any>(null);
  const [selectedEntree, setSelectedEntree] = useState<EntreeStock | null>(null);

  const [isReferencesModalOpen, setIsReferencesModalOpen] = useState(false);



  const { toast } = useToast();
  const itemsPerPage = 10;


  const [ComplexeFilter, setComplexeFilter] = useState(DataStock)




  const [stockStatistics, setStockStatistics] = useState(null)

  const changeValue = () => {
    const totalProduits = DataStock?.length | 0;
    const produitsDisponibles = ((DataStock?.filter(item => item.quantite != 0))?.map((e) => e.quantite).length != 0 ? (DataStock?.filter(item => item.quantite != 0))?.map((e) => e.quantite) : [0])?.reduce((acc, el) => acc + el);
    const produitsEnAlerte = DataStock?.filter(item => item.quantite <= 3 && item.quantite > 0).length | 0;
    const produitsEnRupture = DataStock?.filter(item => item.quantite == 0).length | 0;
    const valeurTotale = DataStock?.reduce((acc, item) => acc + (item.quantite * item.prix_affiche), 0);

    return {
      totalProduits,
      produitsDisponibles,
      produitsEnAlerte,
      produitsEnRupture,
      valeurTotale
    };
  }
  useEffect(() => {
    dispatch(changeMsg(""))
  }, [])
  useEffect(() => {
    setStockStatistics(changeValue())
    setComplexeFilter(DataStock)
  }, [DataStock])
  useEffect(() => {
    setNouvelleVente(prev => ({ ...prev, client: selectedClient?.id }));

  }, [selectedClient])


  const resetProductForm = () => {
    setProductFormData({
      code_barre: '',
      codeItems: '',
      designation: '',
      origine: '',
      marqueProduit: '',
      marque: '',
      modele: '',
      serie: '',
      categorie: '',
      prixAffiche: 0,
      dernierPrix: 0,
      emplacement: '',
      quantiteStock: 0,
      quantiteMinimale: 0,
      description: ''
    });
  };



  const [tri, setTri] = useState(0)
  const [price, setPrice] = useState(0)
  const [name, setName] = useState(0)
  const filteredStock = useMemo(() => {
    setCurrentPage(prev => Math.max(1, prev - 1))



    let flr = ComplexeFilter
    if (tri == 1) {

      return (flr.filter(item => {
        const matchesSearch = !searchTerm ||
          item.marque_produit.toLowerCase().includes(searchTerm.toLowerCase()) || item?.family?.origine.pays.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item?.marque_produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item?.family?.parent?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item?.family?.parent?.parent?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item?.family?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code_barre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code_items.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.emplacement.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch
      })).sort((e, f) => e.quantite - f.quantite);
    } else if (tri == 2) {


      return (flr.filter(item => {
        const matchesSearch = !searchTerm ||
          item.marque_produit.toLowerCase().includes(searchTerm.toLowerCase()) || item.family.origine.pays.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.family.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.family?.parent?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.family?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.designation.toLowerCase().includes(searchTerm.toLowerCase()) || item?.family?.parent?.parent?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code_barre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code_items.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.emplacement.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch
      })).sort((e, f) => f.quantite - e.quantite);
    } else {




      if (price == 1) {

        return (flr.filter(item => {
          const matchesSearch = !searchTerm ||
            item.marque_produit.toLowerCase().includes(searchTerm.toLowerCase()) || item?.family.origine.pays.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.family?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.family?.parent?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.family.parent.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.designation.toLowerCase().includes(searchTerm.toLowerCase()) || item?.family?.parent?.parent?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code_barre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code_items.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.emplacement.toLowerCase().includes(searchTerm.toLowerCase());

          return matchesSearch
        })).sort((e, f) => e.prix_affiche - f.prix_affiche);
      } else if (price == 2) {


        return (flr.filter(item => {
          const matchesSearch = !searchTerm ||
            item.marque_produit.toLowerCase().includes(searchTerm.toLowerCase()) || item.family.origine.pays.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.family?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.family?.parent?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.family?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.designation.toLowerCase().includes(searchTerm.toLowerCase()) || item?.family?.parent?.parent?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code_barre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code_items.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.emplacement.toLowerCase().includes(searchTerm.toLowerCase());

          return matchesSearch
        })).sort((e, f) => f.prix_affiche - e.prix_affiche);
      } else {


        if (name == 1) {

          return (flr.filter(item => {
            const matchesSearch = !searchTerm ||
              item.marque_produit.toLowerCase().includes(searchTerm.toLowerCase()) || item.family.origine.pays.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item?.family?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) || item?.family?.parent?.parent?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item?.family?.parent?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item?.family?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.code_barre.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.code_items.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.emplacement.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSearch
          })).sort((e, f) => e.designation.localeCompare(f.designation));
        } else if (name == 2) {


          return (flr.filter(item => {
            const matchesSearch = !searchTerm ||
              item.marque_produit.toLowerCase().includes(searchTerm.toLowerCase()) || item.family.origine.pays.toLowerCase().includes(searchTerm.toLowerCase()) || item?.family?.parent?.parent?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item?.family?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item?.family?.parent?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.family.parent.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.code_barre.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.code_items.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.emplacement.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSearch
          })).sort((e, f) => f.designation.localeCompare(e.designation));
        } else {

          return (flr?.filter(item => {
            const matchesSearch = !searchTerm ||
              item.marque_produit.toLowerCase().includes(searchTerm.toLowerCase()) || item?.family?.origine?.pays.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item?.family?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) || item?.family?.parent?.parent?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item?.family?.parent?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item?.family?.parent?.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.code_barre.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.code_items.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.emplacement.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSearch
          }));
        }


      }

    }
  }, [stockData, searchTerm, selectedCategory, selectedStatus, tri, price, name, stockStatistics, ComplexeFilter]);

  function filterItems(data, filters) {
    return data.filter(item => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (
          !item.designation.toLowerCase().includes(s) &&
          !item.code_items.toLowerCase().includes(s)
        ) return false;
      }
      if (filters.categories.length > 0 && !filters.categories.includes(item.categorie)) {
        return false;
      }

      if (filters.status.length > 0) {
        let itemStatus = '';
        if (item.quantite > 3) itemStatus = 'en_stock';
        else if (item.quantite > 0) itemStatus = 'stock_bas';
        else itemStatus = 'rupture';

        if (!filters.status.includes(itemStatus)) {
          return false;
        }
      }

      if (filters.location && item.emplacement !== filters.location) {
        return false;
      }

      const origine = item.family?.origine?.pays;
      if (filters.origines.length > 0 && !filters.origines.includes(origine)) {
        return false;
      }

      const marque = item.family?.parent?.parent?.family_name;
      if (filters.marques.length > 0 && !filters.marques.includes(marque)) {
        return false;
      }

      const marqueProd = item?.marque_produit;
      if (filters.marquesProd.length > 0 && !filters.marquesProd.includes(marqueProd)) {
        return false;
      }
      const modele = item?.family?.parent?.family_name;
      if (filters.modeles.length > 0 && !filters.modeles.includes(modele)) {
        return false;
      }

      const serie = item?.family?.family_name;
      if (filters.series.length > 0 && !filters.series.includes(serie)) {
        return false;
      }

      return true;
    });
  }


  const filteredEntrees = useMemo(() => {
    return EntreStock.data.filter(entree => {
      const entreeDate = new Date(entree.date);
      const matchesDateRange = (!startDate || entreeDate >= startDate) &&
        (!endDate || entreeDate <= endDate);

      const matchesFournisseur = selectedFournisseur === "all" || entree.fournisseur === selectedFournisseur;
      const matchesType = selectedTypeEntree === "all" || entree.status === selectedTypeEntree;

      return matchesDateRange && matchesFournisseur && matchesType;
    });
  }, [entreesData, startDate, endDate, selectedFournisseur, selectedTypeEntree, AddEntreStock.loading, stockStatistics]);

  let paginatedStock = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStock?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStock, currentPage, load.loading, load.data?.length, stockStatistics]);


  const upToDown = () => {
  }


  const totalPages = Math.ceil(filteredStock?.length / itemsPerPage);

  const categories = Array.from(new Set(stockData?.map(item => item.categorie)));
  const fournisseurs = Array.from(new Set(entreesData.map(entree => entree.fournisseur)));

  const handleRowClick = (item: StockItem) => {

    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleEditItem = (e: React.MouseEvent, item: StockItem) => {
    e.stopPropagation();
    setSelectedItem(item);
    setIsEditStockModalOpen(true);
  };

  const [Es, setEs] = useState({
    idStock: 0,
    quantite: 0,
    status: '',
    prix_unitaire: '',
    fournisseurs: '',
    admin: OneUser.data?.person?.id,
  })
  const handleChange = (item, value) => {
    setEs(prev => ({ ...prev, [item]: value }));
  }
  const handleChangeVente = (item, value) => {
    setNouvelleVente(prev => ({ ...prev, [item]: value }));
  }

  const handleCreateEntree = () => {
    dispatch(AddEntreStockAsync(Es as any))
  };
  const handleCreateEntree2 = () => {

    dispatch(AddEntreStockAsync({ ...Es, idStock: stockSelected?.id } as any))
  };

  const handleCreateStock = () => {
    const newStock = {
      code_barre: productFormData.code_barre,
      code_items: productFormData.codeItems,
      designation: productFormData.designation,
      categorie: productFormData.categorie,
      quantite: productFormData.quantiteStock,
      prix_achat: productFormData.prix_achat,
      prix_affiche: productFormData.prixAffiche,
      dernier_prix: productFormData.dernierPrix,
      emplacement: productFormData.emplacement,
      marque_produit: productFormData.marqueProduit,
      family: productFormData.serie,
      admin: OneUser.data?.person?.id,
    }

    dispatch(AddStockAsync(newStock as any))
  };
  useEffect(() => {
    if (!AddStock.loading) {
      dispatch(StockAsync())
    }
  }, [AddStock.loading])
  useEffect(() => {
    if (!UpStockSlice.loading && (UpStockSlice.status == "updated" || UpStockSlice.status == "deleted")) {
      dispatch(StockAsync())
      dispatch(changeStatusStock(""))
      setSelectedItem(null)
      setIsEditStockModalOpen(false)
      setIsDeleteDialogOpen(false)
    }
  }, [UpStockSlice.loading])
  useEffect(() => {
    const filtered = filterItems(DataStock, filters2);
    setComplexeFilter(filtered)

  }, [filters2])





  const handleUpdateStock = (pieceData: ReturnType<typeof convertFormDataToPiece>) => {
    if (!selectedItem) return;

    const updatedPiece: StockItem = {
      ...selectedItem,
      ...pieceData,
      status: pieceData.quantiteStock === 0 ? "rupture" :
        pieceData.quantiteStock <= pieceData.quantiteMinimale ? "alerte" : "disponible",
      marqueProduit: pieceData.marque
    };

    setStockData(prev => prev.map(item =>
      item.id === selectedItem.id ? updatedPiece : item
    ));
    setIsEditStockModalOpen(false);
    setSelectedItem(null);
    toast({
      title: "Produit modifié",
      description: "Le produit a été modifié avec succès."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponible": return "bg-green-100 text-green-700";
      case "alerte": return "bg-orange-100 text-orange-700";
      case "rupture": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "disponible": return <Package className="h-4 w-4" />;
      case "alerte": return <AlertTriangle className="h-4 w-4" />;
      case "rupture": return <TrendingDown className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getTypeEntreeColor = (type: string) => {
    switch (type) {
      case "achat": return "bg-blue-100 text-blue-700";
      case "retour": return "bg-green-100 text-green-700";
      case "ajustement": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };
  let UpdateExport = useSelector((item: RootState) => item.UpdateExportSlice)


  const downloadExcel = async () => {
    dispatch(ExportAsyncThunk(String(Choose)))
  }




  //   const blob = await response.blob();

  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `stocks_${Date.now()}.xlsx`;
  //   a.click();
  //   window.URL.revokeObjectURL(url);


  useEffect(() => {
    if (!UpdateExport.loading && UpdateExport.data != "") {
      const link = document.createElement('a');
      link.href = APP_URL + UpdateExport.data;
      link.download = '';
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      dispatch(changeStatusExport(""))
      setIsExportFile(false)
    }
  }, [UpdateExport.loading])



  return (
    <div className="space-y-3 px-3">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold  tracking-tight " style={{ fontSize: "15px" }}>Gestion du Stock</h1>
        </div>
        <div className="flex gap-2">
          {
            decoded.role == "admin" &&
            <Button variant="outline" className="" style={{fontSize:"12px"}} onClick={() => setIsExportFile(true)}>
              <UploadIcon className="h-4 w-4 mr-2" />
              Exporter Excel
            </Button>
          }
          {
            decoded.role == "admin" &&
            <Button variant="outline" className="" style={{fontSize:"12px"}} onClick={() => setIsReferencesModalOpen(true)}>
              <Package className="h-4 w-4 mr-2" />
              Références Pièces
            </Button>
          }
          <Button variant="outline" className="" style={{fontSize:"12px"}} onClick={refresh}>
            <RefreshCcw className="h-4 w-4 mr-2 text-xs"  size={7}/>
          </Button>
          {
            decoded.role == "admin" &&
            <Button onClick={() => setIsCreateStockModalOpen(true)} className="bg-blue-600 hover:bg-blue-700"  style={{fontSize:"12px"}} >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau produit
            </Button>
          }
        </div>
      </div>
      <Tabs defaultValue="stock" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex  justify-start">
          <TabsTrigger value="stock" className="flex items-center gap-2 p-2 px-3 w-fit" style={{ fontSize: "12px" }}>
            <Package size={13} />
            Suivi du Stock
          </TabsTrigger>
          {
            decoded.role == "admin" &&
            <TabsTrigger value="entrees" className="flex items-center gap-2" style={{ fontSize: "12px" }}>
              <TrendingUp size={13} />
              Entrées de Stock
            </TabsTrigger>
          }
        </TabsList>

        <TabsContent value="stock" className="space-y-3">


          {
            DataStock.length != 0 ?
              <div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <StatCard
                      title="Pièces en stock"
                      value={stockStatistics?.totalProduits || 0}
                      className="bg-blue-50 border-blue-100 h-fit p-3"
                      icon={<Car className="h-6 w-6 text-blue-600" />}
                    />

                  </motion.div>



                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <StatCard
                      title="En Alerte"
                      value={stockStatistics?.produitsEnAlerte || 0}
                      className="border-orange-200 bg-orange-50/50 h-fit p-3"
                      icon={<Car className="h-6 w-6 text-blue-600" />}
                    />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>

                    <StatCard
                      title="En Rupture"
                      value={stockStatistics?.produitsEnRupture || 0}
                      className="border-red-200 bg-red-50/50 h-fit p-3"
                      icon={<Car className="h-6 w-6 text-blue-600" />}
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <StatCard
                      title="Nombre de stock"
                      value={formatNumber(stockStatistics?.produitsDisponibles) || 0}
                      className="border-green-200 bg-green-50/50 h-fit p-3"
                      icon={<Car className="h-6 w-6 text-blue-600" />}
                    />
                  </motion.div>
                  {
                    decoded.role == "admin" &&
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>


                      <StatCard
                        title="Valeur Totale"
                        value={formatNumber(stockStatistics?.valeurTotale) || 0}
                        className="border-blue-200 bg-blue-50/50  h-fit p-3"
                        icon={<Truck className="h-6 w-6 text-amber-600" />}
                      />

                    </motion.div>
                  }
                </div>

                <div className="my-2">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-auto">
                      <Search  className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher des pièces..."
                        className="pl-8 h-8 w-full sm:w-[300px]"
                        value={searchTerm}
                        type="search"
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end">

                      <StockAdvancedFilters
                        filters={filters2}
                        total={ComplexeFilter}
                        stock={DataStock}
                        onFiltersChange={handleFiltersChange}
                      />
                    </div>
                  </div>

                </div>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center w-full">
                      <CardTitle style={{ fontSize: "13px" }}>Stock ({filteredStock.length} produits)</CardTitle>
                      <div className="text-sm text-gray-600">
                        Page {currentPage} sur {totalPages}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">

                      {
                        !load.loading ?
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead style={{ textWrap: "nowrap" }}>Code Barres</TableHead>
                                <TableHead style={{ textWrap: "nowrap" }}>Code Items</TableHead>
                                <TableHead style={{ textWrap: "nowrap", cursor: "pointer" }} className=" text-nowrap cursor-pointer hover:bg-gray-100" onClick={() => { handleSort('designation'), sortOrder === "asc" ? (setPrice(0), setTri(0), setName(1)) : (setPrice(0), setTri(0), setName(2)) }}>  Désignation {sortField === 'designation' && (sortOrder === 'asc' ? '↑' : '↓')}</TableHead>
                                <TableHead style={{ textWrap: "nowrap" }}>Catégorie</TableHead>
                                <TableHead style={{ textWrap: "nowrap" }}>Origine</TableHead>
                                <TableHead style={{ textWrap: "nowrap" }}>Marque Produit</TableHead>
                                <TableHead style={{ textWrap: "nowrap" }}>Marque</TableHead>
                                <TableHead style={{ textWrap: "nowrap" }}>Modèle</TableHead>
                                <TableHead style={{ textWrap: "nowrap" }}>Série</TableHead>
                                <TableHead style={{ textWrap: "nowrap" }} className=" text-nowrap cursor-pointer hover:bg-gray-100" onClick={() => { handleSort("quantite"), sortOrder === "asc" ? (setPrice(0), setTri(1), setName(0)) : (setPrice(0), setTri(2), setName(0)) }}>Stock {sortField === "quantite" && (sortOrder === "asc" ? "↑" : "↓")}</TableHead>
                                <TableHead style={{ textWrap: "nowrap" }}>Statut</TableHead>
                                <TableHead style={{ textWrap: "nowrap" }} className=" text-nowrap cursor-pointer hover:bg-gray-100" onClick={() => handleSort('emplacement' as any)}>Emplacement {sortField === 'emplacement' && (sortOrder === 'asc' ? '↑' : '↓')}</TableHead>
                                <TableHead style={{ textWrap: "nowrap" }} className="text-end">Prix Achat</TableHead>
                                <TableHead style={{ textWrap: "nowrap" }} className="text-end">Prix Afficher</TableHead>
                                <TableHead style={{ textWrap: "nowrap" }} className="text-end">Dérnier prix</TableHead>
                                {/* <TableHead>Marge</TableHead> */}
                                {/* <TableHead style={{ textWrap: "nowrap" }}>Dernière entrée</TableHead> */}
                                <TableHead className="text-center">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {
                                (!load.loading && filteredStock.length != 0) ?
                                  (filteredStock.map((item) => (
                                    <TableRow
                                      key={item.id}
                                      className="hover:bg-gray-50 cursor-pointer !p-0"
                                      onClick={() => { handleRowClick(item), SetstockSelected(item) }}
                                    >
                                      <TableCell className="font-mono text-sm text-nowrap" style={{ fontSize: "12px" }}>{item.code_barre || '-'}</TableCell>
                                      <TableCell className="font-mono text-sm text-nowrap" style={{ fontSize: "12px" }}>{item.code_items || '-'}</TableCell>
                                      <TableCell>
                                        <div>
                                          <div className="font-medium text-nowrap" style={{ fontSize: "10px",textTransform:"uppercase" }}>{item.designation}</div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant="outline" style={{ fontSize: "10px" }} className=" text-nowrap uppercase">{item.categorie}</Badge>
                                      </TableCell>
                                      <TableCell >
                                        <Badge variant="outline"  style={{ fontSize: "10px" }} className=" text-nowrap uppercase">{item?.family?.origine?.pays || '-'}</Badge>
                                      </TableCell>
                                      <TableCell  style={{ fontSize: "10px" }} className=" text-nowrap uppercase font-semibold">{item.marque_produit}</TableCell>
                                      <TableCell style={{ fontSize: "10px" }} className=" text-nowrap uppercase font-semibold">{item.family?.parent?.parent?.family_name || '-'}</TableCell>
                                      <TableCell style={{ fontSize: "10px" }} className=" text-nowrap uppercase font-semibold">{item.family?.parent?.family_name || '-'}</TableCell>
                                      <TableCell style={{ fontSize: "10px" }} className=" text-nowrap uppercase font-semibold">{item.family?.family_name || '-'}</TableCell>

                                      <TableCell>
                                        <div className="text-center">
                                          <div style={{ fontSize: "11px" }} className=" text-nowrap uppercase font-semibold">{item.quantite}</div>
                                          {/* <div className="text-xs text-nowrap text-gray-500">Min: {item.quantite}</div> */}
                                        </div>
                                      </TableCell>
                                      <TableCell style={{ fontSize: "9px" }} className=" text-nowrap font-semibold">
                                        {
                                          item.quantite == 0 ?
                                            <Badge className={`${getStatusColor("rupture")} flex items-center gap-1`}>

                                              {getStatusIcon("rupture")}
                                              {"rupture".charAt(0).toUpperCase() + "rupture".slice(1)}
                                            </Badge>
                                            :
                                            (item.quantite <= 3 ?
                                              <Badge className={`${getStatusColor("alerte")} flex items-center gap-1`}>

                                                {/* {getStatusIcon("alerte")} */}
                                                {"alerte".charAt(0).toUpperCase() + "alerte".slice(1)}
                                              </Badge>

                                              :
                                              item.quantite > 3 &&
                                              <Badge className={`${getStatusColor("disponible")} flex items-center gap-1`}>

                                                {/* {getStatusIcon("disponible")} */}
                                                {"disponible".charAt(0).toUpperCase() + "disponible".slice(1)}
                                              </Badge>


                                            )
                                        }

                                      </TableCell>
                                      <TableCell className="font-mono text-center text-sm " style={{ fontSize: "12px" }}>{item.emplacement}</TableCell>
                                      <TableCell className="text-nowrap text-end font-semibold" style={{ fontSize: "11px" }} > {formatNumber(item.prix_achat) || 0} Ar</TableCell>
                                      <TableCell className="text-nowrap text-end font-semibold" style={{ fontSize: "11px" }}>{formatNumber(item.prix_affiche) || 0} Ar</TableCell>
                                      <TableCell className="text-nowrap text-end font-semibold"  style={{ fontSize: "11px" }}>{formatNumber(item.dernier_prix) || 0} Ar</TableCell>


                                      <TableCell className="text-center">
                                        <div className="flex justify-center gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => { handleEditItem(e, item) }}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                          >
                                            <Edit className="h-2 w-2" size={1}/>
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e: React.MouseEvent) => { e.stopPropagation(), setDeleteStock(item), setIsDeleteDialogOpen(true) }}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                          >
                                            <Trash className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )))
                                  :
                                  <TableRow>

                                    <TableCell colSpan={12} className="h-24 text-center">
                                      <div className="flex flex-col items-center">
                                        Aucun stock trouvé
                                        <Button variant="outline" onClick={() => { setSearchTerm(""), setComplexeFilter(DataStock) }} className="mt-4">
                                          <RefreshCcw className="h-4 w-4 mr-2" />
                                          Réinitialiser
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>


                              }
                            </TableBody>

                          </Table>
                          :
                          <div className="text-center m-auto w-full  pt-2 left-30 relative">
                            <p className="text-sm  ">Chargement en cours .....</p>
                          </div>
                      }


                    </div>


                    {/* {!load.loading && (totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-600">
                          Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredStock.length)} sur {filteredStock.length} résultats
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                          >
                            Précédent
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                          >
                            Suivant
                          </Button>
                        </div>
                      </div>
                    ))} */}
                  </CardContent>
                </Card>

              </div>
              :
              <div className="text-center mt-6 pt-2 border-t">
                <p className="text-sm">Aucun stock trouvé</p>
              </div>

          }


        </TabsContent>

        {/* Onglet Entrées */}
        <TabsContent value="entrees" className="space-y-3">
          {/* Bouton ajouter entrée */}
          <div className="flex justify-between items-center">
            <h2 className="text-xm font-semibold" style={{fontSize:"13px"}}>Entrées de Stock</h2>
            <Button onClick={() => setIsCreateEntreeModalOpen(true)}  style={{fontSize:"12px"}} className="bg-blue-950 hover:bg-blue-700 rounded">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle entrée
            </Button>
          </div>

          {/* Filtres Entrées */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Filtres des entrées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Date début</label>
                  <DatePicker date={startDate} setDate={setStartDate} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date fin</label>
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Fournisseur</label>
                  <Select value={selectedFournisseur} onValueChange={setSelectedFournisseur}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les fournisseurs</SelectItem>
                      {fournisseurs.map(fournisseur => (
                        <SelectItem key={fournisseur} value={fournisseur}>{fournisseur}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Type d'entrée</label>
                  <Select value={selectedTypeEntree} onValueChange={setSelectedTypeEntree}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="achat">Achat</SelectItem>
                      <SelectItem value="retour">Retour</SelectItem>
                      <SelectItem value="ajustement">Ajustement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Tableau Entrées */}
          {
            filteredEntrees.length != 0 ?
              <Card>
                <CardHeader>
                  <CardTitle style={{ fontSize: "14px", fontWeight: "normal" }}>Historique des entrées ({filteredEntrees.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead style={{ padding: "0" }}>Date</TableHead>
                        <TableHead style={{ padding: "0" }}>Produit</TableHead>
                        <TableHead style={{ padding: "0" }}>Type</TableHead>
                        <TableHead style={{ padding: "0" }} className="text-center">Quantité</TableHead>
                        <TableHead style={{ padding: "0" }}>Prix unitaire</TableHead>
                        <TableHead style={{ padding: "0" }}>Total</TableHead>
                        <TableHead style={{ padding: "0" }}>Fournisseur</TableHead>
                        {/* <TableHead style={{ padding: "0" }}>N° Facture</TableHead> */}
                        {/* <TableHead style={{ padding: "0" }}>Actions</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        filteredEntrees.map((entree) => (
                          <TableRow key={entree.id}>
                            <TableCell style={{ padding: "6px 0", fontSize: "13px" }}>
                              {format(new Date(entree.createdAt), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell style={{ padding: "2px 0", fontSize: "11px" }}>
                              <div className="font-normal uppercase">{entree.stock?.designation}</div>
                            </TableCell>
                            <TableCell style={{ padding: "2px 0", fontSize: "12px" }} className="font-normal"    >

                              {entree.status.charAt(0).toUpperCase() + entree.status.slice(1)}
                              {/* </Badge> */}
                            </TableCell>
                            <TableCell style={{ padding: "2px 0" }} className="text-center font-semibold">
                              +{entree.quantite}
                            </TableCell>
                            <TableCell style={{ padding: "2px 0", fontSize: "12px" }} className="text-nowrap">
                              {entree.prix_unitaire}
                              &nbsp; Ar </TableCell>
                            <TableCell style={{ padding: "2px 0", fontSize: "12px" }} className="font-normal text-nowrap">
                              {entree.quantite * entree.prix_unitaire}
                              &nbsp; Ar</TableCell>
                            <TableCell style={{ padding: "2px 0", fontSize: "12px" }} className="text-nowrap">{entree?.fournisseurs || "Non renseigné"}</TableCell>
                            {/* <TableCell style={{ padding: "2px 0" }} className="font-mono text-sm">
                              {entree.id}
                            </TableCell> */}
                            {/* <TableCell style={{ padding: "2px 0" }}>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell> */}
                          </TableRow>
                        ))

                      }
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              :
              <div >
                <div style={{ padding: "2px 0", textAlign: "center", width: "100%" }}>
                  Aucune entreé stock trouver
                </div>
              </div>
          }
        </TabsContent>
      </Tabs>

      {/* Modal détails produit */}
      <Dialog open={fileRefused} onOpenChange={setFileRefused}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Informations</DialogTitle>
          </DialogHeader>
          {
            importExcelFile.fileReturned?.message[0] == "0" ?
              <p className="bg-red-100 py-2 flex items-center gap-8  px-8 ">
                <XIcon size={16} />
                Aucun stock importé
              </p>
              :
              <p className="bg-green-100 py-2 flex items-center gap-8  px-8 ">
                <CheckCircle size={16} />
                {importExcelFile.fileReturned?.message}
              </p>
          }
          <p className="bg-red-50 border-l-4 text-gray-700 border-red-400 pl-6 py-2" style={{ fontSize: "14px" }}>
            {importExcelFile.fileReturned?.remarque}
          </p>
          <p>Remarque : <span className="text-md italic text-gray-500 text-md" style={{ fontSize: "14px" }}>le fichier ignoré est automatiquement télécharger sur votre Appareil</span> </p>


          <DialogFooter className="flex  !justify-end ">


            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setFileRefused(false)}>
                Fermer
              </Button>

            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Détails du produit</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Code Barres</label>
                    <p className="font-mono">{selectedItem.code_barre || 'Non défini'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Code Items</label>
                    <p className="font-mono">{selectedItem.code_items || 'Non défini'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Origine</label>
                    <Badge variant="outline">{selectedItem?.family?.origine.pays || 'Non défini'}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Marque Produit</label>
                    <p className="font-semibold">{selectedItem?.family?.family_name || 'Non défini'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Désignation</label>
                    <p className="font-semibold">{selectedItem.designation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Marque</label>
                    <p>{selectedItem?.family?.parent?.parent?.parent?.family_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Modèle</label>
                    <p>{selectedItem?.family?.parent?.parent?.family_name || 'Non défini'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Série</label>
                    <p>{selectedItem?.family?.parent?.family_name || 'Non défini'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Catégorie</label>
                    <Badge variant="outline">{selectedItem.categorie}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emplacement</label>
                    <p className="font-mono">{selectedItem.emplacement}</p>
                  </div>
                  {/* <div>
                    <label className="text-sm font-medium text-gray-600">Fournisseur</label>
                    <p>{selectedItem.fournisseur}</p>
                  </div> */}
                  {/* <div>
                    <label className="text-sm font-medium text-gray-600">Statut</label>
                    <Badge className={getStatusColor(selectedItem.status)}>
                      {selectedItem.status}
                    </Badge>
                  </div> */}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Stock actuel</label>
                    <p className="text-2xl font-bold">{selectedItem.quantite}</p>
                  </div>
                  {/* <div>
                    <label className="text-sm font-medium text-gray-600">Stock minimum</label>
                    <p>{selectedItem.quantiteMinimale}</p>
                  </div> */}
                </div>
                <div className="grid grid-cols-3 gap-10 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm  text-nowrap text-gray-600">Prix d'achat</p>
                    <p className="text-lg font-bold text-nowrap text-red-600">{formatNumber(selectedItem.prix_achat)} Ar</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-nowrap text-gray-600">Prix de vente</p>
                    <p className="text-lg text-nowrap font-bold text-green-600">{formatNumber(selectedItem.prix_affiche)} Ar</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Marge</p>
                    <p className="text-lg font-bold text-blue-600">
                      {((selectedItem.prix_affiche - selectedItem.prix_achat) / selectedItem.prix_achat * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}





          <DialogFooter className="flex  !justify-between ">

            <div className="flex items-center gap-2">
              <Button disabled={decoded.role != "admin"} onClick={() => { setIsCreateEntreeModalOpen2(true), setIsDetailModalOpen(false) }} style={{ borderRadius: "2px" }}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Entre un Stock
              </Button>
              <Button disabled={Number(selectedItem?.quantite) == 0} onClick={() => { setIsCreateModalOpen(true), setIsDetailModalOpen(false) }} style={{ borderRadius: "2px" }}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Créer une vente
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                Fermer
              </Button>
              <Button disabled={decoded.role != "admin"} onClick={() => {
                setIsDetailModalOpen(false);
                setIsEditStockModalOpen(true);
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal création Vente */}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la vente de {deleteStock?.designation} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteStock}>
              {UpStockSlice.loading ? "Suppression en cours" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      <Dialog open={isExportFile} onOpenChange={() => { dispatch(changeStatusExport("")), setIsExportFile(false), setChoose(1) }}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Exportation fichier</DialogTitle>
            <DialogDescription>
              Quel type de stock voulez-vous exporter ?

            </DialogDescription>
            <div className="flex   gap-2 pt-4">
              {
                ["Tous les stocks", "Stocks épuisés", "Stocks faibles"].map((choix, i) => (

                  <div onClick={() => { dispatch(changeStatusExport("")), setChoose(i + 1) }} key={i} className={Choose == i + 1 ? "flex items-center gap-4 border  border-blue-800 border-input bg-background hover:bg-accent hover:text-accent-foreground p-1 px-2 cursor-pointer rounded text" : "flex items-center gap-4   border p-1 px-2 cursor-pointer rounded"}>
                    <div className={`w-3 h-3 border border-gray-400   ${Choose == i + 1 ? "bg-blue-600 border-none" : ""}  rounded-full`}></div>
                    <p style={{ fontSize: "14px" }} className={`text-nowrap  ${Choose == i + 1 ? "text-gray-800" : "text-gray-500"}`}>{choix}</p>
                  </div>

                ))

              }

            </div>
            <p className=" text-red-500 mt-4 text-center" style={{ fontSize: "13px" }}>{UpdateExport.status}</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportFile(false)}>
              Annuler
            </Button>
            <Button variant="default" onClick={downloadExcel}>
              {UpdateExport.loading ? "Exportation en cours" : "Exporter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form action="" onSubmit={CreateVente}>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Nouvelle vente de : <span className="italic" style={{ fontWeight: "500", fontSize: "15px" }}>{stockSelected?.designation}</span></DialogTitle>
              <DialogDescription>
                Créer une nouvelle vente dans le système
              </DialogDescription>
            </DialogHeader>


            <div className="space-y-6">
              {/* Sélection/ajout de client */}
              <ClientSelector
                selectedClient={selectedClient as any}
                onClientSelect={setSelectedClient as any}
              />
              <div onClick={() => { setSimpleClient(!simpleClient) }} className={` ${String(selectedClient?.id) == "newClient" ? "flex" : "hidden"}  items-center bg-blue-100 gap-4 p-1 cursor-pointer  text-sm px-2`}>
                <Input type="checkbox" checked={simpleClient} readOnly id="tva" className="h-4 w-4" />
                Enrégistrer le client 

              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* <div>
                        <label className="text-sm font-medium mb-1 block">Date de vente</label>
                        <DatePicker date={new Date()} setDate={() => {}} />
                      </div> */}
                <div>
                  <label className="text-sm font-medium mb-1 block">Quantité</label>
                  <Input type="number" defaultValue={nouvelleVente?.quantite} onChange={(e) => handleChangeVente('quantite', e.target.value)} placeholder="1" min="1" />
                </div>
              </div>
              <div className="flex gap-2">

                <div className="flex-grow">
                  <label className="text-sm font-medium mb-1 block">Désignation du produit</label>
                  <Input placeholder="Description du produit..." defaultValue={stockSelected?.designation} readOnly onChange={(e) => handleChangeVente('designation', e.target.value)} />
                </div>
                <div className="flex-grow">
                  <label className="text-sm font-medium mb-1 block">Prix unitaire  (€)</label>
                  <Input type="number" placeholder={`Le prix doit être : ${stockSelected?.prix_affiche} Ar - ${stockSelected?.dernier_prix} Ar`} defaultValue={nouvelleVente?.prix_unitaire} onChange={(e) => { handleChangeVente('prix_unitaire', e.target.value) }} />
                  {/* <p>le prix doit être entre {`${stockSelected.prix_affiche} Ar ---- ${stockSelected.dernier_prix} Ar`}</p> */}
                </div>
              </div>


              <div onClick={() => { setAddTVA(!addTVA) }} className="flex items-center bg-blue-200 gap-4 p-1 cursor-pointer  text-sm px-2">
                <Input type="checkbox" checked={addTVA} readOnly id="tva" className="h-4 w-4" />
                Ajouter un TVA

              </div>

              {
                !addTVA ?
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium mb-1 block"   >Montant total_HT</label>
                      <Input ref={ht} placeholder="COROLLA, PATROL..." readOnly type="number" value={nouvelleVente?.prix_unitaire as any * nouvelleVente?.quantite} />
                    </div>

                    <div className="hidden">
                      <label className="text-sm font-medium mb-1 block">Montant total_TTC</label>
                      <Input ref={ttc} placeholder="2015-, 2010-..." readOnly type="number" value={(nouvelleVente?.prix_unitaire as any * nouvelleVente?.quantite)} />
                    </div>
                  </div>
                  :
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Montant TVA 20% </label>
                      <Input ref={tva} placeholder="COROLLA, PATROL..." type="number" value={nouvelleVente?.prix_unitaire as any * nouvelleVente?.quantite * 0.2} />

                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Montant total_HT</label>
                      <Input ref={ht} placeholder="COROLLA, PATROL..." readOnly type="number" value={nouvelleVente?.prix_unitaire as any * nouvelleVente?.quantite} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Montant total_TTC</label>
                      <Input ref={ttc} placeholder="2015-, 2010-..." readOnly type="number" value={(nouvelleVente?.prix_unitaire as any * nouvelleVente?.quantite as any * 0.2) + (nouvelleVente?.prix_unitaire as any * nouvelleVente?.quantite)} />
                    </div>
                  </div>
              }

              <div className="grid grid-cols-2 gap-4">

                {/* <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Input type="text" placeholder="payé" defaultValue={nouvelleVente.status} onChange={(e) => handleChange('status', e.target.value)} />
                  </div> */}
                <div>
                  <label className="text-sm font-medium mb-1 block">Mode de paiement</label>
                  {/* <Input type="text" placeholder="payé" defaultValue={nouvelleVente.mode_paiement} onChange={(e) => handleChangeVente('mode_paiement', e.target.value)} /> */}
                  <select name="" id="mode" className="block w-full p-2" defaultValue={nouvelleVente.mode_paiement} onChange={(e) => handleChangeVente('mode_paiement', e.target.value)} style={{ fontSize: "13px" }}>
                    <option value="">-- Sélectionner --</option>
                    <option value="espèce">Espèce</option>
                    <option value="mvola">Mvola</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="Airtel Money">Airtel Money</option>

                  </select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <div className="h-8 px-4 rounded-sm py-2 flex items-center text-sm cursor-pointer  border border-input bg-background hover:bg-accent hover:text-accent-foreground" onClick={() => setIsCreateModalOpen(false)}>
                Annuler
              </div>
              <Button onClick={() => {

              }}>
                {
                  AddVentesStock.loading ? "Création en cours" : "Créer la vente"
                }

              </Button>
            </DialogFooter>


          </form>
        </DialogContent>
      </Dialog>


      {isCreateStockExcel && <div className="h-screen fixed  z-10 px-10 flex justify-end items-start pt-40  w-full bottom-0 left-0" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="animate-fade-in card mx-auto bg-white w-5/12 rounded-lg overflow-hidden" style={{ borderRadius: "7px" }}>
          <div className="title border-b relative bg-[rgba(0,0,0] ">
            <button onClick={() => setFile(false)} className={`px-5 py-3 text-sm flex gap-4`}> <ListCheck className="" size={21} />  Ajouter un nouveau produit</button>
            <PlusIcon onClick={() => setIsCreateStockExcel(false)} className="absolute hover:scale-125  cursor-pointer right-4 top-3 rotate-45" />
          </div>
          <div className="content  p-6 ">
            <label htmlFor="uploadFile">

              <div className="import cursor-pointer select-none border-dotted border-stone-200 border-2 rounded-lg  justify-center p-10 py-10 flex gap-2">
                <UploadCloudIcon className="" size={21} />
                <h2 className="text-sm">{uploaded != "" ? uploaded : "Cliquez ici pour selectionner votre fichier !"}</h2>
              </div>
              <input type="file" name="" hidden onChange={uploadFile} id="uploadFile" />
            </label>
          </div>
          <div className="flex border-t items-center justify-between p-3 px-7">
            <h4 className="text-sm text-blue-600 flex items-center gap-4 cursor-pointer" onClick={() => { setIsCreateStockExcel(false), setIsCreateStockModalOpen(true) }}>      <NotepadText size={14} />  Utiliser des Formulaires</h4>
            {/* <Button style={{fontSize:"12.5px",fontWeight:"100" ,float :"right"}} className=""  > <UploadIcon className="mr-2 h-4 w-4"/>Importer </Button> */}
            <Button disabled={importExcelFile.loading} style={{ fontSize: "12.5px", fontWeight: "100", float: "right" }} onClick={importExcel} className={`${uploaded != "" ? "cursor-pointer" : "cursor-not-allowed bg-blue-200 hover:bg-blue-200"}`}   > <Plus className="mr-2 h-4 w-4" />{importExcelFile.loading ? "Importation en cours" : "Importer"} </Button>
          </div>
        </div>

      </div>}


      <Dialog open={isCreateStockModalOpen} onOpenChange={setIsCreateStockModalOpen}>
        <DialogContent className="max-w-2xl p-0 max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="bg-gray-50 sticky top-0 z-10 p-5 px-6">
            <DialogTitle>Ajouter un nouveau produit</DialogTitle>
            <DialogDescription>
              Remplissez les informations du nouveau produit à ajouter au stock
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-3 px-6">
            {/* Colonne 1 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="code_barre">Code Barre *</Label>
                <Input
                  id="code_barre"
                  defaultValue={productFormData.code_barre}
                  onChange={(e) => handleProductFormChange('code_barre', e.target.value)}
                  placeholder="1234567890123"
                />
              </div>

              <div>
                <Label htmlFor="codeItems">Code Items *</Label>
                <Input
                  id="codeItems"
                  defaultValue={productFormData.codeItems}
                  onChange={(e) => handleProductFormChange('codeItems', e.target.value)}
                  placeholder="Code unique de l'article"
                />
              </div>

              <div>
                <Label htmlFor="designation">Désignation *</Label>
                <Input
                  id="designation"
                  defaultValue={productFormData.designation}
                  onChange={(e) => handleProductFormChange('designation', e.target.value)}
                  placeholder="Nom du produit"
                />
              </div>

              <div>
                <Label htmlFor="origine">Origine *</Label>
                <Select
                  value={productFormData.origine}
                  onValueChange={(value) => handleProductFormChange('origine', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'origine" />
                  </SelectTrigger>
                  <SelectContent>
                    {referenceData.origines.map((origine) => (
                      <SelectItem key={origine.id} value={origine.id}>
                        {origine.pays}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="marqueProduit">Marque Produit *</Label>

                <Input
                  id="marqueProduit"
                  defaultValue={productFormData.marqueProduit}
                  onChange={(e) => handleProductFormChange('marqueProduit', e.target.value)}
                  placeholder="Sélectionner la marque produit"
                />

                {/* <Select
                  value={productFormData.marqueProduit}
                  onValueChange={(value) => handleProductFormChange('marqueProduit', value)}
                  // disabled={!productFormData.origine}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la marque produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableMarquesProduit().map((marque) => (
                      <SelectItem key={marque.id} value={marque.id}>
                        {marque.family_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
              </div>

              <div>
                <Label htmlFor="marque">Marque *</Label>
                <Select
                  value={productFormData.marque}
                  onValueChange={(value) => handleProductFormChange('marque', value)}
                  disabled={!productFormData.origine}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableMarques().map((marque) => (
                      <SelectItem key={marque.id} value={marque.id}>
                        {marque?.family_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="modele">Modèle *</Label>
                <Select
                  value={productFormData.modele}
                  onValueChange={(value) => handleProductFormChange('modele', value)}
                  disabled={!productFormData.marque}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableModeles().map((modele) => (
                      <SelectItem key={modele.id} value={modele.id}>
                        {modele?.family_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Colonne 2 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="serie">Série</Label>
                <Select
                  value={productFormData.serie}
                  onValueChange={(value) => handleProductFormChange('serie', value)}
                  disabled={!productFormData.modele}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la série" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableSeries().map((serie) => (
                      <SelectItem key={serie.id} value={serie.id}>
                        {serie?.family_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="categorie">Catégorie *</Label>
                <Input
                  value={productFormData.categorie}
                  placeholder="Tapez la catégorie"
                  onChange={(value) => handleProductFormChange('categorie', value.target.value)}
                >
                  {/* <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VITRE">VITRE</SelectItem>
                    <SelectItem value="FREIN">FREIN</SelectItem>
                    <SelectItem value="ENTRETIEN">ENTRETIEN</SelectItem>
                    <SelectItem value="SUSPENSION">SUSPENSION</SelectItem>
                    <SelectItem value="MOTEUR">MOTEUR</SelectItem>
                    <SelectItem value="ÉLECTRICITÉ">ÉLECTRICITÉ</SelectItem>
                  </SelectContent> */}
                </Input>
              </div>

              <div>
                <Label htmlFor="prixAffiche">Prix d'achat *</Label>
                <Input
                  id="prixAffiche"
                  type="number"
                  step="0.01"
                  defaultValue={productFormData.prix_achat}
                  onChange={(e) => handleProductFormChange('prix_achat' as any, parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="prixAffiche">Prix Affiché *</Label>
                <Input
                  id="prixAffiche"
                  type="number"
                  step="0.01"
                  defaultValue={productFormData.prixAffiche}
                  onChange={(e) => handleProductFormChange('prixAffiche', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="dernierPrix">Dernier Prix *</Label>
                <Input
                  id="dernierPrix"
                  type="number"
                  step="0.01"
                  defaultValue={productFormData.dernierPrix}
                  onChange={(e) => handleProductFormChange('dernierPrix', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="emplacement">Emplacement</Label>
                <Input
                  id="emplacement"
                  defaultValue={productFormData.emplacement}
                  onChange={(e) => handleProductFormChange('emplacement', e.target.value)}
                  placeholder="A-01-15"
                />
              </div>

              <div>
                <Label htmlFor="quantiteStock">Stock Actuel *</Label>
                <Input
                  id="quantiteStock"
                  type="number"
                  defaultValue={productFormData.quantiteStock}
                  onChange={(e) => handleProductFormChange('quantiteStock' as any, parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="hidden">
                <Label htmlFor="quantiteMinimale">Stock Minimum *</Label>
                <Input
                  id="quantiteMinimale"
                  type="number"
                  defaultValue={productFormData.quantiteMinimale}
                  onChange={(e) => handleProductFormChange('quantiteMinimale', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 px-6 hidden">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              defaultValue={productFormData.description}
              onChange={(e) => handleProductFormChange('description', e.target.value)}
              placeholder="Description détaillée du produit..."
              rows={3}
            />
          </div>

          <DialogFooter className="p-3 px-6  w-full  !flex !items-center !justify-between">
            <p className="text-blue-600 border border-dashed border-gray-300 px-6 cursor-pointer text-sm py-1" onClick={() => { setIsCreateStockExcel(true), setIsCreateStockModalOpen(false) }}>Ajouter par excel</p>
            <div className="flex gap-4">
              <Button style={{ fontSize: "13px" }} variant="outline" onClick={() => {
                setIsCreateStockModalOpen(false);
                resetProductForm();
              }}>
                Annuler
              </Button>
              <Button style={{ fontSize: "13px" }} onClick={handleCreateStock}>
                {
                  AddStock.loading ? "Ajoute en cours" : "Ajouter le produit"
                }

              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/*       
      <Dialog open={isCreateStockModalOpen} onOpenChange={setIsCreateStockModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau produit</DialogTitle>
          </DialogHeader>
          <PieceForm
            onSubmit={handleCreateStock}
            onCancel={() => setIsCreateStockModalOpen(false)}
          />
        </DialogContent>
      </Dialog> */}

      {/* Modal modification produit */}
      <Dialog open={isEditStockModalOpen} onOpenChange={setIsEditStockModalOpen}>
        <DialogContent className="max-w-3xl p-0 max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="bg-gray-50 sticky top-0 z-10 p-5 px-6">
            <DialogTitle>Modifier le produit :  <span className="italic" style={{ fontWeight: "500", fontSize: "15px" }}>{stockSelected?.designation}</span></DialogTitle>
            <DialogDescription>
              Modifier les informations d'un produit  au stock
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <PieceForm
              onSubmit={handleUpdateStock}
              onCancel={() => {
                setIsEditStockModalOpen(false);
                setSelectedItem(null);
              }}
              initialData={{
                id: selectedItem.id,
                code_barre: selectedItem.code_barre || '',
                code_items: selectedItem.code_items || '',
                designation: selectedItem.designation || '',
                description: '',
                categorie: selectedItem.categorie,
                prix_achat: selectedItem.prix_achat,
                prix_affiche: selectedItem.prix_affiche,
                dernier_prix: selectedItem.dernier_prix,
                emplacement: selectedItem.emplacement,
                marqueProduit: selectedItem.marque_produit
                ,
                // marque: selectedItem.marque,
                quantite: selectedItem.quantite,
                // quantiteMinimale: selectedItem.quantiteMinimale,
                // prixAchat: selectedItem.prixAchat,
                // prixVente: selectedItem.prixVente,
                // emplacement: selectedItem.emplacement,
                // fournisseur: selectedItem.fournisseur,
                origine: selectedItem.origine || '',
                // modele: selectedItem.modele || '',
                // serie: selectedItem.serie || '',
                // reference: '',
                // anneeDebut: null,
                // anneeFin: null,
                // motorisation: '',
                family: selectedItem.family.id
                // compatibilite: '',
                // poids: '',
                // dimensions: '',
                // garantie: '',
              }}
              reference={
                referenceData.series
              }
            />
          )}
        </DialogContent>
      </Dialog>

      {/*Seconde  Modal de création entrée  */}


      <Dialog open={isCreateInvoice} onOpenChange={setIsCreateInvoice}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Option pour la facturation</DialogTitle>
            <DialogDescription>
              Vous pour créer ou imprimer directement un facture icizy !
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateInvoice(true), reactToPrintFn(), CreateMoreInvoices() }}>
              <EditIcon />
              {

                AddInvoices.loading ? "Enrégistrement en cours" : "Enrégistrer et Imprimer la facture"
              }

            </Button>
            <div className="hidden print:block" ref={contentRef}>
              <ToPrints selectedInvoice={createFacture[0]} num={invoiceNumber} />
            </div>
            {/* <Button variant="secondary" onClick={reactToPrintFn}>
              <PrinterIcon />
              Imprimer
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>



      <Dialog open={isCreateEntreeModalOpen2} onOpenChange={setIsCreateEntreeModalOpen2}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Nouvelle entrée de stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date d'entrée</label>
                <DatePicker date={new Date()} setDate={() => { }} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Type d'entrée</label>
                <Select onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="achat">Achat</SelectItem>
                    <SelectItem value="retour">Retour</SelectItem>
                    <SelectItem value="ajustement">Ajustement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Produitsss</label>
              <Input placeholder="Description du produit..." defaultValue={stockSelected?.designation} readOnly onChange={(e) => handleChange('designation', e.target.value)} />
              {/* <Select onValueChange={(value) => handleChange('idStock', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un produit..." />
                </SelectTrigger>
                <SelectContent>
                   
                 
                    <SelectItem  value={stockSelected?.id | 0} onClick={(e) => handleChange("idStock", stockSelecte?.id | 0)}>
                      {stockSelected?.designation}
                    </SelectItem>
                
                </SelectContent>
              </Select> */}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Quantité</label>
                <Input type="number" defaultValue={Es.quantite} onChange={(e) => handleChange("quantite", e.target.value)} placeholder="0" min="1" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Prix d'achat unitaire (€)</label>
                <Input type="number" min="0" defaultValue={Es.prix_unitaire} onChange={(e) => handleChange("prix_unitaire", e.target.value)} />
              </div>
            </div>
            <div className=" grid-cols-2 gap-4 ">
              <div>
                <label className="text-sm font-medium mb-1 block"  >Fournisseur</label>
                <Input placeholder="Nom du fournisseur" defaultValue={Es.fournisseurs} onChange={(e) => handleChange("fournisseurs", e.target.value)} />
              </div>
              <div className="hidden">
                <label className="text-sm font-medium mb-1 block">N° Facture</label>
                <Input placeholder="Numéro de facture" />
              </div>
            </div>
            <div className="hidden">
              <label className="text-sm font-medium mb-1 block">Commentaire (optionnel)</label>
              <Input placeholder="Notes sur cette entrée..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateEntreeModalOpen2(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateEntree2}>
              {
                AddEntreStock.loading ? "Ajoute en cours..." : "Enregistrer l'entrée"
              }

            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal création entrée */}
      <Dialog open={isCreateEntreeModalOpen} onOpenChange={setIsCreateEntreeModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle entrée de stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date d'entrée</label>
                <DatePicker date={new Date()} setDate={() => { }} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Type d'entrée</label>
                <Select onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="achat">Achat</SelectItem>
                    <SelectItem value="retour">Retour</SelectItem>
                    <SelectItem value="ajustement">Ajustement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Produit</label>
              <Select onValueChange={(value) => handleChange('idStock', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un produit..." />
                </SelectTrigger>
                <SelectContent>
                  {stockData.map(item => (
                    // <SelectItem key={item.id} value={item.id} onClick={(e) => handleChange("idStock", item.id)}>
                    //   {item.categorie} ~  {item.family?.parent?.parent?.parent?.family_name} ~  {item?.family?.origine.pays} ~  {item.family?.parent?.parent?.family_name} ~  {item.family?.parent?.family_name} ~  {item.family?.family_name}
                    // </SelectItem>
                    <SelectItem key={item.id} value={item.id as any} onClick={(e) => handleChange("idStock", item.id)}>
                      {item.designation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Quantité</label>
                <Input type="number" defaultValue={Es.quantite} onChange={(e) => handleChange("quantite", e.target.value)} placeholder="0" min="1" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Prix d'achat unitaire (€)</label>
                <Input type="number" placeholder="0.00" step="0.01" min="0" defaultValue={Es.prix_unitaire} onChange={(e) => handleChange("prix_unitaire", e.target.value)} />
              </div>
            </div>
            <div className="grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block"  >Fournisseur</label>
                <Input placeholder="Nom du fournisseur" defaultValue={Es.fournisseurs} onChange={(e) => handleChange("fournisseurs", e.target.value)} />
              </div>
              <div className="hidden">
                <label className="text-sm font-medium mb-1 block">N° Facture</label>
                <Input placeholder="Numéro de facture" />
              </div>
            </div>
            <div className="hidden">
              <label className="text-sm font-medium mb-1 block">Commentaire (optionnel)</label>
              <Input placeholder="Notes sur cette entrée..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateEntreeModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateEntree}>
              {
                AddEntreStock.loading ? "Ajoute en cours..." : "Enregistrer l'entrée"
              }

            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Références Pièces */}
      <PieceReferencesModal
        open={isReferencesModalOpen}
        onOpenChange={setIsReferencesModalOpen}
      />
    </div>
  );
};

export default Stocks;