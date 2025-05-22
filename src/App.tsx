
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RegisterItem from "./pages/RegisterItem";
import CollectionRequest from "./pages/CollectionRequest";
import Information from "./pages/Information";
import Marketplace from "./pages/Marketplace";
import RecycleLocator from "./pages/RecycleLocator";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => {
  // First create the QueryClient, then wrap everything with the provider
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="/register" element={<RegisterItem />} />
              <Route path="/request" element={<CollectionRequest />} />
              <Route path="/information" element={<Information />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/locator" element={<RecycleLocator />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
