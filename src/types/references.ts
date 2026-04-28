export interface Origine {
    id: string;
    nom: string;
    description: string;
  }
  
  export interface Marque {
    id: string;
    nom: string;
    origine: string;
    description: string;
  }
  
  export interface Modele {
    id: string;
    nom: string;
    marque: string;
    description: string;
  }
  
  export interface Serie {
    id: string;
    nom: string;
    marque: string;
    description: string;
  }
  
  export interface Categorie {
    id: string;
    nom: string;
    description: string;
  }
  
  export type ReferenceType = 'origines' | 'marques' | 'modeles' | 'series' | 'categories';
  
  export interface ReferencesData {
    origines: Origine[];
    marquesProd: Marque[];
    marques: Marque[];
    modeles: Modele[];
    series: Serie[];
    categories: Categorie[];
  }