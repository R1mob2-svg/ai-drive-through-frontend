import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is AI Drive-Through?",
    answer:
      "It's a complete AI-powered lead recovery system for local businesses — AI receptionist, smart website, lead capture and follow-up, all managed for you.",
  },
  {
    question: "How does the 7-day free trial work?",
    answer:
      "You get full access for 7 days with no card required. After that, choose the plan that suits your business or cancel with no penalty.",
  },
  {
    question: "Do I need to change my phone number?",
    answer:
      "No. We route your existing number through the AI system, so callers still reach 'you' — just answered 24/7 by your AI.",
  },
  {
    question: "How fast can I be live?",
    answer:
      "Most businesses are live within 48 hours of signing up.",
  },
  {
    question: "What happens when the AI takes a call?",
    answer:
      "It greets the caller in your business name, captures their details, qualifies the enquiry, and sends you a text summary instantly.",
  },
  {
    question: "Is this a UK-based service?",
    answer:
      "Yes. Support, onboarding, and all systems are UK-based.",
  },
  {
    question: "What if I already have a website?",
    answer:
      "We can work alongside your existing site or replace it — depending on what you need.",
  },
  {
    question: "What does 'no long contracts' mean?",
    answer:
      "Monthly rolling. You're never locked in for more than one month at a time.",
  },
];

const DTFAQ = () => {
  return (
    <section className="section-padding relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section pill */}
        <div className="text-center mb-6">
          <span className="inline-block px-5 py-2 text-sm font-medium rounded-full border border-primary/40 text-primary bg-primary/5">
            FAQ
          </span>
        </div>

        <div className="text-center mb-12">
          <h2 className="headline-section mb-4">
            <span className="headline-primary">Frequently Asked</span>{" "}
            <span className="headline-accent-gradient">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Common questions from local businesses before they start.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl smoked-glass border-t border-t-primary/20 p-4 sm:p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DTFAQ;
