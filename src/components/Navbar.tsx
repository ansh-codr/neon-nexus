import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import CyberButton from "./CyberButton";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Stats", href: "#stats" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="p-2 border border-primary cyber-chamfer-sm neon-glow group-hover:animate-pulse-glow transition-all">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display text-lg uppercase tracking-widest text-primary text-glow">
              CHT
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-terminal text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors relative group"
              >
                <span className="text-primary mr-1">&gt;</span>
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:block">
            <CyberButton variant="glitch" size="sm">
              Get Started
            </CyberButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden border-t border-border py-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="font-terminal text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  <span className="text-primary mr-2">&gt;</span>
                  {link.label}
                </a>
              ))}
              <CyberButton variant="glitch" size="sm" className="mt-4">
                Get Started
              </CyberButton>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
