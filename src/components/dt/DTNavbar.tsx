import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "Products", href: "#products" },
  { name: "Pricing", href: "#pricing" },
  { name: "How It Works", href: "#how-it-works" },
];

const DTNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);

  const handleScroll = useCallback(() => {
    const currentScroll = window.scrollY;
    const enterThreshold = 80;
    const exitThreshold = 40;
    if (!scrolledRef.current && currentScroll > enterThreshold) {
      scrolledRef.current = true;
      setScrolled(true);
    } else if (scrolledRef.current && currentScroll < exitThreshold) {
      scrolledRef.current = false;
      setScrolled(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "h-16 smoked-glass-strong shadow-lg shadow-background/50"
          : "h-20 bg-background/40 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo / Brand */}
          <a
            href="#hero"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={(e) => { e.preventDefault(); handleNavClick("#hero"); }}
          >
            <span className="text-2xl">📞</span>
            <span className="font-bold text-lg text-foreground whitespace-nowrap">
              AI Drive-Through
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="nav-link-underline relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-md text-foreground/80 hover:text-foreground"
              >
                <span className="whitespace-nowrap">{link.name}</span>
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#get-started"
              onClick={(e) => { e.preventDefault(); handleNavClick("#get-started"); }}
            >
              <Button variant="cta" size="sm" className="font-medium btn-glow">
                Start free trial
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-foreground/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in bg-card/95 backdrop-blur-xl -mx-4 sm:-mx-6 px-4 sm:px-6 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-3 min-h-[44px] flex items-center text-base rounded-md transition-all text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 mt-2 border-t border-border">
                <a
                  href="#get-started"
                  onClick={(e) => { e.preventDefault(); handleNavClick("#get-started"); }}
                >
                  <Button variant="cta" className="w-full min-h-[44px] btn-glow">
                    Start free trial
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DTNavbar;
