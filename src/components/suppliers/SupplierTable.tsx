
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, FileEdit, Trash2, ExternalLink } from "lucide-react";

// Sample data - would be fetched from API in real application
const initialSuppliers = [
  {
    id: 1,
    code: "SUP-001",
    name: "Dell Technologies",
    contact: "Jean Dupont",
    email: "j.dupont@dell.example.com",
    phone: "+33 1 23 45 67 89",
    category: "Électronique",
    status: "Active",
  },
  {
    id: 2,
    code: "SUP-002",
    name: "Samsung Electronics",
    contact: "Marie Martin",
    email: "m.martin@samsung.example.com",
    phone: "+33 1 23 45 67 90",
    category: "Électronique",
    status: "Active",
  },
  {
    id: 3,
    code: "SUP-003",
    name: "Logitech",
    contact: "Pierre Bernard",
    email: "p.bernard@logitech.example.com",
    phone: "+33 1 23 45 67 91",
    category: "Périphériques",
    status: "Active",
  },
  {
    id: 4,
    code: "SUP-004",
    name: "Microsoft",
    contact: "Sophie Petit",
    email: "s.petit@microsoft.example.com",
    phone: "+33 1 23 45 67 92",
    category: "Logiciels",
    status: "Inactive",
  },
  {
    id: 5,
    code: "SUP-005",
    name: "Anker",
    contact: "Michel Robert",
    email: "m.robert@anker.example.com",
    phone: "+33 1 23 45 67 93",
    category: "Accessoires",
    status: "Active",
  },
];

const SupplierTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suppliers, setSuppliers] = useState(initialSuppliers);

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un fournisseur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>Ajouter un fournisseur</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-mono text-sm">{supplier.code}</TableCell>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{supplier.category}</TableCell>
                <TableCell>
                  <Badge variant={supplier.status === "Active" ? "outline" : "secondary"}>
                    {supplier.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Voir les produits
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(supplier.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SupplierTable;
