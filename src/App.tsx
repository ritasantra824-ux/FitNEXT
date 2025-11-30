import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navigation from "./components/Navigation";

import Home from "./pages/Home";
import BMI from "./pages/BMI";
import Meals from "./pages/Meals";
import RecipeDetail from "./pages/RecipeDetail";
import Workouts from "./pages/Workouts";
import AITrainer from "./pages/AITrainer";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";

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

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* PROFILE SYSTEM */}
          <Route path="/setup-profile" element={<SetupProfile />} />
          <Route path="/profile" element={<ViewProfile />} />

          {/* PUBLIC PAGES */}
          <Route path="/" element={<Home />} />
          <Route path="/bmi" element={<BMI />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/recipe" element={<RecipeDetail />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/ai-trainer" element={<AITrainer />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
