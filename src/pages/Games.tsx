import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import GlitchText from "@/components/GlitchText";
import {
  Gamepad2,
  Grid3X3,
  Brain,
  Hand,
  Zap,
  Trophy,
  Timer,
  Target,
  Hash,
  Calculator,
  Palette,
  Crosshair,
} from "lucide-react";

const games = [
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Classic 3x3 grid battle. Challenge the AI or play with a friend.",
    icon: Grid3X3,
    color: "#00ff9d",
    difficulty: "Easy",
    players: "1-2",
  },
  {
    id: "memory-flip",
    title: "Memory Flip",
    description: "Match neon pairs and sharpen short-term recall.",
    icon: Brain,
    color: "#ff00ff",
    difficulty: "Easy",
    players: "1",
  },
  {
    id: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    description: "Best of five vs the neural network.",
    icon: Hand,
    color: "#00ffff",
    difficulty: "Easy",
    players: "1",
  },
  {
    id: "reaction-time",
    title: "Reaction Test",
    description: "Tap fast to measure neural response time.",
    icon: Zap,
    color: "#f59e0b",
    difficulty: "Easy",
    players: "1",
  },
  {
    id: "snake",
    title: "Cyber Snake",
    description: "Collect data packets without crashing.",
    icon: Target,
    color: "#10b981",
    difficulty: "Easy",
    players: "1",
  },
  {
    id: "simon-says",
    title: "Simon Says",
    description: "Follow the pattern and extend the sequence.",
    icon: Timer,
    color: "#ec4899",
    difficulty: "Easy",
    players: "1",
  },
  {
    id: "number-guess",
    title: "Number Guess",
    description: "Crack the secret number with smart hints.",
    icon: Hash,
    color: "#22d3ee",
    difficulty: "Easy",
    players: "1",
  },
  {
    id: "quick-math",
    title: "Quick Math",
    description: "Solve 10 lightning questions and score high.",
    icon: Calculator,
    color: "#38bdf8",
    difficulty: "Easy",
    players: "1",
  },
  {
    id: "color-match",
    title: "Color Match",
    description: "Tap the button that matches the text color.",
    icon: Palette,
    color: "#a855f7",
    difficulty: "Easy",
    players: "1",
  },
  {
    id: "reflex-tap",
    title: "Reflex Tap",
    description: "Hit the glowing target before it jumps.",
    icon: Crosshair,
    color: "#34d399",
    difficulty: "Easy",
    players: "1",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Games = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(0, 255, 157, 0.1)"
          animation={{ scale: 70, speed: 40 }}
          noise={{ opacity: 0.5, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,157,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,157,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-20" />

      {/* Main Content */}
      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div
              className="p-3 rounded-lg"
              style={{
                background: "rgba(0, 255, 157, 0.1)",
                border: "1px solid rgba(0, 255, 157, 0.3)",
              }}
            >
              <Gamepad2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider mb-4">
            <GlitchText className="text-primary text-glow">Arcade</GlitchText>{" "}
            <span className="text-foreground">Zone</span>
          </h1>
          <p className="font-mono text-muted-foreground max-w-xl mx-auto">
            <span className="text-primary">&gt;</span> Take a break from tracking.
            Challenge yourself with these classic games, cyberpunk style.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-8 mb-12"
        >
          {[
            { icon: Trophy, label: "Games", value: games.length },
            { icon: Zap, label: "Quick Play", value: "Ready" },
            { icon: Timer, label: "No Ads", value: "Free" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="font-display text-lg text-primary">{stat.value}</p>
              <p className="font-terminal text-xs text-muted-foreground uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Games Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {games.map((game) => (
            <motion.div key={game.id} variants={itemVariants}>
              <Link to={`/games/${game.id}`}>
                <div
                  className="group relative p-6 rounded-lg border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${game.color}10 0%, rgba(0,0,0,0.4) 100%)`,
                    borderColor: `${game.color}40`,
                  }}
                >
                  {/* Hover Glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${game.color}20, transparent 70%)`,
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 text-left">
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{
                        background: `${game.color}20`,
                        border: `2px solid ${game.color}`,
                        boxShadow: `0 0 20px ${game.color}40`,
                      }}
                    >
                      <game.icon className="w-7 h-7" style={{ color: game.color }} />
                    </div>

                    {/* Title */}
                    <h3
                      className="font-display text-xl uppercase tracking-wide mb-2 transition-colors"
                      style={{ color: game.color }}
                    >
                      {game.title}
                    </h3>

                    {/* Description */}
                    <p className="font-mono text-sm text-muted-foreground mb-4 leading-snug">
                      {game.description}
                    </p>

                    {/* Tags */}
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-mono"
                        style={{
                          background: `${game.color}20`,
                          color: game.color,
                        }}
                      >
                        {game.difficulty}
                      </span>
                      <span
                        className="px-2 py-1 rounded text-xs font-mono"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {game.players} {game.players === "1" ? "Player" : "Players"}
                      </span>
                    </div>

                    {/* Play indicator */}
                    <div
                      className="absolute top-4 right-4 font-terminal text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: game.color }}
                    >
                      [PLAY]
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="font-terminal text-xs text-muted-foreground/50">
            <span className="text-primary">$</span> All games run locally • No data collection •{" "}
            <span className="text-primary">Pure fun</span>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Games;
