import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy, Play, Volume2, VolumeX } from "lucide-react";

type GameState = "idle" | "showing" | "input" | "success" | "gameover";

const COLORS = [
  { name: "red", bg: "#ef4444", glow: "rgba(239, 68, 68, 0.8)" },
  { name: "blue", bg: "#3b82f6", glow: "rgba(59, 130, 246, 0.8)" },
  { name: "green", bg: "#00ff9d", glow: "rgba(0, 255, 157, 0.8)" },
  { name: "yellow", bg: "#f59e0b", glow: "rgba(245, 158, 11, 0.8)" },
];

const SimonSays = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("simonHighScore");
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  // Initialize audio context
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as Window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // Play tone for each color
  const playTone = useCallback(
    (colorIndex: number, duration = 300) => {
      if (!soundEnabled) return;

      const ctx = initAudio();
      if (!ctx) return;

      const frequencies = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = "sine";
      oscillator.frequency.value = frequencies[colorIndex];

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);
    },
    [soundEnabled]
  );

  // Flash a color
  const flashColor = useCallback(
    async (colorIndex: number, duration = 500) => {
      setActiveColor(colorIndex);
      playTone(colorIndex, duration);
      await new Promise((resolve) => setTimeout(resolve, duration));
      setActiveColor(null);
      await new Promise((resolve) => setTimeout(resolve, 100));
    },
    [playTone]
  );

  // Show the sequence to the player
  const showSequence = useCallback(async () => {
    setGameState("showing");
    await new Promise((resolve) => setTimeout(resolve, 500));

    for (const colorIndex of sequence) {
      await flashColor(colorIndex);
    }

    setGameState("input");
    setPlayerSequence([]);
  }, [sequence, flashColor]);

  // Start new game
  const startGame = () => {
    const firstColor = Math.floor(Math.random() * 4);
    setSequence([firstColor]);
    setScore(0);
    setPlayerSequence([]);
    setGameState("showing");
  };

  // Add to sequence when player succeeds
  const addToSequence = useCallback(() => {
    const nextColor = Math.floor(Math.random() * 4);
    setSequence((prev) => [...prev, nextColor]);
  }, []);

  // Handle player input
  const handleColorClick = async (colorIndex: number) => {
    if (gameState !== "input") return;

    await flashColor(colorIndex, 300);
    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);

    // Check if input is correct so far
    const isCorrect = newPlayerSequence.every(
      (color, index) => color === sequence[index]
    );

    if (!isCorrect) {
      // Game over
      setGameState("gameover");
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("simonHighScore", score.toString());
      }
      return;
    }

    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      setScore((prev) => prev + 1);
      setGameState("success");
      await new Promise((resolve) => setTimeout(resolve, 500));
      addToSequence();
    }
  };

  // Show sequence when it changes
  useEffect(() => {
    if (sequence.length > 0 && gameState !== "gameover") {
      showSequence();
    }
  }, [sequence, showSequence, gameState]);

  const getStateMessage = () => {
    switch (gameState) {
      case "idle":
        return "Press Start to Begin";
      case "showing":
        return "Watch the Pattern...";
      case "input":
        return "Your Turn!";
      case "success":
        return "Correct! Next Round...";
      case "gameover":
        return "Game Over!";
      default:
        return "";
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(255, 0, 255, 0.12)"
          animation={{ scale: 60, speed: 50 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-20" />

      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
        <Link to="/games">
          <Button variant="ghost" className="mb-6 text-fuchsia-400 hover:text-fuchsia-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Arcade
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1
            className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-2"
            style={{ color: "#ff00ff", textShadow: "0 0 30px rgba(255, 0, 255, 0.5)" }}
          >
            Simon Says
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Memory pattern challenge
          </p>
        </motion.div>

        {/* Score Display */}
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="text-center">
            <p className="font-terminal text-xs text-muted-foreground">Round</p>
            <p className="font-display text-3xl text-fuchsia-400">{score}</p>
          </div>
          <div className="text-center">
            <Trophy className="w-5 h-5 mx-auto text-yellow-400 mb-1" />
            <p className="font-display text-xl text-yellow-400">{highScore}</p>
          </div>
          <Button
            onClick={() => setSoundEnabled(!soundEnabled)}
            variant="ghost"
            className="text-muted-foreground hover:text-white"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>

        {/* Status Message */}
        <motion.div
          key={gameState}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p
            className={`font-terminal text-sm uppercase ${
              gameState === "gameover"
                ? "text-red-400"
                : gameState === "success"
                ? "text-primary"
                : gameState === "input"
                ? "text-amber-400"
                : "text-muted-foreground"
            }`}
          >
            {getStateMessage()}
          </p>
        </motion.div>

        {/* Game Board */}
        <div
          className="grid grid-cols-2 gap-3 mx-auto mb-8"
          style={{ maxWidth: "300px" }}
        >
          {COLORS.map((color, index) => (
            <motion.button
              key={color.name}
              whileTap={gameState === "input" ? { scale: 0.95 } : {}}
              onClick={() => handleColorClick(index)}
              disabled={gameState !== "input"}
              className="aspect-square rounded-2xl transition-all duration-100 relative overflow-hidden"
              style={{
                background:
                  activeColor === index
                    ? color.bg
                    : `${color.bg}40`,
                boxShadow:
                  activeColor === index
                    ? `0 0 40px ${color.glow}, 0 0 80px ${color.glow}, inset 0 0 20px rgba(255,255,255,0.3)`
                    : `0 0 10px ${color.glow}40`,
                border: `2px solid ${activeColor === index ? "rgba(255,255,255,0.5)" : color.bg}40`,
                cursor: gameState === "input" ? "pointer" : "default",
                opacity: gameState === "showing" || gameState === "input" || activeColor === index ? 1 : 0.6,
              }}
            >
              {/* Inner glow effect */}
              <div
                className="absolute inset-2 rounded-xl transition-opacity duration-100"
                style={{
                  background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent)`,
                  opacity: activeColor === index ? 1 : 0,
                }}
              />
            </motion.button>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <AnimatePresence mode="wait">
            {(gameState === "idle" || gameState === "gameover") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Button
                  onClick={startGame}
                  className="bg-fuchsia-500/20 border border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-500/30 px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {gameState === "gameover" ? "Play Again" : "Start"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Game Over Stats */}
        <AnimatePresence>
          {gameState === "gameover" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 text-center"
            >
              <div className="bg-white/5 rounded-lg p-6 border border-red-500/30">
                <p className="font-terminal text-xs text-muted-foreground mb-2">
                  Final Score
                </p>
                <p className="font-display text-4xl text-red-400 mb-4">{score}</p>
                {score >= highScore && score > 0 && (
                  <p className="font-terminal text-sm text-yellow-400">
                    🏆 New High Score!
                  </p>
                )}
                {score < highScore && (
                  <p className="font-mono text-sm text-muted-foreground">
                    Best: <span className="text-primary">{highScore}</span>
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="font-terminal text-xs text-muted-foreground/50">
            Watch the pattern • Repeat it back • Don't make a mistake!
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default SimonSays;
