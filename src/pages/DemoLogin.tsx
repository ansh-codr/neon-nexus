import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Loader2, 
  User, 
  Zap, 
  BookOpen, 
  Activity,
  Brain,
  Trophy,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { DEMO_ACCOUNT } from "@/firebase/demoData";

const DemoLogin = () => {
  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);

  const features = [
    {
      icon: Activity,
      title: "Health Tracking",
      description: "Log sleep, steps, and activity levels",
    },
    {
      icon: Brain,
      title: "Focus Insights",
      description: "AI-powered wellness suggestions",
    },
    {
      icon: BookOpen,
      title: "Study Sessions",
      description: "Track your study streaks",
    },
    {
      icon: Trophy,
      title: "Leaderboard",
      description: "Privacy-safe competitive feed",
    },
    {
      icon: Zap,
      title: "Streak System",
      description: "Build consistency habits",
    },
    {
      icon: Shield,
      title: "Exam Mode",
      description: "Special wellness during exams",
    },
  ];

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      // Try to login with demo account
      await login(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password);
      toast.success("Welcome to the demo!");
      navigate("/dashboard");
    } catch (loginError: any) {
      // If demo account doesn't exist, create it
      if (loginError?.code === "auth/user-not-found" || loginError?.code === "auth/invalid-credential") {
        setCreatingAccount(true);
        try {
          await signup(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password, DEMO_ACCOUNT.displayName);
          toast.success("Demo account created! Welcome!");
          navigate("/dashboard");
        } catch (signupError: any) {
          console.error("Demo signup error:", signupError);
          toast.error("Failed to create demo account. Try regular login.");
          navigate("/login");
        }
      } else {
        console.error("Demo login error:", loginError);
        toast.error("Demo login failed. Please try again.");
      }
    } finally {
      setLoading(false);
      setCreatingAccount(false);
    }
  };

  const handleViewWithoutAccount = () => {
    // Navigate to dashboard - it will show demo data for unauthenticated users
    navigate("/dashboard");
    toast.info("Viewing demo mode. Sign in to save your data!");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(0, 255, 157, 0.15)"
          animation={{ scale: 60, speed: 50 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(0, 255, 157, 0.1) 0%, transparent 60%)",
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 157, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 157, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-20" />

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono uppercase tracking-wider mb-6"
            style={{
              background: "rgba(0, 255, 157, 0.1)",
              border: "1px solid rgba(0, 255, 157, 0.3)",
              color: "#00ff9d",
            }}
          >
            <Zap className="w-4 h-4" />
            Try Before You Sign Up
          </div>

          <h1
            className="text-4xl sm:text-5xl font-display font-bold uppercase tracking-wider mb-4"
            style={{
              color: "#00ff9d",
              textShadow: "0 0 30px rgba(0, 255, 157, 0.5)",
            }}
          >
            Experience Neon Nexus
          </h1>

          <p className="text-muted-foreground font-mono text-sm max-w-lg mx-auto">
            Explore all features with a demo account. No commitment required.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-4 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm"
            >
              <feature.icon
                className="w-8 h-8 mb-3"
                style={{ color: "#00ff9d" }}
              />
              <h3 className="font-display text-sm uppercase tracking-wider mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-md mx-auto"
        >
          <div
            className="p-8 rounded-lg border border-primary/30 bg-card/50 backdrop-blur-sm text-center"
          >
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(0, 255, 157, 0.1)",
                border: "2px solid rgba(0, 255, 157, 0.3)",
              }}
            >
              <User className="w-8 h-8 text-primary" />
            </div>

            <h2
              className="text-2xl font-display font-bold uppercase tracking-wider mb-2"
              style={{ color: "#00ff9d" }}
            >
              Start Exploring
            </h2>

            <p className="text-muted-foreground font-mono text-sm mb-6">
              Use our demo account to try all features instantly
            </p>

            <div className="space-y-4">
              <Button
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full font-mono uppercase tracking-wider h-12"
                style={{
                  background: "rgba(0, 255, 157, 0.2)",
                  border: "1px solid #00ff9d",
                  color: "#00ff9d",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {creatingAccount ? "Creating Demo Account..." : "Logging in..."}
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Start Demo Account
                  </>
                )}
              </Button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-mono">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Button
                onClick={handleViewWithoutAccount}
                variant="outline"
                className="w-full font-mono uppercase tracking-wider"
              >
                Preview Without Account
              </Button>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground font-mono mb-3">
                  Already have an account?
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate("/login")}
                    variant="ghost"
                    className="flex-1 font-mono text-xs"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => navigate("/signup")}
                    variant="ghost"
                    className="flex-1 font-mono text-xs"
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 rounded-lg border border-dashed border-primary/20 text-center"
          >
            <p className="text-xs text-muted-foreground font-mono mb-2">
              Demo Account Credentials:
            </p>
            <p className="text-xs font-mono" style={{ color: "#00ff9d" }}>
              Email: {DEMO_ACCOUNT.email}
            </p>
            <p className="text-xs font-mono" style={{ color: "#00ff9d" }}>
              Password: {DEMO_ACCOUNT.password}
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default DemoLogin;
