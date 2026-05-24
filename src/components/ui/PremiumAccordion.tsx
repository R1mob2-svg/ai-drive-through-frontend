import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface PremiumAccordionProps {
  items: FAQItem[];
  className?: string;
}

const PremiumAccordion = ({ items, className }: PremiumAccordionProps) => {
  return (
    <Accordion
      type="single"
      collapsible
      className={cn("w-full space-y-3", className)}
    >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="smoked-glass rounded-xl border border-border px-6 overflow-hidden transition-all duration-300 hover:border-brand-gold/30 data-[state=open]:border-brand-gold/40 data-[state=open]:shadow-lg data-[state=open]:shadow-brand-gold/5"
        >
          <AccordionTrigger className="text-left py-5 hover:no-underline group">
            <span className="font-semibold text-foreground group-hover:text-brand-gold transition-colors">
              {item.question}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-muted-foreground leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default PremiumAccordion;
