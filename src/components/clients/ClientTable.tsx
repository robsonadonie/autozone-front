
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
import { Search, MoreHorizontal, FileEdit, Trash2, FileText } from "lucide-react";

// Sample data - would be fetched from API in real application
const initialClients = [
  {
    id: 1,
    code: "CLI-001",
    name: "Entreprise ABC",
    contact: "Thomas Dubois",
    email: "t.dubois@entrepriseabc.example.com",
    phone: "+33 1 23 45 67 94",
    status: "Active",
    lastOrder: "2025-03-28",
  },
  {
    id: 2,
    code: "CLI-002",
    name: "Société XYZ",
    contact: "Celine Moreau",
    email: "c.moreau@xyz.example.com",
    phone: "+33 1 23 45 67 95",
    status: "Active",
    lastOrder: "2025-04-02",
  },
  {
    id: 3,
    code: "CLI-003",
    name: "Corporation 123",
    contact: "Luc Lambert",
    email: "l.lambert@corp123.example.com",
    phone: "+33 1 23 45 67 96",
    status: "Inactive",
    lastOrder: "2025-02-15",
  },
  {
    id: 4,
    code: "CLI-004",
    name: "Groupe DEF",
    contact: "Emma Rousseau",
    email: "e.rousseau@groupedef.example.com",
    phone: "+33 1 23 45 67 97",
    status: "Active",
    lastOrder: "2025-04-03",
  },
  {
    id: 5,
    code: "CLI-005",
    name: "Association GHI",
    contact: "Antoine Marchand",
    email: "a.marchand@assoghi.example.com",
    phone: "+33 1 23 45 67 98",
    status: "Active",
    lastOrder: "2025-03-20",
  },
];

const ClientTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState(initialClients);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setClients(clients.filter(client => client.id !== id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>Ajouter un client</Button>
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
              <TableHead>Status</TableHead>
              <TableHead>Dernière commande</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-mono text-sm">{client.code}</TableCell>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.contact}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <Badge variant={client.status === "Active" ? "outline" : "secondary"}>
                    {client.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(client.lastOrder)}</TableCell>
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
                        <FileText className="mr-2 h-4 w-4" />
                        Voir les factures
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(client.id)}
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

export default ClientTable;
