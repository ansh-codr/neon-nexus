import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, AlertTriangle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateQuoteOfTheDay, generateStreakRiskMessage } from "@/firebase/aiService";

interface QuoteOfTheDayProps {
  examMode?: boolean;
  stressLevel?: 'low' | 'medium' | 'high';
  isAtRisk?: boolean;
  currentStreak?: number;
}

const QuoteOfTheDay = ({
  examMode = false,
  stressLevel = 'medium',
  isAtRisk = false,
  currentStreak = 0,
}: QuoteOfTheDayProps) => {
  const [quote, setQuote] = useState<string>('');
  const [riskMessage, setRiskMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const primaryColor = examMode ? "#a855f7" : "#00ff9d";
  const primaryColorRgba = examMode ? "rgba(168, 85, 247," : "rgba(0, 255, 157,";

  // Load quote
  useEffect(() => {
    const loadQuote = async () => {
      try {
        const dailyQuote = await generateQuoteOfTheDay(examMode, stressLevel);
        setQuote(dailyQuote);
      } catch (error) {
        console.error('Error loading quote:', error);
        setQuote("Take it one day at a time. You're doing great.");
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, [examMode, stressLevel]);

  // Load risk message if at risk
  useEffect(() => {
    if (isAtRisk && currentStreak > 0) {
      const loadRiskMessage = async () => {
        try {
          const message = await generateStreakRiskMessage(currentStreak, true);
          setRiskMessage(message);
        } catch (error) {
          console.error('Error loading risk message:', error);
        }
      };

      loadRiskMessage();
    } else {
      setRiskMessage(null);
    }
  }, [isAtRisk, currentStreak]);

  // Refresh quote (generates new one)
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Force refresh by adding timestamp to context
      const newQuote = await generateQuoteOfTheDay(examMode, stressLevel);
      setQuote(newQuote);
    } catch (error) {
      console.error('Error refreshing quote:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quote Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-4 sm:p-5 rounded-lg border overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primaryColorRgba} 0.1) 0%, rgba(0,0,0,0.3) 100%)`,
          borderColor: `${primaryColorRgba} 0.3)`,
        }}
      >
        {/* Decorative element */}
        <div
          className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full blur-3xl opacity-20"
          style={{ background: primaryColor }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: primaryColor }} />
            <h3
              className="font-display text-xs sm:text-sm uppercase tracking-wider"
              style={{ color: primaryColor }}
            >
              {examMode ? 'Exam Mode Boost' : 'Daily Motivation'}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? 'animate-spin' : ''}`}
              style={{ color: primaryColor }}
            />
          </Button>
        </div>

        {/* Quote */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-4"
            >
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse" />
            </motion.div>
          ) : (
            <motion.div
              key={quote}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative z-10"
            >
              <blockquote className="text-base sm:text-lg font-mono text-white/90 leading-relaxed">
                "{quote}"
              </blockquote>
              <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2">
                <div
                  className="w-1 h-3 sm:h-4 rounded-full"
                  style={{ background: primaryColor }}
                />
                <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                  AI-generated • Refreshes daily
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exam Mode Indicator */}
        {examMode && (
          <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/10">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-400 font-mono">
              Exam-aware motivation enabled
            </span>
          </div>
        )}
      </motion.div>

      {/* Streak Risk Alert */}
      <AnimatePresence>
        {isAtRisk && riskMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-lg border"
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              borderColor: 'rgba(245, 158, 11, 0.3)',
            }}
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-full bg-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-mono text-amber-200">
                  Streak Check-in
                </p>
                <p className="text-sm text-muted-foreground font-mono mt-1">
                  {riskMessage}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuoteOfTheDay;
