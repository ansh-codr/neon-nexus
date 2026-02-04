import { motion } from "framer-motion";
import { Moon, Footprints, Dumbbell, Bell, Brain, TrendingUp } from "lucide-react";
import CyberCard from "./CyberCard";
import GlitchText from "./GlitchText";

const features = [
  {
    icon: Moon,
    title: "Sleep Clarity",
    description: "Understand sleep stages and recovery with calm, readable insights.",
    color: "neon-cyan",
  },
  {
    icon: Footprints,
    title: "Daily Motion",
    description: "Track steps, streaks, and light movement goals without the clutter.",
    color: "neon-green",
  },
  {
    icon: Dumbbell,
    title: "Training Log",
    description: "Capture workouts and see progress snapshots that are easy to scan.",
    color: "neon-magenta",
  },
  {
    icon: Bell,
    title: "Gentle Nudges",
    description: "Personal reminders for hydration, breaks, and wind-down routines.",
    color: "neon-green",
  },
  {
    icon: Brain,
    title: "Focus Assist",
    description: "Adaptive suggestions that match your energy and workload patterns.",
    color: "neon-cyan",
  },
  {
    icon: TrendingUp,
    title: "Trend Signals",
    description: "Spot patterns across weeks and find the habits that move the needle.",
    color: "neon-magenta",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 circuit-grid opacity-30" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="font-modern-body text-xs uppercase tracking-[0.3em] text-primary mb-4 block">
            &gt; Experience.core
          </span>
          <h2 className="font-modern text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold uppercase tracking-wide mb-4 sm:mb-6">
            <GlitchText className="text-foreground">Built for</GlitchText>{" "}
            <span className="text-primary text-glow">Momentum</span>
          </h2>
          <p className="font-modern-body text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            A modern suite that blends health, focus, and recovery into a single clean flow.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 sm:-skew-y-1"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="sm:skew-y-1">
              <CyberCard
                variant="terminal"
                hoverEffect
                className="h-full"
              >
                <div className="p-4 sm:p-6">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-3 border cyber-chamfer-sm mb-4 ${
                      feature.color === "neon-green"
                        ? "border-primary text-primary neon-glow"
                        : feature.color === "neon-magenta"
                        ? "border-secondary text-secondary neon-glow-magenta"
                        : "border-neon-cyan text-neon-cyan neon-glow-cyan"
                    }`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <h3 className="font-modern text-xl uppercase tracking-wide text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-modern-body text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Terminal Line */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="font-modern-body text-xs text-primary">
                      <span className="text-muted-foreground">$</span> launch.module()
                      <span className="blink-cursor" />
                    </span>
                  </div>
                </div>
              </CyberCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
