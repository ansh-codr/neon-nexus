import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import GlitchText from "@/components/GlitchText";

const Demo = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Ethereal Shadow Background - Cyberpunk Green/Magenta Mix */}
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
              <GlitchText className="md:text-7xl text-6xl lg:text-8xl font-bold text-center text-foreground mb-6">
                ETHEREAL SHADOWS
              </GlitchText>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-muted-foreground font-mono mb-8 max-w-3xl mx-auto"
              >
                Experience the fluid dynamics of cyberpunk aesthetics. Watch as reality bends and shifts beneath the neon glow.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link to="/login">
                  <Button 
                    size="lg"
                    className="relative group overflow-hidden bg-primary hover:bg-primary/90 text-background font-bold py-6 px-8 font-mono uppercase tracking-widest transition-all duration-300"
                  >
                    <span className="relative z-10">Access System</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Button>
                </Link>
                
                <Link to="/signup">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="relative group border-secondary/50 hover:border-secondary bg-background/50 hover:bg-secondary/10 text-secondary font-bold py-6 px-8 font-mono uppercase tracking-widest transition-all duration-300"
                  >
                    Request Access
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="mt-12"
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
                  Return to Main Terminal
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
