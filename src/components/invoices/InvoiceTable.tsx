
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
import { Search, MoreHorizontal, Eye, Printer, FileText } from "lucide-react";

// Sample data - would be fetched from API in real application
const initialInvoices = [
  {
    id: 1,
    number: "F-2023-085",
    client: "Entreprise ABC",
    date: "2025-03-28",
    dueDate: "2025-04-27",
    amount: 1850.75,
    status: "Payée",
  },
  {
    id: 2,
    number: "F-2023-086",
    client: "Société XYZ",
    date: "2025-03-29",
    dueDate: "2025-04-28",
    amount: 3275.50,
    status: "En attente",
  },
  {
    id: 3,
    number: "F-2023-087",
    client: "Association GHI",
    date: "2025-03-30",
    dueDate: "2025-04-29",
    amount: 950.00,
    status: "En attente",
  },
  {
    id: 4,
    number: "F-2023-088",
    client: "Groupe DEF",
    date: "2025-04-02",
    dueDate: "2025-05-02",
    amount: 2340.25,
    status: "Payée",
  },
  {
    id: 5,
    number: "F-2023-089",
    client: "Corporation 123",
    date: "2025-04-05",
    dueDate: "2025-05-05",
    amount: 1250.00,
    status: "Envoyée",
  },
];

const InvoiceTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState(initialInvoices);

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Payée':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Payée</Badge>;
      case 'En attente':
        return <Badge variant="secondary">En attente</Badge>;
      case 'Envoyée':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Envoyée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une facture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>Créer une facture</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono text-sm font-medium">{invoice.number}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Envoyer
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

export default InvoiceTable;
