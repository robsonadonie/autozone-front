
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Sample data - In a real app, this would come from your backend
const alerts = [
  {
    id: 1,
    product: "Laptop Dell XPS 13",
    type: "low_stock",
    quantity: 3,
    threshold: 5,
  },
  {
    id: 2,
    product: "Écran Samsung 27\"",
    type: "low_stock",
    quantity: 2,
    threshold: 10,
  },
  {
    id: 3,
    product: "Clavier Logitech MX",
    type: "out_of_stock",
    quantity: 0,
    threshold: 5,
  },
  {
    id: 4,
    product: "Souris Microsoft",
    type: "expiring",
    expiryDate: "2025-04-30",
  },
];

const StockAlerts = ({stock}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl" style={{fontSize:"16px"}}>Alertes de stock</CardTitle>
            <CardDescription className="mt-2">Produits nécessitant votre attention</CardDescription>
          </div>
          <Link to="/stock">
            <Button variant="ghost" size="sm" className="gap-1">
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent>
        {
          (stock.filter((item)=>item.quantite <= 3)).sort((acc,el)=>acc.quantite - el.quantite).length != 0 ?
        <div className="space-y-3 mt-2">
          {(stock.filter((item)=>item.quantite <= 3)).sort((acc,el)=>acc.quantite - el.quantite).map((alert) => (
            <Alert className={`flex items-center ${alert.quantite == 0 ? "border-orange-500 bg-red-100" : "border-amber-500 bg-amber-50"}`}
              key={alert.id} 
            
            >
              <AlertTriangle color="orange" className="h-4 w-4 text-red-700 " />
              <AlertTitle className="flex w-full justify-between items-center text-gray-600 font-medium " style={{fontSize:"13px"}}> 
              {alert.designation} / {alert.categorie} / {alert.emplacement} 
              <AlertDescription>
                {alert.quantite} en stock
              </AlertDescription>
              </AlertTitle>
            </Alert>
          ))}
        </div>
        :
        <p>Aucune alerte stock trouvéde</p>
        }
      </CardContent>
    </Card>
  );
};

export default StockAlerts;
