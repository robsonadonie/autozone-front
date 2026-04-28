
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileEdit, Trash2, Plus, Package, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
// const { toast } = useToast();


// Sample data - would be fetched from API in real application
export const initialProducts = [
  {
    id: 1,
    sku: "LP-XPS-13",
    name: "Laptop Dell XPS 13",
    category: "Moteur",
    price: "TOYOTA",
    quantity: 15,
    threshold: 5,
    supplier: "Dell Technologies",
  },
  {
    id: 2,
    sku: "MN-SMG-27",
    name: "Écran Samsung 27\"",
    category: "Echap",
    price: "TOYOTA",
    quantity: 8,
    threshold: 10,
    supplier: "Samsung Electronics",
  },
  {
    id: 3,
    sku: "KB-LOG-MX",
    name: "Clavier Logitech MX",
    category: "Pneu",
    price: "TOYOTA",
    quantity: 25,
    threshold: 8,
    supplier: "Logitech",
  },
  {
    id: 4,
    sku: "MS-MSFT-PRO",
    name: "Souris Microsoft Pro",
    category: "Périphériques",
    price: "TOYOTA",
    quantity: 12,
    threshold: 5,
    supplier: "Microsoft",
  },
  {
    id: 5,
    sku: "CAB-USB-C",
    name: "Câble USB-C 2m",
    category: "Accessoires",
    price: "TOYOTA",
    quantity: 50,
    threshold: 15,
    supplier: "Anker",
  },
  {
    id: 6,
    sku: "SP-JBL-BT",
    name: "Enceinte JBL Bluetooth",
    category: "Audio",
    price:"TOYOTA",
    quantity: 18,
    threshold: 6,
    supplier: "JBL",
  },
  {
    id: 7,
    sku: "HP-SNY-WH",
    name: "Casque Sony WH-1000XM4",
    category: "Audio",
    price: "TOYOTA",
    quantity: 10,
    threshold: 4,
    supplier: "Sony",
  },
  {
    id: 8,
    sku: "CAM-CN-EOS",
    name: "Canon EOS R5",
    category: "Photographie",
    price: "TOYOTA",
    quantity: 3,
    threshold: 2,
    supplier: "Canon",
  },
  {
    id: 9,
    sku: "TAB-APP-IPD",
    name: "iPad Pro 12.9\"",
    category: "Électronique",
    price: "TOYOTA",
    quantity: 0,
    threshold: 5,
    supplier: "Apple",
  },
  {
    id: 10,
    sku: "PHN-SMG-S21",
    name: "Samsung Galaxy S21",
    category: "Téléphonie",
    price:"TOYOTA",
    quantity: 2,
    threshold: 5,
    supplier: "Samsung Electronics",
  },
];

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  threshold: number;
  supplier: string;
}

interface ProductTableProps {
  filters?: {
    search: string;
    category: string;
    supplier: string;
    status: string;
  };
}

const ProductTable = ({ filters = { search: "", category: "", supplier: "", status: "" } }: ProductTableProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | null;
    direction: 'ascending' | 'descending' | null;
  }>({
    key: null,
    direction: null
  });

  // Apply all filters to the products array
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = filters.search === "" || 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) || 
      product.sku.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.category.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.supplier.toLowerCase().includes(filters.search.toLowerCase());
    
    // Category filter
    const matchesCategory = filters.category === "" || product.category === filters.category;
    
    // Supplier filter
    const matchesSupplier = filters.supplier === "" || product.supplier === filters.supplier;
    
    // Status filter
    let matchesStatus = true;
    if (filters.status !== "") {
      const status = getStockStatus(product.quantity, product.threshold);
      if (filters.status === "normal" && status.label !== "Normal") {
        matchesStatus = false;
      } else if (filters.status === "low" && status.label !== "Bas") {
        matchesStatus = false;
      } else if (filters.status === "out" && status.label !== "Rupture") {
        matchesStatus = false;
      }
    }
    
    return matchesSearch && matchesCategory && matchesSupplier && matchesStatus;
  });

  // Sort function
  const requestSort = (key: keyof Product) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedProducts = [...filteredProducts];
  if (sortConfig.key && sortConfig.direction) {
    sortedProducts.sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  const handleDelete = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) return { label: "Rupture", variant: "destructive" };
    if (quantity < threshold) return { label: "Bas", variant: "warning" };
    return { label: "Normal", variant: "outline" };
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className=" rounded-none ">
          <Table>
            <TableHeader>
              <TableRow className="  rounded-none hover:bg-muted/70">
                {/* <TableHead className="w-[100px] font-medium" onClick={() => requestSort('sku')}>
                  <div className="flex items-center gap-1 cursor-pointer">
                    SKU
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead> */}
                <TableHead className="font-medium" onClick={() => requestSort('name')}>
                  <div className="flex items-center gap-1 cursor-pointer">
                    Code_barre
                    {/* <ArrowUpDown className="h-4 w-4" /> */}
                  </div>
                </TableHead>
                <TableHead className="font-medium" onClick={() => requestSort('category')}>
                  <div className="flex items-center gap-1 cursor-pointer">
                    Code_items
                    {/* <ArrowUpDown className="h-4 w-4" /> */}
                  </div>
                </TableHead>
                <TableHead className="text-left font-medium" onClick={() => requestSort('price')}>
                  <div className="  gap-1 cursor-pointer" style={{textWrap :"nowrap"}}>
                    Designation
                    {/* <ArrowUpDown className="h-4 w-4" /> */}
                  </div>
                </TableHead>
                <TableHead className="text-right font-medium" onClick={() => requestSort('price')}>
                  <div className="flex text-nowrap items-center justify-end gap-1 cursor-pointer">
                   Marque produit
                    {/* <ArrowUpDown className="h-4 w-4" /> */}
                  </div>
                </TableHead>
                <TableHead className="text-right font-medium" onClick={() => requestSort('quantity')}>
                  <div className="flex items-center justify-end gap-1 cursor-pointer">
                   Marque
                    {/* <ArrowUpDown className="h-4 w-4" /> */}
                  </div>
                </TableHead>
                <TableHead className="font-medium" onClick={() => requestSort('supplier')}>
                  <div className="flex items-center gap-1 cursor-pointer">
                    Modèle
                    {/* <ArrowUpDown className="h-4 w-4" /> */}
                  </div>
                </TableHead>
                <TableHead className="font-medium">Série</TableHead>
                <TableHead className="font-medium">Catégorie</TableHead>
                <TableHead className="w-[80px] text-nowrap">Plus d'info</TableHead>
                <TableHead className="w-[80px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => {
                  const status = getStockStatus(product.quantity, product.threshold);
                  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
                  
                  if (status.variant === "destructive") badgeVariant = "destructive";
                  else if (status.variant === "warning") badgeVariant = "secondary";
                  
                  return (
                    <TableRow key={product.id} className="p-1 h-1 hover:bg-muted/50" style={{fontSize:"13px"}}>
                      {/* <TableCell className="font-mono text-sm">{product.sku}</TableCell> */}
                      <TableCell className="font-medium">#####</TableCell>
                      <TableCell className="" style={{padding:"0 10px"}}>
                        {/* <Badge variant="outline" className="bg-background">
                        </Badge> */}
                          1376327678
                      </TableCell>
                      <TableCell style={{padding:"0 10px"}} className="text-left font-medium">{product.name} €</TableCell>
                      <TableCell style={{padding:"9px"}} className="text-right flex
                      items-center justify-center font-medium">
                        <Badge variant="outline" className="bg-background   text-center" style={{fontSize:"11px"}}>
                          {/* {product.category} */}
                        {product.price}
                        </Badge>
                        </TableCell>
                      <TableCell style={{padding:"0 10px"}} className="text-center">
                        <div className="flex items-center justify-center">
                          <span className={`font-medium ${product.quantity < product.threshold ? 'text-orange-500' : ''} ${product.quantity === 0 ? 'text-red-500' : ''}`}>
                            {product.quantity}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1 te">/{product.threshold}</span>
                        </div>
                         {/* <Badge variant="outline" className="bg-background   text-center" style={{padding:"0 10px",fontSize:"11px"}} > */}
                          {/* {product.category} */}
                        {/* {product.price}
                        </Badge> */}
                      </TableCell>
                      <TableCell style={{padding:"0 10px"}} className="text-center">
                        {/* <Badge variant={badgeVariant} className={
                          status.label === "Bas" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : 
                          status.label === "Rupture" ? "bg-red-100 text-red-800 hover:bg-red-200" : ""
                        }>
                          {status.label}
                        </Badge> */}
                        HLUK
                      </TableCell>
                      <TableCell style={{padding:"0 10px"}} className="">
                      <Badge variant="outline" className="bg-background" >
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell style={{padding:"0 10px"}} className="">
                      <Badge variant="outline" className="bg-background">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell style={{padding:"0 10px"}} className="">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 ml-5 text-center">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <div className="head bg-slate-200 mb-3 p-2 text-sm text-center">
                              <h4>{product.name}</h4>
                            </div>
                            <div className="item   mb-3 p-1 px-3 text-sm text-center">
                            <span className="pr-3  text-gray-600 font-semibold py-1.5">
                                   Prix Affiché
                              </span>
                            : <span className="pl-2 font-semibold" style={{fontSize:"13px"}}>
                                  500 000 000
                              </span>
                            </div>
                            <div className="item   mb-3 p-1 px-3 text-sm text-center">
                            <span className="pr-3  text-gray-600 font-semibold py-1.5">
                                   Dérnier prix
                              </span>
                            : <span className="pl-2 font-semibold" style={{fontSize:"13px"}}>
                                  500 000 000
                              </span>
                            </div>
                            <div className="item   mb-3 p-1 px-3 text-sm text-center">
                            <span className="pr-3  text-gray-600 font-semibold py-1.5">
                                 Emplacement
                              </span>
                            : <span className="pl-2 font-semibold" style={{fontSize:"13px"}}>
                                 MAGASIN
                              </span>
                            </div>
                            
                            
                             
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell style={{padding:"0 10px"}}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem  >
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem  >
                            Mettre à jour stock
                          </DropdownMenuItem>
                          <DropdownMenuItem  >
                            Dupliquer
                          </DropdownMenuItem>
                          <DropdownMenuItem  >
                            Historique
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Package className="h-8 w-8 mb-2" />
                      <p>Aucun produit ne correspond à ces critères</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center py-4 px-6 border-t">
        <div className="text-sm text-muted-foreground">
          {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
        </div>
        {/* <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un produit
        </Button> */}
      </CardFooter>
    </Card>
  );
};

export default ProductTable;
