import { StrictMode, useEffect } from "react";
import { HashRouter, Routes, Route, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Stocks from "./pages/Stocks";
import Stock from "./pages/Stock";
import Suppliers from "./pages/Suppliers";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import Journals from "./pages/Journals";
import Miscellaneous from "./pages/Miscellaneous";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ClientPortal from "./pages/ClientPortal";
import Vente from "./pages/Ventes";
import UtilisateurPage from "./pages/User";
import ParametresPage from "./pages/Settings";

import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store/store";
import { UserAsync } from "./redux/Async/UserAsync";
import { AboutAsyncThunk } from "./redux/Async/aboutAsyncThunk";

import "@/global.style.css";

// Crée une instance QueryClient
const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(UserAsync());
    dispatch(AboutAsyncThunk());
  }, [dispatch]);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* Notifications */}
          <Toaster />
          <Sonner />

          {/* Routes */}
          <BrowserRouter>
          {/* <HashRouter> */}
            <Routes>
              {/* Auth routes */}
              <Route path="auth/login" element={<Login />} />
              <Route path="auth/register" element={<Register />} />
              <Route path="auth/forgot-password" element={<ForgotPassword />} />

              {/* Protected routes */}
              <Route path="" element={<Layout />}>
                <Route index element={<Stocks />} />
                <Route path="stock" element={<Stocks />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="ventes" element={<Vente />} />
                <Route path="clients" element={<Clients />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="journals" element={<Journals />} />
                <Route path="miscellaneous" element={<Miscellaneous />} />
                <Route path="user" element={<UtilisateurPage />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="settings" element={<ParametresPage />} />
                <Route path="client-portal" element={<ClientPortal />} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          {/* </HashRouter> */}
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;
