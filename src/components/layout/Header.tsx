
import { useEffect, useState } from "react";
import { Bell, Menu, Search, User, Sun, Moon, LogOut, Settings, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {jwtDecode} from "jwt-decode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { changeCollapse } from "@/redux/slice/collapsed";
import { OneUserAsync } from "@/redux/Async/userAuthAsync";

interface HeaderProps {
  toggleSidebar: () => void;
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
}


const Header = ({ toggleSidebar, user, onLogout }: HeaderProps) => {

  const OneUser = useSelector((state:RootState)=>state.OneUserSlice)
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toast } = useToast();
  interface decode {
    id: number,
    email: string,
    status: string,
    createdAt:string,
    role: string,
    person: {
        id: number,
        name: string,
        createdAt: string,
        deletedAt: string,
    }
  }

  const [decoded, setDecoded] = useState({
    id: 0,
    email: "",
    status: "1",
    createdAt:"",
    role: "",
    person: {
        id: 0,
        name: "",
        createdAt: "",
        deletedAt: null,
    }
}) as decode | any;

  
  
  const token = localStorage.getItem("token");
  
    useEffect(()=>{
    if (token) {
    const decoded = jwtDecode(token);
    setDecoded(decoded as decode)
  }
  dispatch(OneUserAsync(decoded.id))
},[])

  useEffect(()=>{
  dispatch(OneUserAsync(decoded.id))
},[decoded.id])

  const toggleTheme = () => {
    setIsDarkMode(isDarkMode ? false : true);
    // In a real implementation, this would actually toggle the theme
    toast({
      title: `Mode ${!isDarkMode ? "sombre" : "clair"} activé`,
      description: "Le thème a été mis à jour",
    });
  };
  const CollapseSlice = useSelector((state :RootState)=>state.CollapseSlice.statue)

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "Vous avez 3 nouvelles notifications",
    });
  };

  // Get user initials for avatar
  const getInitials = () => {
    // if (!user?.name){ 
    //   localStorage.clear()
    //   window.location.href ="/auth/login",
    //   window.location.reload()
    // }else{

    //   return user.name
    //     .split(' ')
    //     .map((n) => n[0])
    //     .join('')
    //     .toUpperCase()
    //     .substring(0, 2);
    // };
    }
  const dispatch = useDispatch<AppDispatch>()
  const setIsOpen = () => {
    dispatch(changeCollapse(true))
  };
  function disconect (){
      localStorage.clear()
      window.location.href ="auth/login"
  }
  if(token == "" || token == undefined){
    disconect()
  }
  if(OneUser.error == "use-not-found"){
    disconect()
  }

  return (
    <motion.header 
      className="bg-white border-b border-border h-12 px-4 flex items-center justify-between shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      
      {
       (OneUser.data as any)?.status== "0" &&
        <div className="fixed h-full z-50 flex justify-center pt-8  bg-black/50 w-full top-0 left-0">
     <div className="isNot  block   h-fit w-fit p-4 py-1.5 text-white rounded bg-red-400" style={{fontSize:"13px"}}>
            <h4>Votre compte est desactivé</h4>
     </div>

        </div>
      }
      <div className="flex items-center gap-4">
      <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen()}
          className="text-sidebar-foreground bg-slate-100 text-slate-800 hover:bg-slate-500 h-8 w-8 !p-0 hover:text-white"
        >
          {CollapseSlice ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        {OneUser.error}
        {/* {decoded.role} */}
        {/* <h1 className="text-xl font-bold tracking-tight" style={{fontSize:"18px"}}>Tableau de bord</h1> */}

        {/* <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div> */}
      </div>

      <div className="flex items-center gap-3">
        {/* <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button variant="ghost" size="icon" onClick={handleNotificationClick}>
          <Bell className="h-5 w-5" />
        </Button> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-0 w-0 rounded-full">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">{(OneUser.data as any)?.email?.split(" ")[0][0]} { ((OneUser.data as any)?.email?.split(" "))?.length != 1 &&(OneUser.data as any)?.email?.split(" ")[1][0] }</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user && (
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{(OneUser.data as any)?.email}</p>
                <p className="text-xs text-muted-foreground">{(OneUser.data as any)?.role}</p>
              </div>
            )}
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={()=>{localStorage.clear(), disconect()}}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default Header;
