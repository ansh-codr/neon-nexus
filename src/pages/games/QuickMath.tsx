import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Calculator, Sparkles } from "lucide-react";

interface Question {
  left: number;
  right: number;
  op: "+" | "-";
  answer: number;
}

const buildQuestion = (): Question => {
  const left = Math.floor(Math.random() * 20) + 1;
  const right = Math.floor(Math.random() * 20) + 1;
  const op = Math.random() > 0.5 ? "+" : "-";
  const answer = op === "+" ? left + right : left - right;
  return { left, right, op, answer };
};

const buildChoices = (answer: number) => {
  const offsets = [-3, -2, -1, 1, 2, 3, 4];
  const picks = new Set<number>([answer]);
  while (picks.size < 3) {
    const offset = offsets[Math.floor(Math.random() * offsets.length)];
    picks.add(answer + offset);
  }
  return Array.from(picks).sort(() => Math.random() - 0.5);
};

const QuickMath = () => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [seed, setSeed] = useState(0);

  const question = useMemo(() => buildQuestion(), [seed]);
  const choices = useMemo(() => buildChoices(question.answer), [question.answer]);

  const nextRound = (isCorrect: boolean) => {
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      setRound((r) => (r < 10 ? r + 1 : r));
      setSeed((s) => s + 1);
    }, 450);
  };

  const resetGame = () => {
    setRound(1);
    setScore(0);
    setFeedback(null);
    setSeed((s) => s + 1);
  };

  const isComplete = round === 10 && feedback === null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(0, 255, 255, 0.12)"
          animation={{ scale: 65, speed: 50 }}
          noise={{ opacity: 0.55, scale: 1.1 }}
          sizing="fill"
        />
      </div>

      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-20" />

      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <Link to="/games">
          <Button variant="ghost" className="mb-6 text-cyan-400 hover:text-cyan-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Arcade
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider text-cyan-400 text-glow-cyan mb-2">
            Quick Math
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Solve 10 lightning math challenges.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/70 border border-cyan-400/30 rounded-lg p-6 backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-6 text-sm font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              Round {round}/10
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Score <span className="text-primary font-semibold">{score}</span>
            </div>
          </div>

          <div className="text-center text-3xl font-display text-foreground mb-6">
            {question.left} {question.op} {question.right} = ?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {choices.map((choice) => (
              <Button
                key={choice}
                variant="outline"
                onClick={() => nextRound(choice === question.answer)}
                className="font-mono text-lg h-14 border-cyan-400/40 hover:border-cyan-300 hover:text-cyan-200"
              >
                {choice}
              </Button>
            ))}
          </div>

          <div className="mt-5 min-h-[28px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  key={feedback}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={feedback === "correct" ? "text-primary" : "text-red-400"}
                >
                  {feedback === "correct" ? "Correct!" : "Not quite. Try the next one."}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 text-center"
            >
              <p className="font-display text-xl text-cyan-300">Run Complete</p>
              <p className="font-mono text-sm text-muted-foreground">
                You scored {score} out of 10.
              </p>
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

export default QuickMath;
