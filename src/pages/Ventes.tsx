 import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Calendar, Plus, Eye, Edit, Trash2, FileText, Filter, X, User, MapPin, Phone, Mail, Settings, CalendarIcon, Package, Tag, Users, Euro, RefreshCcw, XIcon, Printer, PrinterIcon, EditIcon } from "lucide-react";
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
import { ToWords } from 'to-words';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence, setDragLock } from "framer-motion";
import { format, nextDay } from "date-fns";
import { fr } from "date-fns/locale";
import { DatePicker } from "@/components/SuiviVentes/DatePicker";
import { filterVentes, formatCurrency, sortVentes } from "@/components/SuiviVentes/utils";
import { ClientSelector } from "@/components/ClientSelector";
import { AddMoreVentesAsync, AddVentesAsync, UpdateVentesAsync, VentesAsync } from "@/redux/Async/VentesAsync";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { MarkAsyncThunk } from "@/redux/Async/mark.async";
import { MarkProductAsyncThunk } from "@/redux/Async/productMark.async";
import { LevelAsyncThunk } from "@/redux/Async/level.asyncThunk";
import { OrigineAsyncThunk } from "@/redux/Async/origine.async";
import { SerieAsyncThunk } from "@/redux/Async/serie.async";
import { ModeleAsyncThunk } from "@/redux/Async/modele.async";
import { StockAsync } from "@/redux/Async/stockAsync";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { cn } from '@/lib/utils';
import CountUp from "react-countup";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { changeMsg, changeUpdateStatus } from "@/redux/slice/VentesSlice";
import ToPrint from "@/components/toPrint2";
import { useReactToPrint } from "react-to-print";
import { AddInvoicesAsync, AddMoreInvoicesAsync, InvoicesAsync } from "@/redux/Async/InvoicesASync";
import { AddEntreStockAsync } from "@/redux/Async/EntreStockAsync";
import ClickOutside from "@/components/overlayDrop";
import PrintMore from "@/components/toPrintMoreArticles";
import PrintMoreChecked from "@/components/toPrintMoreArticlesChecked";
import { changeStatus } from "@/redux/slice/InvoicesSlice";
import { changeEntreStatus } from "@/redux/slice/EntreStockSlice";
import { ClientAsync } from "@/redux/Async/ClientAsync";
import { AnyARecord } from "dns";
import { OneUserAsync } from "@/redux/Async/userAuthAsync";
import { jwtDecode } from "jwt-decode";
import generateInvoiceNumber from "@/types/num-invoices";
import { APP_URL } from "../../process.env";

// Types
interface Client {
  id: string;
  name: string;
  firstName: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
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
interface ProductFormData {
  codeBarres: string;
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
  quantiteStock: number;
  quantiteMinimale: number;
  description: string;
}
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
  statut: string;
  vendeur: string;
  client: string;
  typeVente: string;
  region: string;
  quantiteMin?: number;
  quantiteMax?: number;
  margeMin?: number;
  margeMax?: number;
  categories: string[];
}

const Vente = () => {
  const AllInvoices = useSelector((state: RootState) => state.InvoicesSlice)
  const AddInvoices = useSelector((state: RootState) => state.AddInvoicesSlice)
  const dispatch = useDispatch<AppDispatch>()

  const [invoiceNumber, setInvoiceNumber] = useState("");
  useEffect(() => {
    dispatch(InvoicesAsync())
    const lastNumber = (AllInvoices?.data.length != 0 ? (AllInvoices?.data[0]?.list[0]?.numFacture)?.split("-")[2] : undefined);
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



  function formatNumber(value) {
    if (!value) return '';
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(value);
  }


  const OneUser = useSelector((state: RootState) => state.OneUserSlice)
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
    // dispatch(OneUserAsync(decoded.id))
  }, [decoded.id])
  useEffect(() => {
    // dispatch(OneUserAsync(decoded.id))
  }, [])




  let DateNow = new Date(format(new Date(), "MM/dd/yyyy"))






  const [articles, setArticles] = useState([])
  const addMore = () => {
    setSelectedArticles([...selectedArticles, {
      quantite: 0,
      prix_unitaire: '',
      status: "",
      mode_paiement: "",
      TVA: 0,
      total_HT: 0,
      total_TTC: 0,
      admin: decoded?.id,
      dataClient: null,
      client: selectedClient?.id,
      stock: 0
    }])
  }



  // const toWords = new ToWords({
  //   localeCode: 'en-IN',
  //   converterOptions: {
  //     currency: true,
  //     ignoreDecimal: false,
  //     ignoreZeroCurrency: false,
  //     doNotAddOnly: false,
  //     currencyOptions: {
  //       // can be used to override defaults for the selected locale
  //       name: 'Rupee',
  //       plural: 'Rupees',
  //       symbol: '₹',
  //       fractionalUnit: {
  //         name: 'Paisa',
  //         plural: 'Paise',
  //         symbol: '',
  //       },
  //     },
  //   },
  // });
  const toWords = new ToWords({
    localeCode: 'fr-FR',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        // can be used to override defaults for the selected locale
        name: 'Ariary',
        plural: 'Ariary',
        symbol: 'Ar',
        fractionalUnit: {
          name: 'Paisa',
          plural: 'Paise',
          symbol: '',
        },
      },
    },
  });


  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [action, setAction] = useState(false);
  const [createFacture, setCreateFacture] = useState([]);
  const [created, setCreated] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    startDate: DateNow,
    endDate: undefined,
    category: "all",
    marqueVehicule: "all",
    marqueProduit: "all",
    searchTerm: "",
    statut: "all",
    vendeur: "all",
    client: "all",
    typeVente: "all",
    region: "all",
    categories: [],
  });

  const search = useRef() as any

  const [searchValue, SetSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
    field: "date",
    order: "desc"
  });



  const [productFormData, setProductFormData] = useState<ProductFormData>({
    codeBarres: '',
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
  const [stockSelected, SetstockSelected] = useState(null);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.category !== "all") count++;
    if (filters.marqueVehicule !== "all") count++;
    if (filters.marqueProduit !== "all") count++;
    if (filters.statut !== "all") count++;
    if (filters.vendeur !== "all") count++;
    if (filters.client !== "all") count++;
    if (filters.typeVente !== "all") count++;
    if (filters.region !== "all") count++;
    if (filters.prixMin) count++;
    if (filters.prixMax) count++;
    if (filters.quantiteMin) count++;
    if (filters.quantiteMax) count++;
    if (filters.margeMin) count++;
    if (filters.margeMax) count++;
    if (filters.categories.length > 0) count++;
    return count;
  }, [filters]);



  const [updateDate, setUpdateDate] = useState(null)
  const DataStock = useSelector((state: RootState) => state.StockSlice.data)
  const UpVentes = useSelector((state: RootState) => state.UpVentesSlice)
  const [DataStockCateg, setDataStockCateg] = useState(DataStock)

  const [searchCateg, setSearchCateg] = useState("")

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef })


  const AddEntreStock = useSelector((state: RootState) => state.AddEntreStockSlice)

  const venteAnnuler = (selectedVente) => {

    const data = {
      idStock: selectedVente?.stock?.id,
      quantite: selectedVente.quantite,
      status: "retour pièce",
      prix_unitaire: selectedVente.total_HT / selectedVente.quantite,
      fournisseurs: '',
      admin: decoded?.id,
      venteId: selectedVente.id
    }
    dispatch(AddEntreStockAsync({ ...data } as any))
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
        admin: decoded?.id
      }

      newInvoice.push(newInvoices)
    })
    dispatch(AddMoreInvoicesAsync(newInvoice as any))
  }
  const [isCreateInvoice, setIsCreateInvoice] = useState(false);


  const AllClient = useSelector((state: RootState) => state.ClientSlice.data).filter((client) => client.status == "fidele")




  useEffect(() => {
    dispatch(ClientAsync())
  }, [])
  useEffect(() => {
    if (!UpVentes.loading && UpVentes.status == "updated") {
      setIsEditModalOpen(false);
      toast({
        title: "Vente modifiée",
        description: "Les modifications ont été enregistrées avec succès."
      });
      dispatch(VentesAsync())

      dispatch(changeUpdateStatus(""))
    }
  }, [UpVentes.loading])

  const CreateInvoicesChecked = () => {
    let newInvoice = []
    stockChecked.map((facture) => {

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
        admin: decoded?.id
      }

      newInvoice.push(newInvoices)
    })


    dispatch(AddMoreInvoicesAsync(newInvoice as any))


  }
  const CreateInvoices = () => {
    const newInvoices = {
      designation: selectedVente.stock.designation,
      client: selectedVente.client.id,
      tva: selectedVente.TVA,
      quantite: selectedVente.quantite,
      prix_ht: (selectedVente.total_HT / selectedVente.quantite),
      total_ht: selectedVente.total_HT,
      total_ttc: selectedVente.total_TTC,
      mode_paiment: selectedVente.mode_paiement as any,
      numFacture: invoiceNumber,
      stock: selectedVente?.id,
      admin: decoded?.id

    }

    dispatch(AddInvoicesAsync(newInvoices as any))
  }


  useEffect(() => {
    setSelectedArticles(selectedArticles)
  }, [action])


  useEffect(() => {
    dispatch(VentesAsync())
  }, [created])


  useEffect(() => {
    setDataStockCateg(DataStock)
  }, [DataStock])

  const VentesStock = useSelector((state: RootState) => state.VentesSlice.data)
  const Mark = useSelector((state: RootState) => state.MarkSlice.data)
  const MarkProd = useSelector((state: RootState) => state.MarkProductSlice.data)
  const Modele = useSelector((state: RootState) => state.ModeleSlice.data)
  const Serie = useSelector((state: RootState) => state.SerieSlice.data)

  const AddVentesStock = useSelector((state: RootState) => state.AddVentesSlice)

  const getAvailableMarques = () => {
    if (!productFormData.marqueProduit) return [];
    return Mark.filter((item) => item?.parent?.family_name == productFormData.marqueProduit) || [];
  };

  const getAvailableModeles = () => {
    if (!productFormData.marque) return [];
    return Modele.filter((item) => item?.parent?.family_name == productFormData.marque) || [];
  };
  const getAvailableSeries = () => {
    if (!productFormData.modele) return [];
    return Serie.filter((item) => item?.parent?.family_name == productFormData.modele) || [];
  };

  const handleChangeVente = (item, value) => {

    setNouvelleVente(prev => ({ ...prev, [item]: value }));
  }
  const [addTVA, setAddTVA] = useState(false)
  const [simpleClient, setSimpleClient] = useState(false)
  const tva = useRef() as any
  const ttc = useRef() as any
  const ht = useRef() as any

  const [mockVentesData, setMockVentesData] = useState(VentesStock)

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);




  useEffect(() => {
    dispatch(VentesAsync())
  }, [])
  useEffect(() => {
    nouvelleVente.client = selectedClient?.id
  }, [selectedClient])

  useEffect(() => {
    applyFilters()
  }, [VentesStock])
  useEffect(() => {
    if (!AddEntreStock.loading && AddEntreStock.status == "ok") {

      dispatch(VentesAsync())
      dispatch(StockAsync())
      SetstockSelected(null)
      setSearchCateg(null)

      toast({
        title: "Vente créée",
        description: "La nouvelle vente a été enregistrée avec succès."
      });
      dispatch(changeEntreStatus(""))
      resetForms()
      setSelectedClient(null)

      setIsCreateModalOpen(false);
      setIsDismissDialogOpen(false);
    }
  }, [AddEntreStock.loading])
  useEffect(() => {
    dispatch(InvoicesAsync())
    if (!AddVentesStock.loading && AddVentesStock.venteIds.length != 0) {
      setCreated(!created)
      setIsCreateInvoice(true)
      dispatch(StockAsync())
      SetstockSelected(null)
      setSearchCateg(null)
      dispatch(VentesAsync())
      toast({
        title: "Vente créée",
        description: "La nouvelle vente a été enregistrée avec succès."
      });
      resetForms()
      setSelectedClient(null)

      setIsCreateModalOpen(false);
      setIsDismissDialogOpen(false);
      dispatch(VentesAsync())
      // dispatch(changeMsg(""))

    }
  }, [AddVentesStock.loading])

  useEffect(() => {
    if (!isCreateInvoice) {
      dispatch(changeMsg(""))
    }
  }, [isCreateInvoice])
  function refresh() {
    dispatch(VentesAsync())
    dispatch(StockAsync())
  }

  const applyFilters = () => {
    setIsLoading(true);
    let value = searchValue
    let data = []

    if (value != '') {
      const filtered = mockVentesData.filter((item) =>
        (item?.mode_paiement?.toLowerCase()).includes(value.toLowerCase()) || (item?.stock?.designation.toLowerCase()).includes(value.toLowerCase()) || (item?.stock?.categorie.toLowerCase()).includes(value.toLowerCase()) || (item?.stock?.emplacement.toLowerCase()).includes(value.toLowerCase()) || (item?.client?.name?.toLowerCase())?.includes(value.toLowerCase()) || (item?.client?.firstName?.toLowerCase())?.includes(value.toLowerCase()) || (item?.stock?.designation.toLowerCase()).includes(value.toLowerCase())
      )

      data = filtered
    } else {
      data = VentesStock
    };

    const filteredData = data.filter((vente) => {
      let NextDate = () => {
        const date = new Date(filters.endDate);
        date.setDate(date.getDate() + 1);
        return date
      };
      if (filters.startDate && new Date((vente.createdAt)) <= new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && new Date(new Date(vente.createdAt)) >= new Date(new Date(NextDate()))) {
        return false;
      }
      if (filters.marqueProduit !== "all" && vente.stock.family.family_name !== filters.marqueProduit) {
        return false;
      }
      if (filters.marqueVehicule !== "all" && vente.stock.family.parent?.parent?.family_name !== filters.marqueVehicule) {
        return false;
      }
      if (filters.statut !== "all" && vente.status !== filters.statut) {
        return false;
      }
      if (filters.typeVente !== "all" && vente.mode_paiement !== filters.typeVente) {
        return false;
      }
      if (filters.vendeur !== "all" && vente.admin.name !== filters.vendeur) {
        return false;
      }

      if (filters.client !== "all" && vente.client.name !== filters.client) {
        return false;
      }

      if (filters.region !== "all" && !vente.client.adresse.includes(filters.region)) {
        return false;
      }

      if (filters.prixMin !== undefined && vente.total_HT < filters.prixMin) {
        return false;
      }
      if (filters.prixMax !== undefined && vente.total_HT > filters.prixMax) {
        return false;
      }

      if (filters.quantiteMin !== undefined && vente.quantite < filters.quantiteMin) {
        return false;
      }
      if (filters.quantiteMax !== undefined && vente.quantite > filters.quantiteMax) {
        return false;
      }

      const margin = ((vente.stock.prix_affiche - vente.stock?.prix_achat) / vente.stock?.prix_achat) * 100;
      if (filters.margeMin !== undefined && margin < filters.margeMin) {
        return false;
      }
      if (filters.margeMax !== undefined && margin > filters.margeMax) {
        return false;
      }

      if (filters.categories.length > 0 && !filters.categories.some(cat => ((vente.stock.categorie).toUpperCase()).includes((cat).toUpperCase()))) {
        return false;
      }
      return true;
    });



    setMockVentesData(filteredData)
  };
  useEffect(() => { applyFilters() }, [searchValue])
  useEffect(() => { applyFilters() }, [filters])


  const resetForms = () => {
    setNouvelleVente({
      quantite: "",
      prix_unitaire: "",
      status: "",
      mode_paiement: "",
      TVA: 0,
      total_HT: 0,
      total_TTC: 0,
      admin: decoded?.id,
      client: selectedClient?.id,
      stock: 5
    } as any)
  }
  const marquesProduit = useMemo(() =>
    Array.from(new Set(mockVentesData.map(vente => vente.marqueProduit))),
    []);
  const marquesVehicule = useMemo(() =>
    Array.from(new Set(mockVentesData.map(vente => vente.marqueVehicule))),
    []);
  const statutOptions = ["Validée", "En attente", "Annulée", "Retournée"];
  const vendeurOptions = ["Jean Dupont", "Marie Martin", "Pierre Durand", "Sophie Bernard"];
  const clientOptions = ["Client A", "Client B", "Client C", "Client D"];
  const typeVenteOptions = ["Comptoir", "Atelier", "Livraison", "Commande"];
  const regionOptions = ["Nord", "Sud", "Est", "Ouest", "Centre"];


  const [nouvelleVente, setNouvelleVente] = useState({
    quantite: 0,
    prix_unitaire: '',
    status: "",
    mode_paiement: "",
    TVA: parseFloat(tva?.current?.value as any),
    total_HT: ht?.current?.value as any,
    total_TTC: ttc?.current?.value as any,
    admin: decoded?.id,
    client: selectedClient?.id,
    stock: 0,
    dataClient: []
  })
  useEffect(() => {
    const newValue = []
    selectedArticles.map((items: any) => (
      newValue.push({ ...items, TVA: addTVA ? (items.prix_unitaire * items.quantite * 0.2) : 0, total_HT: items.prix_unitaire * items.quantite, total_TTC: (addTVA ? (items.prix_unitaire * items.quantite * 0.2) : 0) + (items.prix_unitaire * items.quantite), client: selectedClient?.id, mode_paiement: nouvelleVente.mode_paiement, dataClient: { ...selectedClient, status: simpleClient ? "fidele" : "simple", } })
    ))
    setSelectedArticles(newValue)
  }, [addTVA, nouvelleVente, simpleClient])

  const handleChange = (field: string, value: string) => {
    setNouvelleVente(prev => ({ ...prev, [field]: value }));
  };
  useEffect(() => {
    setNouvelleVente(prev => ({ ...prev, client: selectedClient?.id }));

  }, [selectedClient])
  const CreateVente = (e) => {
    e.preventDefault()
    if (!nouvelleVente.client) {
      if (!nouvelleVente.client) {
        toast({
          title: "Message",
          description: `Veuillez séléctionner un client`,
          variant: "destructive",
        });

      } else if (stockSelected?.id == null) {
        toast({
          title: "Message",
          description: `Veuillez séléctionner un stock`,
          variant: "destructive",
        });

      }

    } else {




      dispatch(AddMoreVentesAsync(selectedArticles as any))
      setCreateFacture(selectedArticles)
      resetForms()
    }

  };





  const handleProductFormChange = (field: keyof ProductFormData, value: string | number) => {
    setProductFormData(prev => ({ ...prev, [field]: value }));

    // Réinitialiser les champs dépendants si nécessaire
    if (field === 'categorie') {
      resetDependentFields('categorie');
    } else if (field === 'marqueProduit') {
      resetDependentFields('marqueProduit');
    } else if (field === 'marque') {
      resetDependentFields('marque');
    } else if (field === 'modele') {
      resetDependentFields('modele');
    }
  };

  useEffect(() => {
    // if (!AddStock.loading) {
    // setIsCreateStockModalOpen(false);
    dispatch(StockAsync())
    dispatch(changeMsg([]))
    setIsCreateInvoice(false)
    // }
  }, [])




  const resetDependentFields = (level: 'categorie' | 'marqueProduit' | 'marque' | 'modele' | 'serie') => {
    const updates: Partial<ProductFormData> = {};

    if (level === 'categorie') {
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



  const [startDate, setStartDate] = useState<Date | undefined>(DateNow);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMarque, setSelectedMarque] = useState("all");
  const [ventesData, setVentesData] = useState<VenteItem[]>(mockVentesData);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDismissDialogOpen, setIsDismissDialogOpen] = useState(false);
  const [isCreateInvoiceSelected, setIsCreateInvoiceSelected] = useState(false);
  const [selectedVente, setSelectedVente] = useState<VenteItem | any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [showFilters, setShowFilters] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { toast } = useToast();

  const itemsPerPage = 10;
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle sort order if the same field is clicked
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending order
      setSortField(field);
      setSortOrder("asc");
    }
  };
  const [stockChecked, setStockChecked] = useState([])

  let fil = (stockChecked.length == 0 ? mockVentesData : mockVentesData.filter((item) => item.client.id == stockChecked[0].client.id && new Date(item.createdAt).toLocaleDateString() == new Date(stockChecked[0].createdAt).toLocaleDateString()))

  // Filtrage et tri des données
  const filteredVentes = useMemo(() => {
    return fil
      .filter(vente => {
        const matchesSearch = !searchTerm ||
          vente.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vente.marqueProduit.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vente.marqueVehicule.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === "all" || vente.categorie === selectedCategory;
        const matchesMarque = selectedMarque === "all" || vente.marqueVehicule === selectedMarque;

        const venteDate = new Date(vente.date);
        const matchesDateRange = (!startDate || venteDate >= startDate) &&
          (!endDate || venteDate <= endDate);

        return matchesSearch && matchesCategory && matchesMarque && matchesDateRange && vente.statut === "active";
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    applyFilters()
  }, [ventesData, searchTerm, selectedCategory, selectedMarque, startDate, endDate, sortField, sortOrder]);

  const paginatedVentes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVentes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVentes, currentPage]);

  const totalPages = Math.ceil(filteredVentes.length / itemsPerPage);

  const statistics = useMemo(() => {
    const totalAchat = mockVentesData.reduce((acc, vente) => acc + (vente.stock?.prix_achat * vente.quantite), 0);
    const totalVentes = mockVentesData.reduce((acc, vente) => acc + (vente.total_HT), 0);
    const commission = totalVentes * 0.05;
    const profit = totalVentes - totalAchat;

    return {
      totalAchat,
      totalVentes,
      commission,
      profit
    };
  }, [mockVentesData]);





  // const categories = Array.from(new Set(mockVentesData.map(v => v.categorie)));
  const categories = ventesData.map((e) => e.stock.categorie)
  const marques = Array.from(new Set(mockVentesData.map(v => v.marqueVehicule)));

  function deleteDoublonsCateg(f) {
    let rest = []
    for (let index = 0; index < f.length; index++) {

      if (!rest.includes(f[index])) {
        rest = [...rest, f[index]]
      }

    }

    return rest
  }





  const [selectedArticles, setSelectedArticles]: any = useState([{
    quantite: 0,
    prix_unitaire: '',
    status: "",
    mode_paiement: "",
    TVA: 0,
    total_HT: 0,
    total_TTC: 0,
    admin: decoded?.id,
    client: selectedClient?.id,
    dataClient: [],
    stock: 0
  }])


  const checkBox = (vente) => {
    const verify = stockChecked.find((item) => item.id == vente.id)
    if (verify) {
      const rest = stockChecked.filter((item) => item.id != vente.id)
      setStockChecked(rest)
    } else {
      stockChecked.push(vente)
      setStockChecked(stockChecked)
    }

  }
  const checkAll = () => {
    let rest = (stockChecked.length == 0 ? mockVentesData : mockVentesData.filter((item) => item.client.id == stockChecked[0].client.id && new Date(item.createdAt).toLocaleDateString() == new Date(stockChecked[0].createdAt).toLocaleDateString()))
    if (stockChecked.length != rest.length) {
      setStockChecked((stockChecked.length == 0 ? mockVentesData : rest))
    } else {
      setStockChecked([])
    }

  }

  const removeArticle = (index: number) => {
    selectedArticles.splice(index, 1)
    // const news  = [...selectedArticles] 



    setSelectedArticles([...selectedArticles])

  }

  useEffect(() => {
    if (!isCreateInvoice) {
      dispatch(changeMsg([]))
    }
  }, [isCreateInvoice])

  useEffect(() => {
    if (!AddInvoices.loading && AddInvoices.status == "ok") {
      setIsCreateInvoice(false)

      fil = (stockChecked.length == 0 ? mockVentesData : mockVentesData.filter((item) => item.client.id == stockChecked[0].client.id && new Date(item.createdAt).toLocaleDateString() == new Date(stockChecked[0].createdAt).toLocaleDateString()))
      dispatch(VentesAsync())
      dispatch(StockAsync())
      setIsCreateInvoice(false)
      setIsCreateInvoiceSelected(false)
      setStockChecked([])
      dispatch(changeStatus(""))
      setMockVentesData(mockVentesData)
      toast({
        title: "Facture crée",
        description: "Le nouveau facture a été enregistré avec succès."
      });
    }
  }, [AddInvoices.loading])
  const handleViewDetails = (vente: VenteItem) => {
    setSelectedVente(vente);
    setIsDetailModalOpen(true);
  };
  useEffect(() => {
    if (!isCreateModalOpen) {

      setSelectedArticles([{
        quantite: 0,
        prix_unitaire: '',
        status: "",
        mode_paiement: "",
        TVA: 0,
        total_HT: 0,
        total_TTC: 0,
        admin: decoded?.id,
        client: selectedClient?.id,
        dataClient: [],
        stock: 0
      }])
    }

    // }
  }, [isCreateModalOpen])


  useEffect(() => {
    setSelectedArticles(selectedArticles)
  }, [selectedArticles])

  const handleChangeArticleValues = (index, value) => {
    const array = selectedArticles
    array[index] = { ...value, TVA: addTVA ? (value.prix_unitaire * value.quantite * 0.2) : 0, total_HT: value.prix_unitaire * value.quantite, total_TTC: (addTVA ? (value.prix_unitaire * value.quantite * 0.2) : 0) + (addTVA ? value.prix_unitaire * value.quantite : 0), client: selectedClient?.id, mode_paiement: nouvelleVente.mode_paiement, dataClient: selectedClient }
    setAction(!action)


  };
  const total_HT = (((selectedArticles.map((e: { prix_unitaire: number, quantite: number } | any) => (e.quantite * e.prix_unitaire) as any)).reduce((acc, el) => acc + el) | 0))



  const handleDismissVente = (vente: VenteItem) => {
    setSelectedVente(vente);
    setIsDismissDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedVente) {
      setVentesData(prev => prev.map(v =>
        v.id === selectedVente.id ? { ...v, statut: "cancelled" as const } : v
      ));

      toast({
        title: "Vente supprimée",
        description: `La vente ${selectedVente.id} a été supprimée avec succès.`,
        variant: "destructive"
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedVente(null);
  };


  const handleSearch = () => {
    setCurrentPage(1);
    toast({
      title: "Recherche effectuée",
      description: `${filteredVentes.length} résultats trouvés.`
    });
  };

  useEffect(() => {
    if (selectedArticles != null) {
      setUpdateDate(selectedArticles.createdAt as any)
    }
    if (isEditModalOpen == false) {
      setUpdateDate(null)
    }
  }, [selectedArticles, isEditModalOpen])
  useEffect(() => {
    setUpdateVente({
      createdAt: new Date(updateDate),
      prix_unitaire: selectedVente?.total_HT / selectedVente?.quantite,
      mode_paiement: selectedVente?.mode_paiement as any,
    })
  }, [selectedVente])

  const updateVenteData = (e) => {
    e.preventDefault()
    const date = new Date(updateDate ? updateDate : selectedVente.createdAt as any);
    if (updateDate) {

      date.setUTCHours(0, 0, 0, 0)
      date.setDate(date.getDate() + 1);
    }
    const newValue = {
      total_HT: updateVente.prix_unitaire * selectedVente.quantite,
      createdAt: new Date(date).toISOString(),
      mode_paiement: updateVente.mode_paiement
    }

    dispatch(UpdateVentesAsync([selectedVente?.id, newValue]))

  }



  const [updateVente, setUpdateVente] = useState({
    createdAt: updateDate,
    prix_unitaire: selectedVente?.total_HT / selectedVente?.quantite,
    mode_paiement: selectedVente?.mode_paiement,
  })



  const resetFilters = () => {
    SetSearchValue("")
    setSearchTerm("");
    setFilters({
      startDate: DateNow,
      endDate: undefined,
      category: "all",
      marqueVehicule: "all",
      marqueProduit: "all",
      searchTerm: "",
      statut: "all",
      vendeur: "all",
      client: "all",
      typeVente: "all",
      region: "all",
      categories: [],

    })
    search.current.value = ""
    setSelectedCategory("all");
    setSelectedMarque("all");
    setStartDate(DateNow);
    setEndDate(undefined);
    setCurrentPage(1);
    setMockVentesData(ventesData)

    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été supprimés."
    });
  };

  const handleEditVente = () => {
    if (selectedVente) {
      setIsEditModalOpen(true);
      setIsDetailModalOpen(false);
      toast({
        title: "Mode édition",
        description: "Vous pouvez maintenant modifier cette vente."
      });
    }
  };

  const sortedData = [...fil].sort((a, b) => {
    if (!sortField) return 0; // No sorting applied

    const valueA = a[sortField];
    const valueB = b[sortField];

    if (sortField == "designation") {

      return sortOrder === "asc"
        ? a.stock.designation.localeCompare(b.stock.designation)
        : b.stock.designation.localeCompare(a.stock.designation);

    }
    else {

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }
    }


    return 0;
  });


  return (
    <div className="space-y-3 py-0 p-3">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold  tracking-tight " style={{ fontSize: "16px" }}>Suivi des Ventes</h1>
        </div>
        <div className="flex items-center gap-8">

          <div className="relative w-[300px] ">
            <Search className="absolute left-2.5 top-2 h-4 w-4  " />
            <Input
              type="search"
              placeholder="Rechercher des ventes..."
              className="pl-9 h-8"
              defaultValue={searchValue || ''}
              ref={search}

              onChange={(e) => SetSearchValue(e.target.value)}

            />
          </div>
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen} >
            <SheetTrigger asChild>
              <Button variant="outline" style={{ fontSize: "13px" }}>
                <Filter className="h-3 w-3 mr-2" />
                Filtres avancés
              </Button>
            </SheetTrigger>

            <SheetContent className="w-[300px] sm:w-[310px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2" style={{ fontSize: "15px" }}>
                  <Settings className="h-4 w-4" />
                  Filtres avancés
                </SheetTitle>
                <SheetDescription>
                  Utilisez ces filtres pour affiner vos résultats de vente.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* ---------------- Période ---------------- */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <Label className="text-base font-medium" style={{ fontSize: "14px" }}>
                      Période
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Date début</Label>
                    <DatePicker
                      date={filters.startDate}
                      setDate={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Date fin</Label>
                    <DatePicker
                      date={filters.endDate}
                      setDate={(date) => setFilters((prev) => ({ ...prev, endDate: date }))}
                    />
                  </div>
                </div>

                <Separator />

                {/* ---------------- Personnel & Clients ---------------- */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <Label className="text-base font-medium" style={{ fontSize: "14px" }}>
                      Personnel & Clients
                    </Label>
                  </div>
                  <div className="grid grid-cols-1 gap-4">

                    {/* Vendeur */}
                    <div className="space-y-2">
                      <Label className="text-sm">Vendeur</Label>
                      <Select
                        value={filters.vendeur}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, vendeur: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les vendeurs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les vendeurs</SelectItem>
                          {vendeurOptions.map((vendeur, index) => (
                            <SelectItem key={index} value={String(vendeur)}>
                              {vendeur}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Client */}
                    {/* <div className="space-y-2">
                      <Label className="text-sm">Client</Label>
                      <Select
                        value={filters.client}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, client: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les clients" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les clients</SelectItem>
                          {AllClient.map((client) => (
                            <SelectItem key={client.id} value={String(client.id)}>
                              {client.name} {client.firstName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div> */}
                  </div>
                </div>

                <Separator />

                {/* ---------------- Fourchettes ---------------- */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    <Label className="text-base font-medium" style={{ fontSize: "14px" }}>
                      Fourchettes
                    </Label>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Fourchette de prix (Ar)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          min={0}
                          value={filters.prixMin || ""}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              prixMin: e.target.value ? Number(e.target.value) : undefined,
                            }))
                          }
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          min={0}
                          value={filters.prixMax || ""}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              prixMax: e.target.value ? Number(e.target.value) : undefined,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Quantité</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          min={0}
                          value={filters.quantiteMin || ""}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              quantiteMin: e.target.value ? Number(e.target.value) : undefined,
                            }))
                          }
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          min={0}
                          value={filters.quantiteMax || ""}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              quantiteMax: e.target.value ? Number(e.target.value) : undefined,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* ---------------- Catégories ---------------- */}
                <div className="space-y-4">
                  <Label className="text-base font-medium" style={{ fontSize: "14px" }}>
                    Catégories sélectionnées
                  </Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {deleteDoublonsCateg(categories).map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters((prev) => ({
                                ...prev,
                                categories: [...prev.categories, category],
                              }));
                            } else {
                              setFilters((prev) => ({
                                ...prev,
                                categories: prev.categories.filter((c) => c !== category),
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={category} className="text-sm font-normal">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ---------------- Footer ---------------- */}
              <SheetFooter className="mt-6 gap-2 sticky bottom-0">
                <Button variant="outline" onClick={resetFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Button onClick={refresh} variant="outline" style={{ borderRadius: "2px" }}>
            <RefreshCcw className="h-4 w-4 mr-2" />
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} style={{ borderRadius: "2px", fontSize: "13px" }}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle vente
          </Button>
        </div>
      </div>
      {
        (sortedData.length != 0) ?
          <div className="mt-4">
            {
              decoded.role == "admin" ?
                <div className="grid grid-cols-1 mt-3 md:grid-cols-4 gap-6 ">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="border-red-200 bg-red-50/50 p-2" >
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-red-700">Montant Achat Total</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-xl font-bold text-red-600" style={{ fontSize: "13px" }}>
                          {(formatNumber(statistics.totalAchat) || 0)} Ar

                        </h3>

                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-blue-200 bg-blue-50/50 p-2">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-blue-700">Montant Total Ventes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-xl font-bold text-blue-600" style={{ fontSize: "13px" }}>
                          {(formatNumber(statistics.totalVentes) || 0)} Ar
                        </h3>

                      </CardContent>
                    </Card>
                  </motion.div>


                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="border-green-200 bg-green-50/50 p-2">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-green-700">Profit Net</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h3 className={`text-xl font-bold ${statistics.profit >= 0 ? 'text-green-600' : 'text-red-600'}`} style={{ fontSize: "13px", }}>

                          {(formatNumber(statistics.profit) || 0)} Ar

                        </h3>

                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
                :
                <div className="grid grid-cols-1 mt-3 md:grid-cols-4 gap-6 ">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-blue-200 bg-blue-50/50 p-2">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-blue-700">Montant Total Ventes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-xl font-bold text-blue-600" style={{ fontSize: "13px" }}>
                          {(formatNumber(statistics.totalVentes) || 0)} Ar
                        </h3>

                      </CardContent>
                    </Card>
                  </motion.div>

                </div>
            }
            <Card className="mt-2">
              <CardHeader className="w-full">
                <div className="flex justify-between items-center w-full">
                  <CardTitle style={{ fontSize: "14px" }}>Liste des ventes ({mockVentesData.length})</CardTitle>
                  <div className="text-sm text-gray-600">
                    Page {currentPage} sur {totalPages}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead style={{ textWrap: "nowrap" }}>
                          {stockChecked.length !== 0 && (
                            <Checkbox
                              checked={stockChecked.length !== 0}
                              onClick={() => checkAll()}
                            />
                          )}
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("createdAt")}
                        >
                          Date {sortField === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("designation")}
                        >
                          Désignation {sortField === "designation" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead style={{ textWrap: "nowrap" }}>Catégorie</TableHead>
                        <TableHead style={{ textWrap: "nowrap" }}>Client</TableHead>
                        <TableHead style={{ textWrap: "nowrap" }}>Vendeur</TableHead>
                        <TableHead className="text-right text-nowrap cursor-pointer hover:bg-gray-100" onClick={() => handleSort("quantite")}>Qté {sortField === "quantite" && (sortOrder === "asc" ? "↑" : "↓")}</TableHead>
                        <TableHead className="text-right">PU HT</TableHead>
                        <TableHead className="text-right text-nowrap cursor-pointer hover:bg-gray-100" onClick={() => handleSort("total_HT")}>Total HT {sortField === "total_HT" && (sortOrder === "asc" ? "↑" : "↓")}</TableHead>
                        <TableHead className="text-center">Payement</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedData.length > 0 ? (
                        sortedData.map((vente) => (
                          <TableRow
                            title="cliquez pour voir le detail"
                            key={vente.id}
                            className="hover:bg-gray-50 cursor-pointer"
                          >
                            <TableCell className="py-0.5">
                              {vente.facture.length === 0 && (
                                <Checkbox
                                  className="rounded"
                                  checked={stockChecked.some((item) => item.id === vente.id)}
                                  onClick={() => {
                                    const verify = stockChecked.find((item) => item.id === vente.id);
                                    if (verify) {
                                      const rest = stockChecked.filter((item) => item.id !== vente.id);
                                      setStockChecked([...rest]);
                                    } else {
                                      stockChecked.push(vente);
                                      setStockChecked([...stockChecked]);
                                    }
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell
                              className="py-0.5"
                              onClick={() => handleViewDetails(vente)}
                              style={{ fontSize: "13px" }}
                            >
                              {format(new Date(vente.createdAt), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell
                              onClick={() => handleViewDetails(vente)}
                              className="font-semibold max-w-xs uppercase truncate"
                              style={{ fontSize: "11px" }}
                            >
                              {vente.stock.designation}
                            </TableCell>
                            <TableCell className="py-0.5 uppercase" onClick={() => handleViewDetails(vente)}>
                              <Badge variant="outline" style={{ fontSize: "10px" }}>
                                {vente.stock.categorie}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-0.5" onClick={() => handleViewDetails(vente)}>
                              {vente.client ? (
                                <div className="flex items-center space-x-2 text-nowrap">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm" style={{ fontSize: "11px" }}>
                                    {(vente.client.firstName || vente.client.name) ? (vente.client.firstName + " " + vente.client.name) : "Non renseigné"}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">Non assigné</span>
                              )}
                            </TableCell>
                            <TableCell
                              onClick={() => handleViewDetails(vente)}
                              className="text-right py-0.5"
                            >
                              <div className="flex items-center space-x-2 text-nowrap">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="text-sm" style={{ fontSize: "11px" }}>
                                  {vente.admin.name} {vente.admin.firstName}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell
                              onClick={() => handleViewDetails(vente)}
                              className="text-right py-0.5"
                              style={{ fontSize: "12px" }}
                            >
                              {vente.quantite}
                            </TableCell>
                            <TableCell
                              onClick={() => handleViewDetails(vente)}
                              className="text-right text-nowrap py-0.5"
                              style={{ fontSize: "12px" }}
                            >
                              {formatNumber(vente.total_HT / vente.quantite)} Ar
                            </TableCell>
                            <TableCell
                              onClick={() => handleViewDetails(vente)}
                              className="text-right py-0.5  text-nowrap font-medium"
                              style={{ fontSize: "12px" }}
                            >
                              {formatNumber(vente.total_HT)} Ar
                            </TableCell>
                            <TableCell

                              className="text-left capitalize py-0.5  text-nowrap font-medium"
                              style={{ fontSize: "12px" }}
                            >
                              {vente.mode_paiement}
                            </TableCell>
                            {vente.facture.length === 0 ? (
                              <TableCell
                                className="text-center py-0.5 font-medium text-nowrap text-orange-700"
                                style={{ fontSize: "12px" }}
                              >
                                Non facturée
                              </TableCell>
                            ) : (
                              <TableCell
                                className="text-center py-0.5 font-medium text-nowrap text-green-600"
                                style={{ fontSize: "12px" }}
                              >
                                facturée
                              </TableCell>
                            )}
                            <TableCell className="text-center py-0.5">
                              <div className="flex justify-center py-0.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedVente(vente);
                                    setIsDismissDialogOpen(true);
                                  }}
                                  title="Voir détails"
                                >
                                  <XIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={12} className="h-24 text-center">
                            <div className="flex flex-col items-center">
                              Aucune vente trouvée
                              <Button variant="outline" onClick={resetFilters} className="mt-4">
                                <RefreshCcw className="h-4 w-4 mr-2" />
                                Réinitialiser
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          :
          <div className="text-center mt-6 pt-2 border-t">
            <p className="text-sm">Aucune vente trouvée</p>
          </div>
      }


      {
        stockChecked.length != 0 &&
        <div className="fixed bottom-4 left-40 text-white flex items-center justify-center z-40 h-11 rounded w-56  -slate-700">
          <Button onClick={() => setIsCreateInvoiceSelected(true)} className="rounded">Choisir l'option</Button>

        </div>
      }

      {/* Modal de détails amélioré avec polices plus petites */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white   py-0.5 text-sm">
          <DialogHeader className="p-6 sticky to py-0.5 bg-gray-50 z-10 py-2">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Détails de la vente du : {selectedVente?.stock.designation}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm">
              Informations complètes sur la transaction
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 py-2 pt-0">
            {selectedVente && (
              <div className="space-y-6">
                <div className="flex gap-2 ">

                  {selectedVente.client && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border w-[50%] border-blue-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">Informations client</h3>
                          <p className="text-gray-600 text-xs">Détails de l'acheteur</p>
                        </div>
                      </div>

                      <div className="  gap-4">
                        <div className="space-y-4 mt-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-600">Nom complet</p>
                              <p className="font-medium text-gray-900 text-sm">
                                {selectedVente.client.name} {selectedVente.client.firstName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-600">Email</p>
                              <p className="font-medium text-gray-900 text-sm">{selectedVente.client.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 mt-4">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-600">Téléphone</p>
                              <p className="font-medium text-gray-900 text-sm">{selectedVente.client.telephone}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-600">Adresse</p>
                              <p className="font-medium text-gray-900 text-sm">
                                {selectedVente.client.adresse}
                              </p>
                              <p className="text-xs text-gray-600">
                                {selectedVente.client.codePostal} {selectedVente.client.ville}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="g gap-4 w-[50%] border rounded-lg border-blue-200 bg-blue-50  ">

                    <div className="  rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Date</p>
                      <p className="text-base font-semibold text-gray-900">
                        {format(new Date(selectedVente.stock.createdAt), "dd MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                    <div className="  rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Quantité</p>
                      <p className="text-base font-semibold text-gray-900">{selectedVente.quantite}</p>
                    </div>
                    <div className="bg-blue-50   p-3 py-0  ">
                      <p className="text-xs font-medium text-gray-600 mb-1">Montant Total TVA 20% </p>
                      <p className="text-sm font-bold text-gray-700">

                        {(selectedVente.TVA || 0)}   Ar</p>

                    </div>
                    <div className="bg-blue-50   p-3 py-0  ">
                      <p className="text-xs font-medium text-gray-600 mb-1">Prix d'achat Unitaire </p>
                      <p className="text-sm font-bold text-gray-700">

                        {formatNumber(selectedVente.total_HT / selectedVente.quantite || 0)}   Ar</p>

                    </div>
                    <div className="bg-blue-50   p-3 py-1 my-3 border border-blue-200">
                      <p className="text-xs font-medium text-gray-600 mb-1">Total HT</p>
                      <p className="text-lg font-bold text-gray-700">
                        {(formatNumber(selectedVente.total_HT) || 0)}   Ar</p>

                    </div>
                    <div className="bg-blue-50   p-3 border border-blue-200">
                      <p className="text-xs font-medium text-blue-600 mb-1">Total TTC</p>
                      <p className="text-lg font-bold text-blue-700">
                        {(formatNumber(selectedVente.total_TTC) || 0)}   Ar</p>

                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900">Informations produit</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Désignation</p>
                          <p className="text-gray-900 font-medium text-sm">{selectedVente.stock.designation}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Marque produit</p>
                          <p className="text-gray-900 text-sm">{selectedVente.stock.family?.parent?.parent?.parent?.family_name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Catégorie</p>
                          <Badge variant="outline" className="text-xs">{selectedVente?.stock.categorie}</Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Prix unitaire</p>
                          <p className="text-base font-semibold text-gray-900">
                            {formatNumber(selectedVente.stock.prix_affiche)}  - {formatNumber(selectedVente.stock.dernier_prix)}
                            Ar </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Marque véhicule</p>
                          <p className="text-gray-900 text-sm">{selectedVente.stock?.family?.parent?.parent?.family_name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Modèle - Série</p>
                          <p className="text-gray-900 text-sm">{selectedVente.stock?.family?.parent?.family_name} ~ {selectedVente.stock?.family?.family_name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

{
    decoded.role == "admin" &&
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Analyse financière</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-600 mb-1">Prix d'achat unitaire</p>
                      <p className="text-lg font-bold text-red-600">  {((formatNumber(selectedVente.total_HT / selectedVente.quantite) || 0))} ( {selectedVente.quantite}) Ar</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-600 mb-1">Marge brute</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatNumber((selectedVente.total_HT / selectedVente.quantite) - selectedVente.stock?.prix_achat)} ( {selectedVente.quantite}) Ar
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-600 mb-1">Taux de marge</p>
                      <p className="text-lg font-bold text-blue-600">
                        {(((selectedVente.total_HT - (selectedVente.stock?.prix_achat * selectedVente.quantite)) / selectedVente.total_HT) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
}
              </div>
            )}

          </div>


          <DialogFooter className="gap-2 pt-4 border-t p-6 py-2">
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Fermer
            </Button>
            <Button variant="outline" onClick={handleEditVente}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <div className="hidden print:block" ref={contentRef}>
              <ToPrint selectedInvoice={selectedVente} num={invoiceNumber} />
            </div>
            <Button disabled={selectedVente?.facture?.length != 0 ? true : false} variant="outline" onClick={() => CreateInvoices()}>
              <Printer className="h-4 w-4 mr-2" />
              {
                AddInvoices.loading ? "Création en cours" : "Créer une facture"}

            </Button>
            <Button variant="outline" onClick={reactToPrintFn}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">

          <form onSubmit={(e) => updateVenteData(e)}>

            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Modifier la vente {selectedVente?.id}</DialogTitle>
              <DialogDescription>
                Modifiez les informations de cette vente
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Date de vente</label>
                  <DatePicker
                    date={updateDate ? new Date(updateDate) : new Date(selectedVente?.createdAt)}
                    setDate={(e) => {
                      setUpdateDate(e),
                        setUpdateVente(prev => ({
                          ...prev,
                          createdAt: e
                        }))
                    }}

                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Quantité</label>
                  <Input disabled title="Vous ne pouvez pas modifier le stock acheté"
                    type="number"
                    defaultValue={selectedVente?.quantite.toString()}
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Désignation du produit</label>
                <Input disabled title="Vous ne pouvez pas modifier le stock acheté" defaultValue={selectedVente?.stock.designation} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Marque produit</label>
                  <Input disabled title="Vous ne pouvez pas modifier le stock acheté" defaultValue={selectedVente?.stock?.family?.parent?.parent?.parent?.family_name} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Catégorie</label>
                  <Input disabled title="Vous ne pouvez pas modifier le stock acheté" defaultValue={selectedVente?.stock.categorie} />

                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Marque véhicule</label>
                  <Input disabled title="Vous ne pouvez pas modifier le stock acheté" defaultValue={selectedVente?.stock?.family?.parent?.parent?.family_name} />

                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Modèle</label>
                  <Input disabled title="Vous ne pouvez pas modifier le stock acheté" defaultValue={selectedVente?.stock?.family?.parent?.family_name} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Série</label>
                  <Input disabled title="Vous ne pouvez pas modifier le stock acheté" defaultValue={selectedVente?.stock?.family?.family_name} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Prix unitaire HT (€)</label>
                  <Input
                    type="number"
                    name="prix_unitaire"
                    defaultValue={selectedVente?.total_HT / selectedVente?.quantite}
                    onChange={(e) => setUpdateVente(prev => ({
                      ...prev,
                      prix_unitaire: e.target.value ? Number(e.target.value) : undefined
                    }))}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Mode de paiement</label>


                  <select name="" id="mode" className="block w-full" onChange={(e) => setUpdateVente(prev => ({
                    ...prev,
                    mode_paiement: e.target.value
                  }))}
                    defaultValue={selectedVente?.mode_paiement} style={{ fontSize: "13px" }}>
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
              <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
                Annuler
              </Button>
              <Button >
                {
                  UpVentes.loading ? "Enregistrement en cours" :
                    "Enregistrer les modifications"
                }
              </Button>
            </DialogFooter>
          </form>

        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <form action="" onSubmit={CreateVente}>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Nouvelle vente <span className="italic" style={{ fontWeight: "500", fontSize: "15px" }}>{stockSelected?.designation}</span></DialogTitle>
              <DialogDescription>
                Créer une nouvelle vente dans le système
              </DialogDescription>
            </DialogHeader>


            <div className="space-y-2">
              <ClientSelector
                selectedClient={selectedClient as any}
                onClientSelect={setSelectedClient as any}

              />

              <div onClick={() => { setSimpleClient(!simpleClient) }} className={` ${String(selectedClient?.id) == "newClient" ? "flex" : "hidden"}  items-center bg-blue-100 gap-4 p-1 cursor-pointer  text-sm px-2`}>
                <Input type="checkbox" checked={simpleClient} readOnly id="tva" className="h-4 w-4" />
                Enrégistrer le client

              </div>


              <div className="flex justify-end">
                <Button type="button" size="sm" onClick={addMore} className="h-6 bg-slate-500 hover:bg-slate-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Plus d'article
                </Button>
              </div>
              {
                selectedArticles.map((e, i) => (
                  <ClickOutside change={handleChangeArticleValues} remove={removeArticle} value={[...selectedArticles][i]} index={i} key={i} />
                ))
              }





              <div onClick={() => { setAddTVA(!addTVA) }} className="flex items-center bg-blue-100 gap-4 p-1 cursor-pointer  text-sm px-2">
                <Input type="checkbox" checked={addTVA} readOnly id="tva" className="h-4 w-4" />
                Ajouter un TVA

              </div>

              {
                !addTVA ?
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="text-xs font-medium mb-1 block"   >Montant total_HT</label>
                      <Input ref={ht} placeholder="COROLLA, PATROL..." readOnly type="number" value={total_HT} />
                    </div>

                    <div className="hidden">
                      <label className="text-xs font-medium mb-1 block">Montant total_TTC</label>
                      <Input ref={ttc} placeholder="2015-, 2010-..." readOnly type="number" value={total_HT} />
                    </div>
                  </div>
                  :
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Montant TVA 20% </label>
                      <Input ref={tva} placeholder="COROLLA, PATROL..." type="number" value={total_HT * 0.2} />

                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Montant total_HT</label>
                      <Input ref={ht} placeholder="COROLLA, PATROL..." readOnly type="number" value={total_HT} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Montant total_TTC</label>
                      <Input ref={ttc} placeholder="2015-, 2010-..." readOnly type="number" value={(total_HT * 0.2) + (total_HT)} />
                    </div>
                  </div>
              }

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="text-sm font-medium mb-1 block">Mode de paiement</label>

                  <select name="" required id="mode" value={nouvelleVente.mode_paiement}
                    onChange={(e) => { handleChangeVente('mode_paiement', e.target.value) }} style={{ fontSize: "13px" }}>
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
              <Button disabled={nouvelleVente.mode_paiement == "" || selectedArticles?.find((item) => item.quantite == 0)}>
                {
                  AddVentesStock.loading ? "Création en cours" : "Créer la vente"
                }

              </Button>
            </DialogFooter>


          </form>
        </DialogContent>
      </Dialog>


      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la vente de {selectedVente?.stock.designation} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDismissDialogOpen} onOpenChange={setIsDismissDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'annulation de vente</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler la vente de {selectedVente?.stock.designation} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDismissDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="secondary" onClick={() => venteAnnuler((selectedVente))}>
              {
                AddEntreStock.loading ? "Annulation en cours" : "Confirmer"
              }

            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
              <PrintMore MoreArticles={createFacture} num={invoiceNumber} />
            </div>
            {/* <Button variant="secondary" onClick={reactToPrintFn}>
              <PrinterIcon />
              Imprimer
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isCreateInvoiceSelected} onOpenChange={setIsCreateInvoiceSelected}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Option pour la facturation</DialogTitle>
            <DialogDescription>
              Vous pour créer ou imprimer directement un facture ici !
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateInvoiceSelected(true), reactToPrintFn(), CreateInvoicesChecked() }}>
              <EditIcon />
              {

                AddInvoices.loading ? "Enrégistrement en cours" : "Enrégistrer et Imprimer la facture"
              }

            </Button>
            <div className="hidden print:block" ref={contentRef}>
              <PrintMoreChecked MoreArticles={stockChecked} num={invoiceNumber} />
            </div>
            {/* <Button variant="secondary" onClick={reactToPrintFn}>
              <PrinterIcon />
              Imprimer
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vente;