
import { Package, ShoppingCart, Users, FileText } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import InventorySummaryChart from "@/components/dashboard/InventorySummaryChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StockAlerts from "@/components/dashboard/StockAlerts";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { ClientAsync } from "@/redux/Async/ClientAsync";
import { useEffect } from "react";
import { StockAsync } from "@/redux/Async/stockAsync";
import { VentesAsync } from "@/redux/Async/VentesAsync";

const Dashboard = () => {

  const AllClient =  useSelector((state : RootState)=>state.ClientSlice.data)
  const Ventes =  useSelector((state : RootState)=>state.VentesSlice.data)
  const DataStock = useSelector((state: RootState) => state.StockSlice.data)

  const now = Ventes.filter((item)=>(new Date(item.createdAt).toLocaleDateString()) == ((new Date()).toLocaleDateString()))

  const dispatch = useDispatch<AppDispatch>()
  
  useEffect(()=>{
    dispatch(StockAsync())
    dispatch(VentesAsync())
    dispatch(ClientAsync())
  },[])

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

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* <h1 className="text-xl font-bold tracking-tight" style={{fontSize:"18px"}}>Tableau de bord</h1> */}
        {/* <p className="text-muted-foreground text mt-1" style={{fontSize:"15px"}}>Aperçu de la gestion du stock et des performances</p> */}
      </motion.div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="p-0" variants={item}>
          <StatsCard
            title="Total des produits"
            value={DataStock.length}
            icon={Package}
            // description="42 catégories"
            // trend={3.2}
            className="p-0"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title="Commandes"
            value="124"

            icon={ShoppingCart}
            // description="Derniers 30 jours"
            // trend={-2.5}
            iconColor="text-green-600"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title="Clients actifs"
            value={AllClient.length}
            icon={Users}
            // description="12 nouveaux ce mois"
            // trend={8.1}
            iconColor="text-blue-600"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title="Factures"
            value="€ 28,450"
            icon={FileText}
            // description="7 en attente"
            // trend={5.3}
            iconColor="text-yellow-600"
          />
        </motion.div>
      </motion.div>

      <motion.div
        // className="grid gap-4 bg-black md:grid-cols-2 lg:grid-cols-3"
        className="flex w-full gap-3 items-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >

        <div className=" grow">
          {/* <RecentActivity  data={now}/> */}
          <RecentActivity  data={[]}/>
        </div>
        <div className="grow ">
          <StockAlerts stock={DataStock}/>
        </div>
      </motion.div>
      {/* <div className=" ">
          <InventorySummaryChart />
        </div> */}
    </div>
  );
};

export default Dashboard;
