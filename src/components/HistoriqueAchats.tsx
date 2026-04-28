import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Eye } from "lucide-react";
import { Client, HistoriqueFacture } from "@/types/client";
import CountUp from "react-countup";

interface HistoriqueAchatsProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  historique: HistoriqueFacture[];
}

export const HistoriqueAchats = ({ 
  isOpen, 
  onClose, 
  client, 
  historique 
}: HistoriqueAchatsProps) => {
    function formatNumber(value) {
      if (!value) return '';
      return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 2
      }).format(value);
    }
  const [searchTerm, setSearchTerm] = useState("");
let SellingStory = historique.filter((item :any)=>item.client.id == client?.id)

// const filteredHistorique = []
  const filteredHistorique = SellingStory?.filter((item :any) =>
    item.mode_paiement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalHT = filteredHistorique?.reduce((sum, item : any) => sum + item.total_HT, 0);
  const totalTTC = filteredHistorique?.reduce((sum, item : any) => sum + item.total_TTC, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden m-auto " style={{left :'56vw'}}>
        <DialogHeader>
          <DialogTitle>Historique des achats</DialogTitle>
          <DialogDescription>
            {client && (
              <span>Client: {client.name} - {client.firstName}</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recherche et statistiques */}
          <div className="flex items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans l'historique..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium">Total HT: </span>
                <Badge variant="secondary">
                {(totalHT || 0)}
                 &nbsp;&nbsp; Ar
                  </Badge> 
              </div>
              <div className="text-sm">
                <span className="font-medium">Total TTC: </span>
                <Badge variant="default"> {(totalTTC || 0)} &nbsp;&nbsp;Ar</Badge>
              </div>
              {/* <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button> */}
            </div>
          </div>

          {/* Tableau de l'historique */}
          <div className="border rounded-md overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    {/* <TableHead>N° Facture</TableHead> */}
                    <TableHead>Désignation</TableHead>
                    <TableHead>Prix unitaire</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Montant Total TVA</TableHead>
                    <TableHead>Total HT</TableHead>
                    <TableHead>Total TTC</TableHead>
                    {/* <TableHead className="w-[60px]"></TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistorique.map((item :any, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(item.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                      {/* <TableCell className="font-medium" style={{fontSize :"13px"}}>{item.numeroFacture}</TableCell> */}
                      <TableCell>{item?.stock?.designation} ~ {item?.stock?.categorie.toLowerCase()}</TableCell>
                      <TableCell>{formatNumber(item.stock.prix_affiche.toFixed(2))} Ar</TableCell>
                      <TableCell>{item.quantite}</TableCell>
                      <TableCell>{(formatNumber(item?.TVA) || 0)}  Ar</TableCell>
                      <TableCell>{(formatNumber(item?.total_HT) || 0)}  Ar</TableCell>
                      <TableCell className="font-medium">{(formatNumber(item?.total_TTC) || 0)}  Ar</TableCell>
                      {/* <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {filteredHistorique.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "Aucun résultat trouvé" : "Aucun historique d'achat"}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
