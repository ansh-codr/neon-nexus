import { motion } from "framer-motion";
import { Activity, ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CyberButton from "./CyberButton";
import GlitchText from "./GlitchText";
import CyberCard from "./CyberCard";
import { useAuth } from "@/contexts/AuthContext";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartTracking = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleLearnMore = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 circuit-grid opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Main Content - 60% */}
          <div className="lg:col-span-3 text-center lg:text-left">
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-primary/50 cyber-chamfer-sm mb-8"
            >
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-terminal text-xs uppercase tracking-widest text-primary">
                PS-98 // Campus Health Tracker
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-wider mb-4 sm:mb-6">
                <span className="text-foreground">Track Your</span>
                <br />
                <GlitchText className="text-primary text-glow">
                  Health
                </GlitchText>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-mono text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0"
            >
              <span className="text-primary">&gt;</span> Students struggle to maintain a healthy lifestyle while managing academics.{" "}
              <span className="blink-cursor text-primary">We fix that</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <CyberButton variant="glitch" size="lg" onClick={handleStartTracking}>
                {user ? 'Go to Dashboard' : 'Start Tracking'}
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </CyberButton>
              <CyberButton variant="outline" size="lg" onClick={handleLearnMore}>
                Learn More
              </CyberButton>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 sm:gap-8 mt-8 sm:mt-12 justify-center lg:justify-start"
            >
              {[
                { value: "10K+", label: "Active Users" },
                { value: "50M", label: "Steps Tracked" },
                { value: "98%", label: "Satisfaction" },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left min-w-[80px]">
                  <div className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-primary text-glow">
                    {stat.value}
                  </div>
                  <div className="font-terminal text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* HUD Panel - 40% */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-2 hidden lg:block"
          >
            <CyberCard variant="holographic" className="p-6">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="font-terminal text-xs uppercase tracking-widest text-muted-foreground">
                    System Status
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="font-terminal text-xs text-primary uppercase">
                      Online
                    </span>
                  </span>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                  {[
                    { icon: Activity, label: "Heart Rate", value: "72 BPM", status: "normal" },
                    { icon: Activity, label: "Sleep Score", value: "85%", status: "good" },
                    { icon: Activity, label: "Daily Steps", value: "8,432", status: "on-track" },
                  ].map((metric, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border border-border/50 cyber-chamfer-sm bg-background/50"
                    >
                      <div className="flex items-center gap-3">
                        <metric.icon className="h-5 w-5 text-primary" />
                        <span className="font-mono text-sm text-foreground">
                          {metric.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-lg text-primary text-glow">
                          {metric.value}
                        </div>
                        <div className="font-terminal text-xs text-muted-foreground uppercase">
                          {metric.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-terminal text-xs text-muted-foreground uppercase">
                      Daily Goal Progress
                    </span>
                    <span className="font-mono text-xs text-primary">84%</span>
                  </div>
                  <div className="h-2 bg-border cyber-chamfer-sm overflow-hidden">
                    <div
                      className="h-full bg-primary neon-glow transition-all duration-1000"
                      style={{ width: "84%" }}
                    />
                  </div>
                </div>
              </div>
            </CyberCard>
          </motion.div>
        </div>
      </div>

      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />
    </section>
  );
};

export default HeroSection;
