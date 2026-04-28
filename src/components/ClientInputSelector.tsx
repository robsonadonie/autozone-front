import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Edit3 } from "lucide-react";

interface ClientData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
}

interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
}

interface ClientInputSelectorProps {
  clientData: ClientData;
  onClientDataChange: (data: ClientData) => void;
}

// Mock data pour les clients existants
const mockClients: Client[] = [
  {
    id: "C-001",
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.com",
    telephone: "06 12 34 56 78",
    adresse: "123 Rue de la Paix",
    ville: "Paris",
    codePostal: "75001"
  },
  {
    id: "C-002",
    nom: "Martin",
    prenom: "Marie",
    email: "marie.martin@email.com",
    telephone: "06 98 76 54 32",
    adresse: "456 Avenue des Champs",
    ville: "Lyon",
    codePostal: "69000"
  },
  {
    id: "C-003",
    nom: "Bernard",
    prenom: "Pierre",
    email: "pierre.bernard@email.com",
    telephone: "06 11 22 33 44",
    adresse: "789 Boulevard Victor Hugo",
    ville: "Marseille",
    codePostal: "13000"
  }
];

export const ClientInputSelector = ({ clientData, onClientDataChange }: ClientInputSelectorProps) => {
  const [inputMode, setInputMode] = useState<"select" | "manual">("select");
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const handleClientSelect = (clientId: string) => {
    if (clientId === "manual") {
      setInputMode("manual");
      setSelectedClientId("");
      // Reset client data when switching to manual
      onClientDataChange({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        ville: "",
        codePostal: ""
      });
    } else {
      const client = mockClients.find(c => c.id === clientId);
      if (client) {
        setSelectedClientId(clientId);
        onClientDataChange({
          nom: client.nom,
          prenom: client.prenom,
          email: client.email,
          telephone: client.telephone,
          adresse: client.adresse,
          ville: client.ville,
          codePostal: client.codePostal
        });
      }
    }
  };

  const handleInputChange = (field: keyof ClientData, value: string) => {
    onClientDataChange({
      ...clientData,
      [field]: value
    });
  };

  const switchToManual = () => {
    setInputMode("manual");
    setSelectedClientId("");
  };

  const switchToSelect = () => {
    setInputMode("select");
    onClientDataChange({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      adresse: "",
      ville: "",
      codePostal: ""
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Informations client</h3>
        
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={inputMode === "select" ? "default" : "outline"}
            size="sm"
            onClick={switchToSelect}
          >
            <User className="h-4 w-4 mr-2" />
            Sélectionner
          </Button>
          <Button
            type="button"
            variant={inputMode === "manual" ? "default" : "outline"}
            size="sm"
            onClick={switchToManual}
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Saisie manuelle
          </Button>
        </div>
      </div>

      {inputMode === "select" ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="clientSelect">Choisir un client</Label>
            <Select onValueChange={handleClientSelect} value={selectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client..." />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center space-x-2">
                      <span>{client.prenom} {client.nom}</span>
                      <Badge variant="outline" className="text-xs">
                        {client.id}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
                <SelectItem value="manual">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Edit3 className="h-4 w-4" />
                    <span>Saisie manuelle</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Affichage des informations du client sélectionné */}
          {selectedClientId && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Nom :</strong> {clientData.nom}</p>
                  <p><strong>Prénom :</strong> {clientData.prenom}</p>
                  <p><strong>Email :</strong> {clientData.email}</p>
                </div>
                <div>
                  <p><strong>Téléphone :</strong> {clientData.telephone}</p>
                  <p><strong>Adresse :</strong> {clientData.adresse}</p>
                  <p><strong>Ville :</strong> {clientData.ville} {clientData.codePostal}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={clientData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                placeholder="Nom du client"
              />
            </div>
            
            <div>
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={clientData.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                placeholder="Prénom du client"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={clientData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@exemple.com"
              />
            </div>
            
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={clientData.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="adresse">Adresse</Label>
            <Textarea
              id="adresse"
              value={clientData.adresse}
              onChange={(e) => handleInputChange('adresse', e.target.value)}
              placeholder="Adresse complète du client"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                value={clientData.ville}
                onChange={(e) => handleInputChange('ville', e.target.value)}
                placeholder="Ville"
              />
            </div>
            
            <div>
              <Label htmlFor="codePostal">Code postal</Label>
              <Input
                id="codePostal"
                value={clientData.codePostal}
                onChange={(e) => handleInputChange('codePostal', e.target.value)}
                placeholder="75000"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};