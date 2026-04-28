export interface Product {
    id: number;
    name: string;
    category: string;
    price: string;
    stock: number;
    status: "Normal" | "Bas" | "Rupture";
    description?: string;
    sku?: string;
    supplier?: string;
    lastUpdated?: string;
    // Automotive specific fields
    partNumber?: string;
    manufacturer?: string;
    vehicleCompatibility?: string[];
    location?: string;
    weight?: string;
    dimensions?: string;
    warranty?: string;
  }
  
  export interface ProductFormData {
    name: string;
    category: string;
    price: string;
    stock: number;
    description: string;
    sku: string;
    supplier: string;
    partNumber: string;
    manufacturer: string;
    vehicleCompatibility: string;
    location: string;
    weight: string;
    dimensions: string;
    warranty: string;
  }
  