import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Label } from "@/components/ui/label";
  import { Badge } from "@/components/ui/badge";
  import { Edit, History, Plus, UserPlus, View, X } from "lucide-react";
  import { Client } from "@/types/client";
  import CountUp from 'react-countup'
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { OneUserAsync } from "@/redux/Async/userAuthAsync";
  interface ClientDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: Client | null;
    onEdit: (client: Client) => void;
    onViewHistory: (client: Client) => void;
  }
  
  export const ClientDetailModal = ({ 
    isOpen, 
    onClose, 
    client, 
    onEdit,
    data,
    onViewHistory ,
    createVnt
  }: ClientDetailModalProps | any) => {
    if (!client) return null;
  
 const   mySelle : {total_TTC: number,quantite:number}[] = data.filter((item)=>item.client.id == client.id)
    

 
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
  
  const dispatch = useDispatch<AppDispatch>()
    
    
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
 
 const CA = mySelle.map((e)=>(e.total_TTC)).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
 const Qts = mySelle.map((e)=>(e.quantite)).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Fiche client détaillée
            </DialogTitle>
            <DialogDescription>
              Informations complètes du client sélectionné
            </DialogDescription>
          </DialogHeader>
  
          <div className="space-y-6">
            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                {/* <div>
                  <Label className="text-sm font-medium text-muted-foreground">Numéro client</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className="font-mono">
                      {client.numeroClient}
                    </Badge>
                  </div>
                </div> */}
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nom du client</Label>
                  <div className="mt-1 font-medium text-lg" style={{fontSize :"15px"}}>{client.name} {client.firstName}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Téléphone</Label>
                  <div className="mt-1 font-mono text-sm bg-blue-50 p-2 rounded border">
                    {client.telephone}
                  </div>
                </div>
  
               
              </div>
  
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date d'enregistrement</Label>
                  <div className="mt-1 font-medium">
                    {new Date().toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
  
                
  
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <div className="mt-1 text-sm bg-green-50 p-2 rounded border">
                    {client.email || "Non renseigné"}
                  </div>
                </div>
                {/* <div>
                  <Label className="text-sm font-medium text-muted-foreground">Ville</Label>
                  <div className="mt-1 text-sm bg-green-50 p-2 rounded border">
                    {client.ville || "Non renseigné"}
                  </div>
                </div> */}
              </div>
            </div>
            <div>
                  <Label className="text-sm font-medium text-muted-foreground">Adresse complète</Label>
                  <div className="mt-1 text-sm bg-gray-50 p-3 rounded-md border">
                    {client.adresse}
                  </div>
                </div>
  
            {/* Informations fiscales */}
            <div>
              <Label className="text-lg font-medium mb-3 block" style={{fontSize :"15px"}}>Informations fiscales</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <Label className="text-xs font-medium text-muted-foreground">Numéro STAT</Label>
                  <div className="mt-1 font-mono text-sm">
                    {client.stat || "Non renseigné"}
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <Label className="text-xs font-medium text-muted-foreground">Numéro NIF</Label>
                  <div className="mt-1 font-mono text-sm">
                    {client.nif || "Non renseigné"}
                  </div>
                </div>
                
                {/* <div className="p-3 bg-gray-50 rounded-lg border">
                  <Label className="text-xs font-medium text-muted-foreground">Numéro RC</Label>
                  <div className="mt-1 font-mono text-sm">
                    {client.rcs || "Non renseigné"}
                  </div>
                </div> */}
              </div>
            </div>
  
            {/* Statistiques rapides */}
            <div>
              <Label className="text-lg font-semibold mb-3 block"  style={{fontSize :"15px"}}> Résumé des activités</Label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {/* <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                  <div className="text-xl font-bold text-blue-600">12</div>
                  <div className="text-xs text-blue-600">Factures</div>
                </div> */}
                <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                  <div className="text-xl font-bold text-green-600">{CA} Ar</div>
                  <div className="text-xs text-green-600">Achat au Total</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 text-center">
                  <div className="text-xl font-bold text-orange-700">{Qts} </div>
                  <div className="text-xs text-orange-700">Quantité achétée</div>
                </div>
                {/* <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
                  <div className="text-xl font-bold text-purple-600">3 mois</div>
                  <div className="text-xs text-purple-600">Dernière commande</div>
                </div> */}
              </div>
            </div>
  
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button disabled={decoded.role != "admin"}
                onClick={() => onEdit(client)}
                className="flex-1"
                size="lg"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier le client
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => createVnt()}
                className="flex-1"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
               Créer une Vente
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => onViewHistory(client)}
                className="flex-1"
                size="lg"
              >
                <View className="h-4 w-4 mr-2" />
                Voir l'historique
              </Button>
  
              {/* <Button 
                variant="ghost"
                onClick={onClose}
                size="lg"
              >
                <X className="h-4 w-4 mr-2" />
                Fermer
              </Button> */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  