import { motion } from "framer-motion";
import { Flame, TrendingUp, Target, Crown } from "lucide-react";
import { DedicationLevel, getBadge } from "@/firebase/streaks";

interface DedicationBadgeProps {
  level: DedicationLevel;
  healthStreak: number;
  studyStreak: number;
  combinedScore: number;
  insight?: string;
  examMode?: boolean;
  compact?: boolean;
}

const LEVEL_CONFIG: Record<DedicationLevel, {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof Flame;
  description: string;
}> = {
  'Getting Started': {
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    icon: Target,
    description: 'Building your foundation',
  },
  'Consistent': {
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    icon: TrendingUp,
    description: 'Maintaining momentum',
  },
  'Focused': {
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    icon: Flame,
    description: 'Sharp and determined',
  },
  'Highly Dedicated': {
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.1)',
    borderColor: 'rgba(236, 72, 153, 0.3)',
    icon: Crown,
    description: 'Leading by example',
  },
};

const DedicationBadge = ({
  level,
  healthStreak,
  studyStreak,
  combinedScore,
  insight,
  examMode = false,
  compact = false,
}: DedicationBadgeProps) => {
  const config = LEVEL_CONFIG[level];
  const Icon = config.icon;
  const badge = getBadge(level);
  const primaryColor = examMode ? "#a855f7" : "#00ff9d";

  if (compact) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          background: config.bgColor,
          border: `1px solid ${config.borderColor}`,
        }}
      >
        <span className="text-lg">{badge}</span>
        <span
          className="font-mono text-xs font-medium"
          style={{ color: config.color }}
        >
          {level}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-lg border backdrop-blur-sm"
      style={{
        background: config.bgColor,
        borderColor: config.borderColor,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{
              background: `${config.color}20`,
              border: `2px solid ${config.color}`,
            }}
          >
            {badge}
          </div>
          <div>
            <h3
              className="font-display text-sm uppercase tracking-wider"
              style={{ color: config.color }}
            >
              {level}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              {config.description}
            </p>
          </div>
        </div>
        <Icon className="w-6 h-6" style={{ color: config.color }} />
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div
          className="p-3 rounded-lg text-center"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          <p className="text-xs text-muted-foreground font-mono mb-1">Health</p>
          <p
            className="font-display text-xl font-bold"
            style={{ color: primaryColor }}
          >
            {healthStreak}
            <span className="text-xs ml-1">days</span>
          </p>
        </div>
        <div
          className="p-3 rounded-lg text-center"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          <p className="text-xs text-muted-foreground font-mono mb-1">Study</p>
          <p
            className="font-display text-xl font-bold"
            style={{ color: primaryColor }}
          >
            {studyStreak}
            <span className="text-xs ml-1">days</span>
          </p>
        </div>
        <div
          className="p-3 rounded-lg text-center"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          <p className="text-xs text-muted-foreground font-mono mb-1">Score</p>
          <p
            className="font-display text-xl font-bold"
            style={{ color: config.color }}
          >
            {combinedScore}
          </p>
        </div>
      </div>

      {/* AI Insight */}
      {insight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-3 rounded-lg border-l-2"
          style={{
            background: 'rgba(0,0,0,0.2)',
            borderLeftColor: config.color,
          }}
        >
          <p className="text-sm text-muted-foreground italic font-mono">
            "{insight}"
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DedicationBadge;
