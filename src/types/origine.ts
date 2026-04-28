export interface Origine {
  id: string;
  admin :number
  pays: string;
  // description: string;
  // couleur: string;
  actif: boolean;
  createdAt: Date;
}

export interface Marque {
  id: string;
  family_name: string;
  nom: string;
  origine : {pays: string};
  description: string;
  logo?: string;
  siteWeb?: string;
  actif: boolean;
  createdAt: Date;
}
export interface MarqueProd {
  id: string;
  family_name: string;
  nom: string;
  origine : {pays: string};
  description: string;
  logo?: string;
  siteWeb?: string;
  actif: boolean;
  createdAt: Date;
}

export interface Modele {
  id: string;
  family_name: string;
  marqueId: string;
  parent : {family_name :string}
  marqueNom: string;
  anneeDebut: string;
  anneeFin?: string;
  description: string;
  actif: boolean;
  dateCreation: string;
}

export interface Serie {
  id: string;
  nom: string;
  modeleId: string;
  modeleNom: string;
  family_name: string;
  marqueNom: string;
  description: string;
  caracteristiques: string[];
  parent : {
    family_name :string
  }
  actif: boolean;
  dateCreation: string;
}