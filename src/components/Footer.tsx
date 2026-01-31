import { Activity, Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Support", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export const Footer = () => {
  return (
    <footer className="relative border-t border-border bg-card/50">
      <div className="absolute inset-0 circuit-grid opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 border border-primary cyber-chamfer-sm neon-glow">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <span className="font-display text-base sm:text-lg uppercase tracking-widest text-primary text-glow">
                CHT
              </span>
            </div>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
              Campus Health Tracker — helping students maintain healthy lifestyles while managing academics.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 sm:gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-1.5 sm:p-2 border border-border hover:border-primary hover:text-primary transition-all cyber-chamfer-sm"
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display text-xs sm:text-sm uppercase tracking-widest text-foreground mb-3 sm:mb-4">
                <span className="text-primary">&gt;</span> {category}
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-mono text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="font-terminal text-[10px] sm:text-xs text-muted-foreground text-center sm:text-left">
            <span className="text-primary">©</span> 2026 Campus Health Tracker. All rights reserved.
          </div>
          <div className="font-terminal text-[10px] sm:text-xs text-muted-foreground text-center sm:text-right">
            <span className="text-primary">PSID:</span> PS-98{" "}
            <span className="text-primary mx-1 sm:mx-2">|</span>
            <span className="text-primary">STATUS:</span> Active
            <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full ml-1.5 sm:ml-2 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
