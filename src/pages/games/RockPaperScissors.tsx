import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy, Hand, Scissors, FileText } from "lucide-react";

type Choice = "rock" | "paper" | "scissors" | null;
type Result = "win" | "lose" | "draw" | null;

const CHOICES: { name: Choice; icon: typeof Hand; beats: Choice }[] = [
  { name: "rock", icon: Hand, beats: "scissors" },
  { name: "paper", icon: FileText, beats: "rock" },
  { name: "scissors", icon: Scissors, beats: "paper" },
];

const CHOICE_COLORS: Record<string, string> = {
  rock: "#00ff9d",
  paper: "#00ffff",
  scissors: "#ff00ff",
};

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [aiChoice, setAiChoice] = useState<Choice>(null);
  const [result, setResult] = useState<Result>(null);
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [round, setRound] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const bestOf = 5;
  const winningScore = Math.ceil(bestOf / 2);

  useEffect(() => {
    if (scores.player === winningScore || scores.ai === winningScore) {
      setGameOver(true);
    }
  }, [scores]);

  const getResult = (player: Choice, ai: Choice): Result => {
    if (player === ai) return "draw";
    const playerChoice = CHOICES.find((c) => c.name === player);
    return playerChoice?.beats === ai ? "win" : "lose";
  };

  const handleChoice = async (choice: Choice) => {
    if (isAnimating || gameOver) return;

    setIsAnimating(true);
    setPlayerChoice(choice);
    setAiChoice(null);
    setResult(null);

    // Countdown animation
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((r) => setTimeout(r, 400));
    }
    setCountdown(null);

    // AI makes choice
    const aiPick = CHOICES[Math.floor(Math.random() * 3)].name;
    setAiChoice(aiPick);

    // Calculate result
    const gameResult = getResult(choice, aiPick);
    setResult(gameResult);

    // Update scores
    if (gameResult === "win") {
      setScores((prev) => ({ ...prev, player: prev.player + 1 }));
    } else if (gameResult === "lose") {
      setScores((prev) => ({ ...prev, ai: prev.ai + 1 }));
    }

    if (gameResult !== "draw") {
      setRound((r) => r + 1);
    }

    setIsAnimating(false);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
    setScores({ player: 0, ai: 0 });
    setRound(1);
    setGameOver(false);
    setCountdown(null);
  };

  const nextRound = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
  };

  const getResultMessage = () => {
    if (countdown) return countdown.toString();
    if (!result) return "Choose Your Weapon";
    if (result === "win") return "You Win Round!";
    if (result === "lose") return "AI Wins Round!";
    return "Draw!";
  };

  const getResultColor = () => {
    if (countdown) return "#f59e0b";
    if (result === "win") return "#00ff9d";
    if (result === "lose") return "#ff00ff";
    if (result === "draw") return "#f59e0b";
    return "#ffffff";
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(0, 255, 255, 0.12)"
          animation={{ scale: 60, speed: 50 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
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
          className="text-center mb-6"
        >
          <h1
            className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-2"
            style={{ color: "#00ffff", textShadow: "0 0 30px rgba(0, 255, 255, 0.5)" }}
          >
            Rock Paper Scissors
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Best of {bestOf} • Round {Math.min(round, bestOf)}
          </p>
        </motion.div>

        {/* Scoreboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center gap-8 mb-8"
        >
          <div className="text-center">
            <p className="font-terminal text-xs text-muted-foreground uppercase mb-1">You</p>
            <p className="font-display text-4xl text-primary">{scores.player}</p>
          </div>
          <div className="text-2xl text-muted-foreground font-mono">VS</div>
          <div className="text-center">
            <p className="font-terminal text-xs text-muted-foreground uppercase mb-1">AI</p>
            <p className="font-display text-4xl text-secondary">{scores.ai}</p>
          </div>
        </motion.div>

        {/* Game Over */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center mb-8 p-6 rounded-lg"
              style={{
                background:
                  scores.player > scores.ai
                    ? "rgba(0, 255, 157, 0.15)"
                    : "rgba(255, 0, 255, 0.15)",
                border: `2px solid ${scores.player > scores.ai ? "#00ff9d" : "#ff00ff"}`,
              }}
            >
              <Trophy
                className="w-12 h-12 mx-auto mb-3"
                style={{ color: scores.player > scores.ai ? "#00ff9d" : "#ff00ff" }}
              />
              <p
                className="font-display text-2xl uppercase"
                style={{ color: scores.player > scores.ai ? "#00ff9d" : "#ff00ff" }}
              >
                {scores.player > scores.ai ? "Victory!" : "Defeat!"}
              </p>
              <p className="font-mono text-sm text-muted-foreground mt-2">
                Final Score: {scores.player} - {scores.ai}
              </p>
              <Button
                onClick={resetGame}
                className="mt-4 font-mono"
                style={{
                  background: "rgba(0, 255, 255, 0.2)",
                  border: "1px solid #00ffff",
                  color: "#00ffff",
                }}
              >
                Play Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {!gameOver && (
          <>
            {/* Battle Arena */}
            <div className="flex justify-center items-center gap-8 mb-8">
              {/* Player Choice */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-lg flex items-center justify-center"
                style={{
                  background: playerChoice
                    ? `${CHOICE_COLORS[playerChoice]}20`
                    : "rgba(255,255,255,0.05)",
                  border: `2px solid ${
                    playerChoice ? CHOICE_COLORS[playerChoice] : "rgba(255,255,255,0.1)"
                  }`,
                }}
              >
                {playerChoice ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-5xl sm:text-6xl"
                  >
                    {playerChoice === "rock" && "✊"}
                    {playerChoice === "paper" && "🖐️"}
                    {playerChoice === "scissors" && "✌️"}
                  </motion.div>
                ) : (
                  <span className="text-2xl text-muted-foreground">?</span>
                )}
              </motion.div>

              {/* VS */}
              <motion.div
                key={countdown || result || "default"}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-xl sm:text-2xl"
                style={{ color: getResultColor() }}
              >
                {countdown ? countdown : "VS"}
              </motion.div>

              {/* AI Choice */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-lg flex items-center justify-center"
                style={{
                  background: aiChoice
                    ? `${CHOICE_COLORS[aiChoice]}20`
                    : "rgba(255,255,255,0.05)",
                  border: `2px solid ${
                    aiChoice ? CHOICE_COLORS[aiChoice] : "rgba(255,255,255,0.1)"
                  }`,
                }}
              >
                {isAnimating && !aiChoice ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                    className="text-4xl"
                  >
                    🤖
                  </motion.div>
                ) : aiChoice ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-5xl sm:text-6xl"
                  >
                    {aiChoice === "rock" && "✊"}
                    {aiChoice === "paper" && "🖐️"}
                    {aiChoice === "scissors" && "✌️"}
                  </motion.div>
                ) : (
                  <span className="text-2xl text-muted-foreground">?</span>
                )}
              </motion.div>
            </div>

            {/* Result Message */}
            <motion.div
              key={getResultMessage()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <p
                className="font-display text-xl uppercase tracking-wider"
                style={{
                  color: getResultColor(),
                  textShadow: result ? "0 0 20px currentColor" : "none",
                }}
              >
                {getResultMessage()}
              </p>
            </motion.div>

            {/* Choice Buttons */}
            {!result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center gap-4"
              >
                {CHOICES.map((choice) => (
                  <motion.button
                    key={choice.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleChoice(choice.name)}
                    disabled={isAnimating}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex flex-col items-center justify-center gap-1 transition-all"
                    style={{
                      background: `${CHOICE_COLORS[choice.name!]}15`,
                      border: `2px solid ${CHOICE_COLORS[choice.name!]}`,
                      opacity: isAnimating ? 0.5 : 1,
                    }}
                  >
                    <span className="text-3xl sm:text-4xl">
                      {choice.name === "rock" && "✊"}
                      {choice.name === "paper" && "🖐️"}
                      {choice.name === "scissors" && "✌️"}
                    </span>
                    <span
                      className="font-terminal text-xs uppercase"
                      style={{ color: CHOICE_COLORS[choice.name!] }}
                    >
                      {choice.name}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <div className="flex justify-center">
                <Button
                  onClick={nextRound}
                  className="font-mono"
                  style={{
                    background: "rgba(0, 255, 255, 0.2)",
                    border: "1px solid #00ffff",
                    color: "#00ffff",
                  }}
                >
                  Next Round
                </Button>
              </div>
            )}
          </>
        )}

        {/* Reset Button */}
        {!gameOver && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={resetGame}
              variant="outline"
              className="font-mono text-xs border-muted-foreground/30 text-muted-foreground hover:bg-muted/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Match
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default RockPaperScissors;
