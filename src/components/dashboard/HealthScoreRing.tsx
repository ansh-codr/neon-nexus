import { motion } from "framer-motion";

interface HealthScoreRingProps {
  score: number;
  size?: number;
  examMode?: boolean;
}

const HealthScoreRing = ({ score, size = 200, examMode = false }: HealthScoreRingProps) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  // Color based on score
  const getScoreColor = () => {
    if (examMode) return { primary: "#a855f7", secondary: "#7c3aed", glow: "rgba(168, 85, 247, 0.5)" };
    if (score >= 80) return { primary: "#00ff9d", secondary: "#00d4ff", glow: "rgba(0, 255, 157, 0.5)" };
    if (score >= 60) return { primary: "#fbbf24", secondary: "#f59e0b", glow: "rgba(251, 191, 36, 0.5)" };
    return { primary: "#ff6b6b", secondary: "#ff00ff", glow: "rgba(255, 107, 107, 0.5)" };
  };

  const colors = getScoreColor();

  const getScoreLabel = () => {
    if (examMode) return "Balanced";
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Care";
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow effect */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size - 20,
          height: size - 20,
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Background ring */}
      <svg width={size} height={size} className="absolute transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${score})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 10px ${colors.glow})`,
          }}
        />
        <defs>
          <linearGradient id={`gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
          className="font-display"
        >
          <span
            className="text-5xl font-bold"
            style={{
              color: colors.primary,
              textShadow: `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}`,
            }}
          >
            {score}
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-xs font-mono uppercase tracking-wider mt-1"
          style={{ color: colors.primary }}
        >
          {getScoreLabel()}
        </motion.p>
      </div>

      {/* Orbiting particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: colors.primary,
            boxShadow: `0 0 10px ${colors.glow}`,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "linear",
          }}
          initial={{
            x: Math.cos((i * 120 * Math.PI) / 180) * (radius + 10),
            y: Math.sin((i * 120 * Math.PI) / 180) * (radius + 10),
          }}
        />
      ))}
    </div>
  );
};

export default HealthScoreRing;
