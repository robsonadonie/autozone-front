import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UtilisateurPage = () => {
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsApp, setNotificationsApp] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profil utilisateur</h1>
        <Button>Sauvegarder les changements</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardContent className="pt-6 flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="" />
              <AvatarFallback className="text-xl">JB</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">Jean Bertrand</h3>
            <p className="text-sm text-muted-foreground mb-4">Administrateur</p>
            <Button variant="outline" className="w-full mb-2">Changer la photo</Button>
            <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
              Supprimer la photo
            </Button>
          </CardContent>
        </Card>
        
        <div className="md:col-span-3">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="account">Compte</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" defaultValue="Jean" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" defaultValue="Bertrand" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="jean.bertrand@example.com" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" defaultValue="+33 6 12 34 56 78" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rôle</Label>
                      <Select defaultValue="admin">
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrateur</SelectItem>
                          <SelectItem value="manager">Gestionnaire</SelectItem>
                          <SelectItem value="user">Utilisateur</SelectItem>
                          <SelectItem value="viewer">Visualisateur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Informations professionnelles</CardTitle>
                  <CardDescription>Mettez à jour vos informations professionnelles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Entreprise</Label>
                    <Input id="company" defaultValue="AMIDIO SAS" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Titre du poste</Label>
                      <Input id="jobTitle" defaultValue="Directeur Commercial" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Département</Label>
                      <Input id="department" defaultValue="Ventes" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Modifier le mot de passe</CardTitle>
                  <CardDescription>Assurez-vous que votre compte utilise un mot de passe long et sécurisé</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  
                  <Button className="w-full sm:w-auto">Mettre à jour le mot de passe</Button>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Authentification à deux facteurs</CardTitle>
                  <CardDescription>Ajoutez une couche de sécurité supplémentaire à votre compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Authentification par application</p>
                      <p className="text-sm text-muted-foreground">Utilisez une application d'authentification</p>
                    </div>
                    <Button variant="outline">Configurer</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Authentification par SMS</p>
                      <p className="text-sm text-muted-foreground">Recevez un code par SMS</p>
                    </div>
                    <Button variant="outline">Configurer</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                  <CardDescription>Gérez comment vous recevez les notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications par email</p>
                      <p className="text-sm text-muted-foreground">Recevez des notifications par email</p>
                    </div>
                    <Switch 
                      checked={notificationsEmail} 
                      onCheckedChange={setNotificationsEmail} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications dans l'application</p>
                      <p className="text-sm text-muted-foreground">Recevez des notifications dans l'application</p>
                    </div>
                    <Switch 
                      checked={notificationsApp} 
                      onCheckedChange={setNotificationsApp} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Emails marketing</p>
                      <p className="text-sm text-muted-foreground">Recevez des emails sur les nouveaux produits et fonctionnalités</p>
                    </div>
                    <Switch 
                      checked={marketingEmails} 
                      onCheckedChange={setMarketingEmails} 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UtilisateurPage;