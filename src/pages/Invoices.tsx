import { useEffect, useState } from "react";
import { Search, Plus, Calendar, Download, MoreHorizontal, Eye, Edit, Trash2, Send, FileText, DollarSign, Clock, AlertCircle, CheckCircle, Filter, ArrowUpDown, Mail, Phone, MapPin, CreditCard, Printer, View, Trash, XIcon, XCircleIcon, RefreshCcw } from "lucide-react";
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


// FSP DEMO - HongKong
// Times NewRoman


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatCard } from "@/components/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
import { ClientInputSelector } from "@/components/ClientInputSelector";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import CountUp from "react-countup";
import { ClientSelector } from "@/components/ClientSelector";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import ToPrint from "@/components/toPrint";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { AddInvoicesAsync, DelInvoicesAsync, InvoicesAsync } from "@/redux/Async/InvoicesASync";
import { AddInvoicesSlice, changeDeleteInv, changeStatus } from "@/redux/slice/InvoicesSlice";
import { stat } from "fs";
import PrintMoreChecked from "@/components/toPrintMoreArticlesChecked";
import PrintFacture from "@/components/PrintFacture";
import { jwtDecode } from "jwt-decode";
import { OneUserAsync } from "@/redux/Async/userAuthAsync";
// Types
interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  date: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Mock data
const invoicesData: Invoice[] = [
  {
    id: "INV-2024-001",
    clientId: "CLT-001",
    clientName: "SARL TECH SOLUTIONS",
    clientEmail: "contact@techsolutions.com",
    clientPhone: "+33 1 23 45 67 89",
    clientAddress: "15 rue de la Paix, 75001 Paris",
    date: "2024-05-28",
    dueDate: "2024-06-27",
    amount: 1500.00,
    taxAmount: 300.00,
    totalAmount: 1800.00,
    status: "sent",
    items: [
      { id: "1", description: "Ordinateur portable Dell", quantity: 2, unitPrice: 750.00, total: 1500.00 }
    ],
    notes: "Livraison prévue sous 5 jours ouvrés",
    terms: "Paiement à 30 jours"
  },
  {
    id: "INV-2024-002",
    clientId: "CLT-002",
    clientName: "ENTREPRISE MARTIN",
    clientEmail: "martin@entreprise.fr",
    clientPhone: "+33 2 34 56 78 90",
    clientAddress: "45 avenue des Champs, 69000 Lyon",
    date: "2024-05-25",
    dueDate: "2024-06-24",
    amount: 2500.00,
    taxAmount: 500.00,
    totalAmount: 3000.00,
    status: "paid",
    items: [
      { id: "1", description: "Imprimante laser", quantity: 1, unitPrice: 800.00, total: 800.00 },
      { id: "2", description: "Cartouches d'encre", quantity: 5, unitPrice: 340.00, total: 1700.00 }
    ]
  },
  {
    id: "INV-2024-003",
    clientId: "CLT-003",
    clientName: "BOUTIQUE DUPONT",
    clientEmail: "dupont@boutique.fr",
    clientPhone: "+33 3 45 67 89 01",
    clientAddress: "12 place du Marché, 33000 Bordeaux",
    date: "2024-05-20",
    dueDate: "2024-05-20",
    amount: 980.00,
    taxAmount: 196.00,
    totalAmount: 1176.00,
    status: "overdue",
    items: [
      { id: "1", description: "Caisse enregistreuse", quantity: 1, unitPrice: 980.00, total: 980.00 }
    ]
  }
];
interface selectedClient {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
}

const Invoices = () => {
  const dispatch = useDispatch<AppDispatch>()
  function formatNumber(value) {
    if (!value) return '';
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(value);
  }
    const OneUser = useSelector((state:RootState)=>state.OneUserSlice)
     const [decoded, setDecoded] = useState({
          id: 0,
    email: "",
    status: "1",
    createdAt:"",
    role: "",
    person: {
        id: 0,
        name: "",
        createdAt: "",
        deletedAt: null,
    }
      }) as any;
      
        
        
        const token = localStorage.getItem("token");
        
        useEffect(()=>{
          if (token) {
          const decoded = jwtDecode(token);
          setDecoded(decoded as any)
        }
      },[])
  
      useEffect(()=>{
        dispatch(OneUserAsync(decoded.id))
      },[decoded.id])
     useEffect(() => {
        dispatch(OneUserAsync(decoded.id))
      }, [])
    
    
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef })
  const [invoices, setInvoices] = useState<Invoice[]>(invoicesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const { toast } = useToast();
  const [addTVA, setAddTVA] = useState(false)

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null | any>(null);
  const [deleteDialog, setDeleteDialog] = useState<string | null | any>(null);
  const [retirefacture, setRetirefacture] = useState<string | null | any>(null);


  const AllInvoices = useSelector((state: RootState) => state.InvoicesSlice)
  const AddInvoices = useSelector((state: RootState) => state.AddInvoicesSlice)

  const [searchValue, SetSearchValue] = useState("");
  const [dataFiltred, SetdataFiltred] = useState(AllInvoices.data);
  const search = useRef() as any

  useEffect(() => {
    dispatch(InvoicesAsync())
  }, [])
  
  

  const applyFilters = () => {
    // setIsLoading(true);
    let value = searchValue
    let data = []

    if (value != '') {
      const filtered = AllInvoices.data.filter((item) => (item.client.name).toLowerCase().includes(value.toLowerCase()) || (item.client.firstName).toLowerCase().includes(value.toLowerCase()) || item.list.some((item)=>(item.designation).toLowerCase().includes(value.toLowerCase()))
      )

      data = filtered
    } else {
      data = AllInvoices.data
    }; 
    
    SetdataFiltred(data)
  };
  useEffect(() => {
    applyFilters();
    // SetdataFiltred(AllInvoices.data)
  }, [AllInvoices.data])

  // Form state
  const [invoiceForm, setInvoiceForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    dueDate: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    notes: "",
    terms: "Paiement à 30 jours"
  });
  const [selectedClient, setSelectedClient] = useState<selectedClient | any>(null);

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter(invoice => {
      const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || invoice.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-desc":
          return b.totalAmount - a.totalAmount;
        case "amount-asc":
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

  // Statistics
  const stats = {
    total: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    paid: invoices.filter(inv => inv.status === "paid").length,
    pending: invoices.filter(inv => inv.status === "sent").length,
    overdue: invoices.filter(inv => inv.status === "overdue").length,
    draft: invoices.filter(inv => inv.status === "draft").length
  };
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

  // Handlers
  const handleCreateInvoice = () => {
    setInvoiceForm({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      dueDate: "",
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      notes: "",
      terms: "Paiement à 30 jours"
    });
    setIsCreateModalOpen(true);
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsModalOpen(true);
  };
  const handleViewModal = () => {
    // setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceForm({
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      clientPhone: invoice.clientPhone,
      clientAddress: invoice.clientAddress,
      dueDate: invoice.dueDate,
      items: invoice.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      })),
      notes: invoice.notes || "",
      terms: invoice.terms || "Paiement à 30 jours"
    });
    setIsEditModalOpen(true);
  };

  const handleSaveInvoice = () => {
    const newInvoice: Invoice = {
      id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      clientId: `CLT-${Date.now()}`,
      clientName: invoiceForm.clientName,
      clientEmail: invoiceForm.clientEmail,
      clientPhone: invoiceForm.clientPhone,
      clientAddress: invoiceForm.clientAddress,
      date: new Date().toISOString().split('T')[0],
      dueDate: invoiceForm.dueDate,
      amount: invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
      taxAmount: invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (addTVA ? 0.2 : 0)), 0),
      totalAmount: invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (addTVA ? 1.2 : 1)), 0),
      status: "draft",
      items: invoiceForm.items.map((item, index) => ({
        id: String(index + 1),
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice
      })),
      notes: invoiceForm.notes,
      terms: invoiceForm.terms
    };

    const newInvoices = {
      designation: newInvoice.items[0].description,
      client: selectedClient.id as any,
      tva: newInvoice.taxAmount,
      quantite: newInvoice.items[0].quantity,
      prix_ht: newInvoice.items[0].unitPrice,
      total_ht: newInvoice.amount,
      total_ttc: newInvoice.totalAmount,
      mode_paiment: newInvoice.terms,
      numFacture: "INV-007",
       admin: (OneUser.data as any)?.person?.id

    }

    dispatch(AddInvoicesAsync(newInvoices as any))

    // setInvoices(prev => [...prev, newInvoice]);
    // setIsCreateModalOpen(false);
    toast({
      title: "Facture créée",
      description: `La facture ${newInvoice.id} a été créée avec succès`,
    });
  };


  useEffect(() => {
    if (!AddInvoices.loading  && AddInvoices.status =="ok") {
      setDeleteDialog(null)
      dispatch(changeStatus(""))
      // dispatch(InvoicesAsync())
    }
  }, [AddInvoices.loading])
  useEffect(() => {
    applyFilters()
  }, [searchValue])

  const handleUpdateInvoice = () => {
    if (!selectedInvoice) return;

    const updatedInvoice: Invoice = {
      ...selectedInvoice,
      clientName: invoiceForm.clientName,
      clientEmail: invoiceForm.clientEmail,
      clientPhone: invoiceForm.clientPhone,
      clientAddress: invoiceForm.clientAddress,
      dueDate: invoiceForm.dueDate,
      amount: invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
      taxAmount: invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * 0.2), 0),
      totalAmount: invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * 1.2), 0),
      items: invoiceForm.items.map((item, index) => ({
        id: String(index + 1),
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice
      })),
      notes: invoiceForm.notes,
      terms: invoiceForm.terms
    };

    setInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? updatedInvoice : inv));
    setIsEditModalOpen(false);
    toast({
      title: "Facture modifiée",
      description: `La facture ${selectedInvoice.id} a été mise à jour`,
    });
  };
  
  const DelInvoices = useSelector((state: RootState) => state.DelInvoicesSlice)
  useEffect(() => {
    if (!DelInvoices.loading && DelInvoices.status == "deleted") {
      dispatch(InvoicesAsync())
      
      dispatch(changeDeleteInv(''))
      applyFilters()
    }
  }, [DelInvoices.loading])
  
  useEffect(() => {
    SetdataFiltred(AllInvoices.data)
  }, [AllInvoices.data])
  function refresh (){
    dispatch(InvoicesAsync())
    applyFilters()

  }
  const handleRetireInvoice = () => {
    
    dispatch(DelInvoicesAsync([retirefacture] as any))
    setSelectedInvoice({ ...selectedInvoice, list: selectedInvoice.list.filter((item) => item.id != retirefacture.id) })
    // const retire = retirefacture
    // // alert(deleteDialog)

    // dispatch(DelInvoicesAsync(deleteDialog as any))
    // // setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
    // // setDeleteDialog(null);
    // // toast({
    // //   title: "Facture supprimée",
    // //   description: "La facture a été supprimée avec succès",
    // // });

  };
  const handleDeleteInvoice = () => {

    // alert(deleteDialog)
    dispatch(DelInvoicesAsync(deleteDialog as any))
    // setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
    // setDeleteDialog(null);
    // toast({
    //   title: "Facture supprimée",
    //   description: "La facture a été supprimée avec succès",
    // });
  };

  const handleStatusChange = (invoiceId: string, newStatus: Invoice["status"]) => {
    setInvoices(prev => prev.map(inv =>
      inv.id === invoiceId ? { ...inv, status: newStatus } : inv
    ));
    toast({
      title: "Statut mis à jour",
      description: `Le statut de la facture a été changé en ${newStatus}`,
    });
  };

  const handleSendEmail = (invoice: Invoice) => {
    // Simulate sending email
    toast({
      title: "Email envoyé",
      description: `La facture ${invoice.id} a été envoyée à ${invoice.clientEmail}`,
    });
    handleStatusChange(invoice.id, "sent");
  };

  const handlePrint = (invoice: Invoice) => {
    toast({
      title: "Impression",
      description: `La facture ${invoice.id} est en cours d'impression`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Les factures sont en cours d'exportation",
    });
  };

  const addInvoiceItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeInvoiceItem = (index: number) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "sent":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "draft":
        return <Edit className="h-4 w-4 text-gray-600" />;
      case "cancelled":
        return <Trash2 className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    const variants = {
      paid: "bg-green-100 text-green-800",
      sent: "bg-blue-100 text-blue-800",
      overdue: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800",
      cancelled: "bg-gray-100 text-gray-600"
    };

    const labels = {
      paid: "Payée",
      sent: "Envoyée",
      overdue: "En retard",
      draft: "Brouillon",
      cancelled: "Annulée"
    };

    return (
      <Badge className={variants[status]}>
        {getStatusIcon(status)}
        <span className="ml-1">{labels[status]}</span>
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-3 p-3 py-0">


      {/* Header */}
      {/* <h1 className="FSP font-bold  " >AutoZone</h1> */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl   tracking-tight font-semibold" style={{ fontSize: "15px" }}>Gestion des Factures</h1>
        <div className="flex items-center gap-3">
          {/* <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button> */}
          <div className="relative w-[300px] ">
            <Search className="absolute left-2.5 top-3 h-4 w-4  " />
            <Input
              type="search"
              placeholder="Rechercher des factures..."
              className="pl-9"
              defaultValue={searchValue || ''}
              ref={search}

              onChange={(e) => SetSearchValue(e.target.value)}

            />
          </div>
          <Button onClick={refresh} variant="outline" style={{ borderRadius: "2px" }}>
            <RefreshCcw className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </div>

      {/* Invoices Table */}
      {
        dataFiltred.length != 0 ?
          <div className="bg-white rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <TableHead>N° Facture</TableHead> */}
                  <TableHead>Date</TableHead>
                  <TableHead>Numero</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Client</TableHead>
                  {/* <TableHead>Échéance</TableHead> */}
                  <TableHead>Prix Unitaire</TableHead>
                  <TableHead>Qte</TableHead>
                  <TableHead>Montant HT</TableHead>
                  <TableHead>Montant TVA</TableHead>
                  <TableHead>Total TTC</TableHead>
                  {/* <TableHead>Statut</TableHead> */}
                  <TableHead className="w-32 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataFiltred.map((invoice,i) => (
                  <TableRow key={i} className="cursor-pointer">
                    {/* <TableCell className="font-medium">{invoice.id}</TableCell> */}
                    <TableCell onClick={() => handleViewDetails(invoice)} style={{ padding: "", fontSize: "11px" }}>{formatDate(invoice.createdAt)}</TableCell>
                    <TableCell onClick={() => handleViewDetails(invoice)} style={{ padding: "",textWrap :"nowrap", fontSize: "12px" }}>{(invoice.list[0].numFacture)}</TableCell>
                    <TableCell onClick={() => handleViewDetails(invoice)} className="font-normal text-nowrap" style={{ fontSize: "11px" }}>{invoice.list.length == 1 ? invoice.list[0].designation : `${invoice.list.length} ARTICLES facturés`}</TableCell>
                    <TableCell onClick={() => handleViewDetails(invoice)} style={{ padding: "2px 0", fontSize: "11px" }} >
                      <div>
                        <p className="text-nowrap uppercase">{invoice.client.name} {invoice.client.firstName}</p>
                        {/* <p className="text-xs text-gray-500">{invoice.client.email}</p> */}
                      </div>
                    </TableCell>

                    {/* <TableCell style={{ padding: "2px 0" }}>{formatDate(invoice.dueDate)}</TableCell> */}
                    <TableCell onClick={() => handleViewDetails(invoice)} className="text-nowrap font-semibold" style={{ fontSize: "12px" }}>
                      {invoice.list.length == 1
                        ? <div>{formatNumber(invoice.list[0].prix_ht)} Ar </div>
                        :
                        `-------------`}
                      {/* {invoice.prix_ht} &nbsp;Ar */}

                    </TableCell>
                    <TableCell onClick={() => handleViewDetails(invoice)} className="text-nowrap font-semibold" style={{ fontSize: "12px" }} >
                      {invoice.quantite}
                    </TableCell>
                    <TableCell onClick={() => handleViewDetails(invoice)} className="text-nowrap font-semibold" style={{ fontSize: "12px" }}>

                      {formatNumber(invoice.total_ht)} &nbsp;Ar

                    </TableCell >
                    <TableCell onClick={() => handleViewDetails(invoice)} className="text-nowrap" style={{ fontSize: "12px" }}>
                      {
                        invoice.tva == 0 ? "vente aucun TVA" :
                          <div>

                            {invoice.tva} &nbsp; Ar
                          </div>
                      }

                    </TableCell>
                    <TableCell onClick={() => handleViewDetails(invoice)} className="font-normal text-nowrap" style={{ fontSize: "13px" }}>
                      {invoice.tva == 0 ? "----------" : formatNumber(invoice.total_ttc) }

                    </TableCell> 
                    <TableCell style={{ padding: "2px 0" }}>
                      <div className="flex justify-center gap-1">
                     
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => { setDeleteDialog(invoice.list) }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredInvoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Aucune facture trouvée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          :
          <div className="text-center mt-6 pt-2 border-t">
            <p className="text-sm">Aucun facture généré</p>
          </div>
      }

      {/* Create/Edit Invoice Modal */}

      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateModalOpen ? 'Nouvelle facture' : 'Modifier la facture'}
            </DialogTitle>
            <DialogDescription>
              {isCreateModalOpen ? 'Créez une nouvelle facture' : 'Modifiez les informations de la facture'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Client Input Selector */}
            {/* <ClientInputSelector
              selectedClient={selectedClient}
              onselectedClientChange={setSelectedClient}
            /> */}
            <ClientSelector
              selectedClient={selectedClient as any}
              onClientSelect={setSelectedClient as any}
            />

            <div onClick={() => { setAddTVA(!addTVA) }} className="flex items-center bg-blue-200 gap-4 p-1 cursor-pointer  text-sm px-2">
              <Input type="checkbox" checked={addTVA} readOnly id="tva" className="h-4 w-4" />
              Ajouter un TVA

            </div>

            {/* Invoice Details */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate">Date d'échéance *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div> */}

            {/* Invoice Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label className="text-lg ">Articles</Label>
                <Button type="button" onClick={addInvoiceItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un article
                </Button>
              </div>

              <div className="space-y-3">
                {invoiceForm.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-5">
                      <Input
                        placeholder="Description de l'article"
                        value={item.description}
                        onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qté"
                        value={item.quantity}
                        onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        placeholder="Prix unitaire"
                        value={formatNumber(item.unitPrice)}
                        onChange={(e) => updateInvoiceItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-1 text-right text-nowrap ">
                      {(formatNumber(item.quantity * item.unitPrice) || 0)}  Ar

                    </div>
                    <div className="col-span-1">
                      {invoiceForm.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInvoiceItem(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span>Sous-total HT :</span>
                    <span className="text-nowrap">

                      {(invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0)}  Ar


                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA (20%) :</span>
                    <span className="text-nowrap">
                      {(invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (addTVA ? 0.2 : 0)), 0) || 0)}  Ar

                      {/* {(invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (addTVA ? 0.2 : 0)), 0))} */}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total TTC :</span>
                    <span>
                      {(invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (addTVA ? 1.2 : 1)), 0) || 0)}  Ar


                    </span>
                  </div>
                  <Separator />
                  {/* <span>{toWords(3)}</span> */}
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={invoiceForm.notes}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notes supplémentaires..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="terms">Conditions de paiement</Label>
                <Textarea
                  id="terms"
                  value={invoiceForm.terms}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, terms: e.target.value }))}
                  placeholder="Conditions de paiement..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateModalOpen(false);
              setIsEditModalOpen(false);
            }}>
              Annuler
            </Button>
            <Button
              onClick={isCreateModalOpen ? handleSaveInvoice : handleUpdateInvoice}
              disabled={!selectedClient?.name || !selectedClient?.firstName || !selectedClient?.email}
            >
              {isCreateModalOpen ? (AddInvoices.loading ? "Création en cours" : 'Créer la facture') : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center bg-white">
                  <div>
                    <DialogTitle className="text-2xl">Facture {selectedInvoice.id}</DialogTitle>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Client Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className=" mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Informations client
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-nowrap">{selectedInvoice.client.name} {selectedInvoice.client.firstName}</p>
                      <p className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedInvoice.client.email}
                      </p>
                      {selectedInvoice.client.telephone && (
                        <p className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {selectedInvoice.client.telephone}
                        </p>
                      )}
                      <p className="text-gray-600">{selectedInvoice.client.adresse}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className=" mb-3 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Résumé financier
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Montant HT :</span>
                        <span className="text-nowrap">{formatNumber((selectedInvoice.list.map((item) => item.total_ht)).reduce((a, e) => a + e))} Ar</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TVA :</span>
                        <span className="text-nowrap">{((selectedInvoice.list.map((item) => item.tva)).reduce((a, e) => a + e))} Ar</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total TTC :</span>
                        <span>{formatNumber((selectedInvoice.list.map((item) => item.total_ht)).reduce((a, e) => a + e) + ((selectedInvoice.list.map((item) => item.tva)).reduce((a, e) => a + e)))} Ar</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className=" mb-3">Articles facturés</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead>Prix unitaire</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        selectedInvoice.list.map((item) => (

                          <TableRow key={item.id}>
                            <TableCell style={{ padding: "2px 0" }}>{item?.designation}</TableCell>
                            <TableCell style={{ padding: "2px 0" }}>{item.vente.quantite}</TableCell>
                            <TableCell style={{ padding: "2px 0" }}>{formatNumber(item.vente.total_HT / item.vente.quantite)} Ar</TableCell>
                            <TableCell className="text-nowrap">{formatNumber(item.vente.total_HT)} Ar</TableCell>
                            {
                              selectedInvoice.list.length != 1 &&
                              <TableCell className="text-nowrap"><XCircleIcon onClick={() => setRetirefacture(item)} className="cursor-pointer" size={17} color="red" /></TableCell>
                            }
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </div>

                {/* Notes and Terms */}
                {(selectedInvoice.notes || selectedInvoice.terms) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedInvoice.notes && (
                      <div>
                        <h3 className=" mb-2">Notes</h3>
                        <p className="text-sm text-gray-600">{selectedInvoice.notes}</p>
                      </div>
                    )}

                    {selectedInvoice.terms && (
                      <div>
                        <h3 className=" mb-2">Conditions de paiement</h3>
                        <p className="text-sm text-gray-600">{selectedInvoice.terms}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter>
                <div className="flex gap-2 w-full justify-end">
                  <div className="flex gap-2">
                    {/* <button onClick={reactToPrintFn}>Print</button> */}
                    <div className="hidden print:block" ref={contentRef}>
                      <PrintFacture MoreArticles={{ ...selectedInvoice, total_ht: ((selectedInvoice.list.map((item) => item.total_ht)).reduce((a, e) => a + e)), tva: ((selectedInvoice.list.map((item) => item.tva)).reduce((a, e) => a + e)), total_ttc: ((selectedInvoice.list.map((item) => item.total_ht)).reduce((a, e) => a + e)) + ((selectedInvoice.list.map((item) => item.tva)).reduce((a, e) => a + e)) }} />

                    </div>
                    <Button variant="outline" onClick={reactToPrintFn}>
                      <Printer className="h-4 w-4 mr-2" />
                      Imprimer
                    </Button>

                  </div>

                  <div className="flex gap-2">
                    {/* <Button variant="outline" onClick={() => {
                      setIsDetailsModalOpen(false);
                      handleEditInvoice(selectedInvoice);
                    }}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button> */}

                    <Button onClick={() => setIsDetailsModalOpen(false)}>
                      Fermer
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteInvoice()}
              className="bg-red-600 hover:bg-red-700"
            >
              {
                DelInvoices.loading ? "Suppression en cours" : "Supprimer"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* retirer facture */}
      <AlertDialog open={!!retirefacture} onOpenChange={() => setRetirefacture(null)}>
        <AlertDialogContent className="">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la retire</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus={false}>Annuler</AlertDialogCancel>
            <AlertDialogAction autoFocus
              onClick={() => retirefacture && handleRetireInvoice()}
              className="bg-red-600 hover:bg-red-700"
            >
              {
                DelInvoices.loading ? "Suppression en cours" : "Retirer"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Invoices;