import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import heroImage from "@/assets/hero-workspace.jpg";

const trustBadges = [
  "7-day free trial — no card required",
  "24/7 AI call answering",
  "Live within 48 hours",
  "UK-based support",
];

const DTHero = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) return;

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
  }, [prefersReducedMotion]);

  // Calculate parallax values
  const parallaxY = prefersReducedMotion ? 0 : Math.min(scrollY * 0.15, 20);
  const scale = prefersReducedMotion ? 1 : 1 + Math.min(scrollY * 0.00005, 0.04);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden film-grain">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Top vignette for text readability - radial fade from top */}
      <div className="absolute inset-0 vignette-top pointer-events-none" />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-52 md:w-80 h-52 md:h-80 bg-accent/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            <h1 className="headline-instrument mb-6 animate-slide-up">
              <span className="headline-primary">Stop Missing Calls</span>{" "}
              <span className="headline-accent-gradient">While You Work.</span>
            </h1>

            <p className="hero-body-dmsans mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              AI Drive-Through gives your business a 24/7 AI receptionist, a high-converting smart website, and an automated lead system — installed fast, proven with receipts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button
                variant="cta"
                size="lg"
                className="btn-glow"
                onClick={() => scrollTo("#get-started")}
              >
                Start 7-day free trial
              </Button>
              <a href="tel:+441212345678">
                <Button variant="ctaOutline" size="lg" className="w-full sm:w-auto">
                  📞 Call the AI demo
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex flex-wrap gap-4">
                {trustBadges.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image with parallax */}
          <div
            ref={imageRef}
            className="hidden lg:block animate-scale-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative hero-parallax" style={{
              transform: `translateY(${parallaxY}px) scale(${scale})`,
            }}>
              {/* Gradient glow behind image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl" />

              {/* Image with top radial vignette overlay */}
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={heroImage}
                  alt="AI receptionist and smart website system for local businesses"
                  className="relative rounded-xl border border-border shadow-2xl w-full"
                />
                {/* Radial vignette overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/20 pointer-events-none rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DTHero;
