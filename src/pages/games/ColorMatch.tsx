import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Palette, RotateCcw } from "lucide-react";

const COLORS = [
  { name: "Green", value: "#00ff9d" },
  { name: "Magenta", value: "#ff00ff" },
  { name: "Cyan", value: "#00ffff" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Purple", value: "#8b5cf6" },
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const ColorMatch = () => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [seed, setSeed] = useState(0);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const { word, color } = useMemo(() => {
    const word = COLORS[Math.floor(Math.random() * COLORS.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return { word, color };
  }, [seed]);

  const options = useMemo(() => shuffle(COLORS).slice(0, 4), [seed]);

  const handleChoice = (choice: string) => {
    const correct = choice === color.name;
    setLastCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      setLastCorrect(null);
      setRound((r) => (r < 10 ? r + 1 : r));
      setSeed((s) => s + 1);
    }, 450);
  };

  const resetGame = () => {
    setRound(1);
    setScore(0);
    setSeed((s) => s + 1);
    setLastCorrect(null);
  };

  const isComplete = round === 10 && lastCorrect === null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(139, 92, 246, 0.15)"
          animation={{ scale: 68, speed: 48 }}
          noise={{ opacity: 0.55, scale: 1.1 }}
          sizing="fill"
        />
      </div>

      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-20" />

      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <Link to="/games">
          <Button variant="ghost" className="mb-6 text-purple-400 hover:text-purple-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Arcade
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider text-purple-400 text-glow-magenta mb-2">
            Color Match
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Tap the button that matches the text color, not the word.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/70 border border-purple-400/30 rounded-lg p-6 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-sm font-mono text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              Round {round}/10
            </div>
            <div>
              Score <span className="text-primary font-semibold">{score}</span>
            </div>
          </div>

          <div className="text-center text-4xl font-display mb-6" style={{ color: color.value }}>
            {word.name}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((option) => (
              <Button
                key={option.name}
                variant="outline"
                onClick={() => handleChoice(option.name)}
                className="font-mono text-base h-12 border-purple-400/40 hover:border-purple-300"
              >
                {option.name}
              </Button>
            ))}
          </div>

          <div className="mt-4 min-h-[24px] text-center text-sm font-mono">
            {lastCorrect === true && <span className="text-primary">Correct!</span>}
            {lastCorrect === false && <span className="text-red-400">Wrong color.</span>}
          </div>

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 text-center"
            >
              <p className="font-display text-xl text-purple-300">Run Complete</p>
              <p className="font-mono text-sm text-muted-foreground">You scored {score} out of 10.</p>
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

export default ColorMatch;
