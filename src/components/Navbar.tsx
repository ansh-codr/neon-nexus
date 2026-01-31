import { Activity, Menu, X, LayoutDashboard, LogOut, User, Gamepad2 } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CyberButton from "./CyberButton";
import { Button } from "./ui/button";
import AudioButton from "./AudioButton";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Stats", href: "#stats" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();
  const isDashboard = location.pathname === "/dashboard";

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

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
            <Link to="/games">
              <Button 
                variant="ghost" 
                className="font-mono text-sm uppercase tracking-wider text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-500/10 transition-all duration-300 flex items-center gap-2"
              >
                <Gamepad2 className="w-4 h-4" />
                Arcade
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button 
                variant="ghost" 
                className="font-mono text-sm uppercase tracking-wider text-primary hover:text-secondary hover:bg-primary/10 transition-all duration-300 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            
            {user ? (
              /* Logged in - Show profile dropdown */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border-2 border-primary/50 hover:border-primary transition-all">
                    <Avatar className="h-9 w-9">
                      <AvatarImage 
                        src={userProfile?.photoURL || user.photoURL || undefined} 
                        alt={userProfile?.displayName || 'User'} 
                      />
                      <AvatarFallback 
                        className="bg-primary/20 text-primary font-mono text-sm"
                      >
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-background/95 backdrop-blur-md border-primary/30" 
                  align="end"
                >
                  <div className="flex items-center gap-3 p-3 border-b border-border">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userProfile?.photoURL || user.photoURL || undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-foreground">
                        {userProfile?.displayName || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem 
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer font-mono text-xs uppercase tracking-wider"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer font-mono text-xs uppercase tracking-wider"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer font-mono text-xs uppercase tracking-wider text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Not logged in - Show login/signup */
              !isDashboard && (
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
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <AudioButton />
            {user && (
              <Link to="/dashboard">
                <Avatar className="h-8 w-8 border-2 border-primary/50">
                  <AvatarImage src={userProfile?.photoURL || user.photoURL || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
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
                <Link to="/games" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full font-mono text-sm uppercase tracking-wider border-fuchsia-500/30 hover:border-fuchsia-500 text-fuchsia-400 flex items-center justify-center gap-2"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    Arcade
                  </Button>
                </Link>
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full font-mono text-sm uppercase tracking-wider border-primary/30 hover:border-primary text-primary flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                
                {user ? (
                  /* Logged in mobile - Show logout */
                  <Button 
                    variant="outline"
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full font-mono text-sm uppercase tracking-wider border-destructive/30 hover:border-destructive text-destructive flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                ) : (
                  /* Not logged in mobile */
                  !isDashboard && (
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
                  )
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
