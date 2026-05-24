const stats = [
  {
    number: "62%",
    label: "of missed calls never call back",
  },
  {
    number: "£8k+",
    label: "avg annual revenue lost to missed calls",
  },
  {
    number: "3 min",
    label: "response window before conversion drops 80%",
  },
  {
    number: "24/7",
    label: "your AI receptionist, never offline",
  },
];

const DTProofStrip = () => {
  return (
    <section className="relative py-8">
      <div className="divider-dual-accent mb-8" />
      <div className="container mx-auto px-4 sm:px-6">
        <div className="smoked-glass rounded-2xl px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.number} className="space-y-1">
                <div className="text-3xl md:text-4xl font-bold text-gold-gradient">
                  {stat.number}
                </div>
                <p className="text-sm text-muted-foreground leading-snug">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="divider-dual-accent mt-8" />
    </section>
  );
};

export default DTProofStrip;
