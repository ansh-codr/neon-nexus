import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy, Timer, Zap, Brain } from "lucide-react";

const CARD_SYMBOLS = ["⚡", "🎮", "💎", "🔥", "🌟", "🎯", "🚀", "💫"];

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryFlip = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);

  const getCardCount = () => {
    switch (difficulty) {
      case "easy": return 8;
      case "medium": return 12;
      case "hard": return 16;
      default: return 8;
    }
  };

  const initializeGame = useCallback(() => {
    const cardCount = getCardCount();
    const pairCount = cardCount / 2;
    const symbols = CARD_SYMBOLS.slice(0, pairCount);
    const cardPairs = [...symbols, ...symbols];
    
    const shuffled = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTime(0);
    setIsPlaying(true);
  }, [difficulty]);

  useEffect(() => {
    if (difficulty) {
      initializeGame();
    }
  }, [difficulty, initializeGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && matches < getCardCount() / 2) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, matches, difficulty]);

  useEffect(() => {
    if (matches === getCardCount() / 2 && isPlaying) {
      setIsPlaying(false);
      const score = moves + Math.floor(time / 2);
      if (!bestScore || score < bestScore) {
        setBestScore(score);
      }
    }
  }, [matches, isPlaying, moves, time, bestScore]);

  const handleCardClick = (id: number) => {
    if (!isPlaying) return;
    if (flippedCards.length === 2) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].symbol === cards[second].symbol) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatches((m) => m + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isGameWon = matches === getCardCount() / 2;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(255, 0, 255, 0.15)"
          animation={{ scale: 60, speed: 50 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-20" />

      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <Link to="/games">
          <Button variant="ghost" className="mb-6 text-secondary hover:text-secondary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Arcade
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider text-secondary text-glow-magenta mb-2">
            Memory Flip
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Match the pairs. Train your neural memory.
          </p>
        </motion.div>

        {!difficulty ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {[
              { mode: "easy", pairs: 4, color: "#10b981" },
              { mode: "medium", pairs: 6, color: "#f59e0b" },
              { mode: "hard", pairs: 8, color: "#ef4444" },
            ].map(({ mode, pairs, color }) => (
              <Button
                key={mode}
                onClick={() => setDifficulty(mode as any)}
                className="flex-1 max-w-xs h-24 flex-col gap-2 font-mono"
                style={{
                  background: `${color}20`,
                  border: `2px solid ${color}`,
                  color: color,
                }}
              >
                <Brain className="w-6 h-6" />
                <span className="capitalize">{mode}</span>
                <span className="text-xs opacity-70">{pairs} pairs</span>
              </Button>
            ))}
          </motion.div>
        ) : (
          <>
            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center gap-6 sm:gap-10 mb-6"
            >
              <div className="text-center">
                <Timer className="w-4 h-4 mx-auto mb-1 text-secondary" />
                <p className="font-display text-xl text-secondary">{formatTime(time)}</p>
                <p className="font-terminal text-xs text-muted-foreground">Time</p>
              </div>
              <div className="text-center">
                <Zap className="w-4 h-4 mx-auto mb-1 text-primary" />
                <p className="font-display text-xl text-primary">{moves}</p>
                <p className="font-terminal text-xs text-muted-foreground">Moves</p>
              </div>
              <div className="text-center">
                <Trophy className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
                <p className="font-display text-xl text-yellow-400">
                  {matches}/{getCardCount() / 2}
                </p>
                <p className="font-terminal text-xs text-muted-foreground">Matches</p>
              </div>
            </motion.div>

            {/* Win Message */}
            <AnimatePresence>
              {isGameWon && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center mb-6 p-4 rounded-lg"
                  style={{
                    background: "rgba(255, 0, 255, 0.1)",
                    border: "1px solid rgba(255, 0, 255, 0.3)",
                  }}
                >
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <p className="font-display text-xl text-secondary">Memory Complete!</p>
                  <p className="font-mono text-sm text-muted-foreground">
                    {moves} moves in {formatTime(time)}
                  </p>
                  {bestScore && (
                    <p className="font-terminal text-xs text-primary mt-1">
                      Best Score: {bestScore}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Card Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`grid gap-3 mb-8 mx-auto ${
                difficulty === "easy"
                  ? "grid-cols-4 max-w-sm"
                  : difficulty === "medium"
                  ? "grid-cols-4 max-w-md"
                  : "grid-cols-4 max-w-lg"
              }`}
            >
              {cards.map((card) => (
                <motion.button
                  key={card.id}
                  whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isFlipped || card.isMatched || flippedCards.length === 2}
                  className="aspect-square rounded-lg flex items-center justify-center text-3xl sm:text-4xl transition-all"
                  style={{
                    background: card.isFlipped || card.isMatched
                      ? card.isMatched
                        ? "rgba(255, 0, 255, 0.3)"
                        : "rgba(255, 0, 255, 0.15)"
                      : "rgba(255, 255, 255, 0.05)",
                    border: `2px solid ${
                      card.isMatched
                        ? "#ff00ff"
                        : card.isFlipped
                        ? "rgba(255, 0, 255, 0.5)"
                        : "rgba(255, 255, 255, 0.1)"
                    }`,
                    boxShadow: card.isMatched ? "0 0 20px rgba(255, 0, 255, 0.5)" : "none",
                    cursor: card.isFlipped || card.isMatched ? "default" : "pointer",
                  }}
                >
                  <motion.span
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: card.isFlipped || card.isMatched ? 0 : 180 }}
                    style={{
                      opacity: card.isFlipped || card.isMatched ? 1 : 0,
                    }}
                  >
                    {card.symbol}
                  </motion.span>
                </motion.button>
              ))}
            </motion.div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={initializeGame}
                variant="outline"
                className="font-mono text-xs border-secondary/30 text-secondary hover:bg-secondary/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
              <Button
                onClick={() => setDifficulty(null)}
                variant="outline"
                className="font-mono text-xs border-primary/30 text-primary hover:bg-primary/10"
              >
                Change Mode
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MemoryFlip;
