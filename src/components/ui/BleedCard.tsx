import { LucideIcon } from "lucide-react";

interface BleedCardProps {
  bleedImage: string;
  icon?: LucideIcon;
  title?: string;
  text?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * BleedCard — Bleed Exposure effect.
 * Single fixed background image revealed only through the card window.
 * Rule: ONE image per PAGE (all bleed cards on the same page share the same image),
 * DIFFERENT image per page across the site.
 * See: mem://style/bleed-exposure-effect
 */
export const BleedCard = ({
  bleedImage,
  icon: Icon,
  title,
  text,
  description,
  className = "",
  children,
}: BleedCardProps) => (
  <div
    className={`relative p-6 rounded-xl h-full overflow-hidden border border-primary/20 transition-all duration-300 hover:border-primary/50 ${className}`}
    style={{
      backgroundImage: `url(${bleedImage})`,
      backgroundAttachment: "fixed",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="absolute inset-0 bg-[hsl(222_35%_8%/0.78)] hover:bg-[hsl(222_35%_8%/0.68)] transition-colors duration-300" />
    <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-transparent to-background/60" />
    <div className="relative z-10">
      {children ?? (
        <>
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-primary/15 backdrop-blur-sm flex items-center justify-center mb-4 border border-primary/20 mx-auto">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          )}
          {title && (
            <h3 className="text-lg font-bold text-foreground mb-2 text-center">
              {title}
            </h3>
          )}
          {(text || description) && (
            <p className="text-sm text-foreground/80 text-center">
              {text ?? description}
            </p>
          )}
        </>
      )}
    </div>
  </div>
);

export default BleedCard;