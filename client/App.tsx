import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import ProfessionalStrategyBuilder from "./pages/ProfessionalStrategyBuilder";
import Marketplace from "./pages/Marketplace";
import Learn from "./pages/Learn";
import Settings from "./pages/Settings";
import Backtest from "./pages/Backtest";
import Profile from "./pages/Profile";
import DebugStrategies from "./pages/DebugStrategies";
import UserStrategies from "./pages/UserStrategies";

const queryClient = new QueryClient();

import { AuthProvider } from "./context/AuthContext";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Index />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="builder" element={<ProfessionalStrategyBuilder />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="learn" element={<Learn />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="debug-strategies" element={<DebugStrategies />} />
              <Route path="user-strategies" element={<UserStrategies />} />
              <Route path="backtest/:id" element={<Backtest />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
