import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CyberButton from "./CyberButton";
import GlitchText from "./GlitchText";
import { useAuth } from "@/contexts/AuthContext";

export const CTASection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleViewDemo = () => {
    navigate('/demo');
  };

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 circuit-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <div className="inline-flex p-4 border-2 border-primary cyber-chamfer neon-glow-lg mb-8 animate-pulse-glow">
            <Zap className="h-8 w-8 text-primary" />
          </div>

          {/* Headline */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wide mb-6">
            <span className="text-foreground">Ready to</span>
            <br />
            <GlitchText className="text-primary text-glow">Upgrade</GlitchText>{" "}
            <span className="text-foreground">Your Health?</span>
          </h2>

          {/* Description */}
          <p className="font-mono text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            <span className="text-primary">&gt;</span> Join thousands of students who have transformed their 
            health habits. Start tracking today and unlock your full potential.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CyberButton variant="glitch" size="lg" onClick={handleGetStarted}>
              {user ? 'Go to Dashboard' : 'Get Started Now'}
              <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </CyberButton>
            <CyberButton variant="secondary" size="lg" onClick={handleViewDemo}>
              View Demo
            </CyberButton>
          </div>

          {/* Terminal Note */}
          <div className="mt-12 font-terminal text-sm text-muted-foreground">
            <span className="text-primary">$</span> No credit card required.{" "}
            <span className="text-primary">Free</span> for students.
            <span className="blink-cursor" />
          </div>
        </motion.div>
      </div>

      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />
    </section>
  );
};

export default CTASection;
