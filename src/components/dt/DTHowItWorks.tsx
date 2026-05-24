import { PhoneCall, Settings, Rocket, TrendingUp, Check } from "lucide-react";

const steps = [
  {
    icon: PhoneCall,
    number: "01",
    title: "Tell us about your business",
    description:
      "2 minutes. We need your name, number and what you do.",
  },
  {
    icon: Settings,
    number: "02",
    title: "We configure your AI system",
    description:
      "AI receptionist, smart website and lead capture — set up and tested for you.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Go live in 48 hours",
    description:
      "Your system activates. Every call answered. Every lead captured.",
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Watch the leads come in",
    description:
      "Real-time lead summaries, call recordings and follow-up reports.",
  },
  {
    icon: Check,
    number: "05",
    title: "7-day free trial, then simple monthly",
    description:
      "No long contracts. Cancel any time. Full UK support.",
  },
];

const DTHowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-center mb-6">
            <span className="inline-block px-5 py-2 text-sm font-medium rounded-full border border-primary/40 text-primary bg-primary/5">
              How It Works
            </span>
          </div>
          <h2 className="headline-section mb-4">
            <span className="headline-primary">From Sign-Up to</span>{" "}
            <span className="headline-accent-gradient">Live in 48 Hours</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We handle all the setup. You just fill in your details and we do the rest.
          </p>
        </div>

        {/* Desktop horizontal timeline */}
        <div className="hidden lg:block relative">
          {/* Timeline line */}
          <div className="absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="grid grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center group">
                {/* Step number badge */}
                <div className="relative z-10 mb-6">
                  <div className="w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="lg:hidden relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex gap-6 items-start">
                {/* Step icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DTHowItWorks;
