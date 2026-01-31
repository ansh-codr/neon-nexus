import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CyberCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "terminal" | "holographic";
  hoverEffect?: boolean;
}

export const CyberCard = ({
  children,
  className,
  variant = "default",
  hoverEffect = false,
}: CyberCardProps) => {
  const baseStyles = "relative border transition-all duration-300";
  
  const variants = {
    default: "bg-card border-border cyber-chamfer",
    terminal: "bg-background border-border cyber-chamfer",
    holographic: "bg-muted/30 border-primary/30 neon-glow backdrop-blur-sm",
  };

  const hoverStyles = hoverEffect
    ? "hover:-translate-y-1 hover:border-primary hover:neon-glow cursor-pointer"
    : "";

  return (
    <div className={cn(baseStyles, variants[variant], hoverStyles, className)}>
      {variant === "terminal" && (
        <div className="terminal-header">
          <span className="terminal-dot bg-destructive" />
          <span className="terminal-dot bg-warning" />
          <span className="terminal-dot bg-primary" />
          <span className="ml-2 text-xs text-muted-foreground font-terminal uppercase tracking-widest">
            terminal
          </span>
        </div>
      )}
      {variant === "holographic" && (
        <>
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
        </>
      )}
      {children}
    </div>
  );
};

export default CyberCard;
