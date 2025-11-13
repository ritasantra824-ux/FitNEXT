import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import BMI from "./pages/BMI";
import Meals from "./pages/Meals";
import RecipeDetail from "./pages/RecipeDetail";
import Workouts from "./pages/Workouts";
import AITrainer from "./pages/AITrainer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import SetupProfile from "./pages/SetupProfile";
import ViewProfile from "./pages/ViewProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Auth />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/bmi" element={<ProtectedRoute><BMI /></ProtectedRoute>} />
          <Route path="/meals" element={<ProtectedRoute><Meals /></ProtectedRoute>} />
          <Route path="/recipe" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
          <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
          <Route path="/ai-trainer" element={<ProtectedRoute><AITrainer /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/setup-profile" element={<SetupProfile />} />
          <Route path="/view-profile" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
