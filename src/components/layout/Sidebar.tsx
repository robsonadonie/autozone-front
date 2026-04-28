
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  Package, 
  Users, 
  Truck, 
  FileText, 
  BookOpen, 
  LayoutGrid, 
  ClipboardList, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  ShoppingBag,
  ShoppingCart,
  LogOut,
  UserCheck,
  ScreenShare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { AboutAsyncThunk } from "@/redux/Async/aboutAsyncThunk";
import { jwtDecode } from "jwt-decode";
import { OneUserAsync } from "@/redux/Async/userAuthAsync";

import { APP_URL } from "../../../process.env";
interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapseSlice: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, isCollapseSlice }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  
  return (
    <Link
      to={to}
      className={cn(
        "sidebar-link flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground text-xs transition-all duration-200",
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"
      )}
    >
      <Icon size={14} />
      {!isCollapseSlice && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="whitespace-nowrap text-xs"
        >
          {label}
        </motion.span>
      )}
    </Link>
  );
};
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const CollapseSlice = useSelector((state :RootState)=>state.CollapseSlice.statue)
  // const CollapseSlice = !isOpen;

  
 const OneUser = useSelector((state:RootState)=>state.OneUserSlice)
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
  }) as any;
    
    
    const token = localStorage.getItem("token");
    
    useEffect(()=>{
      if (token) {
      const decoded = jwtDecode(token);
      setDecoded(decoded as any)
    }
  },[])
  useEffect(()=>{
    dispatch(OneUserAsync(decoded.id))
  },[decoded.id])
 
  
  const about = useSelector((state :RootState)=>state.AboutSlice)
  const dispatch = useDispatch<AppDispatch>()
  useEffect(()=>{
    dispatch(AboutAsyncThunk())
  },[])
  const data = about.data
  function disconect (){
    localStorage.clear()
    window.location.href ="/auth/login",
    window.location.reload()
}
  return (
    <motion.aside 
      className={cn(
        "bg-sidebar flex flex-col h-screen transition-none duration-2 sticky top-0",
      )}
      animate={{ 
        width: CollapseSlice ? "3.7rem" : "7rem",
      }}
      transition={{ duration: 0.3, type: "spring", stiffness: 120 }}
    >
      <div className="flex items-center  flex-col justify-between py-4">
        {!CollapseSlice && (
          <Link to={"/"}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2"
          >
 

            <img src={APP_URL+"/images/logo3.png"} width={"60"}/>
            {/* <ShoppingBag size={20} className="text-sidebar-primary" /> */}
            <h1 className="text-xs font-bold text-sidebar-foreground"  style={{fontSize:"16px"}}>{(data  as any).nom}</h1>
          </motion.div>
            </Link>
        )}
      
      </div>
     

      <Separator className="bg-sidebar-border" />

      <nav className="flex-1 space-y-1 overflow-y-auto "  style={{fontSize:"13px"}}>
        <SidebarLink to="/stock" icon={Package} label="Stock" isCollapseSlice={CollapseSlice} />
        <SidebarLink to="/Ventes" icon={ShoppingCart} label="Ventes" isCollapseSlice={CollapseSlice} />
        <SidebarLink to="/clients"  icon={User} label="Clients" isCollapseSlice={CollapseSlice} />
        <SidebarLink to="/invoices" icon={FileText} label="Factures" isCollapseSlice={CollapseSlice} />
          <SidebarLink to="/journals" icon={BookOpen} label="Journaux" isCollapseSlice={CollapseSlice} />
        <SidebarLink to="/settings" icon={Settings} label="Paramètres" isCollapseSlice={CollapseSlice} />
      </nav> 
      <div className="p-4 px-0">
        {!CollapseSlice && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-sidebar-foreground/70"
          >
            <div className="logOut w-full justify-center border-t border-indigo-300 pt-4 flex items-center gap-2">
            <LogOut size={16}></LogOut>
            <button style={{fontSize :"12px"}}  onClick={()=>{localStorage.clear(), disconect()}}>Se deconnecter</button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
