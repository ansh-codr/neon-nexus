import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "glitch";
  size?: "sm" | "md" | "lg";
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "relative font-mono uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none cyber-chamfer-sm";

    const variants = {
      default:
        "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground hover:neon-glow",
      secondary:
        "border-2 border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-secondary-foreground hover:neon-glow-magenta",
      outline:
        "border border-border text-foreground bg-transparent hover:border-primary hover:text-primary hover:neon-glow",
      ghost:
        "border-none text-foreground hover:bg-primary/10 hover:text-primary",
      glitch:
        "bg-primary text-primary-foreground border-2 border-primary hover:brightness-110 neon-glow",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {variant === "glitch" ? (
          <span className="cyber-glitch" data-text={children}>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

CyberButton.displayName = "CyberButton";

export default CyberButton;
