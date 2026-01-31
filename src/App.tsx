import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Demo from "./pages/Demo";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
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
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/games/memory-flip" element={<MemoryFlip />} />
            <Route path="/games/rock-paper-scissors" element={<RockPaperScissors />} />
            <Route path="/games/reaction-time" element={<ReactionTime />} />
            <Route path="/games/snake" element={<Snake />} />
            <Route path="/games/simon-says" element={<SimonSays />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
