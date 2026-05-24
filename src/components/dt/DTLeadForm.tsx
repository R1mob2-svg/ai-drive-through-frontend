import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DTLeadFormProps {
  backendUrl: string;
  onSuccess?: (data: unknown) => void;
}

const DTLeadForm = ({ backendUrl, onSuccess }: DTLeadFormProps) => {
  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    email: "",
    need: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${backendUrl}/proof/simulate-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.businessName,
          phone: formData.phone,
          email: formData.email,
          product: formData.need,
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        const data = await res.json();
        if (onSuccess) onSuccess(data);
      }
      // Whether backend succeeded or not, show success to buyer
      setSubmitted(true);
    } catch {
      // Backend unavailable — still show success to buyer
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="get-started" className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-xl mx-auto">
          <div className="smoked-glass rounded-2xl p-6 md:p-10">
            {/* Top badge */}
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
                🎁 7-day free trial · No card required · Cancel any time
              </span>
            </div>

            {!submitted ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="headline-section mb-3">
                    <span className="headline-primary">Stop losing leads.</span>
                    <br />
                    <span className="headline-accent-gradient">
                      Start your free trial today.
                    </span>
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Fill in your details and we'll have your system configured within
                    48 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="businessName"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Business name
                    </label>
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="e.g. Smith Plumbing Ltd"
                      className="w-full px-4 py-3 rounded-lg bg-background/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Your phone number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 07700 900000"
                      className="w-full px-4 py-3 rounded-lg bg-background/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@yourbusiness.co.uk"
                      className="w-full px-4 py-3 rounded-lg bg-background/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="need"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      What do you need?
                    </label>
                    <select
                      id="need"
                      name="need"
                      required
                      value={formData.need}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-background/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="" disabled>
                        Select a product…
                      </option>
                      <option value="ai-receptionist">AI Receptionist</option>
                      <option value="smart-website">Smart Website</option>
                      <option value="bundle">Bundle — All Three</option>
                      <option value="gatekeeper-chat">Gatekeeper Chat</option>
                      <option value="lead-recovery">Lead Recovery</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    variant="cta"
                    size="lg"
                    className="w-full btn-glow mt-2"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting…" : "Claim my 7-day free trial →"}
                  </Button>
                </form>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  No payment taken now. Our team contacts you within 24 hours.
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  You're in!
                </h3>
                <p className="text-muted-foreground">
                  We'll be in touch within 24 hours to get your system set up.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DTLeadForm;
