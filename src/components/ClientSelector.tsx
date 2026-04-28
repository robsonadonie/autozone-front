import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { ClientAsync } from "@/redux/Async/ClientAsync";

interface Client {
  id: string;
  name: string;
  firstName: string;
  email: string;
  telephone: string;
  adresse: string;
  rc: string;
  stat: string;
  nif: string;
}

interface ClientSelectorProps {
  selectedClient: Client | null;
  onClientSelect: (client: Client | null) => void;
}

// Mock data pour les clients

// const mockClients: Client[] = [
//   {
//     id: "C-001",
//     nom: "Dupont",
//     prenom: "Jean",
//     email: "jean.dupont@email.com",
//     telephone: "06 12 34 56 78",
//     adresse: "123 Rue de la Paix",
//     ville: "Paris",
//     codePostal: "75001"
//   },
//   {
//     id: "C-002",
//     nom: "Martin",
//     prenom: "Marie",
//     email: "marie.martin@email.com",
//     telephone: "06 98 76 54 32",
//     adresse: "456 Avenue des Champs",
//     ville: "Lyon",
//     codePostal: "69000"
//   },
//   {
  //     id: "C-003",
  //     nom: "Bernard",
//     prenom: "Pierre",
//     email: "pierre.bernard@email.com",
//     telephone: "06 11 22 33 44",
//     adresse: "789 Boulevard Victor Hugo",
//     ville: "Marseille",
//     codePostal: "13000"
//   }
// ];

export function ClientSelector({ selectedClient, onClientSelect }: ClientSelectorProps) {
const AllClient =  useSelector((state : RootState)=>state.ClientSlice.data).filter((client) =>client.status =="fidele" )
const mockClients: Client[] = AllClient || []

  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: "",
    firstName: "",
    email: "",
    telephone: "",
    adresse: "",
    rc: "",
    stat: "",
    nif: "",
  });
  const handleCreateClient = () => {
    
    const client: Client = {
      id: `newClient`,
      name: newClient.name || "",
      firstName: newClient.firstName || "",
      email: newClient.email || "",
      telephone: newClient.telephone || "",
      adresse: newClient.adresse || "",
      rc: newClient.rc || "",
      stat: newClient.stat || "",
      nif: newClient.nif || "",
    };
    
    onClientSelect(client);
    setIsNewClientModalOpen(false);
    setNewClient({
      name: "",
      firstName: "",
      email: "",
      telephone: "",
      adresse: "",
      rc: "",
      stat: "",
      nif: ""
    });
  };


  const dispatch = useDispatch<AppDispatch>()
  
  useEffect(()=>{
    dispatch(ClientAsync())
  },[])
  return (
    <>
      <div className="space-y-3">
        <Label className="text-sm font-medium">Client</Label>
        
        {selectedClient ? (
          <div className="flex items-center justify-between p-3 border rounded-md bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {(selectedClient.firstName.trim() || selectedClient.name.trim()) ? (selectedClient.firstName+" "+selectedClient.name) :  "Non renséigné"}
                </p>
                <p className="text-sm text-gray-600">{selectedClient.email || selectedClient.telephone}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onClientSelect(null)}
            >
              Changer
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Select onValueChange={(value : string | number) => {
              value = (value) as number | string
              if (value == "new") {
               
                setIsNewClientModalOpen(true);
              } else {
                const client = mockClients.find(c => Number(c.id) == Number(value));
                onClientSelect(client || client);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client..." />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="new" className="sticky -top-1 z-30 bg-white">
                  <div className="flex items-center space-x-2 text-blue-600" >
                    <Plus className="h-4 w-4" />
                    <span  onClick={()=>{setIsNewClientModalOpen(true)}}>Nouveau client</span>
                  </div>
                </SelectItem>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center space-x-2">
                      <span>{client.firstName} {client.name}</span>
                      {/* <Badge variant="outline" className="text-xs">
                        {client.id}
                      </Badge> */}
                    </div>
                  </SelectItem>
                ))}
              
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Modal de création de nouveau client */}
      <Dialog open={isNewClientModalOpen} onOpenChange={setIsNewClientModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau client</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={newClient.firstName || ""}
                  onChange={(e) => setNewClient(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Jean"
                />
              </div>
              <div>
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={newClient.name || ""}
                  onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Dupont"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newClient.email || ""}
                onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                placeholder="jean.dupont@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={newClient.telephone || ""}
                onChange={(e) => setNewClient(prev => ({ ...prev, telephone: e.target.value }))}
                placeholder="06 12 34 56 78"
              />
            </div>
            
            <div>
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                value={newClient.adresse || ""}
                onChange={(e) => setNewClient(prev => ({ ...prev, adresse: e.target.value }))}
                placeholder="123 Rue de la Paix"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="hidden">
                <Label htmlFor="rc">Numero RC</Label>
                <Input
                  id="rc"
                  value={newClient.rc || ""}
                  onChange={(e) => setNewClient(prev => ({ ...prev, rc: e.target.value }))}
                  placeholder="Paris"
                />
              </div>
            </div>
              <div>
                <Label htmlFor="nif">Numero STAT</Label>
                <Input
                  id="nif"
                  defaultValue={newClient.stat || ""}
                  onChange={(e) => setNewClient(prev => ({ ...prev, stat: e.target.value }))}
                  placeholder="75001"
                />
              </div>
              <div>
                <Label htmlFor="nif">Numero NIF</Label>
                <Input
                  id="nif"
                  defaultValue={newClient.nif || ""}
                  onChange={(e) => setNewClient(prev => ({ ...prev, nif: e.target.value }))}
                  placeholder="75001"
                />
              </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewClientModalOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleCreateClient}
            >
              Créer le client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}