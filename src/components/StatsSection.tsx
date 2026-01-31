import { motion } from "framer-motion";

const stats = [
  { value: "10,000+", label: "Active Users", prefix: ">" },
  { value: "50M", label: "Steps Tracked", prefix: "$" },
  { value: "1.2M", label: "Hours of Sleep", prefix: "#" },
  { value: "98%", label: "User Satisfaction", prefix: "!" },
];

export const StatsSection = () => {
  return (
    <section id="stats" className="relative py-12 sm:py-16 border-y border-border bg-card/50">
      <div className="absolute inset-0 circuit-grid opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 lg:divide-x divide-border">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center px-2 sm:px-4 lg:px-8"
            >
              <div className="font-terminal text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2">
                <span className="text-primary">{stat.prefix}</span> stat_{index + 1}
              </div>
              <div className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary text-glow mb-1 sm:mb-2">
                {stat.value}
              </div>
              <div className="font-terminal text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
