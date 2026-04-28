import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface Supplier {
  id?: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  website: string;
  siret: string;
  tva: string;
  status: string;
  paymentTerms: string;
  deliveryTime: string;
  minOrder: string;
  categories: string[];
  notes: string;
}

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (supplier: Supplier) => void;
  initialData?: Supplier | null;
}

const categories = [
  "Électronique", "Informatique", "Mobilier", "Fournitures", "Outillage", 
  "Textile", "Alimentaire", "Chimie", "Automobile", "Construction"
];

export const SupplierForm = ({ isOpen, onClose, onSubmit, initialData }: SupplierFormProps) => {
  const [formData, setFormData] = useState<Supplier>({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    website: "",
    siret: "",
    tva: "",
    status: "Actif",
    paymentTerms: "30 jours",
    deliveryTime: "1-2 semaines",
    minOrder: "0",
    categories: [],
    notes: "",
    ...initialData
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categories || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, categories: selectedCategories });
    onClose();
  };

  const addCategory = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier le fournisseur" : "Nouveau fournisseur"}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations du fournisseur ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations générales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations générales</h3>
              
              <div>
                <Label htmlFor="name">Nom du fournisseur *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contact">Personne de contact *</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="website">Site web</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Adresse */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Adresse</h3>
              
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Pays</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => setFormData({...formData, country: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Belgique">Belgique</SelectItem>
                    <SelectItem value="Suisse">Suisse</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations légales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations légales</h3>
              
              <div>
                <Label htmlFor="siret">SIRET</Label>
                <Input
                  id="siret"
                  value={formData.siret}
                  onChange={(e) => setFormData({...formData, siret: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="tva">N° TVA</Label>
                <Input
                  id="tva"
                  value={formData.tva}
                  onChange={(e) => setFormData({...formData, tva: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Inactif">Inactif</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Conditions commerciales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Conditions commerciales</h3>
              
              <div>
                <Label htmlFor="paymentTerms">Conditions de paiement</Label>
                <Select
                  value={formData.paymentTerms}
                  onValueChange={(value) => setFormData({...formData, paymentTerms: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Comptant">Comptant</SelectItem>
                    <SelectItem value="15 jours">15 jours</SelectItem>
                    <SelectItem value="30 jours">30 jours</SelectItem>
                    <SelectItem value="45 jours">45 jours</SelectItem>
                    <SelectItem value="60 jours">60 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="deliveryTime">Délai de livraison</Label>
                <Input
                  id="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
                  placeholder="Ex: 1-2 semaines"
                />
              </div>

              <div>
                <Label htmlFor="minOrder">Commande minimum (€)</Label>
                <Input
                  id="minOrder"
                  type="number"
                  value={formData.minOrder}
                  onChange={(e) => setFormData({...formData, minOrder: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Catégories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Catégories de produits</h3>
            
            <div>
              <Label>Ajouter une catégorie</Label>
              <Select onValueChange={addCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(category => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeCategory(category)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={4}
              placeholder="Notes additionnelles..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {initialData ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};