export interface Client {
    id: number;
    
    createdAt: string;

    firstName: string,
    name: string,
    adresse: string,
    telephone: string,
    rc :string,
    stat :string,
    nif :string,
    email: string,
  }
  export interface HistoriqueFacture {
    date: string;
    numeroFacture: string;
    designation: string;
    prixUnitaire: number;
    quantite: number;
    totalHT: number;
    totalTTC: number;
  }