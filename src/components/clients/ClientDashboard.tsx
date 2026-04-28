
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Truck, FileText, User, Clock } from "lucide-react";
import { motion } from "framer-motion";

const ClientDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const orders = [
    { id: "ORD-234-567", status: "En livraison", date: "12/04/2025", amount: "€1,245.00" },
    { id: "ORD-234-566", status: "Livrée", date: "10/04/2025", amount: "€567.50" },
    { id: "ORD-234-565", status: "En préparation", date: "09/04/2025", amount: "€2,399.00" },
    { id: "ORD-234-564", status: "Livrée", date: "05/04/2025", amount: "€750.25" },
  ];

  const invoices = [
    { id: "FAC-345-678", status: "Payée", date: "12/04/2025", amount: "€1,245.00" },
    { id: "FAC-345-677", status: "Payée", date: "10/04/2025", amount: "€567.50" },
    { id: "FAC-345-676", status: "En attente", date: "09/04/2025", amount: "€2,399.00" },
    { id: "FAC-345-675", status: "En retard", date: "01/04/2025", amount: "€750.25" },
  ];

  const products = [
    { id: "PRD-456-789", name: "Écran Dell 27\"", stock: "Disponible", price: "€299.00" },
    { id: "PRD-456-788", name: "MacBook Pro 14\"", stock: "Sur commande", price: "€1999.00" },
    { id: "PRD-456-787", name: "Clavier Logitech MX", stock: "Disponible", price: "€89.00" },
    { id: "PRD-456-786", name: "SSD Samsung 1To", stock: "Disponible", price: "€129.00" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Espace Client</h1>
          <p className="text-muted-foreground">Gérez vos commandes, factures et profil</p>
        </div>
        <Input 
          placeholder="Rechercher une commande, une facture..." 
          className="max-w-sm" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des commandes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 ce mois-ci</p>
          </CardContent>
        </Card>
        
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">En cours de traitement</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factures impayées</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">€2,399.00 total</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livraisons</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Arrivée prévue demain</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
          <TabsTrigger value="products">Catalogue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Vos commandes récentes</CardTitle>
              <CardDescription>
                Suivez l'état de vos commandes et accédez aux détails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-2"
              >
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    variants={item}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === "Livrée" ? "bg-green-100 text-green-800" : 
                        order.status === "En livraison" ? "bg-blue-100 text-blue-800" : 
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status}
                      </span>
                      <span className="font-medium">{order.amount}</span>
                      <Button variant="ghost" size="sm">Détails</Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Vos factures</CardTitle>
              <CardDescription>
                Consultez et téléchargez vos factures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-2"
              >
                {invoices.map((invoice) => (
                  <motion.div
                    key={invoice.id}
                    variants={item}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        invoice.status === "Payée" ? "bg-green-100 text-green-800" : 
                        invoice.status === "En attente" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      }`}>
                        {invoice.status}
                      </span>
                      <span className="font-medium">{invoice.amount}</span>
                      <Button variant="ghost" size="sm">Télécharger</Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Catalogue produits</CardTitle>
              <CardDescription>
                Parcourez notre catalogue et vérifiez les disponibilités
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={item}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.stock === "Disponible" ? "bg-green-100 text-green-800" : 
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {product.stock}
                      </span>
                      <span className="font-medium">{product.price}</span>
                      <Button variant="outline" size="sm">Commander</Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil Client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                <p>Jean Dupont</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>jean.dupont@exemple.com</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                <p>06 12 34 56 78</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client depuis</p>
                <p>Janvier 2025</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Adresse de livraison</p>
              <p>123 Rue de la Paix, 75000 Paris, France</p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline">Modifier le profil</Button>
              <Button variant="outline">Changer de mot de passe</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
