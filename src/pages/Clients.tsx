import { useEffect, useRef, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Download,
  Mail,
  Phone,
  MapPin,
  Edit,
  Eye,
  History,
  Check,
  UserPlus,
  EditIcon,
  PrinterIcon,
  Trash,
  RefreshCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatCard } from "@/components/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { ClientForm } from "@/components/ClientForm";
import { ClientFiltersComponent, ClientFilters } from "@/components/ClientFilters";
import { HistoriqueAchats } from "@/components/HistoriqueAchats";
import { ClientDetailModal } from "@/components/ClientDetailModal";
import { Client, HistoriqueFacture } from "@/types/client";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { AsyncDeletedClient, ClientAsync } from "@/redux/Async/ClientAsync";
import { AddMoreVentesAsync, AddVentesAsync, VentesAsync } from "@/redux/Async/VentesAsync";
import { StatCard2 } from "@/components/StatCard2";
import CountUp from "react-countup";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientSelector } from "@/components/ClientSelector";
import { toast } from "@/hooks/use-toast";
import { changeMsg } from "@/redux/slice/VentesSlice";
import { StockAsync } from "@/redux/Async/stockAsync";
import ClickOutside from "@/components/overlayDrop";
import ToPrints from "@/components/toPrints";
import { AddMoreInvoicesAsync, InvoicesAsync } from "@/redux/Async/InvoicesASync";
import { useReactToPrint } from "react-to-print";
import PrintMore from "@/components/toPrintMoreArticles";
import PrintMoreChecked from "@/components/toPrintMoreArticlesChecked";
import { changeStatus } from "@/redux/slice/InvoicesSlice";
import { jwtDecode } from "jwt-decode";
import { OneUserAsync } from "@/redux/Async/userAuthAsync";
import generateInvoiceNumber from "@/types/num-invoices";
import Invoices from "./Invoices";

// Données d'exemple
// const clientsData: Client[] = [
//   {
//     id: 1,
//     numeroClient: "CLT001",
//     nom: "RASOAMANARIVO Hery",
//     adresse: "Lot 123 Antananarivo",
//     telephone: "+261 34 12 345 67",
//     numeroSTAT: "20001234567890",
//     numeroNIF: "NIF123456789",
//     numeroRC: "RC789123456",
//     email: "hery@email.mg",
//     dateEnregistrement: "2024-01-15"
//   },
//   {
//     id: 2,
//     numeroClient: "CLT002",
//     nom: "RAKOTO Marie",
//     adresse: "Lot 456 Toamasina",
//     telephone: "+261 32 98 765 43",
//     numeroSTAT: "20001234567891",
//     numeroNIF: "NIF987654321",
//     numeroRC: "RC456789123",
//     email: "marie@email.mg",
//     dateEnregistrement: "2024-02-20"
//   },
//   {
//     id: 3,
//     numeroClient: "CLT003",
//     nom: "ANDRIANA Jean",
//     adresse: "Lot 789 Antsirabe",
//     telephone: "+261 33 11 22 33",
//     numeroSTAT: "20001234567892",
//     numeroNIF: "NIF111222333",
//     numeroRC: "RC333222111",
//     email: "jean@email.mg",
//     dateEnregistrement: "2024-03-10"
//   }
// ];

// const historiqueData: HistoriqueFacture[] = [
//   {
//     date: "2024-04-15",
//     numeroFacture: "FAC-2024-001",
//     designation: "Ordinateur portable HP",
//     prixUnitaire: 1200.00,
//     quantite: 1,
//     totalHT: 1200.00,
//     totalTTC: 1440.00
//   },
//   {
//     date: "2024-04-10",
//     numeroFacture: "FAC-2024-002",
//     designation: "Souris sans fil",
//     prixUnitaire: 25.00,
//     quantite: 2,
//     totalHT: 50.00,
//     totalTTC: 60.00
//   }, {
//     date: "2024-05-17",
//     numeroFacture: "FAC-2024-001",
//     designation: "Ordinateur portable HP",
//     prixUnitaire: 1200.00,
//     quantite: 1,
//     totalHT: 1200.00,
//     totalTTC: 1440.00
//   },
//   {
//     date: "2024-05-20",
//     numeroFacture: "FAC-2024-002",
//     designation: "Souris sans fil",
//     prixUnitaire: 25.00,
//     quantite: 2,
//     totalHT: 50.00,
//     totalTTC: 60.00
//   }
// ];

const Clients = () => {

  const AllInvoices = useSelector((state: RootState) => state.InvoicesSlice)
   
     const dispatch = useDispatch<AppDispatch>()
   
     const [invoiceNumber, setInvoiceNumber] = useState("");
     useEffect(() => {
       dispatch(InvoicesAsync())
       const lastNumber = (AllInvoices?.data.length != 0 ?(AllInvoices?.data[0]?.list[0]?.numFacture)?.split("-")[2] : undefined); // tu peux remplacer par un vrai numéro depuis une base
       const newInvoice = generateInvoiceNumber(lastNumber);
       setInvoiceNumber(newInvoice);
     }, []);
 

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
    dispatch(OneUserAsync(decoded.id))
  }, [decoded.id])

  useEffect(() => {
    dispatch(OneUserAsync(decoded.id))
  }, [])



  const tva = useRef() as any
  const ttc = useRef() as any
  const ht = useRef() as any
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef })
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [nouvelleVente, setNouvelleVente] = useState({
    quantite: 1,
    prix_unitaire: '',
    status: "",
    mode_paiement: "",
    TVA: parseFloat(tva?.current?.value),
    total_HT: ht?.current?.value,
    total_TTC: ttc?.current?.value,
    admin: (OneUser.data as any)?.person?.id,
    client: selectedClient?.id,
    stock: "eeeeee"
  })
  const [selectedArticles, setSelectedArticles] = useState([{
    quantite: 1,
    prix_unitaire: '',
    status: "",
    mode_paiement: nouvelleVente.mode_paiement,
    TVA: parseFloat(tva?.current?.value),
    total_HT: ht?.current?.value,
    total_TTC: ttc?.current?.value,
    admin: (OneUser.data as any)?.person?.id,
    client: selectedClient?.id,
    dataClient: [],
    stock: 0
  }])

  const addMore = () => {
    setSelectedArticles([...selectedArticles, {
      quantite: 1,
      prix_unitaire: '',
      status: "",
      mode_paiement: nouvelleVente.mode_paiement,
      TVA: parseFloat(tva?.current?.value),
      total_HT: ht?.current?.value,
      total_TTC: ttc?.current?.value,
      admin: (OneUser.data as any)?.person?.id,
      dataClient: null,
      client: selectedClient?.id,
      stock: 0
    }])
  }
  const [action, setAction] = useState(false);
  const AddInvoices = useSelector((state: RootState) => state.AddInvoicesSlice)
  const handleChangeArticleValues = (index, value) => {
    const array = selectedArticles
    array[index] = { ...value, TVA: addTVA ? (value.prix_unitaire * value.quantite * 0.2) : 0, total_HT: value.prix_unitaire * value.quantite, total_TTC: (addTVA ? (value.prix_unitaire * value.quantite * 0.2) : 0) + (value.prix_unitaire * value.quantite), client: selectedClient?.id, mode_paiement: nouvelleVente.mode_paiement, dataClient: selectedClient }
    setAction(!action)


  };
  const removeArticle = (index: number) => {
    selectedArticles.splice(index, 1)
    // const news  = [...selectedArticles] 

    setSelectedArticles([...selectedArticles])

  }

  const total_HT = ((selectedArticles.map((e: { prix_unitaire: number, quantite: number } | any) => (e.quantite * e.prix_unitaire))).reduce((acc, el) => acc + el) | 0)

  const [addTVA, setAddTVA] = useState(false)

  const [idClient, setIdClient] = useState(0)

  const VentesStock = useSelector((state: RootState) => state.VentesSlice.data)

  const AllClient = useSelector((state: RootState) => state.ClientSlice.data).filter((client) =>client.vente.length > 0 &&  client.status =="fidele" )


  const [isCreateInvoice, setIsCreateInvoice] = useState(false);

  useEffect(() => {
    dispatch(ClientAsync())
  }, [])
  useEffect(() => {
    if (!AddInvoices.loading && AddInvoices.status == "ok") {
      setIsCreateInvoice(false)
      dispatch(changeStatus(""))
      setIsCreateInvoice(false)
      toast({
        title: "Facture crée",
        description: "Le nouveau facture a été enregistré avec succès."
      });
    }
    dispatch(ClientAsync())
  }, [AddInvoices.loading])
  const [searchTerm, setSearchTerm] = useState("");
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isHistoriqueOpen, setIsHistoriqueOpen] = useState(false);
  const [isClientDetailOpen, setIsClientDetailOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [stockSelected, SetstockSelected] = useState(null);

  const [filters, setFilters] = useState<ClientFilters | any>({
    nom: "",
    ville: "",
    telephone: "",
    email: "",
    dateDebut: "",
    dateFin: "",
    hasFactures: ""
  });

  useEffect(() => {
    nouvelleVente.client = selectedClient?.id
  }, [selectedClient])
  const DataStock = useSelector((state: RootState) => state.StockSlice.data)
  const [DataStockCateg, setDataStockCateg] = useState(DataStock)

  const [searchCateg, setSearchCateg] = useState("")
  const [showCateg, setShowCateg] = useState(false)
  const InputSearchCateg = (e) => {
    let value = e.target.value
    SetstockSelected(null)
    setSearchCateg(value)
    if (value != "") {
      setDataStockCateg(DataStock.filter((item) => ((item.designation).toLowerCase()).includes(value.toLowerCase())))
    } else {
      setDataStockCateg(DataStock)
    }
  }
  const overlayDrop3 = useRef(null) as any;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
 
  const [createFacture, setCreateFacture] = useState([]);
  const resetForms = () => {
    setNouvelleVente({
      quantite: "",
      prix_unitaire: "",
      status: "",
      mode_paiement: "",
      TVA: 0,
      total_HT: 0,
      total_TTC: 0,
      admin: (OneUser.data as any)?.person?.id,
      client: selectedClient?.id,
      stock: 5
    } as any)
  }
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

      const newData = []
      selectedArticles.map((art: any) => {
        newData.push({ ...art, TVA: addTVA ? (art.prix_unitaire * art.quantite * 0.2) : 0, total_HT: art.prix_unitaire * art.quantite, total_TTC: (addTVA ? (art.prix_unitaire * art.quantite * 0.2) : 0) + (art.prix_unitaire * art.quantite), client: selectedClient?.id, mode_paiement: nouvelleVente.mode_paiement, dataClient: selectedClient })
      })

      dispatch(AddMoreVentesAsync(newData as any))

      resetForms()
    }

  };

  const handleChangeVente = (item, value) => {

    setNouvelleVente({ ...nouvelleVente, [item]: value });


  }

  const UpdateClient = useSelector((state: RootState) => state.UpdateClientSlice)

  const AddVentesStock = useSelector((state: RootState) => state.AddVentesSlice)

  function handleDeleteClient() {
    dispatch(AsyncDeletedClient(selectedClient.id as number))
  }


  // Fonctions de tri et filtrage
  const filteredClients = AllClient.filter(client => {
    const matchesSearch =
      client?.name.toLowerCase().includes(searchTerm?.toLowerCase()) || client?.firstName.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      client?.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      client?.telephone?.includes(searchTerm);

    const matchesFilters =
      (!filters?.firstName || client?.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) && (!filters?.name || client?.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters?.ville || client?.adresse.toLowerCase().includes(filters.ville.toLowerCase())) &&
      (!filters?.telephone || client?.telephone.includes(filters.telephone)) &&
      (!filters?.email || client?.email.toLowerCase().includes(filters?.email.toLowerCase()));

    return matchesSearch && matchesFilters;
  }).sort((a, b) => {
    if (!sortBy) return 0;

    let aValue = a[sortBy as keyof Client];
    let bValue = b[sortBy as keyof Client];

    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleClientSubmit = (clientData: Omit<Client, 'id' | 'dateEnregistrement'>) => {
    if (editingClient) {
      // Modifier client existant
    } else {
      // Nouveau client
    }
    setEditingClient(null);
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setIsClientDetailOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsClientFormOpen(true);
    setIsClientDetailOpen(false);
  };
  const createVnt = () => {
    setIsClientDetailOpen(false)
    setIsCreateModalOpen(true)
  };

  const handleViewHistory = (client: Client) => {
    setSelectedClient(client);
    setIsHistoriqueOpen(true);
    setIsClientDetailOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      nom: "",
      ville: "",
      telephone: "",
      email: "",
      dateDebut: "",
      dateFin: "",
      hasFactures: ""
    });
  };
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
        mode_paiement: facture.mode_paiement,
        numFacture: invoiceNumber,
        stock: facture.id,
        admin: (OneUser.data as any)?.person?.id
      }
      newInvoice.push(newInvoices)
    })


    dispatch(AddMoreInvoicesAsync(newInvoice as any))
  }
  const exportClients = () => {
    const csvContent = [
      "Numéro,Nom,Adresse,Téléphone,Email,STAT,NIF,RC,Date d'enregistrement",
      ...filteredClients.map(client =>
        `${client.numeroClient},${client.nom},${client.adresse},${client.telephone},${client.email},${client.numeroSTAT},${client.numeroNIF},${client.numeroRC},${client.dateEnregistrement}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const activeClients = AllClient.length;
  const newClientsThisMonth = 5;
  const totalInvoices = 156;






  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [mockVentesData, setMockVentesData] = useState(VentesStock)

  const CA = VentesStock.reduce((acc, el) => acc + el.total_HT, 0)


  useEffect(() => {
    dispatch(VentesAsync())
  }, [])
  useEffect(() => {
    dispatch(InvoicesAsync())
    if (!UpdateClient.loading && UpdateClient.status == "deleted") {
      setIsDeleteDialogOpen(false)
      dispatch(ClientAsync())
    }
    dispatch(VentesAsync())
  }, [UpdateClient.loading])
  useEffect(() => {
    dispatch(StockAsync())
  }, [])
  useEffect(() => {
    dispatch(InvoicesAsync())

    if (!isCreateInvoice) {
      // dispatch(changeMsg([]))
    }
  }, [isCreateInvoice])
  function refresh() {
    dispatch(InvoicesAsync())


    dispatch(VentesAsync())
    dispatch(StockAsync())
    dispatch(ClientAsync())
  }
  useEffect(() => {
    dispatch(InvoicesAsync())

    if (!AddVentesStock.loading && AddVentesStock.venteIds.length != 0) {
      dispatch(VentesAsync())
      dispatch(StockAsync())
      dispatch(ClientAsync())
      setIsCreateInvoice(true)
      SetstockSelected(null)
      setSearchCateg(null)
      toast({
        title: "Vente créée",
        description: "La nouvelle vente a été enregistrée avec succès."
      });
      // resetForms()
      setSelectedClient(null)
      setCreateFacture(AddVentesStock.venteIds)
      setIsCreateModalOpen(false);
    } else {

    }
  }, [AddVentesStock.loading])


  useEffect(() => {
    setMockVentesData(VentesStock)
  }, [VentesStock])


  useEffect(() => {

    // new Date(new Date(e.prochaine).toDateString())


    const handleClickOutside = (e: Event | any) => {
      if (overlayDrop3.current && !overlayDrop3.current.contains(e.target)) {
        setShowCateg(false);
      }
      // if (overlayDrop2.current && !overlayDrop2.current.contains(e.target)) {
      //   setIsOpen2(false);
      // }

    };
    // parMode()
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };




  }, []);

  return (
    <div className="space-y-3 px-3 "> 
      <Card>
        <CardHeader>
          <div>
            <CardTitle style={{ fontSize: "16px" }}>Liste des clients enregistrés</CardTitle>
            <CardDescription>Gérez vos clients et consultez leurs informations</CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des clients..."
                className="pl-8 w-full h-8 sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2"> 
              <Button onClick={refresh} variant="outline" style={{ borderRadius: "2px" }}>
                <RefreshCcw className="h-4 w-4 mr-2" />
              </Button>
              <Button
                 style={{ fontSize: "13px" }} className="py-0 rounded"
                onClick={() => {
                  setEditingClient(null);
                  setIsClientFormOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Nouveau client
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent style={{ padding: "0" }}>
          <div className="overflow-x-auto p-0" >
            {
              filteredClients.length != 0 ?
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      {/* <TableHead>N° Client</TableHead> */}
                      <TableHead>Nom</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-center">Nbr d'achats</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow
                        key={client.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSelectClient(client)}
                        title="cliquez pour voir les details"
                      >
                        <TableCell style={{ fontSize: "12px" }} className="py-1">
                          {(new Date(client.createdAt).toLocaleDateString())}
                        </TableCell>
                        {/* <TableCell className="font-medium"  style={{fontSize:"13px"}}>{client.id}</TableCell> */}
                        <TableCell className="text-sm py-1" style={{ fontSize: "11px" }}>{client.name} {client.firstName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1" style={{ fontSize: "13px" }}>
                            {/* <Phone className="h-3.5 w-3.5 text-muted-foreground" /> */}
                            {client.telephone  || "Non renseigné"}
                          </div>
                        </TableCell>
                        <TableCell className="py-1">
                          <div className="flex items-center gap-1" style={{ fontSize: "13px" }}>
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            {client.email || "Non renseigné"}
                          </div>
                        </TableCell>
                        <TableCell className="py-1">
                          <div className="flex  justify-center items-center" >
                            <h4 style={{ fontSize: "13px" }}>{client.vente.length}</h4>
                          </div>
                        </TableCell>
                        <TableCell className="py-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                handleSelectClient(client);
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                handleEditClient(client);
                                setIdClient(client.id)
                              }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                handleViewHistory(client);
                              }}>
                                <History className="h-4 w-4 mr-2" />
                                Historique d'achat
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClient(client);
                                setIsDeleteDialogOpen(true)
                              }}>
                                <Trash className=" text-red-500 h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                :
                <div className="text-center mt-6 pt-2 border-t">
                  <p className="text-sm">Aucun client trouvé</p>
                </div>
            }
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la vente de {selectedClient?.firstName} {selectedClient?.name} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteClient}>
              {UpdateClient.loading ? "Suppression en cours" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogs */}
      <ClientForm
        isOpen={isClientFormOpen}
        onClose={() => {
          setIsClientFormOpen(false);
          setEditingClient(null);
        }}
        client={idClient}
        onSubmit={handleClientSubmit}
        initialData={editingClient}
      />
 
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form action="" onSubmit={CreateVente}>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Nouvelle vente pour :  {selectedClient?.name} {selectedClient?.firstName}</DialogTitle>
              <DialogDescription>
                Créer une nouvelle vente dans le système
              </DialogDescription>
            </DialogHeader>


            <div className="space-y-2">
              {/* Sélection/ajout de client */}
              {/* <ClientSelector
                selectedClient={selectedClient as any}
                onClientSelect={setSelectedClient as any}
              /> */}
              <div className="flex justify-end">
                <Button type="button" size="sm" onClick={addMore} className="h-6 bg-slate-500 hover:bg-slate-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Plus d'article
                </Button>
              </div>
              {
                selectedArticles.map((e, i) => (
                  <ClickOutside key={i} change={handleChangeArticleValues} remove={removeArticle} value={[...selectedArticles][i]} index={i} />
                ))
              }





              <div onClick={() => { setAddTVA(!addTVA) }} className="flex items-center bg-blue-200 gap-4 p-1 cursor-pointer  text-sm px-2">
                <Input type="checkbox" checked={addTVA} readOnly id="tva" className="h-4 w-4" />
                Ajouter un TVA

              </div>

              {
                !addTVA ?
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="text-sm font-medium mb-1 block"   >Montant total_HT</label>
                      <Input ref={ht} placeholder="COROLLA, PATROL..." readOnly type="number" value={total_HT} />
                    </div>

                    <div className="hidden">
                      <label className="text-sm font-medium mb-1 block">Montant total_TTC</label>
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
           

                  <select name="" id="mode" className="block" defaultValue={nouvelleVente.mode_paiement} onChange={(e) => handleChangeVente('mode_paiement', e.target.value)} style={{ fontSize: "13px" }}>
                    <option value="" >-- Sélectionner --</option>
                    <option value="espèce" >Espèce</option>
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

      <Dialog open={isCreateInvoice} onOpenChange={setIsCreateInvoice}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Option pour la facturation</DialogTitle>
            <DialogDescription>
              Vous pour créer ou imprimer directement un facture icizy !
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateInvoice(true), CreateMoreInvoices(),reactToPrintFn() }}>
              <EditIcon />
              {

                AddInvoices.loading ? "Enrégistrement en cours" : "Enrégistrer et Imprimer la facture"
              }

            </Button>
            <div className="hidden print:block" ref={contentRef}>
              <PrintMoreChecked MoreArticles={createFacture} num={invoiceNumber} />
            </div>
            {/* <Button variant="secondary" onClick={reactToPrintFn}>
              <PrinterIcon />
              Imprimer
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ClientDetailModal
        isOpen={isClientDetailOpen}
        onClose={() => setIsClientDetailOpen(false)}
        client={selectedClient}
        onEdit={handleEditClient}
        data={VentesStock}
        createVnt={createVnt}
        onViewHistory={handleViewHistory}
      />

      <HistoriqueAchats
        isOpen={isHistoriqueOpen}
        onClose={() => setIsHistoriqueOpen(false)}
        client={selectedClient}
        historique={VentesStock}
      />
    </div>
  );
};

export default Clients;