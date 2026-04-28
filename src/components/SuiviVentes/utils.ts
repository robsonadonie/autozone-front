import { VenteItem } from "./SuiviVentes";
import { startOfMonth, endOfMonth, format, isWithinInterval, subMonths, isAfter, isBefore, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface SummaryResult {
  totalVentes: number;
  totalAchats: number;
  totalArticles: number;
  pourcentageVendeurs: number;
  profit: number;
  margeCommerciale: number;
  tauxMarge: number;
}

interface VentesByPeriod {
  currentPeriod: number;
  previousPeriod: number;
  percentChange: number;
}

/**
 * Calcule les totaux et statistiques des ventes
 * @param ventes Liste des ventes à analyser
 * @param pourcentageCommission Pourcentage de commission pour les vendeurs (optionnel)
 * @returns Résumé des statistiques de ventes
 */
export const calculateSummary = (
  ventes: VenteItem[],
  pourcentageCommission: number = 0
): SummaryResult => {
  // Calculer le total des ventes
  const totalVentes = ventes.reduce((acc, vente) => acc + vente.total, 0);

  // Calculer le total des achats
  const totalAchats = ventes.reduce(
    (acc, vente) => acc + vente.prixAchat * vente.quantite,
    0
  );

  // Calculer le nombre total d'articles vendus
  const totalArticles = ventes.reduce((acc, vente) => acc + vente.quantite, 0);

  // Calculer le montant des commissions vendeurs
  const pourcentageVendeurs = (totalVentes * pourcentageCommission) / 100;

  // Calculer le profit total
  const profit = totalVentes - totalAchats - pourcentageVendeurs;

  // Calculer la marge commerciale
  const margeCommerciale = totalVentes - totalAchats;
  
  // Calculer le taux de marge (en pourcentage)
  const tauxMarge = totalVentes > 0 ? (margeCommerciale / totalVentes) * 100 : 0;

  return {
    totalVentes,
    totalAchats,
    totalArticles,
    pourcentageVendeurs,
    profit,
    margeCommerciale,
    tauxMarge
  };
};

/**
 * Compare les ventes entre deux périodes
 * @param ventes Liste des ventes à analyser
 * @param currentStartDate Date de début de la période actuelle
 * @param currentEndDate Date de fin de la période actuelle
 * @returns Comparaison des ventes entre la période actuelle et la période précédente
 */
export const compareVentesByPeriod = (
  ventes: VenteItem[],
  currentStartDate?: Date,
  currentEndDate?: Date
): VentesByPeriod => {
  // Si pas de dates spécifiées, utiliser le mois en cours
  const now = new Date();
  const start = currentStartDate || startOfMonth(now);
  const end = currentEndDate || endOfMonth(now);
  
  // Calculer la durée en jours de la période actuelle
  const periodDurationMs = end.getTime() - start.getTime();
  
  // Calculer les dates de la période précédente de même durée
  const previousPeriodEnd = new Date(start.getTime() - 1);
  const previousPeriodStart = new Date(previousPeriodEnd.getTime() - periodDurationMs);
  
  // Filtrer les ventes pour la période actuelle
  const currentPeriodVentes = ventes.filter(vente => {
    const venteDate = new Date(vente.date);
    return isAfter(venteDate, start) && isBefore(venteDate, end);
  });
  
  // Filtrer les ventes pour la période précédente
  const previousPeriodVentes = ventes.filter(vente => {
    const venteDate = new Date(vente.date);
    return isAfter(venteDate, previousPeriodStart) && isBefore(venteDate, previousPeriodEnd);
  });
  
  // Calculer les totaux
  const currentPeriodTotal = currentPeriodVentes.reduce((acc, vente) => acc + vente.total, 0);
  const previousPeriodTotal = previousPeriodVentes.reduce((acc, vente) => acc + vente.total, 0);
  
  // Calculer le pourcentage de changement
  let percentChange = 0;
  if (previousPeriodTotal > 0) {
    percentChange = ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100;
  }
  
  return {
    currentPeriod: currentPeriodTotal,
    previousPeriod: previousPeriodTotal,
    percentChange
  };
};

/**
 * Regroupe les ventes par catégorie
 * @param ventes Liste des ventes à analyser
 * @returns Objet avec les totaux par catégorie
 */
export const groupVentesByCategory = (ventes: VenteItem[]): Record<string, number> => {
  return ventes.reduce((acc, vente) => {
    const category = vente.categorie;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += vente.total;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Regroupe les ventes par marque de produit
 * @param ventes Liste des ventes à analyser
 * @returns Objet avec les totaux par marque
 */
export const groupVentesByBrand = (ventes: VenteItem[]): Record<string, number> => {
  return ventes.reduce((acc, vente) => {
    const brand = vente.marqueProduit;
    if (!acc[brand]) {
      acc[brand] = 0;
    }
    acc[brand] += vente.total;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Filtre les ventes selon divers critères
 * @param ventes Liste des ventes à filtrer
 * @param filters Critères de filtrage
 * @returns Liste filtrée des ventes
 */
export const filterVentes = (
  ventes: VenteItem[],
  filters: {
    startDate?: Date;
    endDate?: Date;
    category?: string;
    marqueVehicule?: string;
    marqueProduit?: string;
    searchTerm?: string;
    prixMin?: number;
    prixMax?: number;
  }
): VenteItem[] => {
  return ventes.filter(vente => {
    // Filtrage par date
    if (filters.startDate && new Date(vente.date) < filters.startDate) {
      return false;
    }
    
    if (filters.endDate) {
      // Ajouter un jour à la date de fin pour inclure le jour entier
      const endDatePlusOne = new Date(filters.endDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      if (new Date(vente.date) > endDatePlusOne) {
        return false;
      }
    }
    
    // Filtrage par catégorie
    if (filters.category && filters.category !== 'all' && vente.categorie !== filters.category) {
      return false;
    }
    
    // Filtrage par marque de véhicule
    if (filters.marqueVehicule && vente.marqueVehicule !== filters.marqueVehicule) {
      return false;
    }
    
    // Filtrage par marque de produit
    if (filters.marqueProduit && vente.marqueProduit !== filters.marqueProduit) {
      return false;
    }
    
    // Filtrage par terme de recherche
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const designationMatch = vente.designation.toLowerCase().includes(searchLower);
      const modeleMatch = vente.modele.toLowerCase().includes(searchLower);
      const serieMatch = vente.serie.toLowerCase().includes(searchLower);
      
      if (!designationMatch && !modeleMatch && !serieMatch) {
        return false;
      }
    }
    
    // Filtrage par prix
    if (filters.prixMin !== undefined && vente.prixUnitaire < filters.prixMin) {
      return false;
    }
    
    if (filters.prixMax !== undefined && vente.prixUnitaire > filters.prixMax) {
      return false;
    }
    
    return true;
  });
};

/**
 * Formatte un nombre en valeur monétaire (EUR)
 * @param value Valeur à formatter
 * @returns Chaîne de caractères formatée (ex: "1 234,56 €")
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formatte un nombre en pourcentage
 * @param value Valeur à formatter
 * @returns Chaîne de caractères formatée (ex: "12,34 %")
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

/**
 * Trie les ventes selon différents critères
 * @param ventes Liste des ventes à trier
 * @param sortBy Critère de tri
 * @param sortOrder Ordre de tri
 * @returns Liste triée des ventes
 */
export const sortVentes = (
  ventes: VenteItem[],
  sortBy: keyof VenteItem,
  sortOrder: 'asc' | 'desc'
): VenteItem[] => {
  return [...ventes].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (typeof a[sortBy] === 'number' && typeof b[sortBy] === 'number') {
      comparison = (a[sortBy] as number) - (b[sortBy] as number);
    } else if (typeof a[sortBy] === 'string' && typeof b[sortBy] === 'string') {
      comparison = (a[sortBy] as string).localeCompare(b[sortBy] as string, 'fr');
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
};

/**
 * Exporte les données de vente au format CSV
 * @param ventes Liste des ventes à exporter
 */
export const exportToCSV = (ventes: VenteItem[]): void => {
  // Définir les en-têtes de colonnes
  const headers = [
    'Date',
    'Désignation',
    'Marque Produit',
    'Marque Véhicule',
    'Modèle',
    'Série',
    'Catégorie',
    'Quantité',
    'Prix Unitaire',
    'Total HT',
    'Prix d\'Achat'
  ];

  // Convertir les données en lignes CSV
  const rows = ventes.map(vente => [
    format(new Date(vente.date), 'dd/MM/yyyy'),
    vente.designation,
    vente.marqueProduit,
    vente.marqueVehicule,
    vente.modele,
    vente.serie,
    vente.categorie,
    vente.quantite.toString(),
    vente.prixUnitaire.toFixed(2),
    vente.total.toFixed(2),
    vente.prixAchat.toFixed(2)
  ]);

  // Combiner les en-têtes et les lignes
  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\n');

  // Créer un objet Blob pour le téléchargement
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Créer un lien de téléchargement
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `suivi-ventes-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  
  // Ajouter le lien au document, cliquer dessus, puis le retirer
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Calcule les statistiques avancées pour les ventes
 * @param ventes Liste des ventes à analyser
 * @returns Statistiques avancées
 */
export const calculateAdvancedStats = (ventes: VenteItem[]) => {
  // Valeur moyenne par vente
  const avgValuePerSale = ventes.length > 0 
    ? ventes.reduce((acc, vente) => acc + vente.total, 0) / ventes.length 
    : 0;
  
  // Articles les plus vendus
  const articlesCount: Record<string, { count: number, totalValue: number }> = {};
  ventes.forEach(vente => {
    if (!articlesCount[vente.designation]) {
      articlesCount[vente.designation] = { count: 0, totalValue: 0 };
    }
    articlesCount[vente.designation].count += vente.quantite;
    articlesCount[vente.designation].totalValue += vente.total;
  });
  
  // Convertir en tableau pour le tri
  const topSellingItems = Object.entries(articlesCount)
    .map(([designation, stats]) => ({ designation, ...stats }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5
  
  // Meilleures marques (par valeur de vente)
  const brandSales: Record<string, number> = {};
  ventes.forEach(vente => {
    if (!brandSales[vente.marqueProduit]) {
      brandSales[vente.marqueProduit] = 0;
    }
    brandSales[vente.marqueProduit] += vente.total;
  });
  
  const topBrands = Object.entries(brandSales)
    .map(([brand, total]) => ({ brand, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5); // Top 5
  
  return {
    avgValuePerSale,
    topSellingItems,
    topBrands
  };
};
