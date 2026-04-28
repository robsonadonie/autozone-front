import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieceFormData, createEmptyPieceFormData, convertFormDataToPiece } from "@/models/piece";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { LevelAsyncThunk } from "@/redux/Async/level.asyncThunk";
import { OrigineAsyncThunk } from "@/redux/Async/origine.async";
import { SerieAsyncThunk } from "@/redux/Async/serie.async";
import { MarkAsyncThunk } from "@/redux/Async/mark.async";
import { ModeleAsyncThunk } from "@/redux/Async/modele.async";
import { StockAsync, UpStockAsync } from "@/redux/Async/stockAsync";
import { ProductFormData } from "@/models/product";
import { jwtDecode } from "jwt-decode";
import { OneUserAsync } from "@/redux/Async/userAuthAsync";

interface PieceFormProps {
  onSubmit: (pieceData: ReturnType<typeof convertFormDataToPiece>) => void;
  onCancel: () => void;
  initialData?: Partial<PieceFormData>;
  referenceData?: { id: number, family_name: string }[]
}


export const PieceForm = ({ onSubmit, onCancel, initialData, reference }: PieceFormProps | any) => {

  const dispatch = useDispatch<AppDispatch>()
  function deleteDoublons(f) {

    let rest = []
    for (let index = 0; index < f.length; index++) {

      if (!rest.find((i) => i.family_name == f[index].family_name)) {
        rest = [...rest, f[index]]
      }

    }

    return rest
  }

  const OneUser = useSelector((state: RootState) => state.OneUserSlice) as any
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




  const [formData, setFormData] = useState<PieceFormData>({
    ...createEmptyPieceFormData(),
    ...initialData,
    ...reference
  });


    

  const categories = [
    "VITRE",
    "FREIN",
    "ENTRETIEN",
    "SUSPENSION",
    "MOTEUR",
    "CARROSSERIE",
    "ÉLECTRICITÉ",
    "TRANSMISSION",
    "DIRECTION",
    "CLIMATISATION"
  ];

  // Données hiérarchiques organisées par origine -> marque -> modèle -> série
  const hierarchicalData = {
    "Origine": {
      "BOSCH": {
        "308": ["Premium", "Standard", "Sport"],
        "C4": ["Comfort", "Premium"],
        "Golf": ["GTI", "R-Line", "Trendline"]
      },
      "VALEO": {
        "308": ["Eco", "Premium"],
        "Clio": ["Expression", "Dynamique"],
        "Corsa": ["Essential", "GS"]
      },
      "MANN": {
        "Serie 3": ["Luxury", "M Sport"],
        "A3": ["Attraction", "Ambition"],
        "Focus": ["Trend", "Titanium"]
      }
    },
    "Adaptable": {
      "FEBI": {
        "308": ["Universal", "Plus"],
        "C4": ["Standard", "Enhanced"],
        "Clio": ["Basic", "Advanced"]
      },
      "GATES": {
        "Golf": ["Standard", "Performance"],
        "Focus": ["Essential", "Sport"],
        "Corsa": ["Base", "Pro"]
      },
      "DAYCO": {
        "Serie 3": ["Classic", "Performance"],
        "A3": ["Standard", "Sport"],
        "308": ["Eco", "Performance"]
      }
    },
    "Occasion": {
      "CONTINENTAL": {
        "308": ["Reconditionné", "Vérifié"],
        "C4": ["Standard", "Premium"],
        "Golf": ["Basic", "Enhanced"]
      },
      "MONROE": {
        "Focus": ["Restored", "Checked"],
        "Clio": ["Standard", "Plus"],
        "Serie 3": ["Verified", "Premium"]
      }
    }
  };

  const AllOrigine = useSelector((state: RootState) => state.OrigineSlice)
  const AddStock = useSelector((state: RootState) => state.AddStockSlice)
  const UpStockSlice = useSelector((state: RootState) => state.UpStockSlice)
  const Mark = useSelector((state: RootState) => state.MarkSlice)
  const MarkProd = useSelector((state: RootState) => state.MarkProductSlice)
  const Modele = useSelector((state: RootState) => state.ModeleSlice)
  const Serie = useSelector((state: RootState) => state.SerieSlice)
  const resetDependentFields = (level: 'origine' | 'marqueProduit' | 'marque' | 'modele') => {
    const updates: Partial<ProductFormData | any> = {};

    if (level === 'origine') {
      updates.marque = '';
      updates.modele = '';
      updates.serie = '';
    }  else if (level === 'marque') {
      updates.modele = '';
      updates.serie = '';
    } else if (level === 'modele') {
      updates.serie = '';
    }

    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleProductFormChange = (field: keyof ProductFormData | any, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Réinitialiser les champs dépendants si nécessaire
    if (field === 'origine') {
      resetDependentFields('origine');
    }  else if (field === 'marque') {
      resetDependentFields('marque');
    } else if (field === 'modele') {
      resetDependentFields('modele');
    } else if (field === 'designation') {
      resetDependentFields('designation' as any);
    }
  };



  const referenceData = {
    origines: [
      ...AllOrigine.data
    ],
    marquesProduit: deleteDoublons([
      // Marques japonaises
      ...MarkProd.data
    ]),
    marques: deleteDoublons([
      // Marques japonaises
      ...Mark.data
    ]),
    modeles: deleteDoublons([...Modele.data]),
    series: deleteDoublons([...Serie.data]),
  };



  const getAvailableMarquesProduit = () => {

    // if (!formData.origine) return [];
    // return  [];
    return referenceData.marquesProduit.filter((item) => item.origine.pays == (referenceData.origines.find((item) => item.pays == formData.origine))?.pays) || [];
  };

  const getAvailableMarques = () => {
    // if (!formData.marqueProduit) return [];
    // return referenceData.marques.filter((item) => item.parent?.family_name == (referenceData.marquesProduit.find((item) => item.family_name == formData.marqueProduit))?.family_name) || [];


    if (!formData.origine) return [];
    
    return referenceData.marques.filter((item) =>item.origine.pays == (referenceData.origines.find((item) => item.pays == formData.origine))?.pays) || [];
    
  };
  
  const getAvailableModeles = () => {
    if (!formData.marque) return [];
    return referenceData.modeles.filter((item) => item.parent?.family_name == (referenceData.marques.find((item) => item.family_name == formData.marque))?.family_name) || [];
  };

  const getAvailableSeries = () => {
    if (!formData.modele) return [];
    return referenceData.series.filter((item) => item.parent?.family_name == (referenceData.modeles.find((item) => item.family_name == formData.modele))?.family_name) || [];
  };




  const { toast } = useToast();

  // Calculer les options disponibles en fonction des sélections
  const availableOrigines = useMemo(() => {
    return Object.keys(hierarchicalData);
  }, []);

  const availableMarques = useMemo(() => {
    if (!formData.origine || !hierarchicalData[formData.origine as keyof typeof hierarchicalData]) {
      return [];
    }
    return Object.keys(hierarchicalData[formData.origine as keyof typeof hierarchicalData]);
  }, [formData.origine]);

  const availableModeles = useMemo(() => {
    if (!formData.origine || !formData.marque) {
      return [];
    }
    const origineData = hierarchicalData[formData.origine as keyof typeof hierarchicalData];
    if (!origineData || !origineData[formData.marque as keyof typeof origineData]) {
      return [];
    }
    return Object.keys(origineData[formData.marque as keyof typeof origineData]);
  }, [formData.origine, formData.marque]);

  const availableSeries = useMemo(() => {
    if (!formData.origine || !formData.marque || !formData.modele) {
      return [];
    }
    const origineData = hierarchicalData[formData.origine as keyof typeof hierarchicalData];
    if (!origineData) return [];
    const marqueData = origineData[formData.marque as keyof typeof origineData];
    if (!marqueData) return [];
    return marqueData[formData.modele as keyof typeof marqueData] || [];
  }, [formData.origine, formData.marque, formData.modele]);


  useEffect(() => {
    dispatch(LevelAsyncThunk())
    dispatch(OrigineAsyncThunk())
    dispatch(SerieAsyncThunk())
    dispatch(MarkAsyncThunk())
    dispatch(ModeleAsyncThunk())
    dispatch(StockAsync())
  }, [])





  const handleInputChange = (field: keyof PieceFormData, value: string | number) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Réinitialiser les champs dépendants quand un parent change
      if (field === 'origine') {
        newData.marque = '';
        newData.modele = '';
        newData.serie = '';
      } else if (field === 'marque') {
        newData.modele = '';
        newData.serie = '';
      } else if (field === 'modele') {
        newData.serie = '';
      }

      return newData;
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
 

    const updateStock = {
      code_barre: formData.code_barre,
      code_items: formData.code_items,
      designation: formData.designation,
      categorie: formData.categorie,
      quantite: formData.quantite,
      prix_achat: formData.prix_achat,
      prix_affiche: formData.prix_affiche,
      dernier_prix: formData.dernier_prix,
      marque_produit: formData.marqueProduit,
      emplacement: formData.emplacement,
      family: Number(formData.family),
      admin: OneUser.data?.person?.id,
    }
    if (formData.serie != "") {
      const IdFamily = (reference as any[]).find((item) => item.family_name == formData.serie)

      const updateStock = {
        code_barre: formData.code_barre,
        code_items: formData.code_items,
        designation: formData.designation,
        categorie: formData.categorie,
        prix_achat: formData.prix_achat,
        prix_affiche: formData.prix_affiche,
        quantite: formData.quantite,
        dernier_prix: formData.dernier_prix,
        marque_produit: formData.marqueProduit,
        emplacement: formData.emplacement,
        family: Number(IdFamily.id),
        admin: OneUser.data?.person?.id,
      }
      dispatch(UpStockAsync([formData.id, updateStock] as any))


    } else {
      const updateStock = {
        code_barre: formData.code_barre,
        code_items: formData.code_items,
        designation: formData.designation,
        categorie: formData.categorie,
        quantite: formData.quantite,
        prix_achat: formData.prix_achat,
        prix_affiche: formData.prix_affiche,
        dernier_prix: formData.dernier_prix,
        marque_produit: formData.marqueProduit,
        emplacement: formData.emplacement,
        family: Number(formData.family),
        admin: OneUser.data?.person?.id,
      }
      dispatch(UpStockAsync([formData.id, updateStock] as any))

    }

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6  p-2 px-6">


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colonne 1 */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="code_barre">Code Barre *</Label>
            <Input
              id="code_barre"
              defaultValue={formData.code_barre}
              onChange={(e) => handleProductFormChange('code_barre', e.target.value)}
              placeholder="1234567890123"
            />
          </div>

          <div>
            <Label htmlFor="codeItems">Code Items *</Label>
            <Input
              id="codeItems"
              defaultValue={formData.code_items}
              onChange={(e) => handleProductFormChange('code_items', e.target.value)}
              placeholder="Code unique de l'article"
            />
          </div>

          <div>
            <Label htmlFor="designation">Désignation *</Label>
            <Input
              id="designation"
              defaultValue={formData.designation}
              onChange={(e) => handleProductFormChange('designation', e.target.value)}
              placeholder="Nom du produit"
            />
          </div>

          <div>
            <Label htmlFor="origine">Origine *</Label>
            <Select
              value={formData.origine}
              onValueChange={(value) => handleProductFormChange('origine', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner l'origine" />
              </SelectTrigger>
              <SelectContent>
                {referenceData.origines.map((origine) => (
                  <SelectItem key={origine.id} value={origine.pays}>
                    {origine.pays}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="marqueProduit">Marque Produit *</Label>
            <Input
                  id="marqueProduit"
                  defaultValue={formData.marqueProduit}
                  onChange={(e) => handleProductFormChange('marqueProduit', e.target.value)}
                  placeholder="Sélectionner la marque produit"
                />
            {/* <Select
              value={formData.marqueProduit}
              onValueChange={(value) => handleProductFormChange('marqueProduit', value)}
              disabled={!formData.origine}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la marque produit" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableMarquesProduit().map((marque) => (
                  <SelectItem key={marque.id} value={marque?.family_name}>
                    {marque.family_name}
                  </SelectItem>
                ))}
              </SelectContent>

            </Select> */}
          </div>

          <div>
            <Label htmlFor="marque">Marque *</Label>
            <Select
              value={formData.marque}
              onValueChange={(value) => handleProductFormChange('marque', value)}
              disabled={!formData.origine}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la marque" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableMarques().map((marque) => (
                  <SelectItem key={marque.id} value={marque.family_name}>
                    {marque?.family_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="modele">Modèle *</Label>
            <Select
              value={formData.modele}
              onValueChange={(value) => handleProductFormChange('modele', value)}
              disabled={!formData.marque}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le modèle" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableModeles().map((modele) => (
                  <SelectItem key={modele.id} value={modele.family_name}>
                    {modele?.family_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>

        {/* Colonne 2 */}
        <div className="space-y-4">

       
          <div>
            <Label htmlFor="serie">Série</Label>
            <Select
              value={formData.serie}
              onValueChange={(value) => handleProductFormChange('serie', value)}
              disabled={!formData.modele}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la série" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableSeries().map((serie) => (
                  <SelectItem key={serie.id} value={serie.family_name}>
                    {serie?.family_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="categorie">Catégorie *</Label>
            <Input
              value={formData.categorie}
              onChange={(value) => handleProductFormChange('categorie', value.target.value)}
            >
              {/* <SelectTrigger>
                <SelectValue placeholder="Sélectionner la catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VITRE">VITRE</SelectItem>
                <SelectItem value="FREIN">FREIN</SelectItem>
                <SelectItem value="ENTRETIEN">ENTRETIEN</SelectItem>
                <SelectItem value="SUSPENSION">SUSPENSION</SelectItem>
                <SelectItem value="MOTEUR">MOTEUR</SelectItem>
                <SelectItem value="ÉLECTRICITÉ">ÉLECTRICITÉ</SelectItem>
              </SelectContent> */}
            </Input>
          </div>
          <div>
            <Label htmlFor="prixAffiche">Prix d'achat *</Label>
            <Input
              id="prixAffiche"
              type="number"
              step="0.01"
              defaultValue={formData.prix_achat}
              onChange={(e) => handleProductFormChange('prix_achat', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="prixAffiche">Prix Affiché *</Label>
            <Input
              id="prixAffiche"
              type="number"
              step="0.01"
              defaultValue={formData.prix_affiche}
              onChange={(e) => handleProductFormChange('prix_affiche', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="dernierPrix">Dernier Prix *</Label>
            <Input
              id="dernierPrix"
              type="number"
              step="0.01"
              defaultValue={formData.dernier_prix}
              onChange={(e) => handleProductFormChange('dernier_prix', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="emplacement">Emplacement</Label>
            <Input
              id="emplacement"
              defaultValue={formData.emplacement}
              onChange={(e) => handleProductFormChange('emplacement', e.target.value)}
              placeholder="A-01-15"
            />
          </div>

          <div className="">
            <Label htmlFor="quantite">Stock Actuel *</Label>
            <Input
              id="quantite"
              type="number"
              defaultValue={formData.quantite}
              onChange={(e) => handleProductFormChange('quantite', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <div className="hidden">
            <Label htmlFor="quantiteMinimale">Stock Minimum *</Label>
            <Input
              id="quantiteMinimale"
              type="number"
              defaultValue={formData.quantiteMinimale}
              onChange={(e) => handleProductFormChange('quantiteMinimale', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 hidden">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleProductFormChange('description', e.target.value)}
          placeholder="Description détaillée du produit..."
          rows={3}
        />
      </div>




      {/* Informations générales */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Informations générales {initialData.id} </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="designation">Désignation *</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => handleInputChange("designation", e.target.value)}
                placeholder="Ex: VITRE AVANT GAUCHE CLAIRE"
                required
              />
            </div>
            <div>
              <Label htmlFor="categorie">Catégorie *</Label>
              <Select value={formData.categorie} onValueChange={(value) => handleInputChange("categorie", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="origine">Origine *</Label>
              <Select 
                value={formData.origine} 
                onValueChange={(value) => handleInputChange("origine", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'origine..." />
                </SelectTrigger>
                <SelectContent>
                  {availableOrigines.map(origine => (
                    <SelectItem key={origine} value={origine}>{origine}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reference">Référence</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => handleInputChange("reference", e.target.value)}
                placeholder="Ex: REF-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marque">Marque Produit *</Label>
              <Select 
                value={formData.marque} 
                onValueChange={(value) => handleInputChange("marque", value)}
                disabled={!formData.origine}
              >
                <SelectTrigger className={!formData.origine ? "opacity-50 cursor-not-allowed" : ""}>
                  <SelectValue placeholder={!formData.origine ? "Sélectionnez d'abord une origine" : "Sélectionner la marque..."} />
                </SelectTrigger>
                <SelectContent>
                  {availableMarques.map(marque => (
                    <SelectItem key={marque} value={marque}>{marque}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="modele">Modèle *</Label>
              <Select 
                value={formData.modele} 
                onValueChange={(value) => handleInputChange("modele", value)}
                disabled={!formData.marque}
              >
                <SelectTrigger className={!formData.marque ? "opacity-50 cursor-not-allowed" : ""}>
                  <SelectValue placeholder={!formData.marque ? "Sélectionnez d'abord une marque" : "Sélectionner le modèle..."} />
                </SelectTrigger>
                <SelectContent>
                  {availableModeles.map(modele => (
                    <SelectItem key={modele} value={modele}>{modele}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="serie">Série</Label>
            <Select 
              value={formData.serie} 
              onValueChange={(value) => handleInputChange("serie", value)}
              disabled={!formData.modele}
            >
              <SelectTrigger className={!formData.modele ? "opacity-50 cursor-not-allowed" : ""}>
                <SelectValue placeholder={!formData.modele ? "Sélectionnez d'abord un modèle" : "Sélectionner la série..."} />
              </SelectTrigger>
              <SelectContent>
                {availableSeries.map(serie => (
                  <SelectItem key={serie} value={serie}>{serie}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card> */}


      {/* <Card>
        <CardHeader>
          <CardTitle>Stock et tarification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="quantite">Stock actuel *</Label>
              <Input
                id="quantite"
                type="number"
                value={formData.quantite}
                onChange={(e) => handleInputChange("quantite", parseInt(e.target.value) || 0)}
                min="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="quantiteMinimale">Stock minimum *</Label>
              <Input
                id="quantiteMinimale"
                type="number"
                value={formData.quantiteMinimale}
                onChange={(e) => handleInputChange("quantiteMinimale", parseInt(e.target.value) || 0)}
                min="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="prixAchat">Prix d'achat (€) *</Label>
              <Input
                id="prixAchat"
                type="number"
                step="0.01"
                value={formData.prixAchat}
                onChange={(e) => handleInputChange("prixAchat", parseFloat(e.target.value) || 0)}
                min="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="prixVente">Prix de vente (€) *</Label>
              <Input
                id="prixVente"
                type="number"
                step="0.01"
                value={formData.prixVente}
                onChange={(e) => handleInputChange("prixVente", parseFloat(e.target.value) || 0)}
                min="0"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

   
      <Card>
        <CardHeader>
          <CardTitle>Localisation et approvisionnement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emplacement">Emplacement</Label>
              <Input
                id="emplacement"
                value={formData.emplacement}
                onChange={(e) => handleInputChange("emplacement", e.target.value)}
                placeholder="Ex: A-01-15"
              />
            </div>
            <div>
              <Label htmlFor="fournisseur">Fournisseur</Label>
              <Input
                id="fournisseur"
                value={formData.fournisseur}
                onChange={(e) => handleInputChange("fournisseur", e.target.value)}
                placeholder="Ex: FOURNISSEUR AUTO"
              />
            </div>
          </div>
        </CardContent>
      </Card>

    
      <Card>
        <CardHeader>
          <CardTitle>Détails techniques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="anneeDebut">Année début</Label>
              <Input
                id="anneeDebut"
                type="number"
                value={formData.anneeDebut || ""}
                onChange={(e) => handleInputChange("anneeDebut", parseInt(e.target.value) || null)}
                placeholder="2010"
                min="1900"
                max="2030"
              />
            </div>
            <div>
              <Label htmlFor="anneeFin">Année fin</Label>
              <Input
                id="anneeFin"
                type="number"
                value={formData.anneeFin || ""}
                onChange={(e) => handleInputChange("anneeFin", parseInt(e.target.value) || null)}
                placeholder="2020"
                min="1900"
                max="2030"
              />
            </div>
            <div>
              <Label htmlFor="poids">Poids</Label>
              <Input
                id="poids"
                value={formData.poids}
                onChange={(e) => handleInputChange("poids", e.target.value)}
                placeholder="Ex: 2.5 kg"
              />
            </div>
            <div>
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                value={formData.dimensions}
                onChange={(e) => handleInputChange("dimensions", e.target.value)}
                placeholder="Ex: 50x30x10 cm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="motorisation">Motorisation</Label>
              <Input
                id="motorisation"
                value={formData.motorisation}
                onChange={(e) => handleInputChange("motorisation", e.target.value)}
                placeholder="Ex: 1.6 HDI"
              />
            </div>
            <div>
              <Label htmlFor="garantie">Garantie</Label>
              <Input
                id="garantie"
                value={formData.garantie}
                onChange={(e) => handleInputChange("garantie", e.target.value)}
                placeholder="Ex: 2 ans"
              />
            </div>
            <div>
              <Label htmlFor="code_barre">Code-barres</Label>
              <Input
                id="code_barre"
                value={formData.code_barre}
                onChange={(e) => handleInputChange("code_barre", e.target.value)}
                placeholder="Ex: 1234567890123"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="compatibilite">Compatibilité véhicules</Label>
            <Input
              id="compatibilite"
              value={formData.compatibilite}
              onChange={(e) => handleInputChange("compatibilite", e.target.value)}
              placeholder="Ex: Peugeot 308, Citroën C4 (séparés par des virgules)"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Description détaillée de la pièce..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card> */}


      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {UpStockSlice.loading ? 'Modification en cours' : 'Modifier la pièce'}

        </Button>
      </div>
    </form>
  );
};