import { Activity, Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CyberButton from "./CyberButton";
import { Button } from "./ui/button";
import AudioButton from "./AudioButton";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Stats", href: "#stats" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 border border-primary cyber-chamfer-sm neon-glow group-hover:animate-pulse-glow transition-all">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display text-lg uppercase tracking-widest text-primary text-glow">
              NEON NEXUS
            </span>
          </Link>

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
          <div className="hidden lg:flex items-center gap-3">
            <AudioButton />
            <Link to="/dashboard">
              <Button 
                variant="ghost" 
                className="font-mono text-sm uppercase tracking-wider text-primary hover:text-secondary hover:bg-primary/10 transition-all duration-300 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            {!isDashboard && (
              <>
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="font-mono text-sm uppercase tracking-wider text-primary hover:text-secondary hover:bg-primary/10 transition-all duration-300"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <CyberButton variant="glitch" size="sm">
                    Sign Up
                  </CyberButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <AudioButton />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
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
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full font-mono text-sm uppercase tracking-wider border-primary/30 hover:border-primary text-primary flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                {!isDashboard && (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button 
                        variant="outline" 
                        className="w-full font-mono text-sm uppercase tracking-wider border-primary/30 hover:border-primary text-primary"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <CyberButton variant="glitch" size="sm" className="w-full">
                        Sign Up
                      </CyberButton>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
