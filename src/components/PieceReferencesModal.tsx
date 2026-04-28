import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LevelAsyncThunk } from "@/redux/Async/level.asyncThunk";
import { AddOrigineAsyncThunk, OrigineAsyncThunk, UpOrigineAsyncThunk } from "@/redux/Async/origine.async";
import { AddMarkAsyncThunk, DelMarkAsyncThunk, MarkAsyncThunk, UpMarkAsyncThunk } from "@/redux/Async/mark.async";
import { ModeleAsyncThunk } from "@/redux/Async/modele.async";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { Marque, MarqueProd, Modele, Origine, Serie } from "@/types/origine";
import { AddSerieAsyncThunk, SerieAsyncThunk } from "@/redux/Async/serie.async";
import { useForm } from "react-hook-form";
import { AddMarkSlice } from "@/redux/slice/mark.slice.";
import { AddSerieSlice } from "@/redux/slice/serie.slice";
import { AddMarkProductAsyncThunk, MarkProductAsyncThunk } from "@/redux/Async/productMark.async";
import { StockAsync } from "@/redux/Async/stockAsync";
import { jwtDecode } from "jwt-decode";
import { OneUserAsync } from "@/redux/Async/userAuthAsync";

interface PieceReferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}



const initialData = {
  origines: [],
  marques: [],
  modeles: [],
  series: [],
};

export const PieceReferencesModal = ({ open, onOpenChange }: PieceReferencesModalProps) => {

  const dispatch = useDispatch<AppDispatch>()


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




  const [levelName, setLevelName] = useState("origine")
  const [levelId, setLevelId] = useState(0)
  const [parentId, setParentId] = useState(0)
  const [origineId, setOrigineId] = useState(0)



  const [references, setReferences] = useState(initialData);
  const [activeTab, setActiveTab] = useState("origines");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; nom: string } | null>(null);

  const [addForm, setAddForm] = useState({ nom: "", description: "", relation: "" });
  const [editForm, setEditForm] = useState({ id: "", nom: "", description: "", relation: "" });

  const { toast } = useToast();

  const resetAddForm = () => {
    setAddForm({ nom: "", description: "", relation: "" });
  };

  const resetEditForm = () => {
    setEditForm({ id: "", nom: "", description: "", relation: "" });
  };

  const addReference = () => {
    const type = activeTab as keyof typeof references;
    if (!addForm.nom?.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom est requis.",
        variant: "destructive",
      });
      return;
    }

    const newRef = {
      id: Date.now().toString(),
      nom: addForm.nom?.trim(),
      description: addForm.description?.trim(),
      ...(type !== "origines" && { [type === "marques" ? "origine" : "marque"]: addForm.relation })
    };

    setReferences(prev => ({
      ...prev,
      [type]: [...prev[type], newRef as any]
    }));

    resetAddForm();
    setAddModalOpen(false);
    toast({
      title: "Référence ajoutée",
      description: `"${addForm.nom?.trim()}" a été ajouté aux ${type}.`,
    });
  };




  const UpOrigineSlice = useSelector((state: RootState) => state.UpOrigineSlice)
  const UpMarkSlice = useSelector((state: RootState) => state.UpMarkSlice)

  const updateReference = () => {
    let idRef = editForm?.id
    if (levelName == "origine") {
      let data = [
        idRef,
        {

          pays: editForm?.nom,
        }
      ]
      dispatch(UpOrigineAsyncThunk(data as any))

    } else {
      let data = [
        idRef,
        {

          family_name: editForm?.nom,
          description: editForm?.description
        }
      ]
      dispatch(UpMarkAsyncThunk(data as any))
    }

  };
  function deleteDoublons(f){
    
    let rest = []
    for (let index = 0; index < f.length; index++) {
      
      if(!rest.find((i)=>i.family_name == f[index].family_name)){
        rest = [...rest,f[index]]
      }
      
    }
    
    return rest
  }
  useEffect(() => {
    if (!UpOrigineSlice.loading || !UpMarkSlice.loading) {
      dispatch(StockAsync())
      dispatch(LevelAsyncThunk())
      dispatch(MarkProductAsyncThunk())
      dispatch(OrigineAsyncThunk())
      dispatch(SerieAsyncThunk())
      dispatch(MarkAsyncThunk())
      dispatch(ModeleAsyncThunk())
      setEditModalOpen(false)

    }
  }, [UpOrigineSlice.loading, UpMarkSlice.loading])
  const deleteReference = (type: keyof typeof references, id: string) => {
    
    
    dispatch(DelMarkAsyncThunk(id as any))
  };
  const [selectedItem, setSelectedItem] = useState(null)

  const startEdit = (item: any) => {
    const type = activeTab as keyof typeof references;
    if (levelName == "origine") {
      setEditForm({
        id: item.id,
        nom: item?.pays,
        description: item.description,
        relation: type === "marques" ? item.origine : type !== "origines" ? item.marque : ""
      })
    } else {
      setEditForm({
        id: item.id,
        nom: item?.family_name,
        description: item.description,
        relation: type === "marques" ? item.origine : type !== "origines" ? item.marque : ""
      })
    }
    setEditModalOpen(true);
  };

  const getRelationOptions = (type: keyof typeof references) => {
    if (type === "marques") return references.origines;
    if (type === "modeles" || type === "series") return references.marques;
    return [];
  };

  const getRelationLabel = (type: keyof typeof references) => {
    if (type === "marques") return "Origine";
    if (type === "modeles" || type === "series") return "Marque";
    return "";
  };

  const getCurrentTypeTitle = () => {
    const titles = {
      origines: "origine",
      marques: "marque",
      modeles: "modèle",
      series: "série"
    };
    return titles[activeTab as keyof typeof titles] || "référence";
  };
  const [ttl, setTtl] = useState("")

  const renderReferenceTable = (type: keyof typeof references, title: string) => (
    <div className="space-y-3">
      {levelName === "modele"
        &&
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Noms</TableHead>
              {/* <TableHead>Description</TableHead> */}
              <TableHead>Marque</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deleteDoublons(modeles).map((item: Modele) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span className="font-medium">{item?.family_name}</span>
                </TableCell>
                {/* <TableCell>
                  <span className="text-sm text-gray-600">{item.description}</span>
                </TableCell> */}
                <TableCell>
                  <span className="text-sm">{item.parent?.family_name}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { startEdit(item), setSelectedItem(item) }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm({ type, id: item.id, nom: item?.family_name })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
      {levelName === "serie"
        &&
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Noms</TableHead>
              {/* <TableHead>Description</TableHead> */}
              <TableHead>Modèles</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deleteDoublons(Serie.data).map((item: Serie) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span className="font-medium">{item.family_name}</span>
                </TableCell>
                {/* <TableCell>
                  <span className="text-sm text-gray-600">{item.description}</span>
                </TableCell> */}
                <TableCell>
                  <span className="text-sm">{item.parent.family_name}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { startEdit(item), setSelectedItem(item) }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm({ type, id: item.id, nom: item.family_name })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
      {levelName === "marque"
        &&
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              {/* <TableHead>Description</TableHead> */}
              <TableHead>Origine</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deleteDoublons(marques).map((item: Marque | any) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span className="font-medium">{item.family_name}</span>
                </TableCell>
                {/* <TableCell>
                  <span className="text-sm text-gray-600">{item.description}</span>
                </TableCell> */}
                <TableCell>
                  <span className="text-sm">{item?.origine.pays}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { startEdit(item), setSelectedItem(item) }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm({ type, id: item.id, nom: item.nom })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
      {levelName === "marque_produit"
        &&
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Noma</TableHead>
              {/* <TableHead>Description</TableHead> */}
              <TableHead>Origine</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deleteDoublons(marquesProd).map((item: Marque) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span className="font-medium">{item.family_name}</span>
                </TableCell>
                {/* <TableCell>
                  <span className="text-sm text-gray-600">{item.description}</span>
                </TableCell> */}
                <TableCell>
                  <span className="text-sm">{item.origine.pays}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { startEdit(item), setSelectedItem(item) }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm({ type, id: item.id, nom: item.nom })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
      {levelName === "origine"
        &&
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Noms</TableHead>
              {/* <TableHead>Description</TableHead> */}
              {type !== "origines" && <TableHead>{getRelationLabel(type)}</TableHead>}
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {origines.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span className="font-medium">{item.pays}</span>
                </TableCell>
                {/* <TableCell>
                  <span className="text-sm text-gray-600">{item.description}</span>
                </TableCell> */}
                {type !== "origines" && (
                  <TableCell>
                    <span className="text-sm">{type === "marques" ? item.origine : item.marque}</span>
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { startEdit(item), setSelectedItem(item) }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm({ type, id: item.id, nom: item.nom })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }


    </div>
  );

  const renderFormFields = (formData: any, setFormData: any) => {
    const type = activeTab as keyof typeof references;

    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Nom *</label>
          <Input
            placeholder={`Nom de ${levelName}`}
            value={formData.nom}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, nom: e.target.value }))}
          />
        </div>

        <div className="hidden">
          <label className="text-sm  font-medium mb-1 block">Description</label>
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        {type !== "origines" && (
          <div>
            <label className="text-sm font-medium mb-1 block">{getRelationLabel(type)} *</label>
            <Select
              value={formData.relation}
              onValueChange={(value) => setFormData((prev: any) => ({ ...prev, relation: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Sélectionner ${getRelationLabel(type).toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {getRelationOptions(type).map((option: any) => (
                  <SelectItem key={option.id} value={option.nom}>
                    {option.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  };
  const c = {
    b: ""
  }
  const [modeleOrigine, setModeleOrigine] = useState(0)
  const pays = useRef() as any
  const nom_level = useRef() as any
  const nom_modele = useRef() as any
  const desc_modele = useRef() as any
  const ref_mark = useRef() as any
  const desc_mark = useRef() as any
  const { register, handleSubmit, formState: { errors } } = useForm();
  const addOrigine = (data: Marque | any) => {

    
    data = { ...data, admin:(OneUser.data as any)?.person?.id }
 
    
    // dispatch(AddOrigineAsyncThunk(data as any))


  };

  const addModele = (e: FormEvent) => {
    e.preventDefault()
    const data = {
      family_name: nom_modele.current.value,
      level: levelId,
      description: desc_modele.current.value,
      parent: Number((ref_mark.current.value).split(",")[0]),
      origine: Number((ref_mark.current.value).split(",")[1]),
      admin:(OneUser.data as any)?.person?.id
    }
    
    dispatch(AddMarkAsyncThunk(data as any))


  };
  const addSerie = (e: FormEvent) => {
    e.preventDefault()
    const data = {
      family_name: nom_modele.current.value,
      level: levelId,
      description: desc_modele.current.value,
      parent: Number((ref_mark.current.value as any).split(",")[0]),
      origine: Number((ref_mark.current.value).split(",")[1]),
      admin:(OneUser.data as any)?.person?.id
    }
    
    dispatch(AddMarkAsyncThunk(data as any))
    


  };

  const addMarkProd = (e: FormEvent) => {
    e.preventDefault()
    const data = {
      family_name: nom_level.current?.value as any,
      level: levelId,
      description: desc_mark.current.value,
      parent: null,
      origine: Number(pays.current.value),
      admin:(OneUser.data as any)?.person?.id
    }
    
    dispatch(AddMarkAsyncThunk(data as any))


  };
  const addMark = (e: FormEvent) => {
    e.preventDefault()
    const data = {
      family_name: nom_level.current?.value as any,
      level: levelId,
      description: desc_mark.current.value,
      parent: Number(pays.current.value),
      origine: Number(pays.current.value),
      admin:(OneUser.data as any)?.person?.id
    }
    
    
    dispatch(AddMarkAsyncThunk(data as any))


  };






  const [levelList, setLevelList] = useState([])
  const [OrigineList, setOrigineList] = useState([])
  const LevelData = useSelector((state: RootState) => state.LevelSlice)
  const AllOrigine = useSelector((state: RootState) => state.OrigineSlice)
  const AddOrigineSlice = useSelector((state: RootState) => state.AddOrigineSlice)
  const AddSerieSlice = useSelector((state: RootState) => state.AddSerieSlice)
  const Mark = useSelector((state: RootState) => state.MarkSlice)
  const AddMarkSlice = useSelector((state: RootState) => state.AddMarkSlice)
  const Modele = useSelector((state: RootState) => state.ModeleSlice)
  const Serie = useSelector((state: RootState) => state.SerieSlice)
  const MarkProd = useSelector((state: RootState) => state.MarkProductSlice)

  const [marquesProd, setMarquesProd] = useState<Marque[]>(MarkProd.data);
  const [marques, setMarques] = useState<Marque[]>(Mark.data);
  const [modeles, setModeles] = useState<Modele[]>(Modele.data);
  const [origines, setOrigines] = useState<Origine[]>(AllOrigine.data);
  const [series, setSeries] = useState<Serie[]>(Serie.data);


  
  
  
  useEffect(() => {
    dispatch(LevelAsyncThunk())
    dispatch(MarkProductAsyncThunk())
    dispatch(OrigineAsyncThunk())
    dispatch(SerieAsyncThunk())
    dispatch(MarkAsyncThunk())
    dispatch(ModeleAsyncThunk())
  }, [])
  useEffect(() => {
    setLevelList(LevelData.data)
  }, [LevelData.loading])

  useEffect(() => {
    setOrigines(AllOrigine.data)
  }, [AllOrigine.data])
  useEffect(() => {
    dispatch(OrigineAsyncThunk())
    dispatch(LevelAsyncThunk())
    dispatch(MarkProductAsyncThunk())
    dispatch(OrigineAsyncThunk())
    dispatch(SerieAsyncThunk())
    dispatch(MarkAsyncThunk())
    dispatch(ModeleAsyncThunk())
    if(!AddOrigineSlice.loading){
      setAddModalOpen(false)
    }

  }, [AddOrigineSlice.loading])
  useEffect(() => {
    dispatch(LevelAsyncThunk())
    dispatch(MarkProductAsyncThunk())
    dispatch(OrigineAsyncThunk())
    dispatch(SerieAsyncThunk())
    dispatch(MarkAsyncThunk())
    dispatch(ModeleAsyncThunk())
    if(!AddMarkSlice.loading){
      setAddModalOpen(false)
    }

  }, [AddMarkSlice.loading, AddSerieSlice.loading])
  useEffect(() => {
    setMarquesProd(MarkProd.data)
  }, [MarkProd.data])
  useEffect(() => {
    setMarques(Mark.data)
  }, [Mark.data])
  useEffect(() => {
    setMarques(Mark.data)
  }, [Mark.data])
  useEffect(() => {
    setSeries(Serie.data)
  }, [Serie.data])
  useEffect(() => {
    setModeles(Modele.data)
  }, [Modele.data])



  return (
    <>
      {/* Modal principale */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Gestion des Références Pièces </DialogTitle>
            <DialogDescription>
              Gérez les références pour les origines, marques, modèles et séries de pièces.
            </DialogDescription>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className=" w-full flex justify-between">
              <div className="flex gap-3">
                <div className="px-4 py-1 text-sm cursor-pointer" style={{ background: levelId == 0 ? "white" : "" }} onClick={() => { setLevelName("origine"), setLevelId(0) }}>Origine</div>
                {/* <div className="px-4 text-sm py-1 cursor-pointer" style={{ background: levelList[3]?.id == levelId ? "white" : "" }} onClick={() => { setLevelName(levelList[3]?.level.toLowerCase()), setLevelId(levelList[3]?.id) }}  >Marques Produit</div> */}
                <div className="px-4 text-sm py-1 cursor-pointer" style={{ background: levelList[0]?.id == levelId ? "white" : "" }} onClick={() => { setLevelName(levelList[0]?.level.toLowerCase()), setLevelId(levelList[0]?.id) }}   >Marques</div>
                <div className="px-4 text-sm py-1 cursor-pointer" style={{ background: levelList[1]?.id == levelId ? "white" : "" }} onClick={() => { setLevelName(levelList[1]?.level.toLowerCase()), setLevelId(levelList[1]?.id) }} >Modèles</div>
                <div className="px-4 text-sm py-1 cursor-pointer" style={{ background: levelList[2]?.id == levelId ? "white" : "" }} onClick={() => { setLevelName(levelList[2]?.level.toLowerCase()), setLevelId(levelList[2]?.id) }} >Séries</div>
              </div>
              <Button onClick={() => { resetAddForm(); setAddModalOpen(true); }}>
                <Plus className="h-4 w-4 mr-1" />
              </Button>
            </TabsList>

            <TabsContent value="origines" className="mt-4">
              {renderReferenceTable("origines", "Origine")}
            </TabsContent>

            <TabsContent value="marques" className="mt-4">
              {renderReferenceTable("marques", "Marque")}
            </TabsContent>

            <TabsContent value="modeles" className="mt-4">
              {renderReferenceTable("modeles", "Modèle")}
            </TabsContent>

            <TabsContent value="series" className="mt-4">
              {renderReferenceTable("series", "Série")}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter {levelName} </DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer une nouvelle {levelName}.
            </DialogDescription>
          </DialogHeader>
          <form action="" onSubmit={handleSubmit(addOrigine)}>

            {
              levelName == "origine" &&
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nom *</label>
                    <Input
                      placeholder={`Nom de ${levelName}`}
                      {...register("pays", { required: "pays is required" })}
                    />
                  </div>

                  <div className="hidden">
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea
                      placeholder="Description"
                      rows={3}
                      defaultValue={"ok"}
                      {...register("description")}
                    />
                  </div>


                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button >
                    {AddOrigineSlice.loading ? "Ajoute en cours" : "Ajouter"}

                  </Button>
                </div>
              </div>
            }
          </form>

          {
            levelName == "marque" && <form action="" onSubmit={(e) => addMark(e)}>


              <div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nom *</label>
                    <Input
                      placeholder={`Nom de ${levelName}`}
                      ref={nom_level}
                    />
                  </div>

                  <div className="hidden">
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea
                    defaultValue={"ok"}
                      placeholder="Description"
                      rows={3}
                      ref={desc_mark}
                    />
                  </div>

                  {/* <div>
                    <label className="text-sm font-medium mb-1 block">Marque produit *</label>

                    <select name="" className="w-full outline-none border border-blue-200 px-3 py-2 mt-3" id="" ref={pays} >
                      {deleteDoublons(marquesProd).map((option: MarqueProd) => (
                        <option key={option.id} value={option.id}>
                          {option.family_name}
                        </option>
                      ))}

                    </select>

                  </div> */}

<div>
                    <label className="text-sm font-medium mb-1 block">Origine *</label>

                    <select name="" className="w-full outline-none border border-blue-200 px-3 py-2 mt-3" id="" ref={pays} >
                      {origines.map((option: Origine) => (
                        <option key={option.id} value={option.id}>
                          {option.pays}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button >
                    {AddMarkSlice.loading ? "Ajoute en cours" : "Ajouter"}

                  </Button>
                </div>
              </div>

            </form>}
          {
            levelName == "marque_produit" && <form action="" onSubmit={(e) => addMarkProd(e)}>


              <div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nom *</label>
                    <Input
                      placeholder={`Nom de ${levelName}`}
                      ref={nom_level}
                    />
                  </div>

                  <div className="hidden">
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea
                    defaultValue={"."}
                      placeholder="Description"
                      rows={3}
                      ref={desc_mark}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Origine *</label>

                    <select name="" className="w-full outline-none border border-blue-200 px-3 py-2 mt-3" id="" ref={pays} >
                      {origines.map((option: Origine) => (
                        <option key={option.id} value={option.id}>
                          {option.pays}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button >
                    {AddMarkSlice.loading ? "Ajoute en cours" : "Ajouter"}

                  </Button>
                </div>
              </div>

            </form>}
          {
            levelName == "serie" && <form action="" onSubmit={(e) => addSerie(e)}>


              <div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nom *</label>
                    <Input
                      placeholder={`Nom de ${levelName}`}
                      ref={nom_modele}
                    />
                  </div>

                  <div className="hidden">
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea
                    defaultValue={"_"}
                      placeholder="Description"
                      rows={3}
                      ref={desc_modele}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Modèle *</label>
                    {/* <Select >
                      {/* <SelectTrigger>
                     <SelectValue placeholder={`Sélectionner ${getRelationLabel("marques").toLowerCase()}`} />
                   </SelectTrigger> */}
                      {/* <SelectContent >
                     {origines.map((option: Origine) => (
                       <SelectItem key={option.id} value={option.pays}>
                         {option.pays}
                       </SelectItem>
                     ))}
                     </SelectContent> */} 
                      <select name="" className="w-full outline-none border border-blue-200 px-3 py-2 mt-3" id="" ref={ref_mark} >
                        {deleteDoublons(modeles).map((option: any) => (
                          <option key={option.id} onClick={() => setModeleOrigine(3)} value={[option.id, option.origine.id]}>
                            {option.family_name} 
                          </option>
                        ))}

                      </select>
                    {/* </Select> */}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button >
                    {AddSerieSlice.loading ? "Ajoute en cours" : "Ajouter"}

                  </Button>
                </div>
              </div>

            </form>}
          {
            levelName == "modele" && <form action="" onSubmit={(e) => addModele(e)}>


              <div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nom *</label>
                    <Input
                      placeholder={`Nom de ${levelName}`}
                      ref={nom_modele}
                    />
                  </div>

                  <div className="hidden">
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea
                    defaultValue={"_"}
                      placeholder="Description"
                      rows={3}
                      ref={desc_modele}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Marque *</label>

                    <select name="" className="w-full outline-none border border-blue-200 px-3 py-2 mt-3" id="" ref={ref_mark} >
                      {deleteDoublons(marques).map((option: Marque | any) => (
                        <option key={option.id} onClick={() => setModeleOrigine(3)} value={[option.id, option.origine.id ]}>
                          {option.family_name}
                        </option>
                      ))}

                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button >
                    {AddMarkSlice.loading ? "Ajoute en cours" : "Ajouter"}

                  </Button>
                </div>
              </div>

            </form>}

        </DialogContent>
      </Dialog>

      {/* Modal de modification */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modification  de : </DialogTitle>
            <DialogDescription>
              Modifiez les informations de cette {levelName}.
            </DialogDescription>
          </DialogHeader>

          {renderFormFields(editForm, setEditForm)}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={updateReference}>
              {(UpOrigineSlice.loading || UpMarkSlice.loading) ? "Sauvegarde en cours" : "Sauvegarder"}

            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{deleteConfirm?.nom}" ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>  deleteReference(deleteConfirm.type as keyof typeof references, deleteConfirm.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};