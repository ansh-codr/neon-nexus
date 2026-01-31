import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
}

export const GlitchText = ({
  children,
  className,
  as: Component = "span",
}: GlitchTextProps) => {
  const text = typeof children === "string" ? children : "";

  return (
    <Component
      className={cn("cyber-glitch font-display", className)}
      data-text={text}
    >
      {children}
    </Component>
  );
};

export default GlitchText;
