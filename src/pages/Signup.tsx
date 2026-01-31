import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import GlitchText from "@/components/GlitchText";
import { Navbar } from "@/components/Navbar";
import { signInWithGoogle } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Activity, Loader2, AlertCircle, Check } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the page user was trying to access
  const from = (location.state as { from?: string })?.from || '/connect-fit';

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome to CAMHY!",
        description: "Account created successfully.",
      });
      // Redirect to connect-fit
      navigate('/connect-fit', { state: { from } });
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err.message || "Failed to sign up with Google");
      toast({
        title: "Sign up failed",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Navbar />
      
      {/* Ethereal Shadow Background - Different color scheme */}
      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(255, 0, 255, 0.25)"
          animation={{ scale: 85, speed: 60 }}
          noise={{ opacity: 0.9, scale: 1.3 }}
          sizing="fill"
        />
      </div>

      {/* Additional Cyber Background Effects */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-background/95 via-background/85 to-background/95" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,0,255,0.15),transparent_50%)]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,255,255,0.1),transparent_50%)]" />
      
      {/* Hexagon Pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(30deg, rgba(255,0,255,0.2) 12%, transparent 12.5%, transparent 87%, rgba(255,0,255,0.2) 87.5%, rgba(255,0,255,0.2)),
            linear-gradient(150deg, rgba(255,0,255,0.2) 12%, transparent 12.5%, transparent 87%, rgba(255,0,255,0.2) 87.5%, rgba(255,0,255,0.2)),
            linear-gradient(30deg, rgba(255,0,255,0.2) 12%, transparent 12.5%, transparent 87%, rgba(255,0,255,0.2) 87.5%, rgba(255,0,255,0.2)),
            linear-gradient(150deg, rgba(255,0,255,0.2) 12%, transparent 12.5%, transparent 87%, rgba(255,0,255,0.2) 87.5%, rgba(255,0,255,0.2))
          `,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px'
        }} />
      </div>

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-30" />

      {/* Signup Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Glowing Card */}
          <div className="relative group">
            {/* Animated Rainbow Glow Border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary via-cyan-500 to-primary rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition duration-1000 animate-pulse" style={{
              animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
            
            {/* Card Content */}
            <div className="relative bg-card/90 backdrop-blur-xl border border-secondary/20 rounded-lg p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <GlitchText className="text-4xl font-bold mb-2">
                    JOIN CAMHY
                  </GlitchText>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-sm font-mono"
                >
                  [CREATE YOUR ACCOUNT]
                </motion.p>
              </div>

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6 p-4 rounded-lg bg-secondary/10 border border-secondary/30"
              >
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-secondary font-mono font-semibold mb-1">Why Google Sign-Up?</p>
                    <p className="text-muted-foreground font-mono text-xs">
                      CAMHY uses Google Fit to track your real health data. Sign up with Google to seamlessly connect your fitness data and unlock all features.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/50"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-400 text-sm font-mono">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Google Sign-Up Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                  className="w-full relative group overflow-hidden bg-white hover:bg-gray-100 text-gray-800 font-bold py-6 font-mono transition-all duration-300 border-2 border-secondary/50 hover:border-secondary"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        <span className="uppercase tracking-wide">Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span className="uppercase tracking-wide">Sign up with Google</span>
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>

              {/* Features You'll Get */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 space-y-3"
              >
                <p className="text-xs text-muted-foreground font-mono text-center mb-3">
                  What you'll get:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm font-mono text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Real-time step and activity tracking</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-mono text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Calorie and distance monitoring</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-mono text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Fun games to stay motivated</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-mono text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Leaderboards and challenges</span>
                  </div>
                </div>
              </motion.div>

              {/* Privacy Notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center"
              >
                <p className="text-xs text-muted-foreground/70 font-mono">
                  By signing up, you agree to our{" "}
                  <Link to="/terms" className="text-secondary hover:underline">Terms</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-secondary hover:underline">Privacy Policy</Link>
                </p>
              </motion.div>

              {/* Login Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-muted-foreground font-mono">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-secondary hover:text-primary font-bold transition-colors duration-300 hover:underline"
                  >
                    Sign In →
                  </Link>
                </p>
              </motion.div>

              {/* Footer Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="mt-6 text-center"
              >
                <p className="text-xs text-muted-foreground/50 font-mono">
                  © 2026 CAMHY • SECURE CONNECTION
                </p>
              </motion.div>
            </div>
          </div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-8 text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center text-sm text-secondary hover:text-primary font-mono transition-colors duration-300 group"
            >
              <svg
                className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Main Page
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
