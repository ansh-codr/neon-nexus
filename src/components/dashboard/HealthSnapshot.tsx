import { motion } from "framer-motion";
import { Moon, Footprints, Brain, Zap } from "lucide-react";

interface HealthMetric {
  label: string;
  value: string | number;
  unit?: string;
  level: "low" | "medium" | "high";
  icon: React.ReactNode;
}

interface HealthSnapshotProps {
  sleepHours: number;
  steps: number;
  activityLevel: "low" | "medium" | "high";
  focusLevel: "low" | "medium" | "high";
  examMode?: boolean;
}

const HealthSnapshot = ({
  sleepHours,
  steps,
  activityLevel,
  focusLevel,
  examMode = false,
}: HealthSnapshotProps) => {
  const primaryColor = examMode ? "#a855f7" : "#00ff9d";
  const secondaryColor = examMode ? "#7c3aed" : "#00d4ff";

  const getLevelColor = (level: "low" | "medium" | "high") => {
    if (examMode) {
      return level === "low" ? "#a855f7" : level === "medium" ? "#c084fc" : "#e9d5ff";
    }
    return level === "low" ? "#ff6b6b" : level === "medium" ? "#fbbf24" : "#00ff9d";
  };

  const getLevelLabel = (level: "low" | "medium" | "high") => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const metrics: HealthMetric[] = [
    {
      label: "Sleep",
      value: sleepHours,
      unit: "hrs",
      level: sleepHours >= 7 ? "high" : sleepHours >= 6 ? "medium" : "low",
      icon: <Moon className="w-5 h-5" />,
    },
    {
      label: "Activity",
      value: steps.toLocaleString(),
      unit: "steps",
      level: activityLevel,
      icon: <Footprints className="w-5 h-5" />,
    },
    {
      label: "Focus",
      value: getLevelLabel(focusLevel),
      level: focusLevel,
      icon: <Brain className="w-5 h-5" />,
    },
    {
      label: "Energy",
      value: getLevelLabel(activityLevel),
      level: activityLevel,
      icon: <Zap className="w-5 h-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((metric, index) => {
        const color = getLevelColor(metric.level);

        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            className="relative p-4 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden group hover:border-primary/40 transition-all duration-300 cursor-pointer"
          >
            {/* Background glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
              style={{ background: color }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="p-2 rounded-lg"
                  style={{
                    background: `${color}20`,
                    color: color,
                  }}
                >
                  {metric.icon}
                </span>
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    background: color,
                    boxShadow: `0 0 10px ${color}`,
                  }}
                />
              </div>

              <div className="mt-3">
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  {metric.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-2xl font-display font-bold"
                    style={{
                      color: color,
                      textShadow: `0 0 20px ${color}40`,
                    }}
                  >
                    {metric.value}
                  </span>
                  {metric.unit && (
                    <span className="text-xs font-mono text-muted-foreground">
                      {metric.unit}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-3 h-1 rounded-full bg-background/50 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${color}, ${secondaryColor})` }}
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      metric.level === "high"
                        ? "100%"
                        : metric.level === "medium"
                        ? "60%"
                        : "30%",
                  }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default HealthSnapshot;
