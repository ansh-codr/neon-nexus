import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crosshair, RotateCcw, Timer } from "lucide-react";

const GRID_SIZE = 9;
const ROUND_TIME = 20;

const getRandomIndex = (prev?: number) => {
  let next = Math.floor(Math.random() * GRID_SIZE);
  while (prev !== undefined && next === prev) {
    next = Math.floor(Math.random() * GRID_SIZE);
  }
  return next;
};

const ReflexTap = () => {
  const [activeIndex, setActiveIndex] = useState<number>(() => getRandomIndex());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => getRandomIndex(prev));
    }, 650);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      setIsRunning(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isRunning]);

  const resetGame = () => {
    setScore(0);
    setTimeLeft(ROUND_TIME);
    setActiveIndex(getRandomIndex());
    setIsRunning(true);
  };

  const handleTap = (index: number) => {
    if (!isRunning) return;
    if (index === activeIndex) {
      setScore((s) => s + 1);
      setActiveIndex((prev) => getRandomIndex(prev));
    }
  };

  const status = useMemo(() => (isRunning ? "LIVE" : "COMPLETE"), [isRunning]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(0, 255, 157, 0.12)"
          animation={{ scale: 62, speed: 50 }}
          noise={{ opacity: 0.5, scale: 1.1 }}
          sizing="fill"
        />
      </div>

      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-20" />

      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <Link to="/games">
          <Button variant="ghost" className="mb-6 text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Arcade
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider text-primary text-glow mb-2">
            Reflex Tap
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Tap the glowing target before it jumps.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/70 border border-primary/30 rounded-lg p-6 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-sm font-mono text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-primary" />
              Score <span className="text-primary font-semibold">{score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-yellow-400" />
              {timeLeft}s
            </div>
            <div className="text-xs uppercase tracking-widest text-primary">{status}</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: GRID_SIZE }).map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={index}
                  onClick={() => handleTap(index)}
                  className="relative h-20 sm:h-24 border border-primary/20 rounded-lg bg-background/40 hover:border-primary/60 transition-all"
                >
                  {isActive && (
                    <motion.div
                      layoutId="target"
                      initial={{ scale: 0.6, opacity: 0.2 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-2 rounded-lg bg-primary/20 border border-primary shadow-[0_0_24px_hsl(var(--primary)/0.45)]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {!isRunning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 text-center"
            >
              <p className="font-display text-xl text-primary">Run Complete</p>
              <p className="font-mono text-sm text-muted-foreground">You hit {score} targets.</p>
              <Button onClick={resetGame} className="mt-4 font-mono uppercase tracking-wider">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ReflexTap;
