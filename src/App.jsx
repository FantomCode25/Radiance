import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { TherapistAuthProvider } from "./hooks/useTherapistAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import TherapistLogin from "./pages/TherapistLogin";
import Signup from "./pages/Signup";
import TherapistSignup from "./pages/TherapistSignup";
import Quiz from "./pages/Quiz";
import Therapists from "./pages/Therapists";
import TherapistSession from "./pages/TherapistSession";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TherapistAuthProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/therapist-login" element={<TherapistLogin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/therapist-signup" element={<TherapistSignup />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/therapists" element={<Therapists />} />
                <Route path="/therapists/:id/session" element={<TherapistSession />} />
                <Route path="/users/:id/session" element={<TherapistSession />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </TherapistAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;