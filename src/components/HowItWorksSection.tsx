import { motion } from "framer-motion";
import { Download, UserCheck, Activity, Sparkles } from "lucide-react";
import GlitchText from "./GlitchText";

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Download App",
    description: "Get the Campus Health Tracker from your app store. Quick setup, zero hassle.",
  },
  {
    number: "02",
    icon: UserCheck,
    title: "Create Profile",
    description: "Set up your health profile with your goals, preferences, and academic schedule.",
  },
  {
    number: "03",
    icon: Activity,
    title: "Start Tracking",
    description: "Begin monitoring sleep, steps, and exercise. The app syncs automatically.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Get Insights",
    description: "Receive personalized suggestions and watch your health trends improve.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 bg-muted/20">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 circuit-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-terminal text-xs uppercase tracking-[0.3em] text-secondary mb-4 block">
            &gt; System.initialize()
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wide mb-6">
            <span className="text-foreground">How It</span>{" "}
            <GlitchText className="text-secondary text-glow-magenta">Works</GlitchText>
          </h2>
          <p className="font-mono text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes. Track for life.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  {/* Number */}
                  <div className="font-display text-6xl md:text-7xl font-black text-border/50 absolute -top-4 left-1/2 -translate-x-1/2 select-none">
                    {step.number}
                  </div>

                  {/* Icon Container */}
                  <div className="relative z-10 mx-auto w-20 h-20 flex items-center justify-center border-2 border-primary bg-background cyber-chamfer neon-glow mb-6">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-lg uppercase tracking-wide text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 text-primary text-2xl">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
