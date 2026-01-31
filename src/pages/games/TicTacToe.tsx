import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy, User, Cpu } from "lucide-react";

type Player = "X" | "O" | null;
type Board = Player[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6], // Diagonals
];

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ player: 0, ai: 0, draws: 0 });
  const [gameMode, setGameMode] = useState<"ai" | "pvp" | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const calculateWinner = useCallback((squares: Board): { winner: Player; line: number[] } | null => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  }, []);

  const minimax = useCallback((squares: Board, isMaximizing: boolean): number => {
    const result = calculateWinner(squares);
    if (result?.winner === "O") return 10;
    if (result?.winner === "X") return -10;
    if (squares.every((s) => s !== null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = "O";
          const score = minimax(squares, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = "X";
          const score = minimax(squares, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }, [calculateWinner]);

  const getAIMove = useCallback((squares: Board): number => {
    let bestScore = -Infinity;
    let bestMove = 0;
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = "O";
        const score = minimax(squares, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }, [minimax]);

  const handleClick = (index: number) => {
    if (board[index] || winningLine) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinningLine(result.line);
      updateScores(result.winner);
      return;
    }

    if (newBoard.every((s) => s !== null)) {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    if (gameMode === "ai" && isXNext) {
      setIsXNext(false);
      setTimeout(() => {
        const aiMove = getAIMove(newBoard);
        newBoard[aiMove] = "O";
        setBoard([...newBoard]);

        const aiResult = calculateWinner(newBoard);
        if (aiResult) {
          setWinningLine(aiResult.line);
          updateScores(aiResult.winner);
        } else if (newBoard.every((s) => s !== null)) {
          setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
        } else {
          setIsXNext(true);
        }
      }, 500);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const updateScores = (winner: Player) => {
    if (winner === "X") {
      setScores((prev) => ({ ...prev, player: prev.player + 1 }));
    } else {
      setScores((prev) => ({ ...prev, ai: prev.ai + 1 }));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinningLine(null);
  };

  const resetAll = () => {
    resetGame();
    setScores({ player: 0, ai: 0, draws: 0 });
    setGameMode(null);
  };

  const result = calculateWinner(board);
  const isDraw = !result && board.every((s) => s !== null);
  const status = result
    ? `${result.winner === "X" ? "Player 1" : gameMode === "ai" ? "AI" : "Player 2"} Wins!`
    : isDraw
    ? "Draw!"
    : `${isXNext ? "Player 1" : gameMode === "ai" ? "AI" : "Player 2"}'s Turn`;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(0, 255, 157, 0.15)"
          animation={{ scale: 60, speed: 50 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-20" />

      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        {/* Back Button */}
        <Link to="/games">
          <Button variant="ghost" className="mb-6 text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Arcade
          </Button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider text-primary text-glow mb-2">
            Tic Tac Toe
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            {gameMode === "ai" ? "You vs Neural Network" : gameMode === "pvp" ? "Player vs Player" : "Select Mode"}
          </p>
        </motion.div>

        {!gameMode ? (
          /* Mode Selection */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => setGameMode("ai")}
              className="flex-1 max-w-xs h-24 flex-col gap-2 font-mono"
              style={{
                background: "rgba(0, 255, 157, 0.1)",
                border: "2px solid #00ff9d",
                color: "#00ff9d",
              }}
            >
              <Cpu className="w-8 h-8" />
              <span>VS AI</span>
            </Button>
            <Button
              onClick={() => setGameMode("pvp")}
              className="flex-1 max-w-xs h-24 flex-col gap-2 font-mono"
              style={{
                background: "rgba(255, 0, 255, 0.1)",
                border: "2px solid #ff00ff",
                color: "#ff00ff",
              }}
            >
              <User className="w-8 h-8" />
              <span>2 Players</span>
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Scoreboard */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center gap-6 mb-6"
            >
              <div className="text-center">
                <p className="font-terminal text-xs text-muted-foreground uppercase">Player 1</p>
                <p className="font-display text-2xl text-primary">{scores.player}</p>
              </div>
              <div className="text-center">
                <p className="font-terminal text-xs text-muted-foreground uppercase">Draws</p>
                <p className="font-display text-2xl text-muted-foreground">{scores.draws}</p>
              </div>
              <div className="text-center">
                <p className="font-terminal text-xs text-muted-foreground uppercase">
                  {gameMode === "ai" ? "AI" : "Player 2"}
                </p>
                <p className="font-display text-2xl text-secondary">{scores.ai}</p>
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              key={status}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <p
                className="font-display text-xl uppercase tracking-wider"
                style={{
                  color: result
                    ? result.winner === "X"
                      ? "#00ff9d"
                      : "#ff00ff"
                    : isDraw
                    ? "#f59e0b"
                    : "#ffffff",
                  textShadow: result || isDraw ? "0 0 20px currentColor" : "none",
                }}
              >
                {status}
              </p>
            </motion.div>

            {/* Game Board */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-8"
            >
              {board.map((cell, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: cell ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleClick(index)}
                  disabled={!!cell || !!winningLine || (gameMode === "ai" && !isXNext)}
                  className="aspect-square rounded-lg flex items-center justify-center font-display text-4xl sm:text-5xl transition-all"
                  style={{
                    background: winningLine?.includes(index)
                      ? cell === "X"
                        ? "rgba(0, 255, 157, 0.3)"
                        : "rgba(255, 0, 255, 0.3)"
                      : "rgba(255, 255, 255, 0.05)",
                    border: `2px solid ${
                      winningLine?.includes(index)
                        ? cell === "X"
                          ? "#00ff9d"
                          : "#ff00ff"
                        : "rgba(255, 255, 255, 0.1)"
                    }`,
                    color: cell === "X" ? "#00ff9d" : cell === "O" ? "#ff00ff" : "transparent",
                    textShadow: cell ? "0 0 20px currentColor" : "none",
                    cursor: cell || winningLine ? "default" : "pointer",
                  }}
                >
                  {cell}
                </motion.button>
              ))}
            </motion.div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={resetGame}
                variant="outline"
                className="font-mono text-xs border-primary/30 text-primary hover:bg-primary/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Game
              </Button>
              <Button
                onClick={resetAll}
                variant="outline"
                className="font-mono text-xs border-secondary/30 text-secondary hover:bg-secondary/10"
              >
                Reset All
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default TicTacToe;
