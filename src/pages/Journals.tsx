import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Filter, Calendar, Download, Plus, Edit, Trash2, RefreshCw, FileText, DollarSign, TrendingUp, TrendingDown, Printer } from "lucide-react";
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
import { StatCard } from "@/components/StatCard";
import { DatePicker } from "@/components/SuiviVentes/DatePicker";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { AddjournauxAsync, DeljournauxAsync, journauxAsync, UpjournauxAsync } from "@/redux/Async/journauxAsync";
import { format } from "date-fns";
import { VentesAsync } from "@/redux/Async/VentesAsync";
import { changeDeleteType, changeStatusJornals, changeType } from "@/redux/slice/journauxSlice";
import { changeUpdateStatus } from "@/redux/slice/VentesSlice";
import { useReactToPrint } from "react-to-print";
import PrintJournals from "@/components/PrintJournals";
import "../global.style.css"
// Types
interface Expense {
  id: number;
  date: string;
  designation: string;
  amount: number;
  category?: string;
  description?: string;
}

interface Revenue {
  id: number
  mode_paiement: string,
  cause: string,
  montant: number,
  type: string,
}

// Mock data
// const mockExpenses: Expense[] = [
//   { id: 1, date: "2024-05-28", designation: "ALAIN", amount: 15000, category: "Personnel", description: "Salaire employé" },
//   { id: 2, date: "2024-05-28", designation: "JEAN CHRIS", amount: 30000, category: "Personnel", description: "Prime vendeur" },
//   { id: 3, date: "2024-05-28", designation: "MÉDICAMENT", amount: 30000, category: "Frais", description: "Pharmacie d'entreprise" },
//   { id: 4, date: "2024-05-28", designation: "CARBURANT", amount: 25000, category: "Transport", description: "Essence véhicules" },
//   { id: 5, date: "2024-05-28", designation: "ÉLECTRICITÉ", amount: 45000, category: "Utilities", description: "Facture électricité" },
// ];

// const mockRevenues: Revenue[] = [
//   { id: 1, date: "2024-05-28", title: "VENTES SUR STOCK", amount: 790000, source: "Ventes", description: "Ventes produits neufs" },
//   { id: 2, date: "2024-05-28", title: "VENTES SUR STOCK OCCASION", amount: 150000, source: "Ventes", description: "Ventes produits d'occasion" },
//   { id: 3, date: "2024-05-28", title: "SERVICES RÉPARATION", amount: 75000, source: "Services", description: "Prestations réparation" },
// ];

const Journal = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(format(new Date(), "MM/dd/yyyy")));
  const [selectedDate2, setSelectedDate2] = useState<Date>(new Date(format(new Date(), "MM/dd/yyyy")));
  const selectedDateString = new Date(format(selectedDate, "MM/dd/yyyy"));
  const selectedDateString2 = new Date(format(selectedDate2, "MM/dd/yyyy"));

  const dispatch = useDispatch<AppDispatch>()
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef })

  const Journals = useSelector((state: RootState) => state.journauxSlice.data)
  const DelJournals = useSelector((state: RootState) => state.DeljournauxSlice)
  const Upjournaux = useSelector((state: RootState) => state.UpjournauxSlice)
  const AddJournals = useSelector((state: RootState) => state.AddjournauxSlice)

  const depenses = Journals.filter((item) => item.type == "depenses")
  const recette = Journals.filter((item) => item.type == "recette")
  useEffect(() => {
    dispatch(journauxAsync())
  }, [])
  useEffect(() => {
    if (!AddJournals.loading) {
      dispatch(journauxAsync())
      if (AddJournals.type == "recette") {
        // setExpenses(prev => [...prev, expenseData]);
        toast({
          title: "Dépense ajoutée",
          description: "La nouvelle dépense a été enregistrée",
        });
        setIsRevenueModalOpen(false);

      }

      if (AddJournals.type == "depenses") {
        // setRevenues(prev => [...prev, revenueData]);
        toast({
          title: "Recette ajoutée",
          description: "La nouvelle recette a été enregistréeiiiiiiiiii",
        });
        setIsExpenseModalOpen(false);
      }
    }
    if (!DelJournals.loading) {
      if (DelJournals.type == "depenses") {
        // setExpenses(prev => [...prev, expenseData]);
        toast({
          title: "Dépense supprimée",
          description: "La nouvelle dépense a été supprimée",
        });
        setIsExpenseModalOpen(false);
      }

      if (DelJournals.type == "recette") {
        // setRevenues(prev => [...prev, revenueData]);
        toast({
          title: "Recette supprimée",
          description: "La nouvelle recette a été supprimée",
        });
        setIsRevenueModalOpen(false);
      }

      dispatch(changeDeleteType(""))
    }
    if (!Upjournaux.loading) {
      if (Upjournaux.statusJornals == "depenses") {
        // setExpenses(prev => [...prev, expenseData]);
        toast({
          title: "Dépense modifiée",
          description: "La nouvelle dépense a été modifiée",
        });
        setIsExpenseModalOpen(false);
      }

      if (Upjournaux.statusJornals == "recette") {
        // setRevenues(prev => [...prev, revenueData]);
        toast({
          title: "Recette modifiée",
          description: "La nouvelle recette a été modifiée",
        });
        setIsRevenueModalOpen(false);
      }

    }
    dispatch(changeType(""))
    dispatch(changeDeleteType(""))
    dispatch(changeStatusJornals(""))

    dispatch(journauxAsync())

  }, [AddJournals.loading, DelJournals.loading, Upjournaux.loading])






  // const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  // const [revenues, setRevenues] = useState<Revenue[]>(mockRevenues);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Modal states
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ type: 'expense' | 'revenue', id: number } | null>(null);

  // Form states
  const [expenseForm, setExpenseForm] = useState({
    designation: "",
    amount: "",
    mode_paiement: "",
    category: "",
    description: ""
  });
  const filteredRevenues = recette.filter(revenue =>
    new Date(revenue.createdAt) >= new Date(selectedDateString) && new Date(format(new Date(revenue.createdAt), "MM/dd/yyyy")) <= new Date(selectedDateString2) &&
    (revenue.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      revenue.cause.toLowerCase().includes(searchTerm?.toLowerCase()))
  );

  
  const [revenueForm, setRevenueForm] = useState({
    title: "",
    amount: "",
    mode_paiement: "",
    source: "",
    description: ""
  }) as any;

  const Ventes = useSelector((state: RootState) => state.VentesSlice.data)
  const now = Ventes.filter((item) => (((new Date(item.createdAt)) >= new Date(selectedDateString)) && ((new Date(format(new Date(item.createdAt), "MM/dd/yyyy"))) <= new Date(selectedDateString2))))
  useEffect(() => {
    dispatch(VentesAsync())
  }, [])

  let dates = journalOf((now)).reverse()



  let recetteNow = useMemo(() => {
    let mode = []
    let recetteVente = []
    now.map((vente) => {
      if (mode.includes((vente.mode_paiement).toLowerCase())) {

      } else {
        if (vente.mode_paiement != "") {
          mode.push((vente.mode_paiement).toLowerCase())
        }
      }
    })
    mode.map((mode) => {
      let ventes = now.filter((vente) => (vente.mode_paiement).toLowerCase() == (mode).toLowerCase())
      let somme = ventes.map((item) => item.total_HT).reduce((a, b) => a + b)
      recetteVente.push({ cause: "vente pièce", mode_paiement: mode, montant: somme, createdAt: new Date(format(new Date(), "MM/dd/yyyy")) })
    })
    return recetteVente
  }, [now])

  function recetteParDate() {
    let fulldata = []
    dates.reverse().map((a) => {

      // recettes vente

      let dataPardate = (now).filter((item) => (String(new Date(format(new Date(item.createdAt), "MM/dd,yyyy"))) == a))

      let mode = []
      let recetteVente = []
      dataPardate.map((vente) => {
        if (mode.includes((vente.mode_paiement).toLowerCase())) {

        } else {
          if (vente.mode_paiement != "") {
            mode.push((vente.mode_paiement).toLowerCase())
          }
        }
      })
      mode.map((mode) => {
        let ventes = dataPardate.filter((vente) => (vente.mode_paiement).toLowerCase() == (mode).toLowerCase())
        let somme = ventes.map((item) => item.total_HT).reduce((a, b) => a + b)
        recetteVente.push({ cause: "vente pièce", mode_paiement: mode, montant: somme, createdAt: new Date((new Date(a))) })
      })

      //  recette simple

      let dataPardate2 = (filteredRevenues).filter((item) => (String(new Date(format(new Date(item.createdAt), "MM/dd,yyyy"))) == a))

      // let mode2 = []
      // let recetteVente2 = []
      // dataPardate2.map((vente) => {
      //   if (mode2.includes((vente.mode_paiement).toLowerCase())) {

      //   } else {
      //     if (vente.mode_paiement != "") {
      //       mode2.push((vente.mode_paiement).toLowerCase())
      //     }
      //   }
      // })
      // mode2.map((c) => {
      //   let ventes = dataPardate2.filter((vente) => (vente.mode_paiement).toLowerCase() == (c).toLowerCase())
      //   let somme = ventes.map((item) => item.total_HT).reduce((a, b) => a + b)
      //   recetteVente.push({ cause: "vente pièce", mode_paiement: c, montant: somme, createdAt: new Date((new Date(a))) })
      // })



      fulldata.push({ daty: a, dataRecette: recetteVente, dataSimple: dataPardate2 })


    })
    return fulldata
  }
  function depenseParDate() {
    let fulldata = []
    dates.reverse().map((a) => {

      // recettes vente

      let dataPardate = (filteredExpenses).filter((item) => (String(new Date(format(new Date(item.createdAt), "MM/dd,yyyy"))) == a))

       


      fulldata.push({ daty: a, dataDepense: dataPardate })


    })
    return fulldata
  }

  recetteParDate()

  // Filter data by selected date


  const filteredExpenses = depenses.filter(expense =>
    ((new Date(expense.createdAt) >= new Date(selectedDateString)) && (new Date(format(new Date(expense.createdAt), "MM/dd/yyyy")) <= new Date(selectedDateString2)))

  );


  // Calculations
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.montant, 0);
  const totalRevenues = filteredRevenues.concat(recetteNow).reduce((sum, revenue) => sum + revenue.montant, 0);
  const dailyBalance = totalRevenues - totalExpenses;



  const recetteespece = (filteredRevenues.filter((item) => (item.mode_paiement).toLowerCase() == "espèce").length != 0 ? (filteredRevenues.filter((item) => (item.mode_paiement).toLowerCase() == "espèce").map((item) => item.montant).reduce((a, b) => a + b)) : 0) + (recetteNow.filter((item) => (item.mode_paiement).toLowerCase() == "espèce").length != 0 ? (recetteNow.filter((item) => (item.mode_paiement).toLowerCase() == "espèce").map((item) => item.montant).reduce((a, b) => a + b)) : 0) - ((filteredExpenses.map((e) => e.montant)).length != 0 ? (((filteredExpenses.map((e) => e.montant)).reduce((ac, el) => ac + el))) : 0)



  // Handlers
  const handleRefresh = () => {
    toast({
      title: "Données actualisées",
      description: `Journaux mis à jour pour le ${selectedDate?.toLocaleDateString('fr-FR')}`,
    });
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setExpenseForm({ designation: "", amount: "", mode_paiement: "", category: "", description: "" });
    setIsExpenseModalOpen(true);
  };

  const handleEditExpense = (expense: Expense | any) => {
    setEditingExpense(expense);
    setExpenseForm({
      designation: expense.cause,
      amount: expense.montant,
      mode_paiement: expense.mode_paiement,
    } as any);
    setIsExpenseModalOpen(true);
  };


  let especes = recetteNow.find((item) => (item.cause).toLowerCase() == "espèces")


  const handleSaveExpense = () => {
    if (!expenseForm.designation || !expenseForm.amount) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const expenseData = {
      // id: editingExpense?.id || Date.now(),
      // date: selectedDateString,
      mode_paiement: expenseForm.mode_paiement,
      cause: expenseForm.designation,
      montant: parseFloat(expenseForm.amount),
      type: "depenses",
    };

    dispatch(AddjournauxAsync(expenseData as any))


  };

  // oooooooo
  const handleSaveRevenue = () => {
    if (!revenueForm.title || !revenueForm.amount) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const revenueData = {
      // id: editingExpense?.id || Date.now(),
      // date: selectedDateString,
      mode_paiement: revenueForm.mode_paiement,
      cause: revenueForm.title,
      montant: parseFloat(revenueForm.amount),
      type: "recette",
    };

    dispatch(AddjournauxAsync(revenueData as any))


  };
  const handleUpdateRevenue = () => {
    if (!revenueForm.title || !revenueForm.amount) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const revenueData = {
      // id: editingExpense?.id || Date.now(),
      // date: selectedDateString,
      mode_paiement: revenueForm.mode_paiement,
      cause: revenueForm.title,
      montant: parseFloat(revenueForm.amount),
      type: "recette",
    } as any;

    dispatch(UpjournauxAsync([revenueForm.id, revenueData] as any))


  };


  const handleUpdateExpense = () => {
    if (!expenseForm.designation || !expenseForm.amount) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const revenueData = {
      // id: editingExpense?.id || Date.now(),
      // date: selectedDateString,
      mode_paiement: expenseForm.mode_paiement,
      cause: expenseForm.designation,
      montant: parseFloat(expenseForm.amount),
    } as any;

    dispatch(UpjournauxAsync([editingExpense.id, revenueData] as any))


  };


  const handleAddRevenue = () => {
    setEditingRevenue(null);
    setRevenueForm({ title: "", amount: "", source: "", mode_paiement: "", description: "" });
    setIsRevenueModalOpen(true);
  };

  const handleEditRevenue = (revenue: Revenue) => {
    setEditingRevenue(revenue);
    setRevenueForm({
      id: revenue.id,
      title: revenue.cause,
      amount: revenue.montant,
      description: revenue.cause,
      mode_paiement: revenue.mode_paiement,
      // description: revenue.description || ""


    } as any);
    setIsRevenueModalOpen(true);
  };


  function factureParDate(){
    let data = []
    dates.map((e,i)=>{
        const r = recetteParDate().find((item)=>item.daty == e)
        const d = depenseParDate().find((item)=>item.daty == e).dataDepense
        data.push({daty : e , revenue :  r.dataSimple.concat(r.dataRecette) ,depense : d})
        
  })
  return data
  }
factureParDate();
  


  const handleDelete = (type: 'expense' | 'revenue', id: number) => {

    dispatch(DeljournauxAsync(id as any))

  };

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Le rapport journalier est en cours de génération",
    });
  };
  function formatNumber(value) {
    if (!value) return '';
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(value);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CFA',
      minimumFractionDigits: 0
    }).format(amount).replace('CFA', 'Ar');
  };


  function journalOf(data = []) {
    let arrayDate = []
    data.map(e => {

      if (!arrayDate.includes(String(new Date(format(new Date(e.createdAt), "MM/dd,yyyy"))))) {
        arrayDate.push(String(new Date(format(new Date(e.createdAt), "MM/dd,yyyy"))))
      }
    })
    return arrayDate
  }



  function selectPerDate(dates = []) {
    let perDate = []
    dates.map(e => {
      let r = (filteredRevenues.concat(recetteNow)).filter((item) => (String(new Date(format(new Date(item.createdAt), "MM/dd,yyyy"))) == e))
      let d = (filteredExpenses).filter((item) => (String(new Date(format(new Date(item.createdAt), "MM/dd,yyyy"))) == e))
      perDate.push({ date: e, revenue: r, depense: d })

    })
    return perDate
  }




  return (
    <div className="space-y-2 p-3 py-0">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold" style={{ fontSize: "15px" }}>Journaux - Dépenses & Recettes  </h1>
        <div className="flex items-center gap-3">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <Label className="font-medium">Date sélectionnée :</Label>
          </div> */}
            {/* <div className="bg-white p-0 rounded-lg    ">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher dans les journaux..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div> */}
            <div className="hidden print:block" ref={contentRef}>
              <PrintJournals data={factureParDate().reverse()} rec={recetteParDate()} dep={depenseParDate()} dates={dates} />
            </div>
            <Button onClick={reactToPrintFn} className="bg-blue-600 hover:bg-blue-700 rounded"  style={{fontSize:"12px"}}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <DatePicker
              date={selectedDate}
              setDate={(date) => setSelectedDate(date || new Date(format(new Date(), "MM/dd/yyyy")))}
              placeholder="Sélectionner une date"
              className="w-44"
            />
            <DatePicker
              date={selectedDate2}
              setDate={(date) => setSelectedDate2(date || new Date(format(new Date(), "MM/dd/yyyy")))}
              placeholder="Sélectionner une date"
              className="w-44"
            />

          </div>

        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 bg-white p-2 gap-4">
        <StatCard
          title="Total Dépenses"
          value={`${((filteredExpenses.map((e) => e.montant)).length != 0 ? (formatNumber((filteredExpenses.map((e) => e.montant)).reduce((ac, el) => ac + el))) : 0)} Ar`}
          className="bg-red-50 border-red-100"
          icon={<TrendingDown className="h-8 w-8 text-red-600" />}
        />
        <StatCard
          title="Total Recettes"
          value={`${(filteredRevenues.concat(recetteNow).length != 0 ? (formatNumber(filteredRevenues.concat(recetteNow).map((e) => e.montant).reduce((ac, el) => ac + el))) : 0)} Ar`}
          className="bg-green-50 border-green-100"
          icon={<TrendingUp className="h-8 w-8 text-green-600" />}
        />
        <StatCard
          title="Solde Journalier"
          value={formatCurrency(dailyBalance)}
          className={dailyBalance >= 0 ? "bg-blue-50 border-blue-100" : "bg-orange-50 border-orange-100"}
          icon={<DollarSign className="h-8 w-8 text-blue-600" />}
        />
        <StatCard
          title="Solde en caise"
          value={`${formatCurrency(recetteespece)}`}
          className="bg-purple-50 border-purple-100"
        />
      </div>

      {/* Search */}

      {/* Side by Side Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
        {/* Expenses Section */}
        <div className="bg-white   flex-grow rounded-lg border shadow-sm">
          <div className="p-4 border-b bg-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <h2 className="text-md font-bold text-red-800">Dépenses</h2>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  {filteredExpenses.length}
                </span>
              </div>
              <Button disabled={recetteespece == 0} onClick={handleAddExpense} size="sm" style={{ borderRadius: "3px", fontSize: "13px", padding: "4px 11px", height: "fit-content", }}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader >
              <TableRow className="p-0">
                {/* <TableHead className="w-12">Date</TableHead> */}
                <TableHead className="py-1 h-0" >Désignation</TableHead>
                <TableHead className="py-1 h-0" >Montant</TableHead>
                <TableHead className="w-20 py-1">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                depenseParDate().length != 0 ?
                  (depenseParDate().reverse().map((expenses, index) => (
                    <>
                     {
                    dates.length != 1 &&
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        {
                          (new Date(expenses.daty)).toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short", year: "2-digit" })
                        }
                      </TableCell>
                    </TableRow>
                  }
                  { expenses.dataDepense.length != 0 ? (expenses.dataDepense.map((expense, index) => (


                    <TableRow >
                      {/* <TableCell className="font-medium">
        {format(new Date(expense?.createdAt), "dd/MM/yyyy")}
      </TableCell> */}
                      <TableCell className="font-normal py-0">
                        <div>
                          <p className="font-normal" style={{ fontSize: "13px" }}>{expense.cause}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-red-600 py-0">
                        {formatCurrency(expense.montant)}
                      </TableCell>
                      <TableCell className="py-0">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditExpense(expense)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteDialog({ type: 'expense', id: expense.id })}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )))
                  
                  :
                  <TableCell colSpan={4} className="text-center py-2 text-gray-500 border">
                    Aucune dépense enregistrée sur cette date
                  </TableCell>
                  
                  }
                    </>
                  )))
                  :
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Aucune dépense enregistrée pour cette date
                  </TableCell>
              }

            </TableBody>
          </Table>
        </div>

        {/* Revenues Section */}
        <div className="bg-white  flex-grow rounded-lg border shadow-sm">
          <div className="p-4 border-b bg-green-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h2 className="text-md font-bold text-green-800">Recettes</h2>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {filteredRevenues.concat(recetteNow).length}
                </span>
              </div>
              <Button onClick={handleAddRevenue} size="default" style={{ borderRadius: "7px", fontSize: "13px", padding: "4px 11px", height: "fit-content" }}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                {/* {
                  dates.length != 1 &&
                <TableHead className="w-12">Date</TableHead>
                } */}
                <TableHead>Intitulé</TableHead>
                <TableHead>Mode de paiement</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recetteParDate().length != 0 ?
                (recetteParDate().reverse().map((revenues, index) => (
                  <>
                  {
                    dates.length != 1 &&
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        {
                          (new Date(revenues.daty)).toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "long", year: "2-digit" })
                        }
                      </TableCell>
                    </TableRow>
                  }
                    {((revenues.dataRecette.concat(revenues.dataSimple)).map((revenue, index) => (
                      <TableRow key={index}>

                        <TableCell className="font-normal py-0" style={{ fontSize: "13px" }}>
                          <div>
                            <p className="font-normal uppercase" style={{ fontSize: "13px" }}>{revenue.cause}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-normal py-0" style={{ fontSize: "13px" }}>
                          <div>
                            <p className="capitalize font-normal" style={{ fontSize: "13px" }}>{revenue.mode_paiement}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold py-0 text-green-600">
                          {formatNumber(revenue.montant)} Ar
                        </TableCell>
                        {
                          revenue.cause == "vente pièce" ?

                            <TableCell className="py-0">
                              <div className="flex gap-1 justify-center  items-center">

                                <h3 className="text-center   py-2 ">-------</h3>
                              </div>
                            </TableCell> :
                            <TableCell className="py-0">
                              <div className="flex gap-1">

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditRevenue(revenue)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteDialog({ type: 'revenue', id: revenue.id })}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                        }
                      </TableRow>

                    )))}
                  </>




                )))
                :
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  Aucune recette enregistrée pour cette date
                </TableCell>
              }
              {/* {recette.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Aucune recette enregistrée pour cette date
                  </TableCell>
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Expense Modal */}
      <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
        <DialogContent className="sm:max-w-md  bg-white">
          <DialogHeader>
            <DialogTitle>
              {editingExpense ? (Upjournaux.loading ? "Modification en cours" : 'Modifier la depense') : 'Nouvelle dépense'}
            </DialogTitle>
            <DialogDescription>
              {editingExpense ? 'Modifiez les informations de la dépense' : 'Ajoutez une nouvelle dépense au journal'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="designation">Désignation *</Label>
              <Input
                id="designation"
                value={expenseForm.designation}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, designation: e.target.value }))}
                placeholder="Ex: ALAIN, CARBURANT..."
              />
            </div>

            <div className="">
              {/* <div>
                <Label htmlFor="amount">Solde espèce *</Label>
                <Input
                  id="amount"
                  
                  className="!border-red-400 !text-gray-600 !opacity-100"
                  type="number"
                  defaultValue={recetteespece}
                />
              </div> */}
              <div>
                <Label htmlFor="amount">Montant *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0"
                />
              </div>

            </div>
            <div className="hidden">
              <Label htmlFor="mode">Montant *</Label>

              <select name="" id="mode" className="block" value={"espèce"}
                onChange={(e) => { setExpenseForm(prev => ({ ...prev, mode_paiement: e.target.value })) }}>
                <option value="">-- Sélectionner --</option>
                <option value="espèce">Espèce</option>
                <option value="mvola">Mvola</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Airtel Money">Airtel Money</option>

              </select>
            </div>


          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExpenseModalOpen(false)}>
              Annuler
            </Button>

            <Button title={recetteespece == 0 ? "Impssible de depenses" : ""} disabled={recetteespece == 0 && !editingExpense} onClick={() => { editingExpense ? handleUpdateExpense() : handleSaveExpense() }}>
              {editingExpense ? (Upjournaux.loading ? "Modification en cours" : 'Modifier') : (AddJournals.loading ? "Ajoute en cours..." : 'Ajouter')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revenue Modal */}
      <Dialog open={isRevenueModalOpen} onOpenChange={setIsRevenueModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>
              {editingRevenue ? 'Modifier la recette' : 'Nouvelle recette'}
            </DialogTitle>
            <DialogDescription>
              {editingRevenue ? 'Modifiez les informations de la recette' : 'Ajoutez une nouvelle recette au journal'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Intitulé *</Label>
              <Input
                id="title"
                value={revenueForm.title}
                onChange={(e) => setRevenueForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: VENTES SUR STOCK..."
              />
            </div>

            <div>
              <Label htmlFor="amount">Montant *</Label>
              <Input
                id="amount"
                type="number"
                value={revenueForm.amount}
                onChange={(e) => setRevenueForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="mode_p">Mode de paiement</Label>

              <select name="" id="mode_p" className="block" value={revenueForm.mode_paiement}
                onChange={(e) => setRevenueForm(prev => ({ ...prev, mode_paiement: e.target.value }))}>
                <option value="">-- Sélectionner --</option>
                <option value="espèce">Espèce</option>
                <option value="mvola">Mvola</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Airtel Money">Airtel Money</option>
              </select>
            </div>



          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevenueModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => editingRevenue ? handleUpdateRevenue() : handleSaveRevenue()}>
              {editingRevenue ? (Upjournaux.loading ? "Modification en cours" : 'Modifier') : (AddJournals.loading ? "Ajoute en cours..." : 'Ajouter')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteDialog}
        onOpenChange={() => setDeleteDialog(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette {deleteDialog?.type === 'expense' ? 'dépense' : 'recette'} ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog && handleDelete(deleteDialog.type, deleteDialog.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              {DelJournals.loading ? "Suppression en cours" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Journal;
