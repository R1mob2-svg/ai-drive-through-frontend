import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const tiers = [
  {
    id: "pay-per-lead",
    name: "Pay-per-lead",
    price: "£0 setup",
    priceDetail: "Pay only for qualified leads captured",
    tagline: "Best for testing the system without commitment",
    features: [
      "AI receptionist",
      "Lead capture",
      "SMS summary",
      "7-day free trial",
    ],
    popular: false,
    cta: "Start free trial",
  },
  {
    id: "flat-monthly",
    name: "Flat monthly",
    price: "From £99/month",
    priceDetail: "Everything included",
    tagline: "Best for businesses ready for predictable growth",
    features: [
      "All AI Receptionist features",
      "Smart website included",
      "Priority support",
      "Monthly reporting",
    ],
    popular: true,
    cta: "Start free trial",
  },
];

const DTPricing = () => {
  const scrollToStart = () => {
    const el = document.querySelector("#get-started");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section pill */}
        <div className="text-center mb-6">
          <span className="inline-block px-5 py-2 text-sm font-medium rounded-full border border-primary/40 text-primary bg-primary/5">
            Pricing
          </span>
        </div>

        <div className="text-center mb-12">
          <h2 className="headline-section mb-4">
            <span className="headline-primary">Simple, Transparent</span>{" "}
            <span className="headline-accent-gradient">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start free. No payment until your trial ends. All prices in GBP.
          </p>
        </div>

        {/* Two-tier pricing */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative p-6 md:p-8 rounded-xl smoked-glass border-t transition-all duration-300 hover:-translate-y-1 ${
                tier.popular
                  ? "border-t-primary/50 glow-subtle"
                  : "border-t-primary/20 hover:border-t-primary/40"
              }`}
            >
              {tier.popular && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(var(--brand-gold) / 0.12) 0%, transparent 60%)",
                  }}
                />
              )}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold text-gold-gradient mb-1">
                    {tier.price}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{tier.priceDetail}</p>
                  <p className="text-xs text-primary font-medium">{tier.tagline}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.popular ? "cta" : "ctaOutline"}
                  className={`w-full gap-2 ${tier.popular ? "btn-glow" : ""}`}
                  onClick={scrollToStart}
                >
                  {tier.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bundle pricing callout */}
        <div className="max-w-3xl mx-auto">
          <div className="smoked-glass rounded-xl p-6 md:p-8 text-center border border-primary/20">
            <h3 className="text-lg font-bold mb-2">
              Smart Website + AI Receptionist Bundle
            </h3>
            <div className="text-2xl font-bold text-gold-gradient mb-2">
              From £1,299 setup + £129/month
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              7-day free trial before live activation
            </p>
            <Button variant="cta" className="btn-glow" onClick={scrollToStart}>
              Claim the bundle
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DTPricing;
