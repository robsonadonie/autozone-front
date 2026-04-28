
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { AdduserAuthAsync } from "@/redux/Async/userAuthAsync";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { UserAsync } from "@/redux/Async/UserAsync";
import { changeAddUser } from "@/redux/slice/UserSlice";
import { AboutAsyncThunk } from "@/redux/Async/aboutAsyncThunk";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const dispatch = useDispatch<AppDispatch>()


  const AddUserSlice = useSelector((state: RootState) => state.AddUserSlice) as any
  const OneUser = useSelector((state: RootState) => state.OneUserSlice)
  useEffect(() => {
    if (!AddUserSlice.loading && AddUserSlice.status == "created") {
      dispatch(UserAsync())
    
          toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
      
      setTimeout(() => {
        
        navigate("/auth/login");
      }, 1000)

      dispatch(changeAddUser(""))
      dispatch(AboutAsyncThunk())
    }
   
  }, [AddUserSlice.loading])
  
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
     
    setIsLoading(true);
    
    // This is a mock registration function
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newClient = {
        email: name,
        password: password,
        passwordConfirm: password,
        role: "admin"
      }
      dispatch(AdduserAuthAsync(newClient as any))
     
  }catch{
    
  }
  }
  
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-4"
      >
        <Card className="border-border/40 shadow-lg">
          <CardHeader className="space-y-1 text-center block">
            <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
            <CardDescription>
              Inscrivez-vous pour accéder à AutoZone
            </CardDescription>
          </CardHeader>
            <br />  
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2 hidden">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {AddUserSlice.loading ? "Ajoute en cours ..." :  (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    S'inscrire
                  </>
                )}
              </Button>
              <div className="mt-4 text-center text-sm">
                Vous avez déjà un compte?{" "}
                <Link to="/auth/login" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          © 2025 AutoZone. Tous droits réservés.
        </p>
      </motion.div>
    </div>
  );
};


export default Register;
