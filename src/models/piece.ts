export interface Piece {
    id: string;
    designation: string;
    marque: string;
    categorie: string;
    quantiteStock: number;
    quantiteMinimale: number;
    prixAchat: number;
    prixVente: number;
    prix_achat :number
    emplacement: string;
    fournisseur: string;
    dateDerniereEntree: string;
    status: "disponible" | "rupture" | "alerte";
    // Champs spécifiques automotive
    origine?: string;
    modele?: string;
    serie?: string;
    reference?: string;
    anneeDebut?: number;
    anneeFin?: number;
    motorisation?: string;
    compatibilite?: string[];
    image?: string;
    poids?: string;
    dimensions?: string;
    garantie?: string;
    code_barre?: string;
    description?: string;
  }
  
  export interface PieceFormData {
    id: number ,
    designation: string;
    marque: string;
    categorie: string;
    quantiteStock: number;
    quantiteMinimale: number;
    prixAchat: number;
    prixVente: number;
    emplacement: string;
    fournisseur: string;
    prix_affiche:string
    dernier_prix: string
    marqueProduit: string
    quantite: string
    family: string
    origine: string;
    prix_unitaire: string;
    modele: string;
    prix_achat:string
    serie: string;
    reference: string;
    anneeDebut: number | null;
    anneeFin: number | null;
    motorisation: string;
    compatibilite: string;
    poids: string;
    dimensions: string;
    garantie: string;
    code_barre: string;
    code_items: string;
    description: string;
  }
  
  export const createEmptyPieceFormData = (): PieceFormData | any => ({
    id :0 ,
    designation: "",
    marque: "",
    categorie: "",
    quantiteStock: 0,
    quantiteMinimale: 0,
    prixAchat: 0,
    prixVente: 0,
    emplacement: "",
    fournisseur: "",
    origine: "",
    modele: "",
    serie: "",
    reference: "",
    anneeDebut: null,
    anneeFin: null,
    motorisation: "",
    compatibilite: "",
    poids: "",
    dimensions: "",
    garantie: "",
    code_barre: "",
    code_items: "",
    description: ""
  });
  
  export const convertFormDataToPiece = (formData: PieceFormData | any): Omit<Piece | any, 'id' | 'dateDerniereEntree' | 'status'> => ({
    designation: formData.designation,
    marque: formData.marque,
    categorie: formData.categorie,
    quantiteStock: formData.quantiteStock,
    quantiteMinimale: formData.quantiteMinimale,
    prixAchat: formData.prixAchat,
    prixVente: formData.prixVente,
    emplacement: formData.emplacement,
    fournisseur: formData.fournisseur,
    origine: formData.origine || undefined,
    modele: formData.modele || undefined,
    serie: formData.serie || undefined,
    reference: formData.reference || undefined,
    anneeDebut: formData.anneeDebut || undefined,
    anneeFin: formData.anneeFin || undefined,
    motorisation: formData.motorisation || undefined,
    compatibilite: formData.compatibilite ? formData.compatibilite.split(',').map(s => s?.trim()).filter(Boolean) : undefined,
    poids: formData.poids || undefined,
    dimensions: formData.dimensions || undefined,
    garantie: formData.garantie || undefined,
    code_barre: formData.code_barre || undefined,
    description: formData.description || undefined
  });
  