import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy, Play, Pause, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };
type GameState = "idle" | "playing" | "paused" | "gameover";

const GRID_SIZE = 15;
const INITIAL_SPEED = 150;

const Snake = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const directionRef = useRef<Direction>(direction);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("snakeHighScore");
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeBody.some((seg) => seg.x === newFood.x && seg.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 7, y: 7 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameState("idle");
  }, [generateFood]);

  const startGame = () => {
    if (gameState === "gameover") {
      resetGame();
    }
    setGameState("playing");
  };

  const pauseGame = () => {
    setGameState(gameState === "playing" ? "paused" : "playing");
  };

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };
      const currentDirection = directionRef.current;

      switch (currentDirection) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameState("gameover");
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        setGameState("gameover");
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood(newSnake));
        setScore((prev) => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem("snakeHighScore", newScore.toString());
          }
          return newScore;
        });
        // Increase speed every 50 points
        if ((score + 10) % 50 === 0) {
          setSpeed((prev) => Math.max(prev - 10, 50));
        }
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [food, generateFood, highScore, score]);

  // Game loop
  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, moveSnake, speed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing" && gameState !== "paused") return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (directionRef.current !== "DOWN") {
            directionRef.current = "UP";
            setDirection("UP");
          }
          e.preventDefault();
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (directionRef.current !== "UP") {
            directionRef.current = "DOWN";
            setDirection("DOWN");
          }
          e.preventDefault();
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (directionRef.current !== "RIGHT") {
            directionRef.current = "LEFT";
            setDirection("LEFT");
          }
          e.preventDefault();
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (directionRef.current !== "LEFT") {
            directionRef.current = "RIGHT";
            setDirection("RIGHT");
          }
          e.preventDefault();
          break;
        case " ":
          pauseGame();
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const handleDirectionButton = (newDirection: Direction) => {
    if (gameState !== "playing") return;

    const opposites: Record<Direction, Direction> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };

    if (directionRef.current !== opposites[newDirection]) {
      directionRef.current = newDirection;
      setDirection(newDirection);
    }
  };

  const cellSize = `calc((min(100vw - 2rem, 400px)) / ${GRID_SIZE})`;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(0, 255, 157, 0.12)"
          animation={{ scale: 60, speed: 50 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-20" />

      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
        <Link to="/games">
          <Button variant="ghost" className="mb-6 text-primary hover:text-primary/80">
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
            style={{ color: "#00ff9d", textShadow: "0 0 30px rgba(0, 255, 157, 0.5)" }}
          >
            Cyber Snake
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Classic arcade, neon edition
          </p>
        </motion.div>

        {/* Score Display */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="text-center">
            <p className="font-terminal text-xs text-muted-foreground">Score</p>
            <p className="font-display text-2xl text-primary">{score}</p>
          </div>
          <div className="text-center">
            <Trophy className="w-4 h-4 mx-auto text-yellow-400" />
            <p className="font-display text-xl text-yellow-400">{highScore}</p>
          </div>
        </div>

        {/* Game Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-lg overflow-hidden mx-auto"
          style={{
            width: "min(100%, 400px)",
            aspectRatio: "1/1",
            background: "rgba(0, 0, 0, 0.8)",
            border: "2px solid rgba(0, 255, 157, 0.3)",
            boxShadow: "0 0 30px rgba(0, 255, 157, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, #00ff9d 1px, transparent 1px),
                linear-gradient(to bottom, #00ff9d 1px, transparent 1px)
              `,
              backgroundSize: `calc(100% / ${GRID_SIZE}) calc(100% / ${GRID_SIZE})`,
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute rounded-sm"
              style={{
                width: cellSize,
                height: cellSize,
                left: `calc(${segment.x} * ${cellSize})`,
                top: `calc(${segment.y} * ${cellSize})`,
                background:
                  index === 0
                    ? "linear-gradient(135deg, #00ff9d, #00cc7d)"
                    : `rgba(0, 255, 157, ${1 - index * 0.05})`,
                boxShadow:
                  index === 0
                    ? "0 0 10px #00ff9d, inset 0 0 5px rgba(255,255,255,0.3)"
                    : "0 0 5px rgba(0, 255, 157, 0.5)",
                border: index === 0 ? "1px solid rgba(255,255,255,0.5)" : "none",
              }}
            />
          ))}

          {/* Food */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 10px #ff00ff",
                "0 0 20px #ff00ff",
                "0 0 10px #ff00ff",
              ],
            }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute rounded-full"
            style={{
              width: cellSize,
              height: cellSize,
              left: `calc(${food.x} * ${cellSize})`,
              top: `calc(${food.y} * ${cellSize})`,
              background: "radial-gradient(circle, #ff00ff, #cc00cc)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          />

          {/* Game State Overlay */}
          {gameState !== "playing" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="text-center">
                {gameState === "idle" && (
                  <>
                    <p className="font-display text-xl text-primary mb-4">Ready to Play?</p>
                    <Button
                      onClick={startGame}
                      className="bg-primary/20 border border-primary text-primary hover:bg-primary/30"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start
                    </Button>
                  </>
                )}
                {gameState === "paused" && (
                  <>
                    <p className="font-display text-xl text-amber-400 mb-4">Paused</p>
                    <Button
                      onClick={pauseGame}
                      className="bg-amber-400/20 border border-amber-400 text-amber-400 hover:bg-amber-400/30"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Resume
                    </Button>
                  </>
                )}
                {gameState === "gameover" && (
                  <>
                    <p className="font-display text-2xl text-red-500 mb-2">Game Over</p>
                    <p className="font-mono text-lg text-muted-foreground mb-4">
                      Score: <span className="text-primary">{score}</span>
                    </p>
                    {score >= highScore && score > 0 && (
                      <p className="font-terminal text-sm text-yellow-400 mb-4">
                        🏆 New High Score!
                      </p>
                    )}
                    <Button
                      onClick={startGame}
                      className="bg-primary/20 border border-primary text-primary hover:bg-primary/30"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Play Again
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Mobile Controls */}
        <div className="mt-6 md:hidden">
          <div className="flex flex-col items-center gap-2">
            <Button
              onTouchStart={() => handleDirectionButton("UP")}
              onClick={() => handleDirectionButton("UP")}
              className="w-14 h-14 bg-white/5 border border-white/20 hover:bg-white/10"
              disabled={gameState !== "playing"}
            >
              <ChevronUp className="w-8 h-8" />
            </Button>
            <div className="flex gap-2">
              <Button
                onTouchStart={() => handleDirectionButton("LEFT")}
                onClick={() => handleDirectionButton("LEFT")}
                className="w-14 h-14 bg-white/5 border border-white/20 hover:bg-white/10"
                disabled={gameState !== "playing"}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                onClick={pauseGame}
                className="w-14 h-14 bg-white/5 border border-white/20 hover:bg-white/10"
                disabled={gameState === "idle" || gameState === "gameover"}
              >
                {gameState === "paused" ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
              </Button>
              <Button
                onTouchStart={() => handleDirectionButton("RIGHT")}
                onClick={() => handleDirectionButton("RIGHT")}
                className="w-14 h-14 bg-white/5 border border-white/20 hover:bg-white/10"
                disabled={gameState !== "playing"}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </div>
            <Button
              onTouchStart={() => handleDirectionButton("DOWN")}
              onClick={() => handleDirectionButton("DOWN")}
              className="w-14 h-14 bg-white/5 border border-white/20 hover:bg-white/10"
              disabled={gameState !== "playing"}
            >
              <ChevronDown className="w-8 h-8" />
            </Button>
          </div>
        </div>

        {/* Desktop Controls Info */}
        <div className="hidden md:block mt-6 text-center">
          <p className="font-terminal text-xs text-muted-foreground">
            Use <span className="text-primary">Arrow Keys</span> or{" "}
            <span className="text-primary">WASD</span> to move •{" "}
            <span className="text-primary">Space</span> to pause
          </p>
        </div>
      </main>
    </div>
  );
};

export default Snake;
