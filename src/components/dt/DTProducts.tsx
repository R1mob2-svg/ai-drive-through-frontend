import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import pkgAudit from "@/assets/pkg-audit.jpg";
import pkgGrowth from "@/assets/pkg-growth.jpg";
import pkgLeadEngine from "@/assets/pkg-lead-engine.jpg";
import imageryLocalBusiness from "@/assets/imagery-local-business.jpg";
import imageryAiChatbotTech from "@/assets/imagery-ai-chatbot-tech.jpg";

const products = [
  {
    name: "AI Receptionist",
    image: imageryLocalBusiness,
    target: "For missed-call businesses",
    problem: "Missing calls means missing jobs.",
    solution:
      "We install an AI receptionist that answers 24/7, captures caller details, books enquiries and sends you the lead.",
    outcome: "More calls answered. Fewer lost customers.",
    features: [
      "24/7 AI call answering",
      "Lead capture & qualification",
      "SMS summary to your phone",
      "Connects to your existing number",
      "7-day free trial included",
    ],
    popular: false,
    cta: "Try free for 7 days",
  },
  {
    name: "Smart Website",
    image: pkgLeadEngine,
    target: "For businesses with a broken website",
    problem: "Your website should bring enquiries, not just sit there.",
    solution:
      "We build a premium smart website designed to turn visitors into calls, forms and booked leads.",
    outcome: "Better trust, clearer offers, more enquiries.",
    features: [
      "Premium mobile-first design",
      "Conversion-optimised layout",
      "Local SEO built in",
      "Lead capture & CTAs",
      "7-day free trial included",
    ],
    popular: false,
    cta: "Get a quote",
  },
  {
    name: "Smart Website + AI Receptionist Bundle",
    image: pkgGrowth,
    target: "Recommended — Best Value",
    problem: "Your website, phone and follow-up should work together.",
    solution:
      "We connect the smart website, AI receptionist and lead capture into one joined-up growth system.",
    outcome: "Best value. Fastest route to a working lead machine.",
    features: [
      "Everything in AI Receptionist",
      "Everything in Smart Website",
      "Joined-up lead system",
      "Priority onboarding",
      "7-day free trial included",
    ],
    popular: true,
    cta: "Start free trial",
  },
  {
    name: "Gatekeeper Chat",
    image: imageryAiChatbotTech,
    target: "For high-traffic websites",
    problem: "Visitors leave when nobody answers.",
    solution:
      "Add an AI chat gatekeeper that qualifies visitors, answers questions and captures hot leads.",
    outcome: "Fewer lost visitors. Better lead quality.",
    features: [
      "AI chat on your website",
      "Lead qualification questions",
      "Hot lead alerts",
      "Integrates with your CRM",
      "7-day free trial included",
    ],
    popular: false,
    cta: "Add to my site",
  },
  {
    name: "Lead Recovery",
    image: pkgAudit,
    target: "For slow follow-up businesses",
    problem: "Most businesses lose leads because follow-up is slow.",
    solution:
      "Automated follow-up workflows and lead reminders that re-engage missed enquiries.",
    outcome: "More second chances. Less wasted ad spend.",
    features: [
      "Automated follow-up sequences",
      "Lead reminder workflows",
      "Re-engagement messages",
      "Works with your existing leads",
      "7-day free trial included",
    ],
    popular: false,
    cta: "Recover my leads",
  },
];

const DTProducts = () => {
  const scrollToStart = () => {
    const el = document.querySelector("#get-started");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="products" className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section pill */}
        <div className="text-center mb-6">
          <span className="inline-block px-5 py-2 text-sm font-medium rounded-full border border-primary/40 text-primary bg-primary/5">
            Products
          </span>
        </div>

        <div className="text-center mb-12">
          <h2 className="headline-section mb-4">
            <span className="headline-primary">Everything Your Business</span>{" "}
            <span className="headline-accent-gradient">Needs to Win Leads</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pick the product that fits your biggest problem. Start with a 7-day
            free trial — no card required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((product) => (
            <div
              key={product.name}
              className={`relative p-6 md:p-8 rounded-xl smoked-glass border-t transition-all duration-300 hover:-translate-y-1 ${
                product.popular
                  ? "border-t-primary/50 glow-subtle"
                  : "border-t-primary/20 hover:border-t-primary/40"
              }`}
            >
              {/* Image + gradients clipped to card shape */}
              <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                <img
                  src={product.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: 0.28, mixBlendMode: "luminosity" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222_33%_7%/0.55)] via-[hsl(222_33%_7%/0.78)] to-[hsl(222_33%_7%/0.92)]" />
                {product.popular && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(var(--brand-gold) / 0.18) 0%, transparent 60%)",
                    }}
                  />
                )}
              </div>

              {product.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}

              <div className="relative z-10">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                  <p className="text-sm text-primary">{product.target}</p>
                </div>

                {/* Problem / Solution / Outcome */}
                <div className="mb-4 space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-medium">Problem:</span>{" "}
                    {product.problem}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-medium">Solution:</span>{" "}
                    {product.solution}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-medium">Outcome:</span>{" "}
                    {product.outcome}
                  </p>
                </div>

                <ul className="space-y-2 mb-6">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={product.popular ? "cta" : "ctaOutline"}
                  className={`w-full gap-2 ${product.popular ? "btn-glow" : ""}`}
                  onClick={scrollToStart}
                >
                  {product.cta}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-sm mt-8">
          All products include a 7-day free trial with no payment taken upfront.{" "}
          <button
            onClick={scrollToStart}
            className="text-primary hover:underline bg-transparent border-0 cursor-pointer p-0 min-h-0"
          >
            Start your trial today
          </button>
        </p>
      </div>
    </section>
  );
};

export default DTProducts;
