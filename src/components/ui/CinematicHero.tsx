import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CinematicHeroProps {
  backgroundImage?: string;
  children: ReactNode;
  className?: string;
  overlayOpacity?: "light" | "medium" | "heavy";
  showGrain?: boolean;
  parallax?: boolean;
}

const CinematicHero = ({
  backgroundImage,
  children,
  className,
  overlayOpacity = "medium",
  showGrain = true,
  parallax = true,
}: CinematicHeroProps) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion || !parallax) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prefersReducedMotion, parallax]);

  const parallaxY = prefersReducedMotion || !parallax ? 0 : Math.min(scrollY * 0.15, 30);
  const scale = prefersReducedMotion || !parallax ? 1 : 1 + Math.min(scrollY * 0.00003, 0.03);

  const overlayClasses = {
    light: "bg-gradient-to-b from-background/60 via-background/40 to-background/80",
    medium: "bg-gradient-to-b from-background/80 via-background/60 to-background/90",
    heavy: "bg-gradient-to-b from-background/90 via-background/70 to-background",
  };

  return (
    <section
      className={cn(
        "relative min-h-[70vh] flex items-center pt-20 pb-16 overflow-hidden",
        showGrain && "film-grain",
        className
      )}
    >
      {/* Background Image with Parallax */}
      {backgroundImage && (
        <div
          ref={imageRef}
          className="absolute inset-0 hero-parallax"
          style={{
            transform: `translateY(${parallaxY}px) scale(${scale})`,
          }}
        >
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div className={cn("absolute inset-0", overlayClasses[overlayOpacity])} />

      {/* Top radial vignette for text readability */}
      <div className="absolute inset-0 vignette-top pointer-events-none" />

      {/* Hero gradient effect */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />

      {/* Ambient glow orbs - Entreprenuity gold/cyan — hidden on small screens to prevent overflow */}
      <div className="absolute top-1/3 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-brand-gold/8 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-52 md:w-80 h-52 md:h-80 bg-brand-cyan/6 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">{children}</div>
    </section>
  );
};

export default CinematicHero;
