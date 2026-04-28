import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Download,
  Key,
  Shield,
  Mail,
  Bell,
  Users,
  Settings,
  Database,
  Palette,
  Globe,
  Calendar,
  CreditCard,
  FileText,
  Printer,
  Phone,
  RefreshCcw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useToast } from "@/hooks/use-toast";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { AddUserAsync, UserAsync } from "@/redux/Async/UserAsync";
import { AboutAsyncThunk, UpdateAboutAsyncThunk } from "@/redux/Async/aboutAsyncThunk";
import { AdduserAuthAsync, AsyncDeletedUser, OneUserAsync, UpdateuserAuthAsync } from "@/redux/Async/userAuthAsync";
import { changeAddClient } from "@/redux/slice/ClientSlice";
import { changeAddUser } from "@/redux/slice/UserSlice";
import { jwtDecode } from "jwt-decode";

// Types
interface TaxRate {
  id: number;
  name: string;
  rate: number;
  code: string;
  default: boolean;
  description?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "vendeur" | "user" | "viewer";
  status: "active" | "inactive";
  lastLogin?: string;
  permissions: string[];
}

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}




const ParametresPage = () => {

  const dispatch = useDispatch<AppDispatch>()
  const OneUser = useSelector((state: RootState) => state.OneUserSlice)

  const { toast } = useToast();

  // Company settingsmop
  const [companySettings, setCompanySettings] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    country: "",
    siret: "",
    vatNumber: "",
    logo: null as File | null
  });

  // System preferences
  const [systemPrefs, setSystemPrefs] = useState({
    currency: "eur",
    dateFormat: "dmY",
    numberFormat: "comma",
    fiscalYear: "calendar",
    timezone: "Europe/Paris",
    language: "fr"
  });

  // Application settings
  const [appSettings, setAppSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    autoSave: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    backupFrequency: "daily"
  });
  const [change, setChange] = useState(false)

  // Modal states
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxRate | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ type: 'tax' | 'user', id: number } | null>(null);
  const [isActived, setIsActived] = useState<{ type: '1' | '0', id: number } | null>(null);

  // Form states
  const [taxForm, setTaxForm] = useState({
    name: "",
    rate: "",
    code: "",
    description: ""
  });
  interface decode {
    id: number,
    email: string,
    status: string,
    createdAt: string,
    role: string,
    person: {
      id: number,
      name: string,
      createdAt: string,
      deletedAt: string,
    }
  }
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
  }) as decode | any;



  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setDecoded(decoded as decode)
    }
  }, [])

  const [act, setAct] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "vendeur" as User["role"],
    permissions: [] as string[]
  });


  // Handlers
  const handleSaveCompanySettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les informations de l'entreprise ont été mises à jour",
    });
  };

  const handleSaveSystemPrefs = () => {
    toast({
      title: "Préférences sauvegardées",
      description: "Les préférences système ont été mises à jour",
    });
  };

  const handleSaveAppSettings = () => {
    toast({
      title: "Configuration sauvegardée",
      description: "Les paramètres d'application ont été mis à jour",
    });
  };

  const handleAddTax = () => {
    setEditingTax(null);
    setTaxForm({ name: "", rate: "", code: "", description: "" });
    setIsTaxModalOpen(true);
  };

  const handleEditTax = (tax: TaxRate) => {
    setEditingTax(tax);
    setTaxForm({
      name: tax.name,
      rate: tax.rate.toString(),
      code: tax.code,
      description: tax.description || ""
    });
    setIsTaxModalOpen(true);
  };

  const handleSaveTax = () => {
    toast({
      title: editingTax ? "Taux modifié" : "Taux ajouté",
      description: editingTax ? "Le taux de TVA a été modifié" : "Le nouveau taux de TVA a été ajouté",
    });
    setIsTaxModalOpen(false);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({ name: "", email: "", role: "user", permissions: [] });
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = () => {

    // setIsUserModalOpen(false);
    const newClient = {
      email: userForm.name,
      password: userForm.email,
      passwordConfirm: userForm.email,
      role: userForm.role
    }
    dispatch(AdduserAuthAsync(newClient as any))
  };
  const confMdp = useRef() as any
  const newMdp = useRef() as any
  const handleUpUser = () => {

    // setIsUserModalOpen(false);

    if(confMdp.current && newMdp.current){
      
      if(confMdp.current.value == newMdp.current.value){
        
        const newClient = {
          email: userForm.name,
          role: userForm.role,
          password : newMdp.current.value
        }
        
        dispatch(UpdateuserAuthAsync([newClient as any, isIdUser] as any))

      }else{
        toast({
          title: "mot de passe",
          variant : "destructive",
          description: "Mot de passe different",
        });
      }
    }else{
      
      const newClient = {
        email: userForm.name,
        role: userForm.role
      }

      // console.log("333",UpdateuserAuthAsync);
      
    dispatch(UpdateuserAuthAsync([newClient as any, isIdUser] as any))
  }
  };

  const handleDelete = (type: 'tax' | 'user', id: number) => {

    dispatch(AsyncDeletedUser(deleteDialog.id))
  };
  const handleDesactived = (type: '1' | '0', id: number) => {

    dispatch(UpdateuserAuthAsync([{ status: isActived.type == "0" ? "1" : "0" }, isActived.id] as any))
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCompanySettings(prev => ({ ...prev, logo: file }));
      toast({
        title: "Logo uploadé",
        description: "Le logo de l'entreprise a été mis à jour",
      });
    }
  };
  const [isUpdateAbout, setIsUpdateAbout] = useState(false);
  const [isIdUser, setIsIdUser] = useState(0);

  const AllUser = useSelector((state: RootState) => state.UserSlice)
  const About = useSelector((state: RootState) => state.AboutSlice) as any
  const AddUserSlice = useSelector((state: RootState) => state.AddUserSlice) as any
  useEffect(() => {
    if (!AddUserSlice.loading && AddUserSlice.status == "created") {
      dispatch(UserAsync())
      toast({
        title: editingUser ? "Utilisateur modifié" : "Utilisateur ajouté",
        description: editingUser ? "L'utilisateur a été modifié" : "Le nouvel utilisateur a été ajouté",
      });
      dispatch(changeAddUser(""))
      dispatch(AboutAsyncThunk())
      dispatch(OneUserAsync(decoded.id))
      setIsUserModalOpen(false)
    }
    if (!AddUserSlice.loading && AddUserSlice.status == "deleted") {
      dispatch(UserAsync())
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé",
      });
      dispatch(changeAddUser(""))
      dispatch(AboutAsyncThunk())
      setIsUserModalOpen(false)
      setDeleteDialog(null);
      dispatch(OneUserAsync(decoded.id))
    }
    if (!AddUserSlice.loading && AddUserSlice.status == "actived") {
      dispatch(UserAsync())
      toast({
        title: "Compte utilisateur",
        description: "Compte utilisateur a été modifiée",
      });
      dispatch(changeAddUser(""))
      dispatch(AboutAsyncThunk())
      dispatch(OneUserAsync(decoded.id))
      setIsUserModalOpen(false)
      setIsActived(null);

    }
  }, [AddUserSlice.loading])
  useEffect(() => {
    dispatch(OneUserAsync(decoded.id))
    dispatch(UserAsync())
    dispatch(AboutAsyncThunk())
  }, [])

  useEffect(() => {
    setCompanySettings({
      name: About.data.nom,
      email: About.data.email,
      phone: About.data.telephone,
      address: About.data.adresse,
      postalCode: About.data.rcs,
      city: "Paris",
      country:About.data.slogan,
      siret: About.data.nif,
      vatNumber: About.data.stat,
      logo: null as File | null
    })
  }, [About.loading])

  const handleExportSettings = () => {
    toast({
      title: "Export en cours",
      description: "Les paramètres sont en cours d'exportation",
    });
  };

  const handleImportSettings = () => {
    toast({
      title: "Import en cours",
      description: "Les paramètres sont en cours d'importation",
    });
  };

  const handleUpdate = () => {
    const data = {
      nom: companySettings.name,
      email: companySettings.email,
      telephone: companySettings.phone,
      adresse: companySettings.address,
      slogan: companySettings.country,
      nif: companySettings.siret,
      rcs: companySettings.postalCode,
      stat: companySettings.vatNumber
    }
    dispatch(UpdateAboutAsyncThunk([About.data.id, data] as any))
  };



  const getRoleBadge = (role: User["role"]) => {
    const variants = {
      admin: "bg-purple-100 text-purple-800",
      manager: "bg-blue-100 text-blue-800",
      user: "bg-green-100 text-green-800",
      viewer: "bg-gray-100 text-gray-800"
    };

    const labels = {
      admin: "Administrateur",
      manager: "Manager",
      user: "Utilisateur",
      viewer: "Lecteur"
    };

    return (
      <Badge className={variants[role]}>
        {labels[role]}
      </Badge>
    );
  };

  const getStatusBadge = (status: User["status"]) => {
    return (
      <Badge className={status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
        {status === "active" ? "Actif" : "Inactif"}
      </Badge>
    );
  };

  const UpdateAbout = useSelector((state: RootState) => state.UpdateAbout)


  useEffect(() => {
    if (!UpdateAbout.loading && UpdateAbout.status == "updated") {
      dispatch(UserAsync())
      dispatch(AboutAsyncThunk())
      toast({
        title: "Configuration sauvegardée",
        description: "Les paramètres d'application ont été mis à jour",
      });
      setIsUpdateAbout(false)
    }
  }, [UpdateAbout.loading])


  return (
    <div className="space-y-3 p-3 pt-0">
      {AddUserSlice.status}
      <Dialog open={isUpdateAbout} onOpenChange={setIsUpdateAbout}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirmer la modification des informations</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir modifier  ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { }}>
              Annuler
            </Button>
            <Button variant="secondary" onClick={() => { handleUpdate() }}>
              {
                UpdateAbout.loading ? "Enrégistrement en cours" : "Enrégistrer"
              }

            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold  tracking-tight " style={{ fontSize: "17px" }}>Paramètres du système</h1>

      </div>
      <div className="selection flex gap-2">
        {
          decoded.role == "admin" &&
          <button onClick={() => { setAct(false) }} style={{ fontSize: "13px" }} className="border rounded bg-gray-100 px-6">Paramètre</button>
        }
        {
          decoded.role == "admin" &&
        <button onClick={() => { setAct(true) }} style={{ fontSize: "13px" }} className="border rounded bg-gray-100 px-6">Mon Compte</button>
        }
      </div>
      <Tabs defaultValue="general" className="w-full">

        {
          (decoded.role == "admin" ? (!act) : act) &&
          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {/* Company Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ fontSize: "14px" }}>
                    <FileText className="h-5 w-5" />
                    Informations de l'entreprise
                  </CardTitle>
                  {/* <CardDescription>Informations générales et coordonnées</CardDescription> */}
                </CardHeader>
                <CardContent className="space-y-4">


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                      <Input
                        id="companyName"
                        value={companySettings.name}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email de contact *</Label>
                      <Input
                        id="email"
                        type="text"
                        value={companySettings.email}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={companySettings.phone}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>


                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Slogan</Label>
                    <Textarea
                      id="address"
                      value={companySettings.country}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, country: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse complète</Label>
                    <Textarea
                      id="address"
                      value={companySettings.address}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, address: e.target.value }))}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">RC</Label>
                      <Input
                        id="postalCode"
                        value={companySettings.postalCode}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, postalCode: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2 hidden">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        value={companySettings.city}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siret">NIF</Label>
                      <Input
                        id="siret"
                        value={companySettings.siret}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, siret: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

                    <div className="space-y-2">
                      <Label htmlFor="vatNumber">STAT</Label>
                      <Input
                        id="vatNumber"
                        value={companySettings.vatNumber}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, vatNumber: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button onClick={() => setIsUpdateAbout(true)} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {/* System Preferences */}


                {/* <TabsContent value="users"> */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2" style={{ fontSize: "14px" }}>
                        <Users className="h-5 w-5" />
                        Gestion des utilisateurs
                      </CardTitle>
                      <CardDescription>Gérez les utilisateurs et leurs permissions</CardDescription>
                    </div>
                    <Button onClick={handleAddUser}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un utilisateur
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Utilisateur</TableHead>
                          <TableHead>Rôle</TableHead>
                          {/* <TableHead>Statut</TableHead> */}
                          {/* <TableHead>Dernière connexion</TableHead> */}
                          {/* <TableHead>Permissions</TableHead> */}
                          <TableHead className="w-32">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {AllUser.data.map((user) => (
                          <TableRow key={user?.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium" style={{ fontSize: "13px" }}>{user?.name}</p>
                                {/* <p className="text-sm text-gray-500">{user.email}</p> */}
                              </div>
                            </TableCell>
                            <TableCell>{user?.user.role}</TableCell>
                            {/* <TableCell>{getStatusBadge(user.status)}</TableCell> */}
                            {/* <TableCell className="text-sm">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : 'Jamais'}
                            </TableCell> */}
                            {/* <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {
                                  user?.user.status == "0" ?
                                    <Badge variant="outline" className="text-xs text-red-500 border-red-500">
                                      Desactivé
                                    </Badge>
                                    :
                                    <Badge variant="outline" className="text-xs text-green-500 border-green-500">
                                      Activé
                                    </Badge>
                                }
                                
                              </div>
                            </TableCell> */}
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => { handleEditUser(user), setUserForm(user), setIsIdUser(user?.user.id) }}>
                                    <Edit className="cursor-pointer h-4 w-4 mr-2" />
                                    Modifier
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => setDeleteDialog({ type: 'user', id: user?.user.id })}
                                    className="text-blue-600"
                                  >
                                    <Trash2 className="cursor-pointer h-4 w-4 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                  {/* {
                                    user?.user.status == "0" ?
                                      <DropdownMenuItem
                                        onClick={() => { setIsActived({ type: user?.user.status, id: user?.user.id }) }}
                                        className="text-green-600"
                                      >
                                        <RefreshCcw className="cursor-pointer h-4 w-4 mr-2" />
                                        Activer
                                      </DropdownMenuItem> :
                                      <DropdownMenuItem
                                        onClick={() => { setIsActived({ type: user?.user.status, id: user?.user.id }) }}
                                        className="text-red-600"
                                      >
                                        <RefreshCcw className="cursor-pointer h-4 w-4 mr-2" />
                                        Desactiver
                                      </DropdownMenuItem>
                                  } */}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>


              </div>
            </div>
          </TabsContent>
        }

        {
          (decoded.role == "admin" ? act : !act) &&
          <div className="monProfil">
            {/* <h2>Mes informations</h2> */}
            <div className="max-w-[500px]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ fontSize: "14px" }}>
                    <FileText className="h-5 w-5" />
                    Mes informations
                  </CardTitle>
                  {/* <CardDescription>Informations générales et coordonnées</CardDescription> */}
                </CardHeader>
                <CardContent className="space-y-4">


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nom Complet *</Label>
                      <Input
                        id="companyName"
                        value={(OneUser.data as any)?.email}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Mot de passe</Label>
                      <Input
                        disabled
                        id="email"
                        type="text"
                        value={"*********"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Type de compte</Label>
                      <Input
                        id="phone" disabled
                        value={decoded.role}
                      />
                    </div>

                  </div>


                  <Button onClick={() => { handleEditUser(decoded), setUserForm(prev => ({ ...prev, name: (OneUser.data as any)?.email })), setIsIdUser(decoded?.id) }} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        }
      </Tabs>


      {/* User Modal */}
      <Dialog open={isUserModalOpen} onOpenChange={()=>{setIsUserModalOpen(false) , setChange(false)}}>
        <DialogContent className="w-[470px] bg-white">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </DialogTitle>
            <DialogDescription>
              {editingUser ? 'Modifiez les informations de l\'utilisateur' : 'Ajoutez un nouvel utilisateur'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="">
              <div>
                <Label htmlFor="userName">Nom complet *</Label>
                <Input
                  id="userName"
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Jean Dupont"
                  className="mt-2"
                />
              </div>
              {
                decoded.id != isIdUser ?

                  <div className="mt-2">
                    <Label htmlFor="userEmail">mot de passe (par defaut) *</Label>
                    <Input
                      id="userEmail"
                      type="password"
                      hidden={!!editingUser}
                      disabled={!!editingUser}
                      value={editingUser?.name || userForm.email}
                      className="mt-2"
                      onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="*******"
                    />
                  </div> :
                  <div className="mt-4">

                    <Label htmlFor="ck" className="flex gap-4">
                      <Input
                        id="ck"
                        type="checkbox"
                        className="w-4 h-4"
                        checked={change}
                        onChange={(e) => setChange(e.target.checked)}
                      />
                      changer le mot de passe 
                    </Label>


                    {
                      change &&
                    <div>

                      <div className="mt-2">
                        <Label htmlFor="userEmail">Nouveau mot de passe</Label>
                        <Input
                          id="userEmail"
                          type="password"
                          className="mt-2"
                          placeholder="*******"
                          ref={newMdp}
                        />
                      </div>
                      <div className="mt-2">
                        <Label htmlFor="userEmail">Confirmer mot de passe </Label>
                        <Input
                          id="userEmail"
                          type="password"
                          className="mt-2"
                          placeholder="*******"
                          ref={confMdp}
                        />
                      </div>
                    </div>
                      }
                  </div>

              }

            </div>
            {
              decoded.id != isIdUser &&
              <div>
                <Label htmlFor="userRole">Rôle *</Label>
                <Select value={userForm.role} onValueChange={(value: User["role"]) => setUserForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="vendeur">Vendeur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }


          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>
              Annuler
            </Button>
            <Button disabled={AddUserSlice.loading} onClick={editingUser ? handleUpUser : handleSaveUser}>
              {editingUser ? (AddUserSlice.loading ? "Modification en cours ..." : 'Modifier') : (AddUserSlice.loading ? "Ajoute en cours ..." : 'Ajouter')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog && handleDelete(deleteDialog.type, deleteDialog.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              {AddUserSlice.loading ? "Suppression en cours" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!isActived}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer {isActived?.type == "0" ? "l'activation" : 'la desactivation'}</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir desactiver cet utilisateur ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsActived(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => isActived && handleDesactived(isActived.type, isActived.id)}
              className={isActived?.type == "0" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-oragne-700"}
            >
              {AddUserSlice.loading ? "Modification en cours" : (isActived?.type == "0" ? "Activer" : "Desactiver")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ParametresPage;