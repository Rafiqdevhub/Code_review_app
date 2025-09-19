import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RateLimitProvider } from "@/contexts/RateLimitContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DevelopmentBanner from "@/components/DevelopmentBanner";
import Home from "./pages/Home";
import Index from "./pages/Index";
import CodeReview from "./pages/CodeReview";
import AiChat from "./pages/AiChat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RateLimitProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <DevelopmentBanner />
          <BrowserRouter>
            <Routes>
              {/* Public routes that redirect authenticated users */}
              <Route
                path="/login"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Login />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Register />
                  </ProtectedRoute>
                }
              />

              {/* Main app routes - accessible to guests until rate limited */}
              <Route path="/" element={<Home />} />
              <Route path="/old" element={<Index />} />
              <Route path="/review" element={<CodeReview />} />
              <Route path="/chat" element={<AiChat />} />

              {/* Authentication-only routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RateLimitProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
