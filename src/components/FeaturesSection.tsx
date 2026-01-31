import { motion } from "framer-motion";
import { Moon, Footprints, Dumbbell, Bell, Brain, TrendingUp } from "lucide-react";
import CyberCard from "./CyberCard";
import GlitchText from "./GlitchText";

const features = [
  {
    icon: Moon,
    title: "Sleep Tracking",
    description: "Monitor your sleep patterns, REM cycles, and wake times. Get insights to improve your rest quality.",
    color: "neon-cyan",
  },
  {
    icon: Footprints,
    title: "Step Counter",
    description: "Track every step you take. Set daily goals and watch your progress in real-time.",
    color: "neon-green",
  },
  {
    icon: Dumbbell,
    title: "Exercise Log",
    description: "Log workouts, track reps, and measure your fitness journey with detailed analytics.",
    color: "neon-magenta",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Get personalized notifications for hydration, movement breaks, and sleep schedules.",
    color: "neon-green",
  },
  {
    icon: Brain,
    title: "AI Suggestions",
    description: "Receive AI-powered recommendations based on your unique health patterns.",
    color: "neon-cyan",
  },
  {
    icon: TrendingUp,
    title: "Trend Analysis",
    description: "Visualize your health trends over time. Identify patterns and optimize your lifestyle.",
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
    <section id="features" className="relative py-24 lg:py-32 overflow-hidden">
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
          className="text-center mb-16"
        >
          <span className="font-terminal text-xs uppercase tracking-[0.3em] text-primary mb-4 block">
            &gt; System.features()
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wide mb-6">
            <GlitchText className="text-foreground">Core</GlitchText>{" "}
            <span className="text-primary text-glow">Modules</span>
          </h2>
          <p className="font-mono text-muted-foreground max-w-2xl mx-auto">
            Comprehensive health tracking features designed for the modern student lifestyle.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 -skew-y-1"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="skew-y-1">
              <CyberCard
                variant="terminal"
                hoverEffect
                className="h-full"
              >
                <div className="p-6">
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
                  <h3 className="font-display text-xl uppercase tracking-wide text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Terminal Line */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="font-terminal text-xs text-primary">
                      <span className="text-muted-foreground">$</span> module.init()
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
