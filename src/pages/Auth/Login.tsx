
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
import { Eye, EyeOff, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { LoginAsync } from "@/redux/Async/userAuthAsync";
import { changeLogin } from "@/redux/slice/UserSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  const LoginSlice =  useSelector((state:RootState)=>state.LoginSlice)
  // Check if user is already logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/");
    dispatch(changeLogin(""))

    }
  }, [navigate]);
  useEffect(() => {
  if(!LoginSlice.loading && (LoginSlice.status !="" || JSON.stringify(LoginSlice.token) != '{"token":""}')) { try {
      // Simulate API call
       new Promise((resolve) => setTimeout(resolve, 1500));
      
      // For demo purposes, let's consider admin@example.com/password as valid credentials
      if (LoginSlice.token.token != "") {
        // Save user data to localStorage (in a real app, you'd use a token)
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", LoginSlice.token.token );
        localStorage.setItem("user", JSON.stringify({ 
          name: "OAuth", 
          email: "OAuth",
          role: "OAuth" 
        }));
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur AutoZone",
        });
        
        // Redirect to home page
        navigate("/");
      } else {
        toast({
          title: "Échec de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se connecter, veuillez réessayer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }}
  }, [LoginSlice.loading]);
  
  const dispatch = useDispatch<AppDispatch>()


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(LoginAsync({email:email,password:password} as any)) 
 
  };
  function clear(){
    dispatch(changeLogin(""))
  }

  return (
    <div className="flex items-center justify-center min-h-screen  from-primary/20 to-background bg-redd-500">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-4"
      >
        <Card className="border-border/40 shasdow-lg py-8">
          <CardHeader className="flex flex-col space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-red-500 ">AutoZone</CardTitle> 
            <CardDescription>
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin} className="mt-8">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Nom complet *</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Saisissez votre nom !"
                  value={email}
                  onChange={(e) => {setEmail(e.target.value),clear()}}
                />
              </div>
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe *</Label>
                  {/* <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
                    Mot de passe oublié?
                  </Link> */}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value),clear()}}
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
            </CardContent>
            <p className="text-red-500 ml-4 text-xs">
              {
                LoginSlice.status.includes("email") ? "Veuillez vérifier votre nom" : (LoginSlice.status.includes("password") && "Mot de passe incorrect")
              }
              {
                LoginSlice.status == "desactived" && "Votre compte est desactivé !"
              }
            </p>
            <CardFooter className="flex flex-col  mt-2">
              <Button 
                type="submit" 
                className="w-full rounded bg-red-500 hover:bg-red-700" 
                disabled={isLoading}
              >
                {LoginSlice.loading ? "Connexion en cours..." : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Se connecter
                  </>
                )}
              </Button>
            </CardFooter>
              {/* <div className="mt-4 text-center text-sm">
                Vous n'avez pas de compte?{" "}
                <Link to="/auth/register" className="text-primary hover:underline">
                  S'inscrire
                </Link>
              </div> */}
          </form>
        </Card>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          © 2025 AutoZone. Tous droits réservés.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
