import { motion } from "framer-motion";
import { GraduationCap, Moon, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ExamModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const ExamModeToggle = ({ enabled, onToggle }: ExamModeToggleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative p-5 rounded-lg border overflow-hidden transition-all duration-500"
      style={{
        borderColor: enabled ? "rgba(168, 85, 247, 0.5)" : "rgba(0, 255, 157, 0.2)",
        background: enabled
          ? "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)"
          : "rgba(0, 0, 0, 0.2)",
        boxShadow: enabled ? "0 0 40px rgba(168, 85, 247, 0.2)" : "none",
      }}
    >
      {/* Background animation when enabled */}
      {enabled && (
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-2.5 rounded-lg"
            style={{
              background: enabled ? "rgba(168, 85, 247, 0.2)" : "rgba(0, 255, 157, 0.1)",
            }}
            animate={enabled ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <GraduationCap
              className="w-5 h-5"
              style={{ color: enabled ? "#a855f7" : "#00ff9d" }}
            />
          </motion.div>
          <div>
            <h4
              className="font-display text-sm uppercase tracking-wider"
              style={{ color: enabled ? "#a855f7" : "#00ff9d" }}
            >
              Exam Mode
            </h4>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {enabled ? "Prioritizing rest & balance" : "Standard wellness tracking"}
            </p>
          </div>
        </div>

        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-purple-500"
        />
      </div>

      {/* Benefits when enabled */}
      {enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-purple-500/20"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
              <Moon className="w-3.5 h-3.5" />
              <span>Rest focus</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
              <Shield className="w-3.5 h-3.5" />
              <span>Reduced goals</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExamModeToggle;
