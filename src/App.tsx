import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, FitSetupRoute, AuthRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Demo from "./pages/Demo";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ConnectFit from "./pages/ConnectFit";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Games from "./pages/Games";
import TicTacToe from "./pages/games/TicTacToe";
import MemoryFlip from "./pages/games/MemoryFlip";
import RockPaperScissors from "./pages/games/RockPaperScissors";
import ReactionTime from "./pages/games/ReactionTime";
import Snake from "./pages/games/Snake";
import SimonSays from "./pages/games/SimonSays";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes - No auth required */}
            <Route path="/" element={<Index />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Auth Routes - Redirect if already logged in */}
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
            
            {/* Fit Setup Route - Requires login, but not Fit yet */}
            <Route path="/connect-fit" element={<FitSetupRoute><ConnectFit /></FitSetupRoute>} />
            
            {/* Protected Routes - Require login + Google Fit */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="/demo" element={<ProtectedRoute><Demo /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
            <Route path="/games/tic-tac-toe" element={<ProtectedRoute><TicTacToe /></ProtectedRoute>} />
            <Route path="/games/memory-flip" element={<ProtectedRoute><MemoryFlip /></ProtectedRoute>} />
            <Route path="/games/rock-paper-scissors" element={<ProtectedRoute><RockPaperScissors /></ProtectedRoute>} />
            <Route path="/games/reaction-time" element={<ProtectedRoute><ReactionTime /></ProtectedRoute>} />
            <Route path="/games/snake" element={<ProtectedRoute><Snake /></ProtectedRoute>} />
            <Route path="/games/simon-says" element={<ProtectedRoute><SimonSays /></ProtectedRoute>} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
