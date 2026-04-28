


import React, { FormEvent, useEffect, useState } from "react";
import {
  Search, Filter, Plus, ArrowUpDown, MoreHorizontal,
  Download, Save, X, Car, Wrench, FileText, Truck,
  PlusIcon,
  UploadCloudIcon,
  ListCheck,
  NotepadText,
  BarcodeIcon,
  Package
} from "lucide-react";
import Barcode from 'react-barcode';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Form, FormControl, FormDescription, FormField,
  FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { StatCard } from "@/components/StatCard";
import { useForm } from "react-hook-form";
// import { any, any } from "@/models/any";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductTable from "@/components/stock/ProductTable";
import PopupFilter from "@/components/ui/popupfilter";
import { PieceReferencesModal } from "@/components/PieceReferencesModal";
import { Marque, Modele, Origine, Serie } from "@/types/origine";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { LevelAsyncThunk } from "@/redux/Async/level.asyncThunk";
import { OrigineAsyncThunk } from "@/redux/Async/origine.async";
import { MarkAsyncThunk } from "@/redux/Async/mark.async";
import { ModeleAsyncThunk } from "@/redux/Async/modele.async";
const Stock = () => {

  // Define a schema for form validation
  const anySchema = z.object({
    name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères" }),
    category: z.string().min(1, { message: "La catégorie est requise" }),
    price: z.string().min(1, { message: "Le prix est requis" }),
    stock: z.coerce.number().min(0, { message: "Le stock ne peut pas être négatif" }),
    description: z.string().optional(),
    sku: z.string().min(3, { message: "Le SKU doit contenir au moins 3 caractères" }),
    supplier: z.string().optional(),
    partNumber: z.string().min(1, { message: "Le numéro de pièce est requis" }),
    manufacturer: z.string().min(1, { message: "Le fabricant est requis" }),
    vehicleCompatibility: z.string().optional(),
    location: z.string().optional(),
    weight: z.string().optional(),
    dimensions: z.string().optional(),
    warranty: z.string().optional(),
  });
  const mockPieces: Piece[] = [
    {
      id: "P001",
      codeBarre: "1234567890123",
      codeItems: "ITM001",
      designation: "Plaquettes de frein avant",
      origine: "Origine",
      marqueProduit: "Bosch",
      marque: "Bosch",
      modele: "0 986 494 063",
      serie: "QuietCast",
      categorie: "Freinage",
      prixAffiche: 45.99,
      dernierPrix: 32.50,
      emplacement: "A-01-03",
      stock: 15,
      stockMin: 5,
      dateCreation: "2024-01-01",
      statut: "actif",
      description: "Plaquettes de frein avant haute qualité pour Peugeot 308"
    },
    {
      id: "P002",
      codeBarre: "2345678901234",
      codeItems: "ITM002",
      designation: "Amortisseur arrière",
      origine: "Adaptable",
      marqueProduit: "Monroe",
      marque: "Monroe",
      modele: "G7439",
      serie: "OESpectrum",
      categorie: "Suspension",
      prixAffiche: 89.99,
      dernierPrix: 65.00,
      emplacement: "B-02-01",
      stock: 8,
      stockMin: 3,
      dateCreation: "2024-01-02",
      statut: "actif",
      description: "Amortisseur arrière adaptable haute performance"
    },
    {
      id: "P003",
      codeBarre: "3456789012345",
      codeItems: "ITM003",
      designation: "Filtre à huile",
      origine: "Origine",
      marqueProduit: "Mann",
      marque: "Mann",
      modele: "W 712/75",
      serie: "HU",
      categorie: "Filtration",
      prixAffiche: 15.99,
      dernierPrix: 8.50,
      emplacement: "C-01-05",
      stock: 2,
      stockMin: 10,
      dateCreation: "2024-01-03",
      statut: "rupture",
      description: "Filtre à huile premium pour moteurs BMW"
    }
  ];
  const [pieces, setPieces] = useState<any>(mockPieces);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  // const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterOrigine, setFilterOrigine] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [activeTab, setActiveTab] = useState('liste');
  // const { toast } = useToast();
  const resetForm = () => {
    setFormData({
      codeBarre: '',
      codeItems: '',
      designation: '',
      origine: '',
      marqueProduit: '',
      marque: '',
      modele: '',
      serie: '',
      categorie: '',
      prixAffiche: '',
      dernierPrix: '',
      emplacement: '',
      stock: '',
      stockMin: '',
      description: ''
    });
  };
  const initialStockData: any = [
    {
      id: 1,
      name: "Filtre à huile Bosch F026407123",
      category: "Filtration",
      price: "12.50 €",
      stock: 3,
      status: "Bas",
      partNumber: "F026407123",
      manufacturer: "Bosch",
      vehicleCompatibility: ["Renault", "Peugeot", "Citroen"],
      location: "A1-B3",
    },
    {
      id: 2,
      name: "Plaquettes de frein ATE 13.0460-7186.2",
      category: "Freinage",
      price: "59.99 €",
      stock: 2,
      status: "Bas",
      partNumber: "13.0460-7186.2",
      manufacturer: "ATE",
      vehicleCompatibility: ["BMW", "Mercedes"],
      location: "A2-C5",
    },
    {
      id: 3,
      name: "Courroie distribution Gates K015603XS",
      category: "Moteur",
      price: "79.90 €",
      stock: 0,
      status: "Rupture",
      partNumber: "K015603XS",
      manufacturer: "Gates",
      vehicleCompatibility: ["Volkswagen", "Audi"],
      location: "B1-D2",
    },
    {
      id: 4,
      name: "Liquide de frein DOT 4",
      category: "Fluides",
      price: "15.50 €",
      stock: 12,
      status: "Normal",
      partNumber: "DOT4-500",
      manufacturer: "TotalEnergies",
      vehicleCompatibility: ["Universel"],
      location: "C3-A1",
    },
    {
      id: 5,
      name: "Amortisseur avant Bilstein B4",
      category: "Suspension",
      price: "129.00 €",
      stock: 5,
      status: "Normal",
      partNumber: "22-139741",
      manufacturer: "Bilstein",
      vehicleCompatibility: ["Renault", "Dacia"],
      location: "D4-B2",
    },
    {
      id: 6,
      name: "Batterie Varta E43 Blue Dynamic",
      category: "Électricité",
      price: "89.99 €",
      stock: 8,
      status: "Normal",
      partNumber: "572409068",
      manufacturer: "Varta",
      vehicleCompatibility: ["Multiples"],
      location: "A4-C7",
    },
    {
      id: 7,
      name: "Bougie d'allumage NGK LZKAR6-11",
      category: "Allumage",
      price: "19.50 €",
      stock: 4,
      status: "Normal",
      partNumber: "92535",
      manufacturer: "NGK",
      vehicleCompatibility: ["Toyota", "Nissan", "Honda"],
      location: "B2-D3",
    },
  ];

  interface PieceFormData {
    codeBarre: string;
    codeItems: string;
    designation: string;
    origine: string;
    marqueProduit: string;
    marque: string;
    modele: string;
    serie: string;
    categorie: string;
    prixAffiche: string;
    dernierPrix: string;
    emplacement: string;
    stock: string;
    stockMin: string;
    description: string;
  }
  const handleGenerateBarcode = () => {
    // const newBarcode = generateBarcode();
    // setFormData(prev => ({ ...prev, codeBarre: newBarcode }));
  };

  // const categories = [
  //   "Filtration",
  //   "Freinage",
  //   "Moteur",
  //   "Suspension",
  //   "Direction",
  //   "Allumage",
  //   "Électricité",
  //   "Transmission",
  //   "Carrosserie",
  //   "Fluides",
  //   "Échappement",
  //   "Accessoires",
  // ];

  const manufacturers = [
    "Bosch",
    "ATE",
    "Gates",
    "TotalEnergies",
    "Bilstein",
    "Varta",
    "NGK",
    "Valeo",
    "SKF",
    "Sachs",
    "Febi",
    "Continental",
    "Castrol",
    "Brembo",
  ];

  const [formData, setFormData] = useState<PieceFormData>({
    codeBarre: '',
    codeItems: '',
    designation: '',
    origine: '',
    marqueProduit: '',
    marque: '',
    modele: '',
    serie: '',
    categorie: '',
    prixAffiche: '',
    dernierPrix: '',
    emplacement: '',
    stock: '',
    stockMin: '',
    description: ''
  });
  const [originselected,setoriginselected] = useState("")
  const [markselected,setmarkselected] = useState("")
  const [modeleSelected,setModeleSelected] = useState("")
  interface Piece {
    id: string;
    codeBarre: string;
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
    stock: number;
    stockMin: number;
    dateCreation: string;
    statut: 'actif' | 'inactif' | 'rupture';
    description?: string;
  } const handleInputChange = (field: keyof PieceFormData, value: string) => {
    
    for (const element of Object.keys(formData)) {
      if(element == field){
        
        formData[element] = value
        if(element== "origine"){
          setoriginselected(value)
        }else if(element == "marque"){
          setmarkselected(value)
        }else if(element == "modele"){
          
          setModeleSelected(value)
        }
      } 
    }
    // formData.origine ="baddao" 
    // setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreatePiece = () => {
    const newPiece: Piece = {
      id: `P${(pieces.length + 1).toString().padStart(3, '0')}`,
      codeBarre: formData.codeBarre,
      codeItems: formData.codeItems,
      designation: formData.designation,
      origine: formData.origine,
      marqueProduit: formData.marqueProduit,
      marque: formData.marque,
      modele: formData.modele,
      serie: formData.serie,
      categorie: formData.categorie,
      prixAffiche: parseFloat(formData.prixAffiche),
      dernierPrix: parseFloat(formData.dernierPrix),
      emplacement: formData.emplacement,
      stock: parseInt(formData.stock),
      stockMin: parseInt(formData.stockMin),
      dateCreation: new Date().toISOString().split('T')[0],
      statut: parseInt(formData.stock) > parseInt(formData.stockMin) ? 'actif' : 'rupture',
      description: formData.description
    };

    // setPieces(prev => [...prev, newPiece]);
    // resetForm();
    // setIsCreateModalOpen(false);
    // toast({
    //   title: "Pièce ajoutée",
    //   description: `La pièce ${newPiece.designation} a été ajoutée avec succès.`,
    // });
    
  };


  const ComboBox = ({ value, onValueChange, options, placeholder }: {
    value: string;
    onValueChange: (value: string) => void;
    options: string[];
    placeholder: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const filteredOptions = options.filter(option =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onValueChange(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          className="w-full"
        />
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  setInputValue(option);
                  onValueChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };


  const [add, setAdd] = useState(false)
  const [uploaded, setUploaded] = useState("")
  const uploadFile = (e: any) => {
    if (e.target.files[0]) {
      setUploaded(e.target.files[0].name)

    } else {

      setUploaded("")
    }

  }
  const [file, setFile] = useState(true)

  const [searchTerm, setSearchTerm] = useState("");
  const [stockData, setStockData] = useState<any[]>(initialStockData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedany, setSelectedany] = useState<any | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  // React hook form setup
  const form = useForm<any>({
    resolver: zodResolver(anySchema),
    defaultValues: {
      name: "",
      category: "",
      price: "",
      stock: 0,
      description: "",
      sku: "",
      supplier: "",
      partNumber: "",
      manufacturer: "",
      vehicleCompatibility: "",
      location: "",
      weight: "",
      dimensions: "",
      warranty: "",
    },
  });

  const filteredStock = stockData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.partNumber && item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalanys = stockData.length;
  const lowStockCount = stockData.filter(item => item.status === "Bas").length;
  const outOfStockCount = stockData.filter(item => item.status === "Rupture").length;
  const totalValue = stockData.reduce((sum, item) =>
    sum + parseFloat(item.price.replace(" €", "").replace(",", ".")) * item.stock, 0
  ).toFixed(2);

  const handleAddany = (data: any) => {
    // Format price to match existing format
    let formattedPrice = parseFloat(data.price.replace(",", ".")).toFixed(2) + " €";

    // Determine status based on stock level
    let status: "Normal" | "Bas" | "Rupture" = "Normal";
    if (data.stock === 0) status = "Rupture";
    else if (data.stock <= 3) status = "Bas";

    const newany: any = {
      id: stockData.length + 1,
      name: data.name,
      category: data.category,
      price: formattedPrice,
      stock: data.stock,
      status: status,
      description: data.description,
      sku: data.sku,
      supplier: data.supplier,
      partNumber: data.partNumber,
      manufacturer: data.manufacturer,
      vehicleCompatibility: data.vehicleCompatibility ? [data.vehicleCompatibility] : [],
      location: data.location,
      weight: data.weight,
      dimensions: data.dimensions,
      warranty: data.warranty,
    };

    setStockData([...stockData, newany]);
    setIsAddDialogOpen(false);
    form.reset();

    toast({
      title: "Pièce ajoutée",
      description: `${data.name} a été ajoutée au stock.`,
    });
  };
  const dispatch = useDispatch<AppDispatch>()

  const [levelList, setLevelList] = useState([])
  const [OrigineList, setOrigineList] = useState([])
  const LevelData = useSelector((state: RootState) => state.LevelSlice)
  const AllOrigine = useSelector((state: RootState) => state.OrigineSlice)
  const Mark = useSelector((state: RootState) => state.MarkSlice)
  const Modele = useSelector((state: RootState) => state.ModeleSlice)
  const Serie = useSelector((state: RootState) => state.SerieSlice)

  const [marques, setMarques] = useState<Marque[]>(Mark.data);
  const [modeles, setModeles] = useState<Modele[]>(Modele.data);
  const [origines, setOrigines] = useState<Origine[]>(AllOrigine.data);
  const [series, setseries] = useState<Serie[]>(Serie.data);
 

  useEffect(() => {
    dispatch(LevelAsyncThunk())
    dispatch(OrigineAsyncThunk())
    dispatch(MarkAsyncThunk())
    dispatch(ModeleAsyncThunk())
  }, [])
  // useEffect(() => {
  //   setLevelList(LevelData.data)
  // }, [LevelData.loading])
  useEffect(() => {
    setOrigines(AllOrigine.data)
  }, [AllOrigine.data])
  
  useEffect(() => {
    setMarques(Mark.data)
  }, [Mark.data])
  useEffect(() => {
    setMarques(Mark.data != undefined ? Mark.data.filter((item: any) => item.origine.pays == originselected) : [])
  }, [originselected])
  useEffect(() => {
    setMarques(Modele.data != undefined ? Modele.data.filter((item: any) => item.parent.family_name == originselected) : [])
  }, [markselected])
  useEffect(() => {
    setseries(Serie.data != undefined ? Serie.data.filter((item: any) => item.parent.family_name == modeleSelected) : [])
  }, [modeleSelected])
  useEffect(() => {
    setseries(Serie.data)
  }, [Serie.data])
  useEffect(() => {
    setModeles(Modele.data)
  }, [Modele.data])

  const categories = ["Freinage", "Suspension", "Filtration", "Échappement", "Transmission", "Électricité", "Carrosserie", "Climatisation"];
  // // const origines = ["Japonaise", "Allemande", "Française", "Américaine"];
  const marquesProduits = ["Bosch", "Monroe", "Mann", "Valeo", "Continental", "Febi", "Gates", "Dayco"];
  // const marques = ["Peugeot", "Citroën", "Renault", "BMW", "Mercedes", "Audi", "Volkswagen", "Ford"];
  // const modeles = ["308", "C4", "Clio V", "Série 3", "Classe A", "A3", "Golf", "Focus"];
  // const series = ["QuietCast", "OESpectrum", "HU", "Premium", "Sport", "Eco"];
  const [isReferencesModalOpen, setIsReferencesModalOpen] = useState(false);

  const handleExport = () => {
    // Simulate export functionality
    toast({
      title: "Export réussi",
      description: "Les données ont été exportées avec succès.",
    });
    setIsExportDialogOpen(false);
  };

  // const ComboBox = ({ value, onValueChange, options, placeholder }: {
  //   value: string;
  //   onValueChange: (value: string) => void;
  //   options: string[];
  //   placeholder: string;
  // }) => {
  //   const [isOpen, setIsOpen] = useState(false);
  //   const [inputValue, setInputValue] = useState(value);

  //   const filteredOptions = options.filter(option =>
  //     option.toLowerCase().includes(inputValue.toLowerCase())
  //   );

  //   return (
  //     <div className="relative">
  //       <Input
  //         value={inputValue}
  //         onChange={(e) => {
  //           setInputValue(e.target.value);
  //           onValueChange(e.target.value);
  //         }}
  //         onFocus={() => setIsOpen(true)}
  //         onBlur={() => setTimeout(() => setIsOpen(false), 200)}
  //         placeholder={placeholder}
  //         className="w-full"
  //       />
  //       {isOpen && filteredOptions.length > 0 && (
  //         <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
  //           {filteredOptions.map((option, index) => (
  //             <div
  //               key={index}
  //               className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
  //               onClick={() => {
  //                 setInputValue(option);
  //                 onValueChange(option);
  //                 setIsOpen(false);
  //               }}
  //             >
  //               {option}
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
  // const handleInputChange = (field: keyof PieceFormData, value: string) => {
  //   setFormData(prev => ({ ...prev, [field]: value }));
  // };

  // const handleViewDetails = (any: any) => {
  //   setSelectedany(any);
  //   setIsDetailDialogOpen(true);
  // };

  // const handleDeleteany = (id: number) => {
  //   setStockData(stockData.filter(item => item.id !== id));
  //   toast({
  //     title: "Pièce supprimée",
  //     description: "La pièce a été supprimée avec succès.",
  //     variant: "destructive"
  //   });
  // };

  // const handleUpdateStock = (id: number, newStock: number) => {
  //   const updatedStockData = stockData.map(item => {
  //     if (item.id === id) {
  //       let status: "Normal" | "Bas" | "Rupture" = "Normal";
  //       if (newStock === 0) status = "Rupture";
  //       else if (newStock <= 3) status = "Bas";

  //       return { ...item, stock: newStock, status };
  //     }
  //     return item;
  //   });

  //   setStockData(updatedStockData);

  //   toast({
  //     title: "Stock mis à jour",
  //     description: `Le stock a été mis à jour avec succès.`,
  //   });
  // };

  return (
    <div className="space-y-3 p-3">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold  tracking-tight " style={{ fontSize: "18px" }}>Pièces Automobiles</h1>
        <div className="flex items-center gap-2">
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Exporter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exporter les données</DialogTitle>
                <DialogDescription>
                  Choisissez le format d'exportation et les données à inclure.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <FormLabel>Format</FormLabel>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="csv" name="format" defaultChecked />
                      <label htmlFor="csv">CSV</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="radio" id="excel" name="format" />
                      <label htmlFor="excel">Excel</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="radio" id="pdf" name="format" />
                      <label htmlFor="pdf">PDF</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel>Données à inclure</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="include-all" defaultChecked />
                      <label htmlFor="include-all">Toutes les pièces</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="include-low" />
                      <label htmlFor="include-low">Stock faible uniquement</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="include-out" />
                      <label htmlFor="include-out">Ruptures uniquement</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="include-compatible" />
                      <label htmlFor="include-compatible">Avec compatibilité</label>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" /> Exporter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {add && <div className="h-screen fixed  z-10 px-10 flex justify-end items-start pt-40  w-full bottom-0 left-0" style={{ background: "rgba(0,0,0,0.3)" }}>
            <div className="animate-fade-in card mx-auto bg-white w-5/12 rounded-lg overflow-hidden" style={{ borderRadius: "7px" }}>
              <div className="title border-b relative bg-[rgba(0,0,0] ">
                <button onClick={() => setFile(false)} className={`px-5 py-3 text-sm flex gap-4`}> <ListCheck className="" size={21} />  Ajouter un nouveau produit</button>
                <PlusIcon onClick={() => setAdd(false)} className="absolute hover:scale-125  cursor-pointer right-4 top-3 rotate-45" />
              </div>
              <div className="content  p-6 ">
                <label htmlFor="uploadFile">

                  <div className="import cursor-pointer select-none border-dotted border-stone-200 border-2 rounded-lg  justify-center p-10 py-10 flex gap-6">
                    <UploadCloudIcon className="" size={21} />
                    <h2 className="text-sm">{uploaded != "" ? uploaded : "Importer ou déposer un fichier ( Word ou Excel )"}</h2>
                  </div>
                  <input type="file" name="" hidden onChange={uploadFile} id="uploadFile" />
                </label>
              </div>
              <div className="flex border-t items-center justify-between p-3 px-7">
                <h4 className="text-sm text-blue-600 flex items-center gap-4 cursor-pointer" onClick={() => { setAdd(false), setIsAddDialogOpen(true) }}>      <NotepadText size={14} />  Utiliser des Formulaires</h4>
                {/* <Button style={{fontSize:"12.5px",fontWeight:"100" ,float :"right"}} className=""  > <UploadIcon className="mr-2 h-4 w-4"/>Importer </Button> */}
                <Button style={{ fontSize: "12.5px", fontWeight: "100", float: "right" }} className={`${uploaded != "" ? "cursor-pointer" : "cursor-not-allowed bg-blue-200 hover:bg-blue-200"}`}   > <Plus className="mr-2 h-4 w-4" />Ajouter </Button>
              </div>
            </div>

          </div>}
          <Button variant="outline" onClick={() => setIsReferencesModalOpen(true)}>
            <Package className="h-4 w-4 mr-2" />
            Références Pièces
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Pièce
              </Button>
            </DialogTrigger>
          </Dialog>

        </div>
      </div>


      {/* Nouvelle pièces */}

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarcodeIcon className="h-5 w-5" />
              Ajouter une nouvelle pièce
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations de la nouvelle pièce
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Première colonne */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="codeBarre">Code Barre *</Label>
                <div className="flex gap-2">
                  <Input
                    id="codeBarre"
                    defaultValue={formData.codeBarre}
                    onChange={(e) => handleInputChange('codeBarre', e.target.value)}
                    placeholder="1234567890123"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateBarcode}
                    className="px-3"
                  >
                    <BarcodeIcon className="h-4 w-4" />
                  </Button>
                </div>
                {formData.codeBarre && (
                  <div className="mt-2 p-2 border rounded bg-white">
                    <Barcode
                      value={formData.codeBarre}
                      format="CODE128"
                      width={1}
                      height={30}
                      fontSize={12}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="codeItems">Code Items *</Label>
                <Input
                  id="codeItems"
                  defaultValue={formData.codeItems}
                  onChange={(e) => handleInputChange('codeItems', e.target.value)}
                  placeholder="ITM001"
                />
              </div>

              <div>
                <Label htmlFor="designation">Désignation *</Label>
                <Input
                  id="designation"
                  defaultValue={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  placeholder="Plaquettes de frein avant"
                />
              </div>

              <div>
                <Label htmlFor="origine">Origine *</Label>
                <ComboBox
                  value={formData.origine}
                  onValueChange={(value) => handleInputChange('origine', value)}
                  options={origines.map((e) => e.pays)}
                  placeholder="Sélectionner l'origine"
                />
              </div>
            </div>

            {/* Deuxième colonne */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="marqueProduit">Marque Produit *</Label>
                <ComboBox
                  value={formData.marqueProduit}
                  onValueChange={(value) => handleInputChange('marqueProduit', value)}
                  options={marques.map((e) => e.family_name)}
                  placeholder="Sélectionner la marque produit"
                />
              </div>

              <div>
                <Label htmlFor="marque">Marque *</Label>
                <ComboBox
                  value={formData.marque}
                  onValueChange={(value) => handleInputChange('marque', value)}
                  options={marques.map((e) => e.family_name)}
                  placeholder="Sélectionner la marque"
                />
              </div>

              <div>
                <Label htmlFor="modele">Modèle *</Label>
                <ComboBox
                  value={formData.modele}
                  onValueChange={(value) => handleInputChange('modele', value)}
                  options={modeles.map(e=>e.family_name)}
                  placeholder="Sélectionner le modèle"
                />
              </div>

              <div>
                <Label htmlFor="serie">Série</Label>
                <ComboBox
                  value={formData.serie}
                  onValueChange={(value) => handleInputChange('serie', value)}
                  options={series.map((e) => e.family_name)}
                  placeholder="Sélectionner la série"
                />
              </div>
            </div>

            {/* Troisième colonne */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="categorie">Catégorie *</Label>
                <ComboBox
                  value={formData.categorie}
                  onValueChange={(value) => handleInputChange('categorie', value)}
                  options={categories}
                  placeholder="Sélectionner la catégorie"
                />
              </div>

              <div>
                <Label htmlFor="prixAffiche">Prix Affiché *</Label>
                <Input
                  id="prixAffiche"
                  type="number"
                  step="0.01"
                  defaultValue={formData.prixAffiche}
                  onChange={(e) => handleInputChange('prixAffiche', e.target.value)}
                  placeholder="45.99"
                />
              </div>

              <div>
                <Label htmlFor="dernierPrix">Dernier Prix *</Label>
                <Input
                  id="dernierPrix"
                  type="number"
                  step="0.01"
                  defaultValue={formData.dernierPrix}
                  onChange={(e) => handleInputChange('dernierPrix', e.target.value)}
                  placeholder="32.50"
                />
              </div>

              <div>
                <Label htmlFor="emplacement">Emplacement</Label>
                <Input
                  id="emplacement"
                  defaultValue={formData.emplacement}
                  onChange={(e) => handleInputChange('emplacement', e.target.value)}
                  placeholder="A-01-03"
                />
              </div>
            </div>

            {/* Section Stock */}
            <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock">Stock Actuel *</Label>
                <Input
                  id="stock"
                  type="number"
                  defaultValue={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="15"
                />
              </div>
              <div>
                <Label htmlFor="stockMin">Stock Minimum *</Label>
                <Input
                  id="stockMin"
                  type="number"
                  defaultValue={formData.stockMin}
                  onChange={(e) => handleInputChange('stockMin', e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 lg:col-span-3">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                defaultValue={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Description détaillée de la pièce..."
                className="w-full px-3 py-2 border rounded-md h-20 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreatePiece}>
              Ajouter la pièce
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard
            title="Pièces en stock"
            value={totalanys}
            className="bg-blue-50 border-blue-100 h-fit p-3"
            icon={<Car className="h-6 w-6 text-blue-600" />}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard
            title="Stock faible"
            value={lowStockCount}
            className="bg-amber-50 border-amber-100  h-fit p-3"
            icon={<Truck className="h-6 w-6 text-amber-600" />}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard
            title="Ruptures de stock"
            value={outOfStockCount}
            className="bg-red-50 border-red-100  h-fit p-3"
            icon={<FileText className="h-6 w-6 text-red-600" />}
          />
        </motion.div>
        {
          decoded.role == "admin" &&
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <StatCard
            title="Valeur totale"
            value={`${totalValue} €`}
            className="bg-green-50 border-green-100  h-fit p-3"
            icon={<Wrench className="h-6 w-6 text-green-600" />}
          />
        </motion.div>
        }
      </div>

      <Tabs defaultValue="pieces" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pieces">Pièces</TabsTrigger>
          <TabsTrigger value="compatibilite">Compatibilité</TabsTrigger>
          <TabsTrigger value="fournisseurs">Fournisseurs</TabsTrigger>
        </TabsList>

        <TabsContent value="pieces">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des pièces..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <PopupFilter />
              {/* <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filtres
              </Button> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="h-4 w-4 mr-2" /> Trier
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuItem>Nom (A-Z)</DropdownMenuItem>
                  <DropdownMenuItem>Nom (Z-A)</DropdownMenuItem>
                  <DropdownMenuItem>Prix (croissant)</DropdownMenuItem>
                  <DropdownMenuItem>Prix (décroissant)</DropdownMenuItem>
                  <DropdownMenuItem>Stock (faible-élevé)</DropdownMenuItem>
                  <DropdownMenuItem>Stock (élevé-faible)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>



        </TabsContent>
        <div className="mt-4"></div>
        <ProductTable />

        <TabsContent value="compatibilite">
          <div className="bg-white p-6 rounded-md border">
            <h3 className="text-lg font-semibold mb-4">Rechercher par véhicule</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="Marque">Marque</label>
                {/* <FormLabel>Marque</FormLabel> */}
                <select className="w-full p-2 border rounded">
                  <option>Sélectionner une marque</option>
                  <option>Renault</option>
                  <option>Peugeot</option>
                  <option>Citroën</option>
                  <option>Volkswagen</option>
                  <option>BMW</option>
                  <option>Mercedes</option>
                </select>
              </div>

              <div>
                {/* <FormLabel>Modèle</FormLabel> */}
                <label htmlFor="Modèle">Modèle</label>

                <select className="w-full p-2 border rounded">
                  <option>Sélectionner un modèle</option>
                  <option>Clio</option>
                  <option>Megane</option>
                  <option>208</option>
                  <option>Golf</option>
                  <option>Série 3</option>
                </select>
              </div>

              <div>
                {/* <FormLabel>Année</FormLabel> */}
                <label htmlFor="Année">Année</label>

                <select className="w-full p-2 border rounded">
                  <option>Sélectionner une année</option>
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                  <option>2020</option>
                  <option>2019</option>
                </select>
              </div>
            </div>

            <Button
              onClick={() => toast({
                title: "Recherche de compatibilité",
                description: "Recherche des pièces compatibles..."
              })}
            >
              Rechercher
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="fournisseurs">
          <div className="bg-white p-6 rounded-md border">
            <h3 className="text-lg font-semibold mb-4">Fournisseurs par catégorie</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium">{category}</h4>
                  <p className="text-sm text-gray-500">
                    {manufacturers.slice(0, 3).join(', ')} et plus...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        {/* </div> */}
      </Tabs>

      {/* any Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          {selectedany && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedany.name}</DialogTitle>
                <DialogDescription>
                  Référence: {selectedany.partNumber} | Fabricant: {selectedany.manufacturer}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Catégorie:</span> {selectedany.category}
                  </div>
                  <div>
                    <span className="font-semibold">Prix:</span> {selectedany.price}
                  </div>
                  <div>
                    <span className="font-semibold">Stock:</span> {selectedany.stock} unités
                  </div>
                  <div>
                    <span className="font-semibold">Statut:</span>
                    <span className={`ml-2 inline-block px-2 py-1 text-xs font-medium rounded-full ${selectedany.status === "Normal" ? "bg-green-100 text-green-800" :
                      selectedany.status === "Bas" ? "bg-amber-100 text-amber-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                      {selectedany.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">SKU:</span> {selectedany.sku || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Fournisseur:</span> {selectedany.supplier || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Emplacement:</span> {selectedany.location || "N/A"}
                  </div>
                  {selectedany.warranty && (
                    <div>
                      <span className="font-semibold">Garantie:</span> {selectedany.warranty}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-semibold">Compatibilité véhicule:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedany.vehicleCompatibility?.map((vehicle, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {vehicle}
                    </span>
                  )) || "N/A"}
                </div>
              </div>

              {selectedany.description && (
                <div className="mt-4">
                  <span className="font-semibold">Description:</span>
                  <p className="mt-1 text-gray-600">{selectedany.description}</p>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Fermer
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Modification",
                    description: "Ouverture du formulaire de modification..."
                  });
                  setIsDetailDialogOpen(false);
                }}>
                  Modifier
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      <PieceReferencesModal open={isReferencesModalOpen} onOpenChange={setIsReferencesModalOpen}
      />
    </div>
  );
};

export default Stock;
