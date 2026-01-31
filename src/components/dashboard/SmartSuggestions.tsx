import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SmartSuggestionsProps {
  insights: string[];
  examMode?: boolean;
  onRefresh?: () => void;
}

const SmartSuggestions = ({ insights, examMode = false, onRefresh }: SmartSuggestionsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<number[]>([]);

  const primaryColor = examMode ? "#a855f7" : "#00ff9d";
  const glowColor = examMode ? "rgba(168, 85, 247, 0.3)" : "rgba(0, 255, 157, 0.3)";

  const availableInsights = insights.filter((_, i) => !dismissed.includes(i));

  const handleRefresh = () => {
    setCurrentIndex((prev) => (prev + 1) % availableInsights.length);
    onRefresh?.();
  };

  const handleDismiss = () => {
    const actualIndex = insights.indexOf(availableInsights[currentIndex]);
    setDismissed((prev) => [...prev, actualIndex]);
    if (currentIndex >= availableInsights.length - 1) {
      setCurrentIndex(0);
    }
  };

  if (availableInsights.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm text-center"
      >
        <p className="text-muted-foreground font-mono text-sm">
          All insights dismissed. Check back later!
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3"
          onClick={() => {
            setDismissed([]);
            setCurrentIndex(0);
          }}
        >
          Reset Insights
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative p-6 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden"
    >
      {/* Background effects */}
      <div
        className="absolute top-0 left-0 w-40 h-40 opacity-20 blur-3xl"
        style={{ background: primaryColor }}
      />
      <div
        className="absolute bottom-0 right-0 w-32 h-32 opacity-10 blur-3xl"
        style={{ background: examMode ? "#7c3aed" : "#00d4ff" }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-5 h-5" style={{ color: primaryColor }} />
            </motion.div>
            <h3
              className="font-display text-lg uppercase tracking-wider"
              style={{ color: primaryColor }}
            >
              AI Insight
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">
              {currentIndex + 1}/{availableInsights.length}
            </span>
          </div>
        </div>

        {/* Insight Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative p-4 rounded-lg border bg-background/30"
            style={{
              borderColor: `${primaryColor}30`,
              boxShadow: `0 0 30px ${glowColor}`,
            }}
          >
            {/* AI indicator */}
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}40, ${examMode ? "#7c3aed" : "#00d4ff"}40)`,
                  border: `1px solid ${primaryColor}50`,
                }}
              >
                <span className="text-sm">🤖</span>
              </div>
              <p className="text-sm text-foreground/90 font-mono leading-relaxed flex-1">
                {availableInsights[currentIndex]}
              </p>
            </div>

            {/* Typing indicator animation */}
            <motion.div
              className="absolute bottom-2 right-3 flex gap-1"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: primaryColor }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 0.5,
                    repeat: 3,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-destructive font-mono text-xs"
          >
            <X className="w-4 h-4 mr-1" />
            Dismiss
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="font-mono text-xs"
            style={{
              borderColor: `${primaryColor}50`,
              color: primaryColor,
            }}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Next Insight
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SmartSuggestions;
