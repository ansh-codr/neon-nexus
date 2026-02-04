import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, RotateCcw, Hash, TrendingDown, TrendingUp, Trophy } from "lucide-react";

const getRandomNumber = () => Math.floor(Math.random() * 100) + 1;

const NumberGuess = () => {
  const [secret, setSecret] = useState(getRandomNumber);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hint, setHint] = useState<"high" | "low" | "correct" | null>(null);
  const [best, setBest] = useState<number | null>(null);

  const isWin = hint === "correct";
  const range = useMemo(() => ({ min: 1, max: 100 }), []);

  const resetGame = () => {
    setSecret(getRandomNumber());
    setGuess("");
    setAttempts(0);
    setHint(null);
  };

  const submitGuess = () => {
    const value = Number(guess);
    if (!value || value < range.min || value > range.max) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (value === secret) {
      setHint("correct");
      if (!best || nextAttempts < best) {
        setBest(nextAttempts);
      }
      return;
    }

    setHint(value > secret ? "high" : "low");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(0, 255, 157, 0.15)"
          animation={{ scale: 70, speed: 45 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-20" />

      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
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
            Number Guess
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Guess the secret number between {range.min} and {range.max}.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/70 border border-primary/30 rounded-lg p-6 backdrop-blur-md"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2 border border-primary/30 rounded-lg bg-primary/10">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            <div className="text-sm font-mono text-muted-foreground">
              Attempts: <span className="text-primary font-semibold">{attempts}</span>
            </div>
            {best && (
              <div className="text-sm font-mono text-muted-foreground">
                Best: <span className="text-secondary font-semibold">{best}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Input
              type="number"
              min={range.min}
              max={range.max}
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess"
              className="font-mono"
            />
            <Button onClick={submitGuess} className="font-mono uppercase tracking-wider">
              Submit
            </Button>
            <Button variant="outline" onClick={resetGame} className="font-mono uppercase tracking-wider">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="mt-6 min-h-[64px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {hint && (
                <motion.div
                  key={hint}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-sm font-mono"
                >
                  {hint === "high" && (
                    <>
                      <TrendingDown className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400">Too high. Try lower.</span>
                    </>
                  )}
                  {hint === "low" && (
                    <>
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-400">Too low. Try higher.</span>
                    </>
                  )}
                  {hint === "correct" && (
                    <>
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="text-primary">Correct! You cracked the code.</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isWin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 text-center text-xs font-mono text-muted-foreground"
            >
              Press reset to play again.
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default NumberGuess;
