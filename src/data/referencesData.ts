import { ReferencesData } from "@/types/references";

export const initialData: ReferencesData | any = {
  origines: [
    { id: "1", nom: "Japonais", description: "Constructeurs automobiles japonais" },
    { id: "2", nom: "Allemand", description: "Constructeurs automobiles allemands" },
    { id: "3", nom: "Français", description: "Constructeurs automobiles français" },
    { id: "4", nom: "Coréen", description: "Constructeurs automobiles coréens" },
    { id: "5", nom: "Italien", description: "Constructeurs automobiles italiens" },
    { id: "6", nom: "Américain", description: "Constructeurs automobiles américains" },
    { id: "7", nom: "Suédois", description: "Constructeurs automobiles suédois" },
    { id: "8", nom: "Britannique", description: "Constructeurs automobiles britanniques" },
    { id: "9", nom: "Tchèque", description: "Constructeurs automobiles tchèques" },
    { id: "10", nom: "Espagnol", description: "Constructeurs automobiles espagnols" },
  ],
  marques: [
    // Marques japonaises
    { id: "1", nom: "Toyota", origine: "Japonais", description: "Constructeur automobile japonais" },
    { id: "2", nom: "Honda", origine: "Japonais", description: "Constructeur automobile japonais" },
    { id: "3", nom: "Nissan", origine: "Japonais", description: "Constructeur automobile japonais" },
    { id: "4", nom: "Mazda", origine: "Japonais", description: "Constructeur automobile japonais" },
    { id: "5", nom: "Subaru", origine: "Japonais", description: "Constructeur automobile japonais" },
    { id: "6", nom: "Mitsubishi", origine: "Japonais", description: "Constructeur automobile japonais" },
    { id: "7", nom: "Lexus", origine: "Japonais", description: "Marque premium de Toyota" },
    { id: "8", nom: "Infiniti", origine: "Japonais", description: "Marque premium de Nissan" },
    { id: "9", nom: "Acura", origine: "Japonais", description: "Marque premium de Honda" },
    
    // Marques allemandes
    { id: "10", nom: "BMW", origine: "Allemand", description: "Constructeur automobile allemand" },
    { id: "11", nom: "Mercedes-Benz", origine: "Allemand", description: "Constructeur automobile allemand" },
    { id: "12", nom: "Audi", origine: "Allemand", description: "Constructeur automobile allemand" },
    { id: "13", nom: "Volkswagen", origine: "Allemand", description: "Constructeur automobile allemand" },
    { id: "14", nom: "Porsche", origine: "Allemand", description: "Constructeur automobile allemand" },
    { id: "15", nom: "Opel", origine: "Allemand", description: "Constructeur automobile allemand" },
    { id: "16", nom: "MINI", origine: "Allemand", description: "Marque du groupe BMW" },
    
    // Marques françaises
    { id: "17", nom: "Peugeot", origine: "Français", description: "Constructeur automobile français" },
    { id: "18", nom: "Citroën", origine: "Français", description: "Constructeur automobile français" },
    { id: "19", nom: "Renault", origine: "Français", description: "Constructeur automobile français" },
    { id: "20", nom: "Dacia", origine: "Français", description: "Marque du groupe Renault" },
    { id: "21", nom: "Alpine", origine: "Français", description: "Marque sportive du groupe Renault" },
    { id: "22", nom: "DS", origine: "Français", description: "Marque premium de Citroën" },
    
    // Marques coréennes
    { id: "23", nom: "Hyundai", origine: "Coréen", description: "Constructeur automobile coréen" },
    { id: "24", nom: "Kia", origine: "Coréen", description: "Constructeur automobile coréen" },
    { id: "25", nom: "Genesis", origine: "Coréen", description: "Marque premium de Hyundai" },
    
    // Marques italiennes
    { id: "26", nom: "Fiat", origine: "Italien", description: "Constructeur automobile italien" },
    { id: "27", nom: "Ferrari", origine: "Italien", description: "Constructeur automobile italien" },
    { id: "28", nom: "Lamborghini", origine: "Italien", description: "Constructeur automobile italien" },
    { id: "29", nom: "Alfa Romeo", origine: "Italien", description: "Constructeur automobile italien" },
    { id: "30", nom: "Maserati", origine: "Italien", description: "Constructeur automobile italien" },
    
    // Marques américaines
    { id: "31", nom: "Ford", origine: "Américain", description: "Constructeur automobile américain" },
    { id: "32", nom: "Chevrolet", origine: "Américain", description: "Marque du groupe General Motors" },
    { id: "33", nom: "Cadillac", origine: "Américain", description: "Marque premium du groupe General Motors" },
    { id: "34", nom: "Tesla", origine: "Américain", description: "Constructeur de véhicules électriques" },
    { id: "35", nom: "Chrysler", origine: "Américain", description: "Constructeur automobile américain" },
    { id: "36", nom: "Jeep", origine: "Américain", description: "Marque de SUV américaine" },
    
    // Marques suédoises
    { id: "37", nom: "Volvo", origine: "Suédois", description: "Constructeur automobile suédois" },
    { id: "38", nom: "Saab", origine: "Suédois", description: "Ancien constructeur automobile suédois" },
    
    // Marques britanniques
    { id: "39", nom: "Land Rover", origine: "Britannique", description: "Constructeur de SUV britannique" },
    { id: "40", nom: "Jaguar", origine: "Britannique", description: "Constructeur automobile britannique" },
    { id: "41", nom: "Aston Martin", origine: "Britannique", description: "Constructeur automobile britannique" },
    { id: "42", nom: "Bentley", origine: "Britannique", description: "Constructeur automobile britannique" },
    { id: "43", nom: "Rolls-Royce", origine: "Britannique", description: "Constructeur automobile britannique" },
    
    // Marques tchèques
    { id: "44", nom: "Škoda", origine: "Tchèque", description: "Constructeur automobile tchèque" },
    
    // Marques espagnoles
    { id: "45", nom: "SEAT", origine: "Espagnol", description: "Constructeur automobile espagnol" },
  ],
  modeles: [
    // Modèles Toyota
    { id: "1", nom: "Corolla", marque: "Toyota", description: "Berline compacte" },
    { id: "2", nom: "Camry", marque: "Toyota", description: "Berline familiale" },
    { id: "3", nom: "RAV4", marque: "Toyota", description: "SUV compact" },
    { id: "4", nom: "Prius", marque: "Toyota", description: "Hybride" },
    { id: "5", nom: "Yaris", marque: "Toyota", description: "Citadine" },
    { id: "6", nom: "Highlander", marque: "Toyota", description: "SUV 7 places" },
    
    // Modèles BMW
    { id: "7", nom: "Série 3", marque: "BMW", description: "Berline compacte premium" },
    { id: "8", nom: "Série 5", marque: "BMW", description: "Berline familiale premium" },
    { id: "9", nom: "X3", marque: "BMW", description: "SUV compact premium" },
    { id: "10", nom: "X5", marque: "BMW", description: "SUV familial premium" },
    { id: "11", nom: "Série 1", marque: "BMW", description: "Compacte premium" },
    
    // Modèles Mercedes-Benz
    { id: "12", nom: "Classe A", marque: "Mercedes-Benz", description: "Compacte premium" },
    { id: "13", nom: "Classe C", marque: "Mercedes-Benz", description: "Berline compacte premium" },
    { id: "14", nom: "Classe E", marque: "Mercedes-Benz", description: "Berline familiale premium" },
    { id: "15", nom: "GLC", marque: "Mercedes-Benz", description: "SUV compact premium" },
    { id: "16", nom: "GLE", marque: "Mercedes-Benz", description: "SUV familial premium" },
    
    // Modèles Peugeot
    { id: "17", nom: "208", marque: "Peugeot", description: "Citadine" },
    { id: "18", nom: "308", marque: "Peugeot", description: "Compacte" },
    { id: "19", nom: "3008", marque: "Peugeot", description: "SUV compact" },
    { id: "20", nom: "5008", marque: "Peugeot", description: "SUV 7 places" },
    { id: "21", nom: "508", marque: "Peugeot", description: "Berline familiale" },
    
    // Modèles Renault
    { id: "22", nom: "Clio", marque: "Renault", description: "Citadine" },
    { id: "23", nom: "Mégane", marque: "Renault", description: "Compacte" },
    { id: "24", nom: "Kadjar", marque: "Renault", description: "SUV compact" },
    { id: "25", nom: "Captur", marque: "Renault", description: "SUV urbain" },
    { id: "26", nom: "Talisman", marque: "Renault", description: "Berline familiale" },
    
    // Modèles Volkswagen
    { id: "27", nom: "Golf", marque: "Volkswagen", description: "Compacte" },
    { id: "28", nom: "Polo", marque: "Volkswagen", description: "Citadine" },
    { id: "29", nom: "Tiguan", marque: "Volkswagen", description: "SUV compact" },
    { id: "30", nom: "Passat", marque: "Volkswagen", description: "Berline familiale" },
    { id: "31", nom: "Touareg", marque: "Volkswagen", description: "SUV premium" },
    
    // Modèles Audi
    { id: "32", nom: "A3", marque: "Audi", description: "Compacte premium" },
    { id: "33", nom: "A4", marque: "Audi", description: "Berline compacte premium" },
    { id: "34", nom: "A6", marque: "Audi", description: "Berline familiale premium" },
    { id: "35", nom: "Q3", marque: "Audi", description: "SUV compact premium" },
    { id: "36", nom: "Q5", marque: "Audi", description: "SUV familial premium" },
    
    // Modèles Ford
    { id: "37", nom: "Focus", marque: "Ford", description: "Compacte" },
    { id: "38", nom: "Fiesta", marque: "Ford", description: "Citadine" },
    { id: "39", nom: "Kuga", marque: "Ford", description: "SUV compact" },
    { id: "40", nom: "Mondeo", marque: "Ford", description: "Berline familiale" },
    { id: "41", nom: "EcoSport", marque: "Ford", description: "SUV urbain" },
  ],
  series: [
    // Séries Toyota Corolla
    { id: "1", nom: "Active", marque: "Toyota", description: "Finition de base" },
    { id: "2", nom: "Dynamic", marque: "Toyota", description: "Finition intermédiaire" },
    { id: "3", nom: "Exclusive", marque: "Toyota", description: "Finition haut de gamme" },
    { id: "4", nom: "GR Sport", marque: "Toyota", description: "Finition sportive" },
    
    // Séries BMW
    { id: "5", nom: "Efficient Dynamics", marque: "BMW", description: "Version économique" },
    { id: "6", nom: "M Sport", marque: "BMW", description: "Pack sport" },
    { id: "7", nom: "Luxury", marque: "BMW", description: "Pack luxe" },
    { id: "8", nom: "M Performance", marque: "BMW", description: "Performance sportive" },
    { id: "9", nom: "xDrive", marque: "BMW", description: "Transmission intégrale" },
    
    // Séries Mercedes-Benz
    { id: "10", nom: "Style", marque: "Mercedes-Benz", description: "Finition de base" },
    { id: "11", nom: "Progressive", marque: "Mercedes-Benz", description: "Finition intermédiaire" },
    { id: "12", nom: "AMG Line", marque: "Mercedes-Benz", description: "Pack sportif AMG" },
    { id: "13", nom: "Avantgarde", marque: "Mercedes-Benz", description: "Finition élégante" },
    { id: "14", nom: "4MATIC", marque: "Mercedes-Benz", description: "Transmission intégrale" },
    
    // Séries Peugeot
    { id: "15", nom: "Active", marque: "Peugeot", description: "Finition de base" },
    { id: "16", nom: "Allure", marque: "Peugeot", description: "Finition intermédiaire" },
    { id: "17", nom: "GT Line", marque: "Peugeot", description: "Finition sportive" },
    { id: "18", nom: "GT", marque: "Peugeot", description: "Version sportive" },
    
    // Séries Renault
    { id: "19", nom: "Life", marque: "Renault", description: "Finition de base" },
    { id: "20", nom: "Zen", marque: "Renault", description: "Finition intermédiaire" },
    { id: "21", nom: "Intens", marque: "Renault", description: "Finition haut de gamme" },
    { id: "22", nom: "RS Line", marque: "Renault", description: "Finition sportive" },
    
    // Séries Volkswagen
    { id: "23", nom: "Trendline", marque: "Volkswagen", description: "Finition de base" },
    { id: "24", nom: "Comfortline", marque: "Volkswagen", description: "Finition intermédiaire" },
    { id: "25", nom: "Highline", marque: "Volkswagen", description: "Finition haut de gamme" },
    { id: "26", nom: "R-Line", marque: "Volkswagen", description: "Pack sportif" },
    { id: "27", nom: "GTI", marque: "Volkswagen", description: "Version sportive" },
    
    // Séries Audi
    { id: "28", nom: "Attraction", marque: "Audi", description: "Finition de base" },
    { id: "29", nom: "Ambition", marque: "Audi", description: "Finition intermédiaire" },
    { id: "30", nom: "S line", marque: "Audi", description: "Pack sportif" },
    { id: "31", nom: "Competition", marque: "Audi", description: "Finition premium" },
    { id: "32", nom: "quattro", marque: "Audi", description: "Transmission intégrale" },
  ],
  categories: [
    { id: "1", nom: "Moteur", description: "Pièces du groupe motopropulseur" },
    { id: "2", nom: "Transmission", description: "Boîte de vitesses et embrayage" },
    { id: "3", nom: "Freinage", description: "Système de freinage" },
    { id: "4", nom: "Suspension", description: "Amortisseurs et ressorts" },
    { id: "5", nom: "Direction", description: "Système de direction" },
    { id: "6", nom: "Échappement", description: "Ligne d'échappement" },
    { id: "7", nom: "Refroidissement", description: "Circuit de refroidissement" },
    { id: "8", nom: "Électricité", description: "Composants électriques" },
    { id: "9", nom: "Carrosserie", description: "Éléments de carrosserie" },
    { id: "10", nom: "Intérieur", description: "Habitacle et garnitures" },
    { id: "11", nom: "Pneumatiques", description: "Pneus et jantes" },
    { id: "12", nom: "Filtration", description: "Filtres à air, huile, carburant" },
    { id: "13", nom: "Éclairage", description: "Phares et feux" },
    { id: "14", nom: "Climatisation", description: "Système de climatisation" },
    { id: "15", nom: "Accessoires", description: "Accessoires et options" },
    { id: "16", nom: "Huiles et Fluides", description: "Lubrifiants et liquides" },
    { id: "17", nom: "Courroies", description: "Courroies de distribution et accessoires" },
    { id: "18", nom: "Joints", description: "Joints d'étanchéité" },
    { id: "19", nom: "Roulements", description: "Roulements de roue et autres" },
    { id: "20", nom: "Outillage", description: "Outils de réparation" },
  ],
};