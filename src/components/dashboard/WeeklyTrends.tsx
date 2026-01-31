import { motion } from "framer-motion";
import { WeeklyDataPoint } from "@/data/healthData";

interface WeeklyTrendsProps {
  data: WeeklyDataPoint[];
  examMode?: boolean;
  summary: string;
}

const WeeklyTrends = ({ data, examMode = false, summary }: WeeklyTrendsProps) => {
  const maxSleep = Math.max(...data.map(d => d.sleep));
  const primaryColor = examMode ? "#a855f7" : "#00ff9d";
  const glowColor = examMode ? "rgba(168, 85, 247, 0.5)" : "rgba(0, 255, 157, 0.5)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative p-6 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-20 blur-3xl"
        style={{ background: primaryColor }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg uppercase tracking-wider" style={{ color: primaryColor }}>
            Weekly Sleep Trend
          </h3>
          <span className="text-xs font-mono text-muted-foreground">Last 7 days</span>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-32 mb-4">
          {data.map((day, index) => {
            const height = (day.sleep / maxSleep) * 100;
            const isToday = index === data.length - 1;

            return (
              <motion.div
                key={day.day}
                className="flex-1 flex flex-col items-center gap-2"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5, ease: "easeOut" }}
                style={{ originY: 1 }}
              >
                <span className="text-xs font-mono text-muted-foreground">{day.sleep}h</span>
                <div
                  className="w-full rounded-t-sm relative group cursor-pointer transition-all duration-300"
                  style={{
                    height: `${height}%`,
                    minHeight: "20px",
                    background: isToday
                      ? `linear-gradient(180deg, ${primaryColor} 0%, ${examMode ? "#7c3aed" : "#00d4ff"} 100%)`
                      : `linear-gradient(180deg, ${primaryColor}80 0%, ${primaryColor}40 100%)`,
                    boxShadow: isToday ? `0 0 20px ${glowColor}` : "none",
                  }}
                >
                  {/* Hover tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 px-2 py-1 rounded text-xs font-mono whitespace-nowrap border border-primary/30">
                    {day.sleep} hours
                  </div>
                </div>
                <span
                  className="text-xs font-mono"
                  style={{ color: isToday ? primaryColor : "var(--muted-foreground)" }}
                >
                  {day.day}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 p-3 rounded border border-primary/10 bg-background/30"
        >
          <div className="flex items-start gap-2">
            <span className="text-primary text-lg">✦</span>
            <p className="text-sm text-muted-foreground font-mono leading-relaxed">
              {summary}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WeeklyTrends;
