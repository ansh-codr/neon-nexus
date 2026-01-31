import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import GlitchText from "@/components/GlitchText";
import { useAuth } from "@/contexts/AuthContext";
import { DEMO_ACCOUNT } from "@/firebase/demoData";
import { Loader2, Zap, Shield, Activity, BookOpen, Trophy, Brain } from "lucide-react";
import { toast } from "sonner";

const Demo = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [loading, setLoading] = useState(false);

  const features = [
    { icon: Activity, label: "Health Tracking" },
    { icon: Brain, label: "AI Insights" },
    { icon: BookOpen, label: "Study Streaks" },
    { icon: Trophy, label: "Leaderboard" },
    { icon: Shield, label: "Exam Mode" },
  ];

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await login(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password);
      toast.success("Welcome to the demo!");
      navigate("/dashboard");
    } catch (loginError: any) {
      if (loginError?.code === "auth/user-not-found" || loginError?.code === "auth/invalid-credential") {
        try {
          await signup(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password, DEMO_ACCOUNT.displayName);
          toast.success("Demo account created!");
          navigate("/dashboard");
        } catch {
          navigate("/dashboard");
          toast.info("Viewing in demo mode");
        }
      } else {
        navigate("/dashboard");
        toast.info("Viewing in demo mode");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Ethereal Shadow Background */}
      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(0, 255, 157, 0.4)"
          animation={{ scale: 100, speed: 90 }}
          noise={{ opacity: 1, scale: 1.2 }}
          sizing="fill"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <GlitchText className="md:text-7xl text-5xl lg:text-8xl font-bold text-center text-foreground mb-6">
                NEON NEXUS
              </GlitchText>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-muted-foreground font-mono mb-4 max-w-3xl mx-auto"
              >
                Campus Health & Productivity Tracking
              </motion.p>

              {/* Features Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-wrap justify-center gap-4 mb-8"
              >
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
                    style={{
                      background: "rgba(0, 255, 157, 0.1)",
                      border: "1px solid rgba(0, 255, 157, 0.3)",
                      color: "#00ff9d",
                    }}
                  >
                    <f.icon className="w-3 h-3" />
                    {f.label}
                  </div>
                ))}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button 
                  onClick={handleDemoLogin}
                  disabled={loading}
                  size="lg"
                  className="relative group overflow-hidden bg-primary hover:bg-primary/90 text-background font-bold py-6 px-8 font-mono uppercase tracking-widest transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading Demo...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Try Demo
                    </>
                  )}
                </Button>
                
                <Link to="/login">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="relative group border-secondary/50 hover:border-secondary bg-background/50 hover:bg-secondary/10 text-secondary font-bold py-6 px-8 font-mono uppercase tracking-widest transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>

              {/* Demo credentials hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="mt-6 text-xs text-muted-foreground/70 font-mono"
              >
                Demo: {DEMO_ACCOUNT.email} / {DEMO_ACCOUNT.password}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="mt-8"
              >
                <Link
                  to="/"
                  className="inline-flex items-center text-sm text-primary hover:text-secondary font-mono transition-colors duration-300 group"
                >
                  <svg
                    className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </EtherealShadow>
      </div>

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-30" />

      {/* Floating Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Demo;
