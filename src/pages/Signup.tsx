import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlitchText from "@/components/GlitchText";
import { Navbar } from "@/components/Navbar";
import { signUpWithEmail, signInWithGoogle, signInWithGithub, signInWithMicrosoft } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!agreedToTerms) {
      setError("You must agree to the terms");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUpWithEmail(formData.email, formData.password, formData.username);
      toast({
        title: "Account created!",
        description: "Welcome to Neon Nexus.",
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      toast({
        title: "Signup failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setIsLoading(true);
    try {
      await signInWithGithub();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignup = async () => {
    setIsLoading(true);
    try {
      await signInWithMicrosoft();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
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
          className="w-full max-w-lg"
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
                    ACCESS REQUEST
                  </GlitchText>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-sm font-mono"
                >
                  [INITIALIZE NEW USER PROTOCOL]
                </motion.p>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="username" className="text-secondary font-mono text-xs uppercase tracking-wider">
                    Username
                  </Label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-cyan-500 rounded opacity-0 group-hover:opacity-50 blur transition duration-300" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="cyber_warrior_2026"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="relative bg-background/50 border-secondary/30 focus:border-secondary text-foreground placeholder:text-muted-foreground font-mono transition-all duration-300 hover:border-secondary/50"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-secondary font-mono text-xs uppercase tracking-wider">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-cyan-500 rounded opacity-0 group-hover:opacity-50 blur transition duration-300" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="user@neon-nexus.io"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="relative bg-background/50 border-secondary/30 focus:border-secondary text-foreground placeholder:text-muted-foreground font-mono transition-all duration-300 hover:border-secondary/50"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-secondary font-mono text-xs uppercase tracking-wider">
                    Password
                  </Label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-cyan-500 rounded opacity-0 group-hover:opacity-50 blur transition duration-300" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="relative bg-background/50 border-secondary/30 focus:border-secondary text-foreground font-mono transition-all duration-300 hover:border-secondary/50"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2"
                >
                  <Label htmlFor="confirmPassword" className="text-secondary font-mono text-xs uppercase tracking-wider">
                    Confirm Password
                  </Label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-cyan-500 rounded opacity-0 group-hover:opacity-50 blur transition duration-300" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="relative bg-background/50 border-secondary/30 focus:border-secondary text-foreground font-mono transition-all duration-300 hover:border-secondary/50"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-start space-x-3 pt-2"
                >
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                    className="w-5 h-5 mt-0.5 rounded border-secondary/30 bg-background/50 checked:bg-secondary checked:border-secondary focus:ring-secondary focus:ring-offset-0 transition-all duration-300 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-muted-foreground font-mono leading-relaxed cursor-pointer">
                    I agree to the{" "}
                    <Link to="/terms" className="text-secondary hover:text-primary underline transition-colors">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-secondary hover:text-primary underline transition-colors">
                      Privacy Policy
                    </Link>
                    . I understand that by accessing this system, all activities may be monitored.
                  </label>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    disabled={isLoading || !agreedToTerms}
                    className="w-full relative group overflow-hidden bg-secondary hover:bg-secondary/90 text-background font-bold py-6 font-mono uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-background border-t-transparent rounded-full mr-2"
                          />
                          PROCESSING...
                        </>
                      ) : (
                        "REQUEST ACCESS"
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Button>
                </motion.div>
              </form>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="relative my-8"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-4 text-muted-foreground font-mono">
                    OR REGISTER WITH
                  </span>
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded bg-red-500/20 border border-red-500/50 text-red-400 text-sm font-mono"
                >
                  {error}
                </motion.div>
              )}

              {/* Social Signup */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="grid grid-cols-3 gap-3"
              >
                <Button
                  variant="outline"
                  onClick={handleGithubSignup}
                  disabled={isLoading}
                  className="relative group border-secondary/30 hover:border-secondary bg-background/50 hover:bg-secondary/10 font-mono text-xs transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Github
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                  className="relative group border-secondary/30 hover:border-secondary bg-background/50 hover:bg-secondary/10 font-mono text-xs transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={handleMicrosoftSignup}
                  disabled={isLoading}
                  className="relative group border-secondary/30 hover:border-secondary bg-background/50 hover:bg-secondary/10 font-mono text-xs transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 0h11.5v11.5H0V0z" fill="#F25022"/>
                    <path d="M12.5 0H24v11.5H12.5V0z" fill="#7FBA00"/>
                    <path d="M0 12.5h11.5V24H0V12.5z" fill="#00A4EF"/>
                    <path d="M12.5 12.5H24V24H12.5V12.5z" fill="#FFB900"/>
                  </svg>
                  Microsoft
                </Button>
              </motion.div>

              {/* Login Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="mt-8 text-center"
              >
                <p className="text-sm text-muted-foreground font-mono">
                  Already have access?{" "}
                  <Link
                    to="/login"
                    className="text-secondary hover:text-primary font-bold transition-colors duration-300 hover:underline"
                  >
                    Login Here →
                  </Link>
                </p>
              </motion.div>

              {/* Footer Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="mt-6 text-center"
              >
                <p className="text-xs text-muted-foreground/50 font-mono">
                  © 2026 NEON NEXUS • ENCRYPTED TRANSMISSION
                </p>
              </motion.div>
            </div>
          </div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
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
              Return to Main Terminal
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
