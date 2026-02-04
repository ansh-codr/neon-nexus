import { motion } from "framer-motion";
import { Download, UserCheck, Activity, Sparkles } from "lucide-react";
import GlitchText from "./GlitchText";

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Connect",
    description: "Link your health data in seconds with secure Google Fit sync.",
  },
  {
    number: "02",
    icon: UserCheck,
    title: "Personalize",
    description: "Set focus hours, goals, and the signals you care about most.",
  },
  {
    number: "03",
    icon: Activity,
    title: "Track",
    description: "Watch sleep, steps, and workouts update in near real time.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Reflect",
    description: "Review clean insights and keep the habits that work.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative py-16 sm:py-24 lg:py-32 bg-muted/20">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 circuit-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="font-modern-body text-xs uppercase tracking-[0.3em] text-secondary mb-4 block">
            &gt; Getting.started
          </span>
          <h2 className="font-modern text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold uppercase tracking-wide mb-4 sm:mb-6">
            <span className="text-foreground">How It</span>{" "}
            <GlitchText className="text-secondary text-glow-magenta">Works</GlitchText>
          </h2>
          <p className="font-modern-body text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            A clean flow from first login to daily progress.
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
                  <div className="font-modern text-5xl sm:text-6xl md:text-7xl font-semibold text-border/50 absolute -top-2 sm:-top-4 left-1/2 -translate-x-1/2 select-none">
                    {step.number}
                  </div>

                  {/* Icon Container */}
                  <div className="relative z-10 mx-auto w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border-2 border-primary bg-background cyber-chamfer neon-glow mb-4 sm:mb-6">
                    <step.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-modern text-base sm:text-lg uppercase tracking-wide text-foreground mb-2 sm:mb-3">
                    {step.title}
                  </h3>
                  <p className="font-modern-body text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
