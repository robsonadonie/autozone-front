
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { FileText, ShoppingCart, Truck } from "lucide-react";

// Sample data - would come from API in a real application
const activities = [
  {
    id: 1,
    type: "invoice",
    description: "Facture #F-2023-089 créée pour Client XYZ",
    date: "2025-04-05T10:30:00",
    amount: "1,250.00 €",
  },
  {
    id: 2,
    type: "purchase",
    description: "Commande #PO-458 reçue des Fournisseurs ABC",
    date: "2025-04-04T14:15:00",
    amount: "3,780.50 €",
  },
  {
    id: 3,
    type: "sale",
    description: "Vente #S-2023-156 à Client DEF",
    date: "2025-04-04T09:45:00",
    amount: "950.75 €",
  },
  {
    id: 4,
    type: "invoice",
    description: "Facture #F-2023-088 payée par Client GHI",
    date: "2025-04-03T16:20:00",
    amount: "2,340.00 €",
  },
  {
    id: 5,
    type: "purchase",
    description: "Commande #PO-457 passée à Fournisseurs JKL",
    date: "2025-04-03T11:10:00",
    amount: "1,875.25 €",
  },
];

const RecentActivity = ({data}) => {
  const [tabValue, setTabValue] = useState("all");

  const filteredActivities = 
    tabValue === "all" 
      ? activities 
      : activities.filter(activity => activity.type === tabValue);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "invoice":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "purchase":
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case "sale":
        return <Truck className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl" style={{fontSize:"16px"}}>Vente d'ajourd'hui</CardTitle>
        <CardDescription>Les dernières transactions et mises à jour</CardDescription>
      </CardHeader>
      {
        data?.length !=0 ?
      <CardContent>
        <Tabs value={tabValue} onValueChange={setTabValue}>
          {/* <TabsList className="mb-4">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="invoice">Factures</TabsTrigger>
            <TabsTrigger value="purchase">Achats</TabsTrigger>
            <TabsTrigger value="sale">Ventes</TabsTrigger>
          </TabsList> */}
          
          <TabsContent value={tabValue} className="mt-4">
            <div className="space-y-4">
              {data?.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start space-x-3 border-b border-border pb-3 last:border-0"
                >
                  <div className="mt-0.5">
                    {(activity.stock.designation)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity?.admin.name}</p>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity?.createdAt)}
                      </p>
                      <p className="text-xs font-medium">{activity?.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      :
      <div className="text-center">
        <p style={{fontSize :"13px"}}>Aucune vente aujourd'hui</p>
      </div>
      }
    </Card>
  );
};

export default RecentActivity;
