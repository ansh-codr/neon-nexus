import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Zap, Trophy, Timer } from "lucide-react";

type GameState = "waiting" | "ready" | "go" | "result" | "too-early";

const ReactionTime = () => {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [bestTime, setBestTime] = useState<number | null>(null);

  useEffect(() => {
    const savedBest = localStorage.getItem("reactionTimeBest");
    if (savedBest) setBestTime(parseInt(savedBest));
  }, []);

  const startGame = useCallback(() => {
    setGameState("ready");
    setReactionTime(null);

    const delay = Math.random() * 3000 + 2000; // 2-5 seconds
    const timeout = setTimeout(() => {
      setGameState("go");
      setStartTime(Date.now());
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  const handleClick = () => {
    if (gameState === "waiting") {
      startGame();
    } else if (gameState === "ready") {
      setGameState("too-early");
    } else if (gameState === "go") {
      const time = Date.now() - (startTime || 0);
      setReactionTime(time);
      setAttempts((prev) => [...prev.slice(-4), time]);
      setGameState("result");

      if (!bestTime || time < bestTime) {
        setBestTime(time);
        localStorage.setItem("reactionTimeBest", time.toString());
      }
    } else if (gameState === "result" || gameState === "too-early") {
      startGame();
    }
  };

  const getAverageTime = () => {
    if (attempts.length === 0) return null;
    return Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length);
  };

  const getReactionRating = (time: number) => {
    if (time < 200) return { text: "Incredible!", color: "#00ff9d" };
    if (time < 250) return { text: "Excellent!", color: "#10b981" };
    if (time < 300) return { text: "Great!", color: "#3b82f6" };
    if (time < 350) return { text: "Good", color: "#f59e0b" };
    if (time < 400) return { text: "Average", color: "#f97316" };
    return { text: "Keep Trying", color: "#ef4444" };
  };

  const getBackgroundColor = () => {
    switch (gameState) {
      case "ready":
        return "rgba(239, 68, 68, 0.3)";
      case "go":
        return "rgba(0, 255, 157, 0.3)";
      case "too-early":
        return "rgba(239, 68, 68, 0.5)";
      case "result":
        return reactionTime && reactionTime < 300
          ? "rgba(0, 255, 157, 0.2)"
          : "rgba(245, 158, 11, 0.2)";
      default:
        return "rgba(255, 255, 255, 0.05)";
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case "waiting":
        return "Click to Start";
      case "ready":
        return "Wait for Green...";
      case "go":
        return "CLICK NOW!";
      case "too-early":
        return "Too Early!";
      case "result":
        return `${reactionTime}ms`;
      default:
        return "";
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(245, 158, 11, 0.12)"
          animation={{ scale: 60, speed: 50 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-20" />

      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <Link to="/games">
          <Button variant="ghost" className="mb-6 text-amber-400 hover:text-amber-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Arcade
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1
            className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-2"
            style={{ color: "#f59e0b", textShadow: "0 0 30px rgba(245, 158, 11, 0.5)" }}
          >
            Reaction Test
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Test your neural response time
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center gap-8 mb-8"
        >
          <div className="text-center">
            <Trophy className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
            <p className="font-display text-xl text-yellow-400">
              {bestTime ? `${bestTime}ms` : "---"}
            </p>
            <p className="font-terminal text-xs text-muted-foreground">Best</p>
          </div>
          <div className="text-center">
            <Timer className="w-4 h-4 mx-auto mb-1 text-amber-400" />
            <p className="font-display text-xl text-amber-400">
              {getAverageTime() ? `${getAverageTime()}ms` : "---"}
            </p>
            <p className="font-terminal text-xs text-muted-foreground">Average</p>
          </div>
          <div className="text-center">
            <Zap className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="font-display text-xl text-primary">{attempts.length}</p>
            <p className="font-terminal text-xs text-muted-foreground">Attempts</p>
          </div>
        </motion.div>

        {/* Main Game Area */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleClick}
          className="w-full aspect-[2/1] rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer mb-6"
          style={{
            background: getBackgroundColor(),
            border: `3px solid ${
              gameState === "go"
                ? "#00ff9d"
                : gameState === "ready" || gameState === "too-early"
                ? "#ef4444"
                : "rgba(255,255,255,0.2)"
            }`,
            boxShadow:
              gameState === "go"
                ? "0 0 50px rgba(0, 255, 157, 0.5), inset 0 0 30px rgba(0, 255, 157, 0.2)"
                : gameState === "ready" || gameState === "too-early"
                ? "0 0 50px rgba(239, 68, 68, 0.3)"
                : "none",
          }}
        >
          {gameState === "result" && reactionTime ? (
            <>
              <motion.p
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-5xl sm:text-6xl mb-2"
                style={{ color: getReactionRating(reactionTime).color }}
              >
                {reactionTime}
                <span className="text-2xl">ms</span>
              </motion.p>
              <p
                className="font-terminal text-lg uppercase"
                style={{ color: getReactionRating(reactionTime).color }}
              >
                {getReactionRating(reactionTime).text}
              </p>
              <p className="font-mono text-sm text-muted-foreground mt-2">
                Click to try again
              </p>
            </>
          ) : (
            <>
              <Zap
                className={`w-16 h-16 mb-4 ${gameState === "go" ? "animate-pulse" : ""}`}
                style={{
                  color:
                    gameState === "go"
                      ? "#00ff9d"
                      : gameState === "ready" || gameState === "too-early"
                      ? "#ef4444"
                      : "#f59e0b",
                }}
              />
              <p
                className="font-display text-2xl sm:text-3xl uppercase"
                style={{
                  color:
                    gameState === "go"
                      ? "#00ff9d"
                      : gameState === "ready" || gameState === "too-early"
                      ? "#ef4444"
                      : "#f59e0b",
                }}
              >
                {getMessage()}
              </p>
              {gameState === "too-early" && (
                <p className="font-mono text-sm text-muted-foreground mt-2">
                  Click to try again
                </p>
              )}
            </>
          )}
        </motion.button>

        {/* Recent Attempts */}
        {attempts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <p className="font-terminal text-xs text-muted-foreground uppercase mb-2 text-center">
              Recent Attempts
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              {attempts.map((time, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded text-sm font-mono"
                  style={{
                    background: `${getReactionRating(time).color}20`,
                    color: getReactionRating(time).color,
                    border: `1px solid ${getReactionRating(time).color}40`,
                  }}
                >
                  {time}ms
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reset Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => {
              setAttempts([]);
              setGameState("waiting");
              setReactionTime(null);
            }}
            variant="outline"
            className="font-mono text-xs border-muted-foreground/30 text-muted-foreground hover:bg-muted/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear History
          </Button>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="font-terminal text-xs text-muted-foreground/50">
            Average human reaction time: <span className="text-primary">200-250ms</span>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default ReactionTime;
