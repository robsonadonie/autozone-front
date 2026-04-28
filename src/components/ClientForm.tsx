import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Client } from "@/types/client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { AddClientAsync, ClientAsync, UpdateClientAsync } from "@/redux/Async/ClientAsync";
import { toast } from "@/hooks/use-toast";
import { changeAddClient, changeStatusClient } from "@/redux/slice/ClientSlice";
import { jwtDecode } from "jwt-decode";
import { OneUserAsync } from "@/redux/Async/userAuthAsync";

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: Omit<Client, 'id' | 'dateEnregistrement'>) => void;
  initialData?: Client | null;
  client: number
}

export const ClientForm = ({ isOpen, onClose, onSubmit, initialData, client }: ClientFormProps | any) => {
  const dispatch = useDispatch<AppDispatch>()
  
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
  
  
    //  useEffect(() => {
    //     dispatch(OneUserAsync(decoded.id))
    //   }, [])
    
    
  const [formData, setFormData] = useState({
    id: 0,
    firstName: "",
    name: "",
    adresse: "",
    telephone: "",
    rcs: "",
    stat: "",
    nif: "",
    email: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        firstName: initialData.firstName,
        name: initialData.name,
        adresse: initialData.adresse,
        telephone: initialData.telephone,
        rcs: initialData.rcs,
        stat: initialData.stat,
        nif: initialData.nif,
        email: initialData.email,
      });
    } else {
      setFormData({
        id: 0,
        firstName: "",
        name: "",
        adresse: "",
        telephone: "",
        rcs: "",
        stat: "",
        nif: "",
        email: "",
      });
    }
  }, [initialData, isOpen]);


  const AddClient = useSelector((state: RootState) => state.AddClientSlice)
  const UpClient = useSelector((state: RootState) => state.UpdateClientSlice)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (initialData) {
      let kill = formData.id
      delete formData.id
      // delete formData.rcs
      // delete formData.nif
      // delete formData.stat
      
      dispatch(UpdateClientAsync([{ ...formData}, kill] as any) )

    } else {
      delete formData.id
      dispatch(AddClientAsync({ ...formData,  admin:(OneUser.data as any)?.person?.id } as any))

    }

    // onClose();
  };

  useEffect(() => {
    dispatch(ClientAsync())
    if (!AddClient.loading && AddClient.data == "added") {
      toast({
        title: "ok",
        description: "Client ajouté avec succés",
        variant: "default",
      });
      onClose();
      dispatch(changeAddClient(""))
    }
    if (!UpClient.loading && UpClient.status == "updated") {
      toast({
        title: "ok",
        description: "Client modifié avec succés",
        variant: "default",
      });
      onClose();
      dispatch(changeStatusClient(""))

    }
    if (!UpClient.loading && UpClient.status == "deleted") {
      toast({
        title: "ok",
        description: "Client supprimé avec succés",
        variant: "default",
      });
      onClose();
      dispatch(changeStatusClient(""))

    }

  }, [AddClient.loading, UpClient.loading])


  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier le client" : "Nouveau client"}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations du client ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            <div>
              <Label htmlFor="nom">Nom client *</Label>
              <Input
                id="nom"
                defaultValue={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                
              />
            </div>
            <div>
              <Label htmlFor="telephone">Prenom *</Label>
              <Input
                id="telephone"
                defaultValue={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="adresse">Adresse *</Label>
              <Textarea
                id="adresse"
                defaultValue={formData.adresse}
                onChange={(e) => handleChange('adresse', e.target.value)}
                
                rows={3}
                style={{ resize: "none" }}
              />
            </div>

            <div>
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                defaultValue={formData.telephone}
                onChange={(e) => handleChange('telephone', e.target.value)}
                
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="hidden">
              <Label htmlFor="Code">Numero rcs *</Label>
              <Input
                id="Code"
                defaultValue={formData.rcs}
                onChange={(e) => handleChange('rcs', e.target.value)}
                
              />
            </div>


            <div>
              <Label htmlFor="numeroSTAT">NUMERO STAT</Label>
              <Input
                id="Ville"
                defaultValue={formData.stat}
                onChange={(e) => handleChange('stat', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="pays">Numero NIF</Label>
              <Input
                id="pays"
                defaultValue={formData.nif}
                onChange={(e) => handleChange('nif', e.target.value)}
              />
            </div>

            {/* <div>
              <Label htmlFor="numerorcs">Numéro rcs</Label>
              <Input
                id="numerorcs"
                defaultValue={formData.numerorcs}
                onChange={(e) => handleChange('numerorcs', e.target.value)}
              />
            </div> */}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" >
              {initialData ? (UpClient.loading ? "Modification en cours" : "Modifier") : (AddClient.loading ? "Ajouter en cours" : "Ajouter")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
